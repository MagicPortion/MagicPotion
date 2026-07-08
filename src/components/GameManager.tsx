import { css } from "#styled-system/css";
import { useGameStore } from "../store/useGameStore";
import type { Scene } from "../store/useGameStore";
import { useGameScale } from "../hooks/useGameScale";
import { GAME_W, GAME_H } from "../hooks/gameConstants";
import { PixiAppProvider } from "../contexts/PixiAppContext";
import Header from "./Header";
import TitleScene from "./scenes/TitleScene";
import Introduction from "./scenes/Introduction";
import ConversationScene from "./scenes/ConversationScene";
import RecipeLearningScene from "./scenes/RecipeLearningScene";
import ShopScene from "./scenes/ShopScene";
import BrewScene from "./scenes/BrewScene";
import DisplayScene from "./scenes/DisplayScene";
import ConversationShopkeeperScene from "./scenes/ConversationShopkeeperScene";
import EndingTransitionScene from "./scenes/EndingTransitionScene";
import FinancialReportScene from "./scenes/FinancialReportScene";
import GameEndScene from "./scenes/GameEndScene";
import InventoryModal from "./ui/inventory/InventoryModal";


const SCENE_LABEL: Record<Scene, string> = {
  title:                    "",
  introduction:            "物語",
  conversation:             "朝",
  recipe_learning:          "朝",
  conversation_move:        "朝",
  conversation_shopkeeper:  "昼",
  shop:                     "昼",
  conversation_brew:        "夜",
  brew:                     "夜",
  display:                  "夜",
  conversation_end:         "結果",
  ending_transition:       "結果",
  financial_report:         "結果",
  game_end:                 "",
};


const renderScene = (scene: Scene) => {
  switch (scene) {
    case "title":                   return <TitleScene />;
    case "introduction":            return <Introduction />;
    case "conversation":            return <ConversationScene />;
    case "recipe_learning":         return <RecipeLearningScene />;
    case "conversation_move":       return <ConversationScene />;
    case "conversation_shopkeeper": return <ConversationShopkeeperScene />;
    case "shop":                    return <ShopScene />;
    case "conversation_brew":       return <ConversationScene />;
    case "brew":                    return <BrewScene />;
    case "display":                 return <DisplayScene />;
    case "conversation_end":        return <ConversationScene />;
    case "ending_transition":      return <EndingTransitionScene />;
    case "financial_report":        return <FinancialReportScene />;
    case "game_end":                return <GameEndScene />;
  }
};

export default function GameManager() {
  const { scene, day, money, materials, brewedPotions, isInventoryOpen, setIsInventoryOpen } = useGameStore();
  const scale = useGameScale();

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

          {/* ヘッダー：タイトル画面・エンド画面では非表示 */}
          {scene !== "title" && scene !== "game_end" && scene !== "ending_transition" && scene !== "financial_report" && scene !== "conversation_end" && (
            <Header
              label={SCENE_LABEL[scene]}
              day={day}
              money={money}
            />
          )}

          {/* インベントリが開いている時は、最前面（zIndex: 1000）に共通モーダルを描画 */}
          {isInventoryOpen && (
            <InventoryModal
              materials={materials}
              brewedPotions={brewedPotions}
              onClose={() => setIsInventoryOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
