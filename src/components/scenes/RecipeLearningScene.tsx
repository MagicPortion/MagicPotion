import { useMemo, useState } from "react";
import { css } from "../../../styled-system/css";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { RECIPES, getPotion, calcSellPrice } from "../../data/gameData";
import DialogueBox, { ActionButton } from "../ui/dialogue/DialogueBox";

export default function RecipeLearningScene() {
  const { dailyRecipeOptions, recipeLevel, learnRecipe, reloadDailyOptions, money, advanceScene } =
    useGameStore();
  const { width, height } = useWindowSize();
  const [reloadMsg, setReloadMsg] = useState<string | null>(null);

  const commands = useMemo<DrawCommand[]>(() => [
    { type: "rect", x: 0, y: 0, width, height, color: 0xfde8f0 },
    { type: "rect", x: width * 0.5 - 50, y: height * 0.12, width: 100, height: 150, color: 0xffb6c1 },
    { type: "text", x: width * 0.5 - 26, y: height * 0.12 + 65, text: "魔女", fontSize: 14, textColor: "#888" },
  ], [width, height]);

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
      <PixiCanvas commands={commands} backgroundColor={0xfde8f0} />

      {/* カードパネル */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "20px 32px 16px",
          background: "rgba(255,248,252,0.96)",
          backdropFilter: "blur(8px)",
          borderTop: "2px solid rgba(255,182,193,0.4)",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: 17, fontWeight: "bold", color: "#6b5b73", margin: 0 }}>
            今日のポーションレシピ
          </h2>
          <p style={{ fontSize: 12, color: "#9b8aaa", margin: "4px 0 0" }}>
            1つ選ぶとそのレシピのレベルが上がり、より高値で売れるようになります
          </p>
        </div>

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
                <span
                  style={{
                    display: "block", width: 56, height: 56, borderRadius: "50%",
                    backgroundColor: `#${opt.potion.colorHex}`,
                    boxShadow: `0 4px 16px #${opt.potion.colorHex}88`,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: "bold", color: "#4a3f55", textAlign: "center", lineHeight: 1.3 }}>
                  {opt.potion.name}
                </span>
                <span style={{ fontSize: 13, color: "#8b7f99" }}>{opt.nextPrice}G</span>
                <span
                  className={css({
                    fontSize: "11px", fontWeight: "bold", px: "10px", py: "3px",
                    borderRadius: "20px",
                    bg: isKnown ? "pastel.lilac" : "pastel.mint",
                    color: "#4a3f55", whiteSpace: "nowrap",
                  })}
                >
                  {isKnown ? `Lv.${opt.level} → ${opt.nextLevel}` : "Lv.1 習得"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <DialogueBox
        actions={
          <>
            {reloadMsg && (
              <span style={{ fontSize: 13, color: "#e07070", marginRight: 4 }}>{reloadMsg}</span>
            )}
            <ActionButton
              variant="secondary"
              onClick={handleReload}
              disabled={money < 10}
            >
              🔄 10Gで引き直す
            </ActionButton>
            <ActionButton variant="secondary" onClick={advanceScene}>
              スキップ →
            </ActionButton>
          </>
        }
      />
    </div>
  );
}
