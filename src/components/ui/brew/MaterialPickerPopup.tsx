import { css } from "#styled-system/css";
import type { MaterialDefWithUrl } from "../../../data/types";
import MaterialCard from "./MaterialCard";

interface MaterialPickerPopupProps {
  title: string;
  items: MaterialDefWithUrl[];
  counts: Record<string, number>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function MaterialPickerPopup({
  title,
  items,
  counts,
  selectedId,
  onSelect,
  onClose,
}: MaterialPickerPopupProps) {
  const ownedItems = items.filter((item) => (counts[item.id] ?? 0) > 0);

  return (
    // 暗くぼかしたフルスクリーンオーバーレイ。カード外クリックで閉じる
    <div
      data-sound="cancel"
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

        {/* 材料を横一行で表示 */}
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

              return (
                <div key={item.id}>
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