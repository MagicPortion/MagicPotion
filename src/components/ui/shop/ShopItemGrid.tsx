import { css } from "../../../../styled-system/css";
import type { MaterialDef } from "../../../data/types";

interface ShopItemGridProps {
  items: MaterialDef[];
  onBuy: (item: MaterialDef) => void;
}

export default function ShopItemGrid({ items, onBuy }: ShopItemGridProps) {
  return (
    <div
      style={{ position: "absolute", bottom: 90, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
      className={css({ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", maxWidth: "700px" })}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onBuy(item)}
          className={css({
            bg: "pastel.mint", border: "2px solid", borderColor: "pastel.sage",
            borderRadius: "12px", p: "10px 16px", cursor: "pointer",
            fontSize: "13px", color: "#4a3f55", boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
            transition: "all 0.15s",
            _hover: { bg: "pastel.lemon", transform: "scale(1.06)" },
          })}
        >
          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", backgroundColor: `#${item.colorHex}`, marginRight: 6, verticalAlign: "middle" }} />
          {item.name} ({item.price}G)
        </button>
      ))}
    </div>
  );
}
