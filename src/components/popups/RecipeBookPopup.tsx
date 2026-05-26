import { css } from "#styled-system/css";
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
          zIndex: 301, width: "min(1600px, 98vw)", maxHeight: "88vh", overflowY: "auto",
          background: "rgba(12,8,3,0.98)", border: "2px solid #8B6914",
          borderRadius: 12, padding: "48px 56px", boxShadow: "0 24px 96px rgba(0,0,0,0.85)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 38, color: "#c8a84b", margin: 0, letterSpacing: "0.12em" }}>
            <IconRecipe size={32} /> レシピ帳
          </h2>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "#8B6914" }}>
            <IconClose size={22} />
          </button>
        </div>

        {knownRecipes.length === 0 ? (
          <p style={{ textAlign: "center", color: "#8B6914", fontSize: 20, padding: "28px 0", letterSpacing: "0.06em" }}>
            まだレシピがありません。<br />
            調合するか、朝のレシピ習得で覚えよう！
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(900px, 1fr))", gap: 22 }}>
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
                  onClick={() => { if (onSelectRecipe && canBrew) { onSelectRecipe(recipe.baseId, recipe.accentId); onClose(); } }}
                  style={{
                    display: "flex", alignItems: "center", gap: 28,
                    background: "rgba(30,20,8,0.82)", border: "1px solid #4a3810",
                    borderRadius: 10, padding: "24px", minHeight: 220, cursor: onSelectRecipe && canBrew ? 'pointer' : 'default',
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 140 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Dot colorHex={base?.colorHex ?? "aaaaaa"} size={28} />
                    </div>
                    <span style={{ fontSize: 20, color: "#e8d8b8", marginTop: 10 }}>{base?.name}</span>
                    <img
                      src={`/src/assets/materials/${recipe.baseId}.png`}
                      alt={base?.name ?? ""}
                      style={{ width: 160, height: 110, objectFit: 'contain', marginTop: 10 }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                  </div>

                  <div style={{ fontSize: 18, color: "#4a3810" }}>＋</div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 200 }}>
                    <Dot colorHex={accent?.colorHex ?? "aaaaaa"} size={28} />
                    <span style={{ fontSize: 20, color: "#e8d8b8", marginTop: 10 }}>{accent?.name}</span>
                    <img
                      src={`/src/assets/materials/${recipe.accentId}.png`}
                      alt={accent?.name ?? ""}
                      style={{ width: 160, height: 110, objectFit: 'contain', marginTop: 10 }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                  </div>

                  <div style={{ fontSize: 18, color: "#4a3810" }}>＝</div>

                  <div style={{ display: "flex", alignItems: "center", gap: 18, flex: 1 }}>
                    <Dot colorHex={potion?.colorHex ?? "808080"} size={28} />
                    <span style={{ fontSize: 32, fontWeight: "bold", color: "#c8a84b" }}>{potion?.name}</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <span style={{ background: "#1a0e06", border: "1px solid #8B6914", borderRadius: 24, padding: "6px 12px", fontSize: 16, color: "#c8a84b", whiteSpace: "nowrap" }}>
                      Lv.{level}
                    </span>
                    <span style={{ fontSize: 20, fontWeight: "bold", color: "#c8a84b", whiteSpace: "nowrap", minWidth: 80, textAlign: "right" }}>
                      {price}G
                    </span>
                    {onSelectRecipe && (
                      <button
                        onClick={() => onSelectRecipe(recipe.baseId, recipe.accentId)}
                        disabled={!canBrew}
                        className={css({
                          bg: canBrew ? "pastel.mint" : "transparent",
                          border: "1px solid", borderColor: canBrew ? "pastel.sage" : "#4a3810",
                          borderRadius: "8px", p: "8px 16px",
                          cursor: canBrew ? "pointer" : "not-allowed",
                          fontSize: "15px", color: canBrew ? "#4a3f55" : "#4a3810",
                          whiteSpace: "nowrap", opacity: canBrew ? "1" : "0.5",
                          _hover: { bg: canBrew ? "pastel.sage" : "transparent" },
                        })}
                      >
                        セット
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function Dot({ colorHex, size = 12 }: { colorHex: string; size?: number }) {
  return (
    <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", backgroundColor: `#${colorHex}`, flexShrink: 0, border: "1px solid rgba(255,255,255,0.2)" }} />
  );
}
