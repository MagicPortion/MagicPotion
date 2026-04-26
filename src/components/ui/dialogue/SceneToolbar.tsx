import type { ReactNode } from "react";
import { useGameStore } from "../../../store/useGameStore";
import { THEMES, TOOLBAR_H } from "./dialogueThemes";
import { IconSettings, IconHint, IconRecipe } from "../icons";

interface SceneToolbarProps {
  onSettings: () => void;
  onHint: () => void;
  onRecipe: () => void;
  actions?: ReactNode;
}

export default function SceneToolbar({ onSettings, onHint, onRecipe, actions }: SceneToolbarProps) {
  const { dialogueAppearance } = useGameStore();
  const t = THEMES[dialogueAppearance.theme];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: TOOLBAR_H,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        background: "none",
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <ToolBtn icon={<IconSettings size={14} />} label="設定"  onClick={onSettings} t={t} />
        <ToolBtn icon={<IconHint    size={14} />} label="ヒント" onClick={onHint}     t={t} />
        <ToolBtn icon={<IconRecipe  size={14} />} label="レシピ" onClick={onRecipe}   t={t} />
      </div>

      {actions && (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {actions}
        </div>
      )}
    </div>
  );
}

function ToolBtn({
  icon, label, onClick, t,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  t: { btnBg: string; btnBorder: string; btnText: string };
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        background: t.btnBg,
        border: `1px solid ${t.btnBorder}`,
        borderRadius: 6,
        padding: "8px 18px",
        cursor: "pointer",
        fontSize: 14,
        color: t.btnText,
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
