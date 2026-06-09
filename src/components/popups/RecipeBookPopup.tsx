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
        className={css({ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300 })}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={css({
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          zIndex: 301, w: "min(1800px,98vw)", maxH: "90vh", overflowY: "auto",
          background: "rgba(12,8,3,0.98)", border: "2px solid #8B6914",
          borderRadius: "12px", p: "42px 48px", boxShadow: "0 20px 96px rgba(0,0,0,0.78)",
        })}
      >
        <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "20px" })}>
          <h2 className={css({ display: "flex", alignItems: "center", gap: "12px", fontSize: "30px", color: "#c8a84b", m: 0, letterSpacing: "0.12em" })}>
            <IconRecipe size={28} /> レシピ帳
          </h2>
          <button
            onClick={onClose}
            className={css({ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "#8B6914" })}
          >
            <IconClose size={28} />
          </button>
        </div>

        {knownRecipes.length === 0 ? (
          <p className={css({ textAlign: "center", color: "#8B6914", fontSize: "30px", p: "20px 0", letterSpacing: "0.06em" })}>
            まだレシピがありません。<br />
            調合するか、朝のレシピ習得で覚えよう！
          </p>
        ) : (
          <div className={css({ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(810px, 1fr))", gap: "20px" })}>
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
                  // cursor は canBrew の動的値のためinline style
                  style={{ cursor: onSelectRecipe && canBrew ? "pointer" : "default" }}
                  className={css({
                    display: "flex", alignItems: "center", gap: "20px",
                    background: "rgba(30,20,8,0.78)", border: "1px solid #4a3810",
                    borderRadius: "12px", p: "20px", minH: "160px",
                  })}
                >
                  {/* ポーション名エリア */}
                  <div className={css({ display: "flex", alignItems: "center", gap: "12px", w: "200px", flexShrink: 0 })}>
                    <Dot colorHex={potion?.colorHex ?? "808080"} size={24} />
                    <span className={css({ fontSize: "28px", fontWeight: "bold", color: "#c8a84b" })}>{potion?.name}</span>
                  </div>

                  <div className={css({ fontSize: "40px", color: "#4a3810", fontWeight: "bold", flexShrink: 0 })}>→</div>

                  {/* ベース素材エリア */}
                  <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", w: "130px", flexShrink: 0 })}>
                    <Dot colorHex={base?.colorHex ?? "aaaaaa"} size={24} />
                    <span className={css({ fontSize: "26px", color: "#e8d8b8", mt: "8px", textAlign: "center" })}>{base?.name}</span>
                    {/* 画像は public/assets/materials/ に配置して /MagicPotion/ ベースパスで参照 */}
                    <img
                      src={`/MagicPotion/assets/materials/${recipe.baseId}.png`}
                      alt={base?.name ?? ""}
                      className={css({ w: "90px", h: "60px", objectFit: "contain", mt: "8px" })}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>

                  <div className={css({ fontSize: "30px", color: "#4a3810", fontWeight: "bold", flexShrink: 0 })}>＋</div>

                  {/* アクセント素材エリア */}
                  <div className={css({ display: "flex", flexDirection: "column", alignItems: "center", w: "130px", flexShrink: 0 })}>
                    <Dot colorHex={accent?.colorHex ?? "aaaaaa"} size={24} />
                    <span className={css({ fontSize: "26px", color: "#e8d8b8", mt: "8px", textAlign: "center" })}>{accent?.name}</span>
                    <img
                      src={`/MagicPotion/assets/materials/${recipe.accentId}.png`}
                      alt={accent?.name ?? ""}
                      className={css({ w: "90px", h: "60px", objectFit: "contain", mt: "8px" })}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>

                  {/* レベル・価格・セットボタン */}
                  <div className={css({ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-end", gap: "8px", ml: "auto", flexShrink: 0 })}>
                    <span className={css({ background: "#1a0e06", border: "1px solid #8B6914", borderRadius: "22px", px: "12px", py: "6px", fontSize: "30px", color: "#c8a84b", whiteSpace: "nowrap" })}>
                      Lv.{level}
                    </span>
                    <span className={css({ fontSize: "28px", fontWeight: "bold", color: "#c8a84b", whiteSpace: "nowrap", minW: "72px", textAlign: "right" })}>
                      {price}G
                    </span>
                    {onSelectRecipe && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectRecipe(recipe.baseId, recipe.accentId); onClose(); }}
                        disabled={!canBrew}
                        className={css({
                          bg: canBrew ? "pastel.mint" : "transparent",
                          border: "1px solid", borderColor: canBrew ? "pastel.sage" : "#4a3810",
                          borderRadius: "6px", p: "6px 14px",
                          cursor: canBrew ? "pointer" : "not-allowed",
                          fontSize: "30px", color: canBrew ? "#4a3f55" : "#4a3810",
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
    // backgroundColor は動的な colorHex のためinline style、size も動的のためinline style
    <span
      style={{ backgroundColor: `#${colorHex}`, width: size, height: size }}
      className={css({ display: "inline-block", borderRadius: "50%", flexShrink: 0, border: "1px solid rgba(255,255,255,0.2)" })}
    />
  );
}
