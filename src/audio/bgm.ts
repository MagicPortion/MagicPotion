const bgmPath = `${import.meta.env.BASE_URL}assets/bgm/Peritune_Bewitched_Forest.mp3`;

const bgm = new Audio(bgmPath);

bgm.loop = true;
bgm.volume = 0.2;
bgm.preload = "auto";

export const playBgm = async () => {
  try {
    if (!bgm.paused) return;

    await bgm.play();
    console.log("BGM再生開始:", bgmPath);
  } catch (error) {
    console.error("BGMを再生できませんでした", error);
  }
};

export const pauseBgm = () => {
  bgm.pause();
};

export const setBgmVolume = (volume: number) => {
  bgm.volume = Math.max(0, Math.min(1, volume));
};