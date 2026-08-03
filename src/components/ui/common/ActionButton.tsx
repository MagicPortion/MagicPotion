import { css } from "#styled-system/css";
import type { ReactNode } from "react";
import { useUITheme } from "../../../hooks/useUITheme";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  variant?: "primary" | "secondary";
  emphasized?: boolean;
}

export function ActionButton({ onClick, disabled, children, variant = "primary", emphasized = false }: ActionButtonProps) {
  const t = useUITheme();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      // 背景テーマ設定・emphasizedに応じて変わる配色のためinline style
      style={{
        background: variant === "primary" ? t.border : t.btnBg,
        border: emphasized
          ? `4px solid ${t.nameText}`
          : variant === "primary"
            ? `1.5px solid ${t.nameText}`
            : `1.5px solid ${t.btnBorder}`,
        color: variant === "primary" ? t.surface : t.btnText,
      }}
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        borderRadius: "10px",
        px: "36px",
        py: "14px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "30px",
        fontWeight: emphasized || variant === "primary" ? "bold" : "normal",
        letterSpacing: "0.06em",
        opacity: disabled ? 0.4 : 1,
        whiteSpace: "nowrap",
        transition: "all 0.12s",
        _hover: { filter: disabled ? "none" : "brightness(1.12)" },
      })}
    >
      {children}
    </button>
  );
}
