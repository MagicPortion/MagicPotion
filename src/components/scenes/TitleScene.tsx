import { css } from "../../../styled-system/css";
import { useGameStore } from "../../store/useGameStore";

export default function TitleScene() {
  const { startNewGame } = useGameStore();

  return (
    <div
      className={css({
        width: "100%",
        height: "100%",
        background: "#f7e9ef",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "40px",
      })}
    >
      <img
        src={`${import.meta.env.BASE_URL}logo.png`}
        alt="Magic Potion"
        className={css({
          width: "700px",
          maxWidth: "80%",
          objectFit: "contain",
        })}
      />

      <button
        onClick={startNewGame}
        className={css({
          px: "72px",
          py: "22px",
          fontSize: "36px",
          fontWeight: "bold",
          borderRadius: "24px",
          border: "none",
          background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          transition: "all 0.2s ease",
          letterSpacing: "0.08em",
          _hover: {
            transform: "scale(1.05)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
          },
        })}
      >
        はじめる
      </button>
    </div>
  );
}
