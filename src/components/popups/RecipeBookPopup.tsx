import { css } from "../../../styled-system/css";
import { useGameStore } from "../../store/useGameStore";
import { getMaterial, getPotion, getRecipe, calcSellPrice } from "../../data/gameData";
import { IconRecipe, IconClose } from "../ui/icons";

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
      <div
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300 }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          zIndex: 301, width: "min(600px, 90vw)", maxHeight: "72vh", overflowY: "auto",
          background: "rgba(12,8,3,0.97)", border: "2px solid #8B6914",
          borderRadius: 6, padding: "28px 32px", boxShadow: "0 12px 48px rgba(0,0,0,0.7)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, color: "#c8a84b", margin: 0, letterSpacing: "0.1em" }}>
            <IconRecipe size={16} /> レシピ帳
          </h2>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "#8B6914" }}>
            <IconClose size={18} />
          </button>
        </div>

        {knownRecipes.length === 0 ? (
          <p style={{ textAlign: "center", color: "#8B6914", fontSize: 14, padding: "20px 0", letterSpacing: "0.06em" }}>
            まだレシピがありません。<br />
            調合するか、朝のレシピ習得で覚えよう！
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "rgba(30,20,8,0.7)", border: "1px solid #4a3810",
                    borderRadius: 4, padding: "10px 14px",
                  }}
                >
                  <Dot colorHex={base?.colorHex ?? "aaaaaa"} />
                  <span style={{ fontSize: 13, color: "#e8d8b8" }}>{base?.name}</span>
                  <span style={{ fontSize: 13, color: "#4a3810" }}>＋</span>
                  <Dot colorHex={accent?.colorHex ?? "aaaaaa"} />
                  <span style={{ fontSize: 13, color: "#e8d8b8" }}>{accent?.name}</span>
                  <span style={{ fontSize: 13, color: "#4a3810", margin: "0 2px" }}>＝</span>
                  <Dot colorHex={potion?.colorHex ?? "808080"} />
                  <span style={{ fontSize: 14, fontWeight: "bold", color: "#c8a84b", flex: 1 }}>{potion?.name}</span>
                  <span style={{ background: "#1a0e06", border: "1px solid #8B6914", borderRadius: 20, padding: "2px 8px", fontSize: 11, color: "#c8a84b", whiteSpace: "nowrap" }}>
                    Lv.{level}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: "bold", color: "#c8a84b", whiteSpace: "nowrap", minWidth: 48, textAlign: "right" }}>
                    {price}G
                  </span>
                  {onSelectRecipe && (
                    <button
                      onClick={() => onSelectRecipe(recipe.baseId, recipe.accentId)}
                      disabled={!canBrew}
                      className={css({
                        bg: canBrew ? "pastel.mint" : "transparent",
                        border: "1px solid", borderColor: canBrew ? "pastel.sage" : "#4a3810",
                        borderRadius: "4px", p: "4px 12px",
                        cursor: canBrew ? "pointer" : "not-allowed",
                        fontSize: "12px", color: canBrew ? "#4a3f55" : "#4a3810",
                        whiteSpace: "nowrap", opacity: canBrew ? "1" : "0.5",
                        _hover: { bg: canBrew ? "pastel.sage" : "transparent" },
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
    <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", backgroundColor: `#${colorHex}`, flexShrink: 0, border: "1px solid rgba(255,255,255,0.2)" }} />
  );
}
