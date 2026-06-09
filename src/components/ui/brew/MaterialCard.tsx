import { css } from "#styled-system/css";
import type { MaterialDef } from "../../../data/types";
import ColorOrb from "../common/ColorOrb";

interface MaterialCardProps {
  item: MaterialDef;
  count: number;
  isSelected: boolean;
  onClick: () => void;
  variant: "picker" | "shelf";
}

export default function MaterialCard({
  item,
  count,
  isSelected,
  onClick,
  variant,
}: MaterialCardProps) {
  const isPicker = variant === "picker";

  return (
    // 個数バッジを絶対配置するためにrelativeラッパー
    <div className={css({ position: "relative" })}>
      <button
        onClick={onClick}
        // border・background・boxShadowがisSelectedで動的のためinline style
        style={{
          border: `2px solid ${isSelected ? "#c8a84b" : isPicker ? "rgba(200,168,75,0.25)" : "rgba(200,168,75,0.2)"}`,
          background: isSelected
            ? "linear-gradient(rgba(200,168,75,0.14), rgba(200,168,75,0.14)), rgba(8,5,20,0.92)"
            : "rgba(8,5,20,0.92)",
          boxShadow: isSelected
            ? "0 0 40px rgba(200,168,75,0.4), 0 8px 40px rgba(0,0,0,0.7)"
            : "0 8px 40px rgba(0,0,0,0.6)",
        }}
        className={css({
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.15s",
          _hover: { filter: "brightness(1.15)" },
          ...(isPicker
            ? { p: "44px 28px 32px", gap: "24px", width: "336px", height: "408px" }
            : { p: "16px 20px", gap: "0px" }),
        })}
      >
        {isSelected && isPicker && (
          <span className={css({ position: "absolute", top: "14px", right: "16px" })}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a84b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}

        <ColorOrb colorHex={item.colorHex} size={isPicker ? 208 : 64} />

        {isPicker && (
          <span className={css({ fontSize: "30px", fontWeight: "bold", color: "#ffffff", letterSpacing: "0.05em", textAlign: "center" })}>
            {item.name}
          </span>
        )}

        {!isPicker && (
          <>
            <span className={css({ fontSize: "28px", fontWeight: "bold", color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>
              {item.name}
            </span>
            <span className={css({ fontSize: "20px", color: "#c8a84b", fontWeight: "bold" })}>
              Lv.{count}
            </span>
          </>
        )}
      </button>

      {count > 1 && (
        <span
          className={css({
            position: "absolute",
            ...(isPicker
              ? { bottom: "-12px", right: "-12px", fontSize: "40px" }
              : { bottom: "-12px", right: "-12px", fontSize: "28px" }),
            fontWeight: "bold",
            color: isPicker ? "#c8a84b" : "#ffffff",
            bg: isPicker ? "rgba(8,5,20,0.95)" : "#c8a84b",
            border: isPicker ? "1.5px solid rgba(200,168,75,0.4)" : "none",
            borderRadius: "16px",
            px: isPicker ? "14px" : "12px",
            py: isPicker ? "4px" : "2px",
            lineHeight: 1,
            pointerEvents: "none",
          })}
        >
          {isPicker ? count : `×${count}`}
        </span>
      )}
    </div>
  );
}
