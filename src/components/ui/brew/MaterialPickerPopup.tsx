import { css } from "#styled-system/css";
import type { MaterialDef } from "../../../data/types";
import MaterialCard from "./MaterialCard";

interface MaterialPickerPopupProps {
  title: string;
  items: MaterialDef[];
  counts: Record<string, number>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
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
  suggestedRecipes = [],
}: MaterialPickerPopupProps) {
  const ownedItems = items.filter((item) => (counts[item.id] ?? 0) > 0);

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

        {/* 材料を横一行で表示（推奨素材はハイライト） */}
        {ownedItems.length > 0 ? (
          <div
            className={css({
              display: "flex",
              flexDirection: "row",
              gap: "28px",
              justifyContent: "center",
            })}
          >
            {ownedItems.map((item) => {
              const count = counts[item.id] ?? 0;
              const isSuggested = suggestedRecipes.some(
                (recipe) => recipe.materialId === item.id
              );

              return (
                <div
                  key={item.id}
                  className={css({
                    position: "relative",
                    transition: "transform 0.2s",
                    _hover: { transform: "scale(1.05)" },
                  })}
                >
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

                  {/* 推奨バッジ */}
                  {isSuggested && (
                    <div
                      className={css({
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        bg: "rgba(255,215,0,0.9)",
                        color: "#000000",
                        fontSize: "20px",
                        fontWeight: "bold",
                        borderRadius: "50%",
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 15px rgba(255,215,0,0.6)",
                        zIndex: 20,
                      })}
                    >
                      ★
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