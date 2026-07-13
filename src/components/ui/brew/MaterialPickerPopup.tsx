import { css } from "../../../../styled-system/css";
import type { MaterialDef } from "../../../data/types";
import MaterialCard from "./MaterialCard";

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
  title,
  items,
  counts,
  selectedId,
  onSelect,
  onClose,
  suggestedItems = [],
  suggestedRecipes = [],
}: MaterialPickerPopupProps) {
  const ownedItems = items.filter((item) => (counts[item.id] ?? 0) > 0);
  const ownedSuggestedItems = suggestedItems.filter(
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
      className={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      {/* スクロール可能なカードエリア。クリック伝播を止めて閉じないようにする */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          overflowX: "auto",
          maxWidth: "90%",
          p: "24px 32px 32px",
        })}
      >
        {/* タイトル（固定） */}
        <div
          className={css({
            minHeight: "50px",
            display: "flex",
            alignItems: "center",
          })}
        >
          <p
            className={css({
              fontSize: "36px",
              color: "#c8a84b",
              letterSpacing: "0.2em",
              m: 0,
              textTransform: "uppercase",
              fontWeight: "bold",
            })}
          >
            {title}
          </p>
        </div>

        {/* カード横並び */}
        {ownedItems.length > 0 ? (
          <div
            className={css({
              display: "flex",
              flexDirection: "row",
              gap: "28px",
            })}
          >
            {ownedItems.map((item) => {
              const count = counts[item.id] ?? 0;
              const suggestedRecipe = suggestedRecipes.find(
                (recipe) => recipe.materialId === item.id
              );
              const isSuggested = ownedSuggestedItems.some(
                (suggested) => suggested.id === item.id
              );

              return (
                <div key={item.id} className={css({ position: "relative" })}>
                  <MaterialCard
                    item={item}
                    count={count}
                    isSelected={selectedId === item.id}
                    onClick={() => {
                      onSelect(item.id);
                      onClose();
                    }}
                    variant="picker"
                  />

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
                        zIndex: 10,
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

                      {/* 現在レベル */}
                      <div
                        className={css({
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#c8a84b",
                        })}
                      >
                        Lv.{suggestedRecipe.currentLevel}
                      </div>

                      {/* 現在価格 */}
                      <div
                        className={css({
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#7CFF8F",
                        })}
                      >
                        {suggestedRecipe.currentPrice}G
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p
            className={css({
              fontSize: "28px",
              color: "#c8a84b",
              letterSpacing: "0.1em",
              textAlign: "center",
            })}
          >
            所持している素材がありません
          </p>
        )}
      </div>
    </div>
  );
}