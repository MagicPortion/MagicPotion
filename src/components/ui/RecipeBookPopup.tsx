import { css } from "../../../styled-system/css";
import { useGameStore } from "../../store/useGameStore";
import { getMaterial, getPotion, getRecipe, calcSellPrice } from "../../data/gameData";

interface RecipeBookPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe?: (baseId: string, accentId: string) => void;
}

export default function RecipeBookPopup({ isOpen, onClose, onSelectRecipe }: RecipeBookPopupProps) {
  const { recipeLevel, materials } = useGameStore();

  if (!isOpen) return null;

  const knownRecipes = Object.entries(recipeLevel).filter(([, lv]) => lv > 0);

  return (
    <>
      {/* オーバーレイ */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 200,
        }}
      />

      {/* パネル */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 201,
          width: "min(600px, 90vw)",
          maxHeight: "72vh",
          overflowY: "auto",
        }}
        className={css({
          bg: "pastel.cream",
          borderRadius: "20px",
          p: "28px 32px",
          boxShadow: "0 12px 48px rgba(0,0,0,0.3)",
          border: "2px solid",
          borderColor: "pastel.peach",
        })}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: "bold", color: "#6b5b73", margin: 0 }}>
            📖 レシピ帳
          </h2>
          <button
            onClick={onClose}
            className={css({ bg: "transparent", border: "none", cursor: "pointer", fontSize: "20px", color: "#9b8aaa", _hover: { color: "#4a3f55" } })}
          >
            ✕
          </button>
        </div>

        {knownRecipes.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: 14, padding: "20px 0" }}>
            まだレシピがありません。<br />
            調合するか、朝のレシピ習得で覚えよう！
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

              const canBrew =
                onSelectRecipe &&
                (materials[recipe.baseId] ?? 0) > 0 &&
                (materials[recipe.accentId] ?? 0) > 0;

              return (
                <div
                  key={recipeId}
                  className={css({
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    bg: "white",
                    borderRadius: "12px",
                    p: "10px 14px",
                  })}
                >
                  <Dot colorHex={base?.colorHex ?? "aaaaaa"} />
                  <span style={{ fontSize: 13, color: "#4a3f55" }}>{base?.name}</span>
                  <span style={{ fontSize: 13, color: "#ddd" }}>＋</span>
                  <Dot colorHex={accent?.colorHex ?? "aaaaaa"} />
                  <span style={{ fontSize: 13, color: "#4a3f55" }}>{accent?.name}</span>
                  <span style={{ fontSize: 13, color: "#ddd", margin: "0 2px" }}>＝</span>
                  <Dot colorHex={potion?.colorHex ?? "808080"} />
                  <span style={{ fontSize: 14, fontWeight: "bold", color: "#6b5b73", flex: 1 }}>
                    {potion?.name}
                  </span>
                  <span className={css({ bg: "pastel.lilac", borderRadius: "20px", px: "8px", py: "2px", fontSize: "11px", color: "#4a3f55", whiteSpace: "nowrap" })}>
                    Lv.{level}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: "bold", color: "#6b5b73", whiteSpace: "nowrap", minWidth: 48, textAlign: "right" }}>
                    {price}G
                  </span>
                  {onSelectRecipe && (
                    <button
                      onClick={() => onSelectRecipe(recipe.baseId, recipe.accentId)}
                      disabled={!canBrew}
                      className={css({
                        bg: canBrew ? "pastel.mint" : "pastel.lavender",
                        border: "none",
                        borderRadius: "8px",
                        p: "5px 12px",
                        cursor: canBrew ? "pointer" : "not-allowed",
                        fontSize: "12px",
                        color: "#4a3f55",
                        whiteSpace: "nowrap",
                        opacity: canBrew ? "1" : "0.5",
                        _hover: { bg: canBrew ? "pastel.sage" : "pastel.lavender" },
                      })}
                    >
                      セット
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function Dot({ colorHex }: { colorHex: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 13,
        height: 13,
        borderRadius: "50%",
        backgroundColor: `#${colorHex}`,
        flexShrink: 0,
      }}
    />
  );
}
