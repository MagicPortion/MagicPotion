import { css } from "../../../../styled-system/css";
import type { MaterialDef } from "../../../data/types";
import { IconClose } from "../icons";

interface MaterialPickerPopupProps {
  title: string;
  items: MaterialDef[];
  counts: Record<string, number>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function MaterialPickerPopup({
  title, items, counts, selectedId, onSelect, onClose,
}: MaterialPickerPopupProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 30,
        background: "rgba(0,0,0,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 560 }}
        className={css({
          bg: "rgba(8,5,20,0.97)",
          border: "2px solid rgba(200,168,75,0.45)",
          borderRadius: "18px",
          p: "32px 36px 36px",
          boxShadow: "0 32px 100px rgba(0,0,0,0.8)",
        })}
      >
        {/* ヘッダー */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, color: "#8B6914", letterSpacing: "0.2em", margin: "0 0 4px", textTransform: "uppercase" }}>
              素材図鑑
            </p>
            <h2 style={{ fontSize: 22, color: "#c8a84b", margin: 0, fontWeight: "bold", letterSpacing: "0.08em" }}>
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "#5a4418", padding: 4 }}
            className={css({ _hover: { color: "#c8a84b" }, transition: "color 0.15s" })}
          >
            <IconClose size={22} />
          </button>
        </div>

        {/* カードグリッド (2×2) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {items.map((item) => {
            const count = counts[item.id] ?? 0;
            const isOwned = count > 0;
            const isSelected = selectedId === item.id;

            return (
              <button
                key={item.id}
                disabled={!isOwned}
                onClick={() => { onSelect(item.id); onClose(); }}
                style={{
                  position: "relative",
                  border: `2px solid ${isSelected ? "#c8a84b" : isOwned ? "rgba(200,168,75,0.2)" : "rgba(255,255,255,0.06)"}`,
                  background: isSelected ? "rgba(200,168,75,0.12)" : isOwned ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.2)",
                  boxShadow: isSelected ? "0 0 28px rgba(200,168,75,0.35)" : "none",
                  opacity: isOwned ? 1 : 0.45,
                }}
                className={css({
                  borderRadius: "14px",
                  p: "24px 16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  _hover: { filter: "brightness(1.15)" },
                  _disabled: { cursor: "not-allowed", _hover: { filter: "none" } },
                })}
              >
                {/* 素材ナンバー */}
                <span style={{ position: "absolute", top: 10, left: 14, fontSize: 11, color: "rgba(200,168,75,0.45)", letterSpacing: "0.1em" }}>
                  No.{items.indexOf(item) + 1}
                </span>

                {/* 選択済みチェック */}
                {isSelected && (
                  <span style={{ position: "absolute", top: 10, right: 12 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8a84b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}

                {/* カラーオーブ */}
                <span style={{
                  display: "block", width: 110, height: 110, borderRadius: "50%",
                  backgroundColor: `#${item.colorHex}`,
                  boxShadow: isOwned ? `0 4px 28px #${item.colorHex}77` : "none",
                  flexShrink: 0,
                }} />

                {/* 素材名 */}
                <span style={{ fontSize: 18, fontWeight: "bold", color: isOwned ? "#e8d8b8" : "#555", letterSpacing: "0.05em" }}>
                  {item.name}
                </span>

                {/* 在庫 or 未入手 */}
                <span style={{
                  fontSize: 13, letterSpacing: "0.05em",
                  color: isOwned ? "#c8a84b" : "#444",
                }}>
                  {isOwned ? `在庫 ×${count}` : "未入手"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
