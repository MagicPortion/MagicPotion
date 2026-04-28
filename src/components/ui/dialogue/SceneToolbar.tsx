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
        bottom: 2,
        left: 0,
        right: 0,
        zIndex: 50,
        height: TOOLBAR_H,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 12px",
        background: "none",
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", gap: 40 }}>
        <ToolBtn icon={<IconSettings size={20} />} label="設定"  onClick={onSettings} t={t} />
        <ToolBtn icon={<IconHint    size={20} />} label="ヒント" onClick={onHint}     t={t} />
        <ToolBtn icon={<IconRecipe  size={20} />} label="レシピ" onClick={onRecipe}   t={t} />
      </div>

      {actions && (
        <div style={{ position: "absolute", right: 12, display: "flex", gap: 8, alignItems: "center" }}>
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
        gap: 20,
        background: t.btnBg,
        border: `1px solid ${t.btnBorder}`,
        borderRadius: 6,
        padding: "12px 84px",
        cursor: "pointer",
        fontSize: 16,
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
