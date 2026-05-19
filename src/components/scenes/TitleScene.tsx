import { useGameStore } from "../../store/useGameStore";

export default function TitleScene() {
  const { setScene } = useGameStore();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f7e9ef",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
      }}
    >
      <img
        src="/MagicPotion/logo.png"
        alt="Magic Potion"
        style={{
          width: 700,
          maxWidth: "80%",
          objectFit: "contain",
        }}
      />

      <button
        onClick={() => setScene("conversation")}
        style={{
            padding: "22px 72px",
            fontSize: 36,
            fontWeight: "bold",

            borderRadius: 24,
            border: "none",

            background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
            color: "white",

            cursor: "pointer",

            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",

            transition: "all 0.2s ease",

            letterSpacing: "0.08em",
        }}

        onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow =
            "0 12px 32px rgba(0,0,0,0.35)";
        }}

        onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
            "0 8px 24px rgba(0,0,0,0.25)";
        }}
        >
        はじめる
        </button>
    </div>
  );
}