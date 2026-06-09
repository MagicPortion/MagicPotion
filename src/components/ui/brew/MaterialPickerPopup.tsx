import { css } from "../../../../styled-system/css";
import type { MaterialDef } from "../../../data/types";

interface MaterialPickerPopupProps {
  title: string;
  items: MaterialDef[];
  counts: Record<string, number>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
  suggestedItems?: MaterialDef[];
  suggestedRecipes?: {
    materialId: string;
    potionName: string;
    currentLevel: number;
    nextLevel: number;
    currentPrice: number;
    nextPrice: number;
  }[];
}

export default function MaterialPickerPopup({
  title, items, counts, selectedId, onSelect, onClose, suggestedItems = [], suggestedRecipes = [],
}: MaterialPickerPopupProps) {
  const ownedItems = items.filter((item) => (counts[item.id] ?? 0) > 0);
  const ownedSuggestedItems =
  suggestedItems.filter(
    (item) => (counts[item.id] ?? 0) > 0
  );

  return (
    // 暗くぼかしたフルスクリーンオーバーレイ。カード外クリックで閉じる
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 55,
        backgroundColor: "rgba(6, 4, 12, 0.8)",
        backdropFilter: "blur(12px)",
      }}
      className={css({ display: "flex", alignItems: "center", justifyContent: "center" })}
    >
      {/* スクロール可能なカードエリア。クリック伝播を止めて閉じないようにする */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          overflowX: "auto",
          maxWidth: "90%",
          p: "24px 32px 32px",
        })}
      >
        {/* タイトル */}
        <p className={css({ fontSize: "32px", color: "#c8a84b", letterSpacing: "0.2em", m: 0, textTransform: "uppercase" })}>
          {title}
        </p>

        {/* カード横並び */}
        <div className={css({ display: "flex", flexDirection: "row", gap: "24px" })}>
          {ownedItems.map((item) => {
            const count = counts[item.id] ?? 0;
            const isSelected = selectedId === item.id;
            const suggestedRecipe = suggestedRecipes.find((recipe) => recipe.materialId === item.id);
            const isSuggested = ownedSuggestedItems.some((suggested) => suggested.id === item.id);

            return (
              // 個数バッジを絶対配置するためにrelativeラッパーが必要
              <div key={item.id} className={css({ position: "relative" })}>
                <button
                  onClick={() => { onSelect(item.id); onClose(); }}
                  // border・background・boxShadowがisSelectedで動的かつ動的カラーコードとの調和のためinline styleを使用
                  style={{
                    border: `2px solid ${isSelected ? "#c8a84b" : "rgba(200,168,75,0.25)"}`,
                    background: isSelected
                      ? "linear-gradient(rgba(200,168,75,0.14), rgba(200,168,75,0.14)), rgba(8,5,20,0.92)"
                      : "rgba(8,5,20,0.92)",
                    boxShadow: isSelected
                      ? "0 0 40px rgba(200,168,75,0.4), 0 8px 40px rgba(0,0,0,0.7)"
                      : "0 8px 40px rgba(0,0,0,0.6)",
                  }}
                  className={css({
                    borderRadius: "20px",
                    p: "36px 24px 28px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    width: "280px",
                    height: "340px",
                    _hover: { filter: "brightness(1.15)" },
                  })}
                >
                  {/* 選択済みチェック */}
                  {isSelected && (
                    <span className={css({ position: "absolute", top: "14px", right: "16px" })}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a84b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}

                  {/* カラーオーブ。colorHexが動的のためinline style */}
                  <span style={{
                    display: "block",
                    width: 140, height: 140,
                    borderRadius: "50%",
                    backgroundColor: `#${item.colorHex}`,
                    boxShadow: `0 4px 32px #${item.colorHex}77`,
                    flexShrink: 0,
                  }} />

                  {/* 素材名 */}
                  <span className={css({ fontSize: "34px", fontWeight: "bold", color: "#ffffff", letterSpacing: "0.05em", textAlign: "center" })}>
                    {item.name}
                  </span>
                </button>

                {isSuggested && suggestedRecipe && (
                  <div
                    className={css({
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      mt: "12px",

                      minWidth: "240px",

                      bg: "rgba(8,5,20,0.97)",
                      border: "2px solid rgba(200,168,75,0.8)",
                      borderRadius: "18px",

                      px: "24px",
                      py: "16px",

                      textAlign: "center",
                      whiteSpace: "nowrap",

                      boxShadow: "0 0 20px rgba(200,168,75,0.25)",

                      pointerEvents: "none",
                    })}
                  >
                    {/* ポーション名 */}
                    <div
                      className={css({
                        fontSize: "30px",
                        fontWeight: "bold",
                        color: "#ffffff",
                        mb: "6px",
                      })}
                    >
                      {suggestedRecipe.potionName}
                    </div>

                    {/* レベル推移 */}
                    <div
                      className={css({
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#c8a84b",
                      })}
                    >
                      Lv.{suggestedRecipe.currentLevel}
                      {" → "}
                      Lv.{suggestedRecipe.nextLevel}
                    </div>

                    {/* 売値推移 */}
                    <div
                      className={css({
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#7CFF8F",
                      })}
                    >
                      {suggestedRecipe.currentPrice}G
                      {" → "}
                      {suggestedRecipe.nextPrice}G
                    </div>

                    {/* 増加量 */}
                    <div
                      className={css({
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: "#8AD8FF",
                        mt: "4px",
                      })}
                    >
                      +{suggestedRecipe.nextPrice - suggestedRecipe.currentPrice}G
                    </div>
                  </div>
                )}

                {/* 個数バッジ。カード右下に絶対配置。1個の場合は非表示 */}
                {count > 1 && (
                  <span className={css({
                    position: "absolute",
                    bottom: "-12px",
                    right: "-12px",
                    fontSize: "40px",
                    fontWeight: "bold",
                    color: "#c8a84b",
                    bg: "rgba(8,5,20,0.95)",
                    border: "1.5px solid rgba(200,168,75,0.4)",
                    borderRadius: "16px",
                    px: "14px",
                    py: "4px",
                    lineHeight: 1,
                    pointerEvents: "none",
                  })}>
                    {count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}