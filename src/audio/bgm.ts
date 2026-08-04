export const DEFAULT_BGM_VOLUME = 0.2;

const bgmPath = `${import.meta.env.BASE_URL}assets/bgm/Peritune_Bewitched_Forest.mp3`;

// ページ読み込み時点でAudioを生成してpreload="auto"にすると、ユーザー操作前の
// 自動プリロードとして一部ブラウザ（Brave等のプライバシー系Shields）にブロックされることがある。
// そのため、実際に再生する（=ユーザー操作が起きた）タイミングで初めて生成する。
let bgm: HTMLAudioElement | null = null;
let currentVolume = DEFAULT_BGM_VOLUME;

function getBgm(): HTMLAudioElement {
  if (!bgm) {
    bgm = new Audio(bgmPath);
    bgm.loop = true;
    bgm.volume = currentVolume;
  }
  return bgm;
}

export const playBgm = async () => {
  try {
    const audio = getBgm();
    if (!audio.paused) return;

    await audio.play();
    console.log("BGM再生開始:", bgmPath);
  } catch (error) {
    console.error("BGMを再生できませんでした", error);
  }
};

export const pauseBgm = () => {
  bgm?.pause();
};

// 設定画面のスライダーから呼ぶ想定。再生前に呼ばれた場合は次回生成時の初期値として使う。
export const applyBgmVolume = (volume: number) => {
  currentVolume = Math.max(0, Math.min(1, volume));
  if (bgm) bgm.volume = currentVolume;
};
