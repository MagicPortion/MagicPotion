import { css } from "../../../../styled-system/css";
import { MATERIALS } from "../../../data/gameData";

interface InventoryPanelProps {
  materials: Record<string, number>;
}

export default function InventoryPanel({ materials }: InventoryPanelProps) {
  const owned = Object.entries(materials).filter(([, c]) => c > 0);

  return (
    <div
      style={{ position: "absolute", bottom: 90, left: 16, zIndex: 10, maxWidth: 340 }}
      className={css({ bg: "pastel.sky", borderRadius: "12px", p: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" })}
    >
      <p style={{ fontSize: 12, color: "#6b5b73", margin: "0 0 6px" }}>持ち物</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {owned.length === 0 ? (
          <span style={{ fontSize: 12, color: "#999" }}>なし</span>
        ) : (
          owned.map(([id, count]) => {
            const mat = MATERIALS.find((m) => m.id === id);
            return mat ? (
              <span key={id} className={css({ bg: "white", borderRadius: "6px", px: "8px", py: "3px", fontSize: "12px", color: "#4a3f55" })}>
                {mat.name} ×{count}
              </span>
            ) : null;
          })
        )}
      </div>
    </div>
  );
}
