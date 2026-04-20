import { css } from "../../styled-system/css";
import { useGameStore } from "../store/useGameStore";
import ConversationScene from "./ConversationScene";
import ShopScene from "./ShopScene";
import BrewScene from "./BrewScene";
import RecipeScene from "./RecipeScene";
import SellScene from "./SellScene";

const phaseLabel = { morning: "朝", noon: "昼", night: "夜" } as const;

const phaseColor = {
  morning: { bg: "pastel.rose", text: "#6b5b73" },
  noon: { bg: "pastel.lemon", text: "#7a6000" },
  night: { bg: "pastel.lavender", text: "#4a3f55" },
} as const;

export default function GameManager() {
  const { scene, day, phase, money } = useGameStore();

  const { bg, text } = phaseColor[phase];

  const renderScene = () => {
    switch (scene) {
      case "conversation": return <ConversationScene />;
      case "shop":         return <ShopScene />;
      case "brew":         return <BrewScene />;
      case "recipe":       return <RecipeScene />;
      case "sell":         return <SellScene />;
    }
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* シーン（フルスクリーン・キャンバス＋オーバーレイUI） */}
      {renderScene()}

      {/* HUD（全シーン共通・最前面） */}
      <header
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 100 }}
        className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: "20px",
          py: "10px",
          bg: bg,
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        })}
      >
        <h1 style={{ fontSize: 20, fontWeight: "bold", color: text, margin: 0 }}>
          🧪 Magic Potion
        </h1>
        <div style={{ display: "flex", gap: 20, fontSize: 14, color: text, alignItems: "center" }}>
          <span style={{ background: "rgba(255,255,255,0.45)", borderRadius: 20, padding: "4px 14px" }}>
            {day}日目
          </span>
          <span style={{ background: "rgba(255,255,255,0.45)", borderRadius: 20, padding: "4px 14px" }}>
            {phaseLabel[phase]}
          </span>
          <span style={{ background: "rgba(255,255,255,0.45)", borderRadius: 20, padding: "4px 14px", fontWeight: "bold" }}>
            💰 {money}G
          </span>
        </div>
      </header>
    </div>
  );
}
