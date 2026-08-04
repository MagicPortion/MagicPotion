import { css } from "../../../styled-system/css";
import { useGameStore } from "../../store/useGameStore";
import logoImage from "#assets/images/logo.png";
import titleBackImage from "#assets/images/TitleBack.png";
import { CHARACTER_PORTRAITS, ITEM_IMAGES } from "#assets/preload";
import { preloadImages } from "../../utils/preloadImages";
import { ActionButton } from "../ui/common/ActionButton";

export default function TitleScene() {
  const { startNewGame, setScene } = useGameStore();

  const handleStart = () => {
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

      <button
        type="button"
        onClick={() => setScene("credits")}
        className={css({
          position: "absolute",
          right: "52px",
          bottom: "42px",
          minWidth: "190px",
          px: "26px",
          py: "12px",
          border: "2px solid #8b6914",
          borderRadius: "8px",
          background: "rgba(8, 5, 2, 0.88)",
          color: "#e0c56f",
          fontSize: "24px",
          fontWeight: "bold",
          letterSpacing: "0.1em",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(224, 197, 111, 0.16)",
          transition: "all 0.15s ease",
          _hover: {
            color: "#fff1b8",
            borderColor: "#c8a84b",
            background: "rgba(28, 18, 5, 0.94)",
            transform: "translateY(-2px)",
          },
        })}
      >
        クレジット
      </button>
    </div>
  );
}
