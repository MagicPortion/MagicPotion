import { css } from "../../styled-system/css";
import { useGameStore } from "../store/useGameStore";
import { getMaterial, getPotion, getRecipe, calcSellPrice } from "../data/gameData";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  /** 調合画面でのみ渡す。クリックでベース・アクセントをセットする */
  onSelectRecipe?: (baseId: string, accentId: string) => void;
};

export default function RecipeBookPopup({ isOpen, onClose, onSelectRecipe }: Props) {
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
          zIndex: 200,
          background: "rgba(40, 28, 60, 0.48)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* メモ帳ウィンドウ */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 210,
          width: "min(580px, 90vw)",
          maxHeight: "75vh",
          display: "flex",
          flexDirection: "column",
        }}
        className={css({
          bg: "pastel.cream",
          borderRadius: "20px",
          boxShadow: "0 16px 56px rgba(0,0,0,0.32)",
          border: "2px solid",
          borderColor: "pastel.peach",
          overflow: "hidden",
        })}
      >
        {/* タイトルバー */}
        <div
          className={css({
            bg: "pastel.lavender",
            px: "20px",
            py: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          })}
        >
          <span style={{ fontSize: 16, fontWeight: "bold", color: "#4a3f55" }}>
            📖 レシピ帳
          </span>
          {onSelectRecipe && (
            <span style={{ fontSize: 12, color: "#6b5b73", marginLeft: 8 }}>
              レシピをクリックで材料をセット
            </span>
          )}
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              color: "#7b6b88",
              lineHeight: 1,
              padding: "2px 6px",
              marginLeft: "auto",
            }}
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* コンテンツ */}
        <div style={{ overflowY: "auto", padding: "16px 20px 24px", flex: 1 }}>
          {knownRecipes.length === 0 ? (
            <p style={{ textAlign: "center", color: "#aaa", fontSize: 14, padding: "28px 0" }}>
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

                // 案A: 所持していない場合はセット不可
                const hasBase = (materials[recipe.baseId] ?? 0) > 0;
                const hasAccent = (materials[recipe.accentId] ?? 0) > 0;
                const canSet = hasBase && hasAccent;

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
                    <RecipeDot colorHex={base?.colorHex ?? "aaaaaa"} />
                    <span style={{ fontSize: 13, color: hasBase ? "#4a3f55" : "#bbb" }}>
                      {base?.name}
                    </span>
                    <span style={{ fontSize: 13, color: "#bbb" }}>＋</span>
                    <RecipeDot colorHex={accent?.colorHex ?? "aaaaaa"} />
                    <span style={{ fontSize: 13, color: hasAccent ? "#4a3f55" : "#bbb" }}>
                      {accent?.name}
                    </span>
                    <span style={{ fontSize: 13, color: "#bbb", margin: "0 4px" }}>＝</span>
                    <RecipeDot colorHex={potion?.colorHex ?? "808080"} />
                    <span style={{ fontSize: 14, fontWeight: "bold", color: "#6b5b73", flex: 1 }}>
                      {potion?.name}
                    </span>
                    <span
                      className={css({
                        bg: "pastel.lilac",
                        borderRadius: "20px",
                        px: "8px",
                        py: "2px",
                        fontSize: "12px",
                        color: "#4a3f55",
                        whiteSpace: "nowrap",
                      })}
                    >
                      Lv.{level}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: "bold", color: "#6b5b73", whiteSpace: "nowrap" }}>
                      {price}G
                    </span>

                    {/* セットボタン（調合画面でのみ表示） */}
                    {onSelectRecipe && (
                      <button
                        onClick={() => {
                          if (!canSet) return;
                          onSelectRecipe(recipe.baseId, recipe.accentId);
                        }}
                        disabled={!canSet}
                        title={canSet ? "この材料で調合する" : "材料が足りません"}
                        className={css({
                          bg: canSet ? "pastel.mint" : "pastel.cream",
                          border: "1.5px solid",
                          borderColor: canSet ? "pastel.sage" : "pastel.lavender",
                          borderRadius: "8px",
                          px: "10px",
                          py: "4px",
                          cursor: canSet ? "pointer" : "not-allowed",
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: canSet ? "#4a3f55" : "#c0b8cc",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          transition: "all 0.12s",
                          _hover: canSet ? { bg: "pastel.sage" } : {},
                        })}
                      >
                        {canSet ? "セット ▶" : "材料不足"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function RecipeDot({ colorHex }: { colorHex: string }) {
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
