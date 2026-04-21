import { css } from "../../styled-system/css";
import { useGameStore } from "../store/useGameStore";
import type { Scene } from "../store/useGameStore";
import ConversationScene from "./ConversationScene";
import RecipeLearningScene from "./RecipeLearningScene";
import ShopScene from "./ShopScene";
import BrewScene from "./BrewScene";
import DisplayScene from "./DisplayScene";
import RecipeBookScene from "./RecipeBookScene";

const SCENE_LABEL: Record<Scene, string> = {
  conversation: "朝",
  recipe_learning: "朝",
  shop: "昼",
  brew: "夜",
  display: "夜",
  recipe_book: "📖",
};

const SCENE_COLOR: Record<Scene, { bg: string; text: string }> = {
  conversation:   { bg: "pastel.rose",    text: "#6b5b73" },
  recipe_learning:{ bg: "pastel.rose",    text: "#6b5b73" },
  shop:           { bg: "pastel.lemon",   text: "#7a6000" },
  brew:           { bg: "pastel.lavender",text: "#4a3f55" },
  display:        { bg: "pastel.lavender",text: "#4a3f55" },
  recipe_book:    { bg: "pastel.cream",   text: "#4a3f55" },
};

export default function GameManager() {
  const { scene, day, money } = useGameStore();
  const { bg, text } = SCENE_COLOR[scene];

  const renderScene = () => {
    switch (scene) {
      case "conversation":    return <ConversationScene />;
      case "recipe_learning": return <RecipeLearningScene />;
      case "shop":            return <ShopScene />;
      case "brew":            return <BrewScene />;
      case "display":         return <DisplayScene />;
      case "recipe_book":     return <RecipeBookScene />;
    }
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {renderScene()}

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
        <div style={{ display: "flex", gap: 12, fontSize: 14, color: text, alignItems: "center" }}>
          <span style={{ background: "rgba(255,255,255,0.45)", borderRadius: 20, padding: "4px 14px" }}>
            {day}日目
          </span>
          <span style={{ background: "rgba(255,255,255,0.45)", borderRadius: 20, padding: "4px 14px" }}>
            {SCENE_LABEL[scene]}
          </span>
          <span style={{ background: "rgba(255,255,255,0.45)", borderRadius: 20, padding: "4px 14px", fontWeight: "bold" }}>
            💰 {money}G
          </span>
        </div>
      </header>
    </div>
  );
}
