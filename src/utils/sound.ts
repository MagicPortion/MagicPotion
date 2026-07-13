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

const MIN_INTERVAL_MS: Partial<Record<UiSound, number>> = {
  voice: 55,
};

const audioCache = new Map<UiSound, HTMLAudioElement>();
const lastPlayedAt = new Map<UiSound, number>();

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

  const now = Date.now();
  const minInterval = MIN_INTERVAL_MS[sound] ?? 0;
  const last = lastPlayedAt.get(sound) ?? 0;
  if (now - last < minInterval) return;
  lastPlayedAt.set(sound, now);

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

export function isCancelSoundTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return target.closest("[data-sound]")?.getAttribute("data-sound") === "cancel";
}

export function isSelectSoundTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  if (target.closest("[data-sound]")?.getAttribute("data-sound") === "none") return false;
  return target.closest("button") !== null || target.closest('[role="button"]') !== null;
}
