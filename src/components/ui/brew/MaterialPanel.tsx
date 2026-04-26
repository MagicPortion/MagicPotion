import { css } from "../../../../styled-system/css";
import type { MaterialDef } from "../../../data/types";

interface MaterialPanelProps {
  title: string;
  items: MaterialDef[];
  counts: Record<string, number>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  side: "left" | "right";
}

const VARIANT = {
  left: {
    panelBg: "#FFDAB9",   // pastel.peach
    selectedBorder: "#FFB6C1", // pastel.pink
    selectedBg: "#FECDD3",    // pastel.rose
  },
  right: {
    panelBg: "#B3E5FC",   // pastel.sky
    selectedBorder: "#D8B4FE", // pastel.lilac
    selectedBg: "#E6E6FA",    // pastel.lavender
  },
} as const;

export default function MaterialPanel({ title, items, counts, selectedId, onSelect, side }: MaterialPanelProps) {
  const v = VARIANT[side];

  return (
    <div
      style={{
        position: "absolute",
        [side]: 20,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        minWidth: 180,
        background: v.panelBg,
        borderRadius: 14,
        padding: 14,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      }}
    >
      <p style={{ fontSize: 13, color: "#6b5b73", margin: "0 0 8px", fontWeight: "bold" }}>{title}</p>
      {items.length === 0 ? (
        <p style={{ fontSize: 12, color: "#aaa" }}>なし</p>
      ) : (
        items.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            style={{
              borderColor: selectedId === m.id ? v.selectedBorder : "transparent",
              background: selectedId === m.id ? v.selectedBg : "white",
            }}
            className={css({
              display: "block", width: "100%", mb: "4px", p: "7px 10px",
              borderRadius: "8px", border: "2px solid",
              cursor: "pointer", fontSize: "12px", color: "#4a3f55",
              _hover: { bg: "pastel.lemon" },
            })}
          >
            <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", backgroundColor: `#${m.colorHex}`, marginRight: 6, verticalAlign: "middle" }} />
            {m.name} ×{counts[m.id] ?? 0}
          </button>
        ))
      )}
    </div>
  );
}
