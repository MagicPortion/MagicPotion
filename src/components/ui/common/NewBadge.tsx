import { css } from "#styled-system/css";

interface NewBadgeProps {
  /** true のとき newBadgePop アニメーションを適用 */
  animated?: boolean;
}

export default function NewBadge({ animated = true }: NewBadgeProps) {
  return (
    <span
      className={css({
        bg: "rgba(255,80,150,1)",
        color: "white",
        fontWeight: "900",
        borderRadius: "8px",
        px: "14px",
        py: "2px",
        letterSpacing: "0.1em",
        fontSize: "30px",
        lineHeight: 1.4,
      })}
      // newBadgePop: バッジ出現アニメーションのためinline style
      style={animated ? { animation: "newBadgePop 0.5s cubic-bezier(0.22,1,0.36,1) 0.25s both" } : undefined}
    >
      NEW
    </span>
  );
}
