import { useState } from "react";
import { css } from "../../styled-system/css";
import { useGameStore } from "../store/useGameStore";
import { useWindowSize } from "../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "./PixiCanvas";
import { RECIPES, getPotion, calcSellPrice } from "../data/gameData";

export default function RecipeLearningScene() {
  const { dailyRecipeOptions, recipeLevel, learnRecipe, reloadDailyOptions, money, advanceScene } =
    useGameStore();
  const { width, height } = useWindowSize();
  const [reloadMsg, setReloadMsg] = useState<string | null>(null);

  const commands: DrawCommand[] = [
    // 背景モック（後で朝の魔法部屋画像に差し替え）
    { type: "rect", x: 0, y: 0, width, height, color: 0xfde8f0 },
    // 魔女モック（後でキャラクター画像に差し替え）
    { type: "rect", x: width * 0.5 - 50, y: height * 0.12, width: 100, height: 150, color: 0xffb6c1 },
    { type: "text", x: width * 0.5 - 26, y: height * 0.12 + 65, text: "魔女", fontSize: 14, textColor: "#888" },
  ];

  const options = dailyRecipeOptions.flatMap((id) => {
    const recipe = RECIPES.find((r) => r.id === id);
    if (!recipe) return [];
    const potion = getPotion(recipe.potionId);
    if (!potion) return [];
    const level = recipeLevel[id] ?? 0;
    const nextLevel = level + 1;
    return [{ id, potion, level, nextLevel, nextPrice: calcSellPrice(potion.basePrice, nextLevel) }];
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

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "24px 32px 32px",
        }}
        className={css({
          bg: "rgba(255,248,252,0.96)",
          backdropFilter: "blur(8px)",
          borderTop: "2px solid",
          borderColor: "pastel.peach",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.1)",
        })}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: "bold", color: "#6b5b73", margin: 0 }}>
              今日のポーションレシピ
            </h2>
            <p style={{ fontSize: 12, color: "#9b8aaa", margin: "4px 0 0" }}>
              1つ選ぶとそのレシピのレベルが上がり、より高値で売れるようになります
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {reloadMsg && <span style={{ fontSize: 12, color: "#e07070" }}>{reloadMsg}</span>}
            <button
              onClick={handleReload}
              disabled={money < 10}
              className={css({
                bg: "pastel.peach",
                border: "none",
                borderRadius: "10px",
                p: "8px 16px",
                cursor: "pointer",
                fontSize: "12px",
                color: "#4a3f55",
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                _hover: { bg: "pastel.rose" },
                _disabled: { opacity: "0.45", cursor: "not-allowed" },
              })}
            >
              🔄 10Gで引き直す
            </button>
            <button
              onClick={advanceScene}
              className={css({
                bg: "pastel.sky",
                border: "none",
                borderRadius: "10px",
                p: "8px 16px",
                cursor: "pointer",
                fontSize: "12px",
                color: "#4a3f55",
                _hover: { bg: "pastel.lavender" },
              })}
            >
              スキップ →
            </button>
          </div>
        </div>

        {/* カード一覧 */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {options.map((opt) => {
            const isKnown = opt.level > 0;
            return (
              <button
                key={opt.id}
                onClick={() => handleLearn(opt.id)}
                className={css({
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  bg: "white",
                  border: "3px solid",
                  borderColor: isKnown ? "pastel.lilac" : "pastel.mint",
                  borderRadius: "20px",
                  p: "20px 16px 16px",
                  cursor: "pointer",
                  width: "130px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  transition: "all 0.18s",
                  _hover: {
                    transform: "translateY(-6px) scale(1.04)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                    borderColor: isKnown ? "pastel.lavender" : "pastel.sage",
                  },
                })}
              >
                {/* ポーションの色玉 */}
                <span
                  style={{
                    display: "block",
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: `#${opt.potion.colorHex}`,
                    boxShadow: `0 4px 16px #${opt.potion.colorHex}88`,
                    flexShrink: 0,
                  }}
                />

                {/* ポーション名 */}
                <span style={{ fontSize: 14, fontWeight: "bold", color: "#4a3f55", textAlign: "center", lineHeight: 1.3 }}>
                  {opt.potion.name}
                </span>

                {/* 売値 */}
                <span style={{ fontSize: 13, color: "#8b7f99" }}>
                  {opt.nextPrice}G
                </span>

                {/* レベルバッジ */}
                <span
                  className={css({
                    fontSize: "11px",
                    fontWeight: "bold",
                    px: "10px",
                    py: "3px",
                    borderRadius: "20px",
                    bg: isKnown ? "pastel.lilac" : "pastel.mint",
                    color: "#4a3f55",
                    whiteSpace: "nowrap",
                  })}
                >
                  {isKnown ? `Lv.${opt.level} → ${opt.nextLevel}` : "Lv.1 習得"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
