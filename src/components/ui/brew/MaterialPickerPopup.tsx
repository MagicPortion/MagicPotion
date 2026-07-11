import { css } from "#styled-system/css";
import type { MaterialDef } from "../../../data/types";
import MaterialCard from "./MaterialCard";
import ModalOverlay from "../common/ModalOverlay";

interface MaterialPickerPopupProps {
  title: string;
  items: MaterialDef[];
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
    <ModalOverlay onBackdropClick={onClose} backdrop="rgba(6, 4, 12, 0.8)" zIndex={55} blur={12}>
      {/* スクロール可能なカードエリア。クリック伝播を止めて閉じないようにする */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          maxWidth: "90%",
          p: "32px 40px 40px",
        })}
      >
        {/* タイトル（固定） */}
        <div className={css({ minHeight: "50px", display: "flex", alignItems: "center" })}>
          <p className={css({ fontSize: "36px", color: "#c8a84b", letterSpacing: "0.2em", m: 0, textTransform: "uppercase", fontWeight: "bold" })}>
            {title}
          </p>
        </div>

        {/* カード横並び */}
        {ownedItems.length > 0 ? (
          <div className={css({ display: "flex", flexDirection: "row", gap: "28px" })}>
            {ownedItems.map((item) => (
              <MaterialCard
                key={item.id}
                item={item}
                count={counts[item.id] ?? 0}
                isSelected={selectedId === item.id}
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
                variant="picker"
              />
            ))}
          </div>
        ) : (
          <p className={css({ fontSize: "28px", color: "#c8a84b", letterSpacing: "0.1em", textAlign: "center" })}>
            所持している素材がありません
          </p>
        )}
      </div>
    </ModalOverlay>
  );
}
