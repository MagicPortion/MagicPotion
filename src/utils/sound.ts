type UiSound = "select" | "cancel" | "voice";

const SOUND_FILES: Record<UiSound, string> = {
  select: "select.mp3",
  cancel: "cancel.mp3",
  voice: "voice_sound.mp3",
};

const VOLUMES: Record<UiSound, number> = {
  select: 0.45,
  cancel: 0.45,
  voice: 0.24,
};

const audioCache = new Map<UiSound, HTMLAudioElement>();
let loopingVoiceAudio: HTMLAudioElement | null = null;

function soundPath(sound: UiSound) {
  return `${import.meta.env.BASE_URL}assets/se/${SOUND_FILES[sound]}`;
}

function getTemplate(sound: UiSound) {
  const cached = audioCache.get(sound);
  if (cached) return cached;

  const audio = new Audio(soundPath(sound));
  audio.preload = "auto";
  audioCache.set(sound, audio);
  return audio;
}

export function playSound(sound: UiSound) {
  if (typeof window === "undefined") return;

  const audio = getTemplate(sound).cloneNode(true) as HTMLAudioElement;
  audio.volume = VOLUMES[sound];
  audio.currentTime = 0;
  void audio.play().catch(() => {
    // Browser audio may be blocked until the first user gesture.
  });
}

export function playSelectSound() {
  playSound("select");
}

export function playCancelSound() {
  playSound("cancel");
}

export function playVoiceSound() {
  playSound("voice");
}

export function startVoiceLoop() {
  if (typeof window === "undefined") return;

  if (!loopingVoiceAudio) {
    loopingVoiceAudio = new Audio(soundPath("voice"));
    loopingVoiceAudio.preload = "auto";
    loopingVoiceAudio.loop = true;
    loopingVoiceAudio.volume = VOLUMES.voice;
  }

  if (!loopingVoiceAudio.paused) return;

  loopingVoiceAudio.currentTime = 0;
  void loopingVoiceAudio.play().catch(() => {
    // Browser audio may be blocked until the first user gesture.
  });
}

export function stopVoiceLoop() {
  if (!loopingVoiceAudio) return;
  loopingVoiceAudio.pause();
  loopingVoiceAudio.currentTime = 0;
}

export function isCancelSoundTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return target.closest("[data-sound]")?.getAttribute("data-sound") === "cancel";
}

export function isSelectSoundTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  const sound = target.closest("[data-sound]")?.getAttribute("data-sound");
  if (sound === "none") return false;
  if (sound === "select") return true;
  return target.closest("button") !== null || target.closest('[role="button"]') !== null;
}
