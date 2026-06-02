import type { MaterialDef } from '../../../data/types';
import { css } from '../../../../styled-system/css';

interface ShopMaterialItem extends MaterialDef {
  instanceId: string;
}

interface ShopCardProps {
  item: ShopMaterialItem;
  isSelected: boolean;
  isSoldOut: boolean;
  onClick: () => void;
}

export default function ShopCard({ item, isSelected, isSoldOut, onClick }: ShopCardProps) {
  const cardBg = item.category === "base" ? "#ff7875" : "#95de64";

  return (
    <div 
      onClick={onClick}
      className={css({
        borderRadius: "16px",
        p: "12px",
        w: "185px", 
        textAlign: "center",
        position: "relative",
        transition: "transform 0.1s",
        boxShadow: "0 8px 16px rgba(0,0,0,0.18)",
        cursor: "pointer",
        _hover: { transform: "scale(1.04)" } // シンプルなホバーのみに修正
      })}
      style={{
        backgroundColor: cardBg,
        boxShadow: isSelected ? "0 0 0 5px #46a1ea, 0 8px 16px rgba(0,0,0,0.3)" : undefined,
        cursor: isSoldOut ? "not-allowed" : "pointer"
      }}
    >
      <div className={css({ fontSize: "14px", color: "#002766", fontWeight: "bold", mb: "8px", overflow: "hidden", whiteSpace: "nowrap" })}>
        {item.name}
      </div>

      <div className={css({ bg: "white", borderRadius: "12px", h: "115px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "46px" })}>
        {item.id === "water" && "💧"}
        {item.id === "herb" && "🌿"}
        {item.id === "mushroom" && "🍄"}
        {item.id === "slime" && "🧪"}
        {item.id === "fire_essence" && "🔥"}
        {item.id === "moon_dust" && "✨"}
        {item.id === "fairy_wing" && "🪶"}
        {item.id === "crystal" && "💎"}
      </div>

      <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "8px", px: "4px" })}>
        <span className={css({ fontSize: "11px", bg: "white", px: "6px", py: "2px", borderRadius: "4px", fontWeight: "bold" })} style={{ color: item.category === "base" ? "#ff4d4f" : "#52c41a" }}>
          {item.category === "base" ? "Base" : "Accent"}
        </span>
        <span className={css({ fontSize: "16px", fontWeight: "bold", color: "white" })}>-{item.price}G</span>
      </div>

      {isSelected && !isSoldOut && (
        <div className={css({ position: "absolute", top: "-10px", right: "-10px", bg: "#46a1ea", color: "white", borderRadius: "50%", w: "30px", h: "30px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold", border: "2px solid white" })}>
          ✓
        </div>
      )}

      {isSoldOut && (
        <div className={css({
          position: "absolute",
          inset: 0,
          bg: "rgba(0,0,0,0.65)",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ff4d4f",
          fontSize: "24px",
          fontWeight: "bold",
          letterSpacing: "0.05em",
          transform: "rotate(-10deg)",
          border: "3px solid #ff4d4f",
          m: "10px",
          zIndex: 2
        })}>
          SOLD OUT
        </div>
      )}
    </div>
  );
}