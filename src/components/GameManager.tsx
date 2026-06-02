import { css } from "#styled-system/css";
import { useGameStore } from "../store/useGameStore";
import type { Scene } from "../store/useGameStore";
import { useGameScale } from "../hooks/useGameScale";
import { GAME_W, GAME_H } from "../hooks/gameConstants";
import { PixiAppProvider } from "../contexts/PixiAppContext";
import Header from "./Header";
import TitleScene from "./scenes/TitleScene";
import ConversationScene from "./scenes/ConversationScene";
import RecipeLearningScene from "./scenes/RecipeLearningScene";
import ShopScene from "./scenes/ShopScene";
import BrewScene from "./scenes/BrewScene";
import DisplayScene from "./scenes/DisplayScene";

const SCENE_LABEL: Record<Scene, string> = {
  title:           "",
  conversation:    "朝",
  recipe_learning: "朝",
  shop:            "昼",
  brew:            "夜",
  display:         "夜",
};

const SCENE_COLOR: Record<Scene, { bg: string; text: string }> = {
  title:           { bg: "transparent", text: "#ffffff" },
  conversation:    { bg: "pastel.rose",     text: "#6b5b73" },
  recipe_learning: { bg: "pastel.rose",     text: "#6b5b73" },
  shop:            { bg: "pastel.lemon",    text: "#7a6000" },
  brew:            { bg: "pastel.lavender", text: "#4a3f55" },
  display:         { bg: "pastel.lavender", text: "#4a3f55" },
};

const renderScene = (scene: Scene) => {
  switch (scene) {
    case "title":           return <TitleScene />;
    case "conversation":    return <ConversationScene />;
    case "recipe_learning": return <RecipeLearningScene />;
    case "shop":            return <ShopScene />;
    case "brew":            return <BrewScene />;
    case "display":         return <DisplayScene />;
  }
};

export default function GameManager() {
  const { scene, day, money } = useGameStore();
  const scale = useGameScale();
  const { bg, text } = SCENE_COLOR[scene];

  const scaledW = Math.floor(GAME_W * scale);
  const scaledH = Math.floor(GAME_H * scale);

  return (
    // レターボックス：ウィンドウ全体を黒で埋め、ゲームエリアを中央に
    <div className={css({ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", overflow: "hidden" })}>
      {/* クリップ領域：スケール後の実際の表示サイズ。width/height は動的計算値のためinline style */}
      <div style={{ width: scaledW, height: scaledH }} className={css({ overflow: "hidden", position: "relative", flexShrink: 0 })}>
        {/* ゲームコンテナ：常に GAME_W×GAME_H、CSS scale で拡縮。transform・width・height は動的のためinline style */}
        <div
          style={{ width: GAME_W, height: GAME_H, transform: `scale(${scale})` }}
          className={css({ transformOrigin: "top left", position: "absolute", top: 0, left: 0, overflow: "hidden" })}
        >
          <PixiAppProvider>
            {/* シーン切り替え：key でリマウントして CSS フェード */}
            <div key={scene} className={`scene-enter ${css({ width: "100%", height: "100%" })}`}>
              {renderScene(scene)}
            </div>
          </PixiAppProvider>

          {/* HUD：タイトル画面では非表示 */}
          {scene !== "title" && (
            <Header
              bg={bg}
              text={text}
              label={SCENE_LABEL[scene]}
              day={day}
              money={money}
            />
          )}
        </div>
      </div>
    </div>
  );
}
