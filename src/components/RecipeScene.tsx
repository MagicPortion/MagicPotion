import { css } from "../../styled-system/css";
import { useGameStore } from "../store/useGameStore";
import { useWindowSize } from "../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "./PixiCanvas";
import { getMaterial, getPotion } from "../data/gameData";

export default function RecipeScene() {
  const { discoveredRecipes, setScene, phase } = useGameStore();
  const { width, height } = useWindowSize();
  const backScene = phase === "noon" ? "shop" as const : "brew" as const;

  // 背景モック（後でレシピ部屋の画像に差し替え）
  const commands: DrawCommand[] = [
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

      {/* レシピ一覧モーダル */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          width: "min(560px, 88vw)",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
        className={css({
          bg: "pastel.cream",
          borderRadius: "18px",
          p: "28px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          border: "2px solid",
          borderColor: "pastel.peach",
        })}
      >
        {discoveredRecipes.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: 15 }}>
            まだレシピを発見していません。<br />調合して新しいレシピを見つけよう！
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {discoveredRecipes.map((recipe, i) => {
              const base = getMaterial(recipe.baseId);
              const accent = getMaterial(recipe.accentId);
              const potion = getPotion(recipe.potionId);
              return (
                <div
                  key={i}
                  className={css({ display: "flex", alignItems: "center", gap: "10px", bg: "white", borderRadius: "10px", p: "10px 14px" })}
                >
                  <Dot color={base?.color ?? 0} />
                  <span style={{ fontSize: 13, color: "#4a3f55" }}>{base?.name}</span>
                  <span style={{ fontSize: 13, color: "#bbb" }}>＋</span>
                  <Dot color={accent?.color ?? 0} />
                  <span style={{ fontSize: 13, color: "#4a3f55" }}>{accent?.name}</span>
                  <span style={{ fontSize: 13, color: "#bbb", margin: "0 4px" }}>＝</span>
                  <Dot color={potion?.color ?? 0} />
                  <span style={{ fontSize: 14, fontWeight: "bold", color: "#6b5b73" }}>{potion?.name}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#8b7f99" }}>{potion?.sellPrice}G</span>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setScene(backScene)}
          className={css({ mt: "20px", display: "block", mx: "auto", bg: "pastel.lavender", border: "none", borderRadius: "10px", p: "10px 28px", cursor: "pointer", fontSize: "14px", color: "#4a3f55", _hover: { bg: "pastel.lilac" } })}
        >
          ← 戻る
        </button>
      </div>
    </div>
  );
}

function Dot({ color }: { color: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: `#${color.toString(16).padStart(6, "0")}`,
        flexShrink: 0,
      }}
    />
  );
}
