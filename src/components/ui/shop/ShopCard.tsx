import { css } from "#styled-system/css";
import type { MaterialDef } from "../../../data/types";
import ColorOrb from "../common/ColorOrb";

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
      // cursor は動的な状態値のためinline style
      style={{ cursor: isSoldOut ? "not-allowed" : "pointer" }}
      className={css({ display: "flex", flexDirection: "column", alignItems: "center", w: "185px" })}
    >
      <div
        // backgroundColor・boxShadow は動的な状態値のためinline style
        style={{
          backgroundColor: cardBg,
          boxShadow: isSelected ? "0 0 0 5px #46a1ea, 0 8px 16px rgba(0,0,0,0.3)" : undefined,
        }}
        className={css({
          borderRadius: "16px",
          p: "12px",
          w: "185px",
          textAlign: "center",
          position: "relative",
          transition: "transform 0.1s",
          boxShadow: "0 8px 16px rgba(0,0,0,0.18)",
          _hover: { transform: "scale(1.04)" },
        })}
      >
        <div className={css({ bg: "white", borderRadius: "12px", h: "115px", display: "flex", alignItems: "center", justifyContent: "center" })}>
          <ColorOrb colorHex={item.colorHex} size={72} />
        </div>

        <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "8px", px: "4px" })}>
          {/* color は category 動的値のためinline style */}
          <span
            style={{ color: item.category === "base" ? "#ff4d4f" : "#52c41a" }}
            className={css({ fontSize: "26px", bg: "white", px: "6px", py: "2px", borderRadius: "4px", fontWeight: "bold" })}
          >
            {item.category === "base" ? "Base" : "Accent"}
          </span>
          <span className={css({ fontSize: "28px", fontWeight: "bold", color: "white" })}>{item.price}G</span>
        </div>

        {isSelected && !isSoldOut && (
          <div className={css({ position: "absolute", top: "-10px", right: "-10px", bg: "#46a1ea", color: "white", borderRadius: "50%", w: "30px", h: "30px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "2px solid white" })}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        {isSoldOut && (
          <div className={css({
            position: "absolute", inset: 0, bg: "rgba(0,0,0,0.65)", borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#ff4d4f", fontSize: "24px", fontWeight: "bold", letterSpacing: "0.05em",
            transform: "rotate(-10deg)", border: "3px solid #ff4d4f", m: "10px", zIndex: 2,
          })}>
            SOLD OUT
          </div>
        )}
      </div>

      {/* 素材名（カード外）。カード幅に縛られず1行で表示し、見切れさせない */}
      <div className={css({
        fontSize: "24px",
        color: "#e8d8b8",
        fontWeight: "bold",
        mt: "10px",
        whiteSpace: "nowrap",
        textAlign: "center",
      })}>
        {item.name}
      </div>
    </div>
  );
}
