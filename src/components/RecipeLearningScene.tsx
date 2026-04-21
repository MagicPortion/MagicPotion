import { useState } from "react";
import { css } from "../../styled-system/css";
import { useGameStore } from "../store/useGameStore";
import { useWindowSize } from "../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "./PixiCanvas";
import { RECIPES, getMaterial, getPotion } from "../data/gameData";

export default function RecipeLearningScene() {
  const { dailyRecipeOptions, recipeLevel, learnRecipe, reloadDailyOptions, money, advanceScene } =
    useGameStore();
  const { width, height } = useWindowSize();
  const [reloadMsg, setReloadMsg] = useState<string | null>(null);

  const commands: DrawCommand[] = [
    // 背景モック（後で朝の魔法部屋画像に差し替え）
    { type: "rect", x: 0, y: 0, width, height, color: 0xfde8f0 },
    // 魔女モック（後でキャラクター画像に差し替え）
    { type: "rect", x: width * 0.5 - 50, y: height * 0.15, width: 100, height: 160, color: 0xffb6c1 },
    { type: "text", x: width * 0.5 - 26, y: height * 0.15 + 68, text: "魔女", fontSize: 14, textColor: "#888" },
  ];

  const options = dailyRecipeOptions.flatMap((id) => {
    const recipe = RECIPES.find((r) => r.id === id);
    if (!recipe) return [];
    const base = getMaterial(recipe.baseId);
    const accent = getMaterial(recipe.accentId);
    const potion = getPotion(recipe.potionId);
    if (!base || !accent || !potion) return [];
    const level = recipeLevel[id] ?? 0;
    return [{ id, recipe, base, accent, potion, level }];
  });

  const handleLearn = (recipeId: string) => {
    learnRecipe(recipeId);
    advanceScene();
  };

  const handleReload = () => {
    const ok = reloadDailyOptions();
    setReloadMsg(ok ? null : "お金が足りません…");
  };

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas
        width={width}
        height={height}
        commands={commands}
        backgroundColor={0xfde8f0}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {/* メインパネル */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          width: "min(600px, 90vw)",
        }}
        className={css({
          bg: "pastel.cream",
          borderRadius: "20px",
          p: "28px 32px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          border: "2px solid",
          borderColor: "pastel.peach",
        })}
      >
        <h2 style={{ fontSize: 18, fontWeight: "bold", color: "#6b5b73", margin: "0 0 6px" }}>
          今日のレシピを選ぼう
        </h2>
        <p style={{ fontSize: 13, color: "#9b8aaa", margin: "0 0 18px" }}>
          1つ選ぶとそのレシピのレベルが上がります。レベルが上がるほど高値で売れます！
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {options.map((opt) => {
            const isKnown = opt.level > 0;
            return (
              <button
                key={opt.id}
                onClick={() => handleLearn(opt.id)}
                className={css({
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  bg: "white",
                  border: "2px solid",
                  borderColor: isKnown ? "pastel.lilac" : "pastel.mint",
                  borderRadius: "12px",
                  p: "12px 16px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  _hover: { bg: isKnown ? "pastel.lavender" : "pastel.sky", transform: "scale(1.02)" },
                })}
              >
                <Dot colorHex={opt.base.colorHex} />
                <span style={{ fontSize: 13, color: "#4a3f55" }}>{opt.base.name}</span>
                <span style={{ fontSize: 13, color: "#bbb" }}>＋</span>
                <Dot colorHex={opt.accent.colorHex} />
                <span style={{ fontSize: 13, color: "#4a3f55" }}>{opt.accent.name}</span>
                <span style={{ fontSize: 13, color: "#bbb", margin: "0 4px" }}>→</span>
                <Dot colorHex={opt.potion.colorHex} />
                <span style={{ fontSize: 14, fontWeight: "bold", color: "#6b5b73", flex: 1 }}>
                  {opt.potion.name}
                </span>
                <span
                  className={css({
                    fontSize: "12px",
                    fontWeight: "bold",
                    px: "10px",
                    py: "3px",
                    borderRadius: "20px",
                    bg: isKnown ? "pastel.lilac" : "pastel.mint",
                    color: "#4a3f55",
                    whiteSpace: "nowrap",
                  })}
                >
                  {isKnown ? `Lv.${opt.level} → Lv.${opt.level + 1}` : "Lv.1 習得"}
                </span>
              </button>
            );
          })}
        </div>

        {/* リロードボタン */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={handleReload}
            disabled={money < 10}
            className={css({
              bg: "pastel.peach",
              border: "none",
              borderRadius: "10px",
              p: "8px 18px",
              cursor: "pointer",
              fontSize: "13px",
              color: "#4a3f55",
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              _hover: { bg: "pastel.rose" },
              _disabled: { opacity: "0.45", cursor: "not-allowed" },
            })}
          >
            🔄 10Gで選択肢をリロード
          </button>
          {reloadMsg && (
            <span style={{ fontSize: 12, color: "#e07070" }}>{reloadMsg}</span>
          )}
          <button
            onClick={advanceScene}
            style={{ marginLeft: "auto" }}
            className={css({
              bg: "pastel.sky",
              border: "none",
              borderRadius: "10px",
              p: "8px 18px",
              cursor: "pointer",
              fontSize: "13px",
              color: "#4a3f55",
              _hover: { bg: "pastel.lavender" },
            })}
          >
            スキップ →
          </button>
        </div>
      </div>
    </div>
  );
}

function Dot({ colorHex }: { colorHex: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor: `#${colorHex}`,
        flexShrink: 0,
      }}
    />
  );
}

