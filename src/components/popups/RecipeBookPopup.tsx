import { css } from "#styled-system/css";
import { useGameStore } from "../../store/useGameStore";
import { getMaterial, getPotion, getRecipe, calcSellPrice } from "../../data/gameData";
import { IconRecipe, IconClose } from "../ui/icons";
import MaterialImage from "../ui/common/MaterialImage";

interface RecipeBookPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe?: (baseId: string, accentId: string) => void;
}

export default function RecipeBookPopup({ isOpen, onClose, onSelectRecipe }: RecipeBookPopupProps) {
  const { recipeLevel, materials } = useGameStore();

  if (!isOpen) return null;

  const knownRecipes = Object.entries(recipeLevel).filter(([, lv]) => lv > 0);

  // potionId でグループ化（同じポーションを複数の作り方でまとめる）
  const grouped = knownRecipes.reduce<Record<string, Array<{ recipeId: string; level: number }>>>(
    (acc, [recipeId, level]) => {
      const recipe = getRecipe(recipeId);
      if (!recipe) return acc;
      const list = acc[recipe.potionId] ?? [];
      return { ...acc, [recipe.potionId]: [...list, { recipeId, level }] };
    },
    {}
  );

  return (
    <>
      <div
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className={css({ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300 })}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={css({
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          zIndex: 301, w: "1800px", maxH: "760px", overflowY: "auto",
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

        {Object.keys(grouped).length === 0 ? (
          <p className={css({ textAlign: "center", color: "#8B6914", fontSize: "30px", p: "20px 0", letterSpacing: "0.06em" })}>
            まだレシピがありません。<br />
            調合するか、朝のレシピ習得で覚えよう！
          </p>
        ) : (
          <div className={css({ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" })}>
            {Object.entries(grouped).map(([potionId, recipes]) => {
              const potion = getPotion(potionId);

              return (
                <div
                  key={potionId}
                  className={css({
                    display: "flex", alignItems: "flex-start", gap: "0",
                    background: "rgba(30,20,8,0.78)", border: "1px solid #4a3810",
                    borderRadius: "12px", overflow: "hidden",
                  })}
                >
                  {/* 左：ポーション情報 */}
                    <div className={css({
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: "10px", w: "170px", flexShrink: 0, p: "20px 16px",
                    borderRight: "1px solid #4a3810", alignSelf: "stretch",
                  })}>
                    <Dot colorHex={potion?.colorHex ?? "808080"} size={40} />
                    <span className={css({ fontSize: "26px", fontWeight: "bold", color: "#c8a84b", textAlign: "center", lineHeight: 1.3 })}>
                      {potion?.name}
                    </span>
                    {recipes.length > 1 && (
                      <span className={css({ fontSize: "24px", color: "#6b5040", letterSpacing: "0.04em" })}>
                        {recipes.length}通り
                      </span>
                    )}
                  </div>

                  {/* 右：レシピ一覧 */}
                  <div className={css({ flex: 1, display: "flex", flexDirection: "column", p: "12px 16px", gap: "8px" })}>
                    {recipes.map(({ recipeId, level }) => {
                      const recipe = getRecipe(recipeId);
                      if (!recipe) return null;
                      const base = getMaterial(recipe.baseId);
                      const accent = getMaterial(recipe.accentId);
                      const price = potion ? calcSellPrice(potion.basePrice, level) : 0;
                      const canBrew =
                        onSelectRecipe &&
                        (materials[recipe.baseId] ?? 0) > 0 &&
                        (materials[recipe.accentId] ?? 0) > 0;

                      return (
                        <div
                          key={recipeId}
                          // cursor は canBrew の動的値のためinline style
                          style={{ cursor: onSelectRecipe && canBrew ? "pointer" : "default" }}
                          onClick={() => { if (onSelectRecipe && canBrew) { onSelectRecipe(recipe.baseId, recipe.accentId); onClose(); } }}
                          className={css({
                            display: "flex", flexDirection: "column", gap: "8px",
                            bg: "rgba(255,255,255,0.04)", borderRadius: "8px", p: "14px 16px",
                            transition: "background 0.12s",
                            _hover: onSelectRecipe && canBrew
                              ? { bg: "rgba(200,168,75,0.08)" }
                              : {},
                          })}
                        >
                          <div className={css({ display: "flex", alignItems: "center", gap: "10px", width: "100%", flexWrap: "wrap" })}>
                            <span className={css({ background: "#1a0e06", border: "1px solid #8B6914", borderRadius: "20px", px: "10px", py: "3px", fontSize: "26px", color: "#c8a84b", whiteSpace: "nowrap" })}>
                              Lv.{level}
                            </span>
                            <span className={css({ fontSize: "26px", fontWeight: "bold", color: "#c8a84b", whiteSpace: "nowrap" })}>
                              {price}G
                            </span>
                          </div>

                          <div className={css({ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", width: "100%", flexWrap: "wrap" })}>
                            <div className={css({ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" })}>
                              {base && <MaterialImage src={base.imagePath} alt={base.name} size={64} />}
                              <span className={css({ fontSize: "26px", color: "#e8d8b8", minW: "80px", wordBreak: "break-word" })}>{base?.name}</span>
                              <span className={css({ fontSize: "26px", color: "#4a3810", flexShrink: 0 })}>＋</span>
                              {accent && <MaterialImage src={accent.imagePath} alt={accent.name} size={64} />}
                              <span className={css({ fontSize: "26px", color: "#e8d8b8", minW: "80px", wordBreak: "break-word" })}>{accent?.name}</span>
                            </div>
                            {onSelectRecipe && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onSelectRecipe(recipe.baseId, recipe.accentId); onClose(); }}
                                disabled={!canBrew}
                                className={css({
                                  bg: canBrew ? "pastel.mint" : "transparent",
                                  border: "1px solid", borderColor: canBrew ? "pastel.sage" : "#4a3810",
                                  borderRadius: "6px", p: "4px 12px", flexShrink: 0,
                                  cursor: canBrew ? "pointer" : "not-allowed",
                                  fontSize: "26px", color: canBrew ? "#4a3f55" : "#4a3810",
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
    // backgroundColor・width・height は動的値のためinline style
    <span
      style={{ backgroundColor: `#${colorHex}`, width: size, height: size }}
      className={css({ display: "inline-block", borderRadius: "50%", flexShrink: 0, border: "1px solid rgba(255,255,255,0.2)" })}
    />
  );
}
