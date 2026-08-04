import { useEffect, useRef, useState } from "react";
import { css } from "#styled-system/css";
import { useGameStore } from "../store/useGameStore";
import type { Scene } from "../store/useGameStore";
import { useGameScale } from "../hooks/useGameScale";
import { useViewportSize } from "../hooks/useViewportSize";
import { GAME_W, GAME_H } from "../hooks/gameConstants";
import { isCancelSoundTarget, isSelectSoundTarget, playCancelSound, playSelectSound } from "../utils/sound";
import { PixiAppProvider } from "../contexts/PixiAppContext";
import Header from "./Header";
import TitleScene from "./scenes/TitleScene";
import CreditsScene from "./scenes/CreditsScene";
import SharedResultScene from "./scenes/SharedResultScene";
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
import PixelSceneTransition from "./ui/common/PixelSceneTransition";
import WhiteSceneTransition from "./ui/common/WhiteSceneTransition";


const SCENE_LABEL: Record<Scene, string> = {
  title:                    "",
  credits:                  "",
  shared_result:            "",
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
    case "credits":                 return <CreditsScene />;
    case "shared_result":           return <SharedResultScene />;
    case "introduction":            return <Introduction />;
    case "conversation":            return <ConversationScene sceneOverride={scene} />;
    case "recipe_learning":         return <RecipeLearningScene />;
    case "conversation_move":       return <ConversationScene sceneOverride={scene} />;
    case "conversation_shopkeeper": return <ConversationShopkeeperScene />;
    case "shop":                    return <ShopScene />;
    case "conversation_brew":       return <ConversationScene sceneOverride={scene} />;
    case "brew":                    return <BrewScene />;
    case "display":                 return <DisplayScene />;
    case "conversation_end":        return <ConversationScene sceneOverride={scene} />;
    case "ending_transition":      return <EndingTransitionScene />;
    case "financial_report":        return <FinancialReportScene />;
    case "game_end":                return <GameEndScene />;
  }
};

const sceneLocation = (scene: Scene): "witch" | "shopkeeper" | null => {
  if (scene === "conversation_shopkeeper" || scene === "shop") return "shopkeeper";
  if (
    scene === "conversation" ||
    scene === "recipe_learning" ||
    scene === "conversation_move" ||
    scene === "conversation_brew" ||
    scene === "brew" ||
    scene === "display"
  ) return "witch";
  return null;
};

const getTransitionKind = (from: Scene, to: Scene): "pixel" | "white" | null => {
  if (from === "financial_report" && to === "game_end") return "white";
  const fromLocation = sceneLocation(from);
  const toLocation = sceneLocation(to);
  if (fromLocation !== null && toLocation !== null && fromLocation !== toLocation) {
    return "pixel";
  }
  return null;
};

export default function GameManager() {
  const { scene, day, money, materials, isInventoryOpen, setIsInventoryOpen } = useGameStore();
  const { width: viewportW, height: viewportH } = useViewportSize();
  const isPortrait = viewportH > viewportW;
  const scale = useGameScale(isPortrait ? viewportH : viewportW, isPortrait ? viewportW : viewportH);
  const [displayedScene, setDisplayedScene] = useState(scene);
  const [transition, setTransition] = useState<{
    kind: "pixel" | "white";
    phase: "cover" | "uncover";
  } | null>(null);
  const displayedSceneRef = useRef(scene);

  useEffect(() => {
    const transitionKind = getTransitionKind(displayedSceneRef.current, scene);

    if (!transitionKind) {
      displayedSceneRef.current = scene;
      setDisplayedScene(scene);
      setTransition(null);
      return;
    }

    const swapDelay = transitionKind === "white" ? 1200 : 620;
    const finishDelay = transitionKind === "white" ? 2000 : 1240;

    setTransition({ kind: transitionKind, phase: "cover" });
    const swapTimer = window.setTimeout(() => {
      displayedSceneRef.current = scene;
      setDisplayedScene(scene);
      setTransition({ kind: transitionKind, phase: "uncover" });
    }, swapDelay);
    const finishTimer = window.setTimeout(() => {
      setTransition(null);
    }, finishDelay);

    return () => {
      window.clearTimeout(swapTimer);
      window.clearTimeout(finishTimer);
    };
  }, [scene]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      // スマホ：初回タップでブラウザUIを隠すためフルスクリーン化を試みる（対応ブラウザのみ）
      if (event.pointerType === "touch" && !document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      }

      if (isCancelSoundTarget(event.target)) {
        playCancelSound();
        return;
      }

      if (isSelectSoundTarget(event.target)) {
        playSelectSound();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, { capture: true });
    return () => window.removeEventListener("pointerdown", handlePointerDown, { capture: true });
  }, []);

  const scaledW = Math.floor(GAME_W * scale);
  const scaledH = Math.floor(GAME_H * scale);

  const letterbox = (
    // レターボックス：親要素全体を黒で埋め、ゲームエリアを中央に
    <div className={css({ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", overflow: "hidden" })}>
      {/* クリップ領域：スケール後の実際の表示サイズ。width/height は動的計算値のためinline style */}
      <div style={{ width: scaledW, height: scaledH }} className={css({ overflow: "hidden", position: "relative", flexShrink: 0 })}>
        {/* ゲームコンテナ：常に GAME_W×GAME_H、CSS scale で拡縮。transform・width・height は動的ためinline style */}
        <div
          style={{ width: GAME_W, height: GAME_H, transform: `scale(${scale})` }}
          className={css({ transformOrigin: "top left", position: "absolute", top: 0, left: 0, overflow: "hidden" })}
        >
          <PixiAppProvider>
            {/* シーン切り替え：key でリマウントして CSS フェード */}
            <div key={displayedScene} className={`scene-enter ${css({ width: "100%", height: "100%" })}`}>
              {renderScene(displayedScene)}
            </div>
          </PixiAppProvider>

          {/* ヘッダー：タイトル画面・エンド画面では非表示 */}
          {displayedScene !== "title" && displayedScene !== "credits" && displayedScene !== "game_end" && displayedScene !== "ending_transition" && displayedScene !== "financial_report" && displayedScene !== "conversation_end" && (
            <Header
              label={SCENE_LABEL[displayedScene]}
              day={day}
              money={money}
            />
          )}

          {/* インベントリが開いている時は、最前面（zIndex: 1000）に共通モーダルを描画 */}
          {isInventoryOpen && (
            <InventoryModal
              materials={materials}
              onClose={() => setIsInventoryOpen(false)}
            />
          )}

          {transition?.kind === "pixel" && (
            <PixelSceneTransition phase={transition.phase} />
          )}
          {transition?.kind === "white" && (
            <WhiteSceneTransition phase={transition.phase} />
          )}
        </div>
      </div>
    </div>
  );

  if (!isPortrait) {
    return (
      <div className={css({ position: "fixed", inset: 0 })}>
        {letterbox}
      </div>
    );
  }

  return (
    // スマホなど縦持ちの場合：画面いっぱいを90度回転させ、横持ち表示として強制的に見せる
    <div
      className={css({
        position: "fixed",
        top: "100vh",
        left: 0,
        width: "100vh",
        height: "100vw",
        transformOrigin: "left top",
        transform: "rotate(-90deg)",
        overflow: "hidden",
      })}
    >
      {letterbox}
    </div>
  );
}
