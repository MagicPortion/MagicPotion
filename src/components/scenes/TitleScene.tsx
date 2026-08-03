import { css } from "../../../styled-system/css";
import { useGameStore } from "../../store/useGameStore";
import logoImage from "#assets/images/logo.png";
import titleBackImage from "#assets/images/TitleBack.png";
import { CHARACTER_PORTRAITS, ITEM_IMAGES } from "#assets/preload";
import { preloadImages } from "../../utils/preloadImages";
import { ActionButton } from "../ui/common/ActionButton";
import { playBgm } from "../../audio/bgm";

export default function TitleScene() {
  const { startNewGame } = useGameStore();

  const handleStart = () => {
  // スタートボタンを押したタイミングでBGMを再生する
  void playBgm();

  // 立ち絵は会話シーンですぐ表示されるため先に、アイテム画像は店シーンに着くまで時間があるため後で読み込む
  preloadImages(CHARACTER_PORTRAITS).then(() => preloadImages(ITEM_IMAGES));

  startNewGame();
};

  return (
    <div
      style={{ backgroundImage: `url(${titleBackImage})` }}
      className={css({
        width: "100%",
        height: "100%",
        backgroundColor: "#f7e9ef",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "40px",
      })}
    >
      <img
        src={logoImage}
        alt="Magic Potion"
        className={css({
          width: "700px",
          maxWidth: "80%",
          objectFit: "contain",
        })}
      />

      <ActionButton onClick={handleStart} variant="secondary" emphasized>
        はじめる
      </ActionButton>
    </div>
  );
}
