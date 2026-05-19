import { css } from "../../../../styled-system/css";
import type { MaterialDef } from "../../../data/types";

interface MaterialCardGridProps {
  title: string;
  items: MaterialDef[];
  counts: Record<string, number>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function MaterialCardGrid({ title, items, counts, selectedId, onSelect }: MaterialCardGridProps) {
  return (
    <div>
      <p style={{ fontSize: 18, color: "#8b7f99", margin: "0 0 14px", fontWeight: "bold", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {title}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, width: 320 }}>
        {items.length === 0 ? (
          <span style={{ fontSize: 16, color: "#444", padding: "20px 0" }}>在庫なし</span>
        ) : (
          items.map((item) => {
            const count = counts[item.id] ?? 0;
            const isSelected = selectedId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                style={{
                  position: "relative",
                  width: 148,
                  height: 148,
                  borderRadius: 14,
                  border: `2px solid ${isSelected ? "#c8a84b" : "rgba(255,255,255,0.10)"}`,
                  boxShadow: isSelected ? `0 0 24px rgba(200,168,75,0.45)` : "none",
                  background: isSelected ? "rgba(200,168,75,0.10)" : "rgba(255,255,255,0.04)",
                  transition: "all 0.15s",
                }}
                className={css({
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  cursor: "pointer",
                  _hover: { bg: "rgba(255,255,255,0.08)" },
                })}
              >
                <span
                  style={{
                    position: "absolute", top: 7, right: 10,
                    fontSize: 15, color: "#c8a84b", fontWeight: "bold",
                  }}
                >
                  ×{count}
                </span>
                <span
                  style={{
                    display: "block", width: 82, height: 82, borderRadius: "50%",
                    backgroundColor: `#${item.colorHex}`,
                    boxShadow: `0 4px 22px #${item.colorHex}66`,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 16, color: isSelected ? "#c8a84b" : "#e8d8b8", fontWeight: isSelected ? "bold" : "normal" }}>
                  {item.name}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
