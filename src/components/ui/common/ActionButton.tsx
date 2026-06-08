import { css } from "#styled-system/css";
import type { ReactNode } from "react";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export function ActionButton({ onClick, disabled, children, variant = "primary" }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        bg: variant === "primary" ? "#8B6914" : "rgba(14,8,2,0.92)",
        border: variant === "primary" ? "1.5px solid #c8a84b" : "1.5px solid #5a4418",
        borderRadius: "10px",
        px: "36px",
        py: "14px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "30px",
        fontWeight: variant === "primary" ? "bold" : "normal",
        color: variant === "primary" ? "#1a0e06" : "#c8a84b",
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
