import type { ReactNode } from "react";
import { useGameStore } from "../../../store/useGameStore";
import { THEMES } from "./dialogueThemes";
import { IconSettings, IconHint, IconRecipe, IconInventory } from "../icons";
import { css } from "@styled-system/css";

interface SceneToolbarProps {
  onSettings: () => void;
  onHint: () => void;
  onInventory?: () => void;
  onRecipe: () => void;
  actions?: ReactNode;
}

export default function SceneToolbar({ onSettings, onHint, onInventory, onRecipe, actions }: SceneToolbarProps) {
  const { dialogueAppearance } = useGameStore();
  const t = THEMES[dialogueAppearance.theme];
  const toolbarFont = 24;
  const handleInventory = onInventory ?? (() => {});

  return (
    <div
      className={css({
        position: "absolute",
        bottom: "20px",
        left: 0,
        right: 0,
        zIndex: 50,
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: "12px",
        bg: "none",
        userSelect: "none",
      })}
    >
      <div className={css({ position: "absolute", left: "12px", display: "flex", alignItems: "center", gap: "12px" })}>
        <ToolBtn icon={<IconSettings size={20} />} label="設定" onClick={onSettings} fontSize={toolbarFont} t={t} />
        <ToolBtn icon={<IconHint size={20} />} label="ヒント" onClick={onHint} fontSize={toolbarFont} t={t} />
      </div>

      <div className={css({ display: "flex", alignItems: "center", gap: "12px" })}>
        <ToolBtn
          icon={<IconRecipe size={34} />}
          label="レシピ"
          onClick={onRecipe}
          fontSize={toolbarFont}
          sizeScale={1.2}
          t={t}
        />
        <ToolBtn
          icon={<IconInventory size={34} />}
          label="持ち物"
          onClick={handleInventory}
          fontSize={toolbarFont}
          sizeScale={1.2}
          t={t}
        />
      </div>

      {actions && (
        <div className={css({ position: "absolute", right: "12px", display: "flex", gap: "8px", alignItems: "center" })}>
          {actions}
        </div>
      )}
    </div>
  );
}

function ToolBtn({
  icon, label, onClick, fontSize, sizeScale = 1, t,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  fontSize?: number;
  sizeScale?: number;
  t: { btnBg: string; btnBorder: string; btnText: string };
}) {
  const resolvedFontSize = Math.round((fontSize ?? 16) * sizeScale);
  const resolvedPaddingX = Math.round(84 * sizeScale);
  const resolvedPaddingY = Math.round(12 * sizeScale);
  const resolvedGap = Math.round(12 * sizeScale);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={css({
        display: "flex",
        alignItems: "center",
        borderRadius: "6px",
        cursor: "pointer",
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
      })}
      style={{
        background: t.btnBg,
        border: `1px solid ${t.btnBorder}`,
        color: t.btnText,
        fontSize: `${resolvedFontSize}px`,
        padding: `${resolvedPaddingY}px ${resolvedPaddingX}px`,
        gap: `${resolvedGap}px`,
      }}
    >
      {icon}
      {label}
    </button>
  );
}
