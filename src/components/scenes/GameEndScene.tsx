import { css } from "#styled-system/css";
import { CLEAR_MONEY_THRESHOLD, useGameStore } from "../../store/useGameStore";

export default function GameEndScene() {
  const { money } = useGameStore();
  const isClear = money >= CLEAR_MONEY_THRESHOLD;

  return (
    <div
      className={css({
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.9)",
      })}
    >
      <div
        className={css({
          color: "#f5e7b5",
          fontSize: "72px",
          fontWeight: "900",
          letterSpacing: "0.2em",
          textAlign: "center",
          textShadow: "0 0 20px rgba(255,255,255,0.35)",
        })}
      >
        {isClear ? "ゲームクリア" : "ゲームオーバー"}
      </div>
    </div>
  );
}
