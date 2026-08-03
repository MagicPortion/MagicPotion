import { css } from "#styled-system/css";
import type { MaterialDefWithUrl } from "../../../data/types";
import Image from "../common/Image";

interface ShopMaterialItem extends MaterialDefWithUrl {
  instanceId: string;
}

interface ShopCardProps {
  item: ShopMaterialItem;
  isSelected: boolean;
  isSoldOut: boolean;
  onClick: () => void;
}

export default function ShopCard({ item, isSelected, isSoldOut, onClick }: ShopCardProps) {
  const isBase = item.category === "base";

  return (
    <div
      data-sound={isSoldOut ? "none" : "select"}
      onClick={onClick}
      // cursor は動的な状態値のためinline style
      style={{ cursor: isSoldOut ? "not-allowed" : "pointer" }}
      className={css({ display: "flex", flexDirection: "column", alignItems: "center", w: "220px" })}
    >
      <div
        className={css({
          bg: "parchment.bgSoft",
          border: "3px solid",
          borderColor: isSelected ? "parchment.accent" : (isBase ? "parchment.danger" : "parchment.success"),
          borderRadius: "16px",
          p: "12px",
          w: "220px",
          textAlign: "center",
          position: "relative",
          transition: "transform 0.1s",
          boxShadow: isSelected ? "0 0 0 4px rgba(200,168,75,0.24), 0 12px 28px rgba(0,0,0,0.5)" : "0 8px 20px rgba(0,0,0,0.4)",
          _hover: { transform: "scale(1.04)", bg: "rgba(42,29,12,0.96)" },
        })}
      >
        <div className={css({ bg: "transparent", h: "115px", display: "flex", alignItems: "center", justifyContent: "center" })}>
          <Image src={item.imageUrl} alt={item.name} width={105} height={105} />
        </div>

        <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "8px", px: "4px" })}>
          <span
            className={css({
              fontSize: "26px",
              bg: "parchment.surface",
              border: "1px solid",
              borderColor: isBase ? "parchment.danger" : "parchment.success",
              color: isBase ? "parchment.dangerBorder" : "parchment.successText",
              px: "6px", py: "2px", borderRadius: "4px", fontWeight: "bold",
            })}
          >
            {isBase ? "Base" : "Accent"}
          </span>
          <span className={css({ fontSize: "28px", fontWeight: "bold", color: "parchment.accent" })}>{item.price}G</span>
        </div>

        {isSelected && !isSoldOut && (
          <div className={css({ position: "absolute", top: "-10px", right: "-10px", bg: "parchment.accent", color: "parchment.surface", borderRadius: "50%", w: "30px", h: "30px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "2px solid", borderColor: "parchment.surface" })}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a0e06" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        {isSoldOut && (
          <div className={css({
            position: "absolute", inset: 0, bg: "rgba(0,0,0,0.65)", borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "parchment.dangerBorder", fontSize: "24px", fontWeight: "bold", letterSpacing: "0.05em",
            transform: "rotate(-10deg)", border: "3px solid", borderColor: "parchment.danger", m: "10px", zIndex: 2,
          })}>
            SOLD OUT
          </div>
        )}
      </div>

      {/* 素材名（カード外）。カード幅に縛られず1行で表示し、見切れさせない */}
      <div className={css({
        fontSize: "24px",
        color: "parchment.text",
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
