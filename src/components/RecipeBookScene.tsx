import { css } from "../../styled-system/css";
import { useGameStore } from "../store/useGameStore";
import { useWindowSize } from "../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "./PixiCanvas";
import { getMaterial, getPotion, getRecipe, calcSellPrice } from "../data/gameData";

export default function RecipeBookScene() {
  const { recipeLevel, setScene, bookReturnScene } = useGameStore();
  const { width, height } = useWindowSize();

  const knownRecipes = Object.entries(recipeLevel).filter(([, lv]) => lv > 0);

  const commands: DrawCommand[] = [
    // 背景モック（後でレシピ帳の部屋画像に差し替え）
    { type: "rect", x: 0, y: 0, width, height, color: 0xfdf6e3 },
  ];

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas
        width={width}
        height={height}
        commands={commands}
        backgroundColor={0xfdf6e3}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          width: "min(600px, 90vw)",
          maxHeight: "70vh",
          overflowY: "auto",
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
        <h2 style={{ fontSize: 18, fontWeight: "bold", color: "#6b5b73", margin: "0 0 16px" }}>
          📖 レシピ帳
        </h2>

        {knownRecipes.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: 15, padding: "16px 0" }}>
            まだレシピがありません。<br />
            調合するか、レシピ習得画面で覚えよう！
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {knownRecipes.map(([recipeId, level]) => {
              const recipe = getRecipe(recipeId);
              if (!recipe) return null;
              const base = getMaterial(recipe.baseId);
              const accent = getMaterial(recipe.accentId);
              const potion = getPotion(recipe.potionId);
              const price = potion ? calcSellPrice(potion.basePrice, level) : 0;
              return (
                <div
                  key={recipeId}
                  className={css({ display: "flex", alignItems: "center", gap: "8px", bg: "white", borderRadius: "12px", p: "10px 14px" })}
                >
                  <Dot colorHex={base?.colorHex ?? "aaaaaa"} />
                  <span style={{ fontSize: 13, color: "#4a3f55" }}>{base?.name}</span>
                  <span style={{ fontSize: 13, color: "#bbb" }}>＋</span>
                  <Dot colorHex={accent?.colorHex ?? "aaaaaa"} />
                  <span style={{ fontSize: 13, color: "#4a3f55" }}>{accent?.name}</span>
                  <span style={{ fontSize: 13, color: "#bbb", margin: "0 4px" }}>＝</span>
                  <Dot colorHex={potion?.colorHex ?? "808080"} />
                  <span style={{ fontSize: 14, fontWeight: "bold", color: "#6b5b73", flex: 1 }}>
                    {potion?.name}
                  </span>
                  <span
                    className={css({ bg: "pastel.lilac", borderRadius: "20px", px: "8px", py: "2px", fontSize: "12px", color: "#4a3f55", whiteSpace: "nowrap" })}
                  >
                    Lv.{level}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: "bold", color: "#6b5b73", whiteSpace: "nowrap" }}>
                    {price}G
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setScene(bookReturnScene)}
          className={css({ mt: "20px", display: "block", mx: "auto", bg: "pastel.lavender", border: "none", borderRadius: "10px", p: "10px 28px", cursor: "pointer", fontSize: "14px", color: "#4a3f55", _hover: { bg: "pastel.lilac" } })}
        >
          ← 戻る
        </button>
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
