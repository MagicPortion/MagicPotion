import type { DialogueAppearance, DialogueFontSize, DialogueTheme } from "../../store/useGameStore";

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  appearance: DialogueAppearance;
  onChange: (next: DialogueAppearance) => void;
}

const FONT_OPTIONS: { key: DialogueFontSize; label: string; size: string }[] = [
  { key: "normal", label: "小", size: "18px" },
  { key: "large",  label: "中", size: "22px" },
  { key: "xl",     label: "大", size: "26px" },
];

const THEME_OPTIONS: { key: DialogueTheme; label: string; bg: string; textColor: string }[] = [
  { key: "dark",      label: "石の闇",  bg: "rgba(10,6,2,0.93)",      textColor: "#c8a84b" },
  { key: "parchment", label: "羊皮紙",  bg: "rgba(240,220,170,0.96)", textColor: "#2c1810" },
  { key: "semi",      label: "半透明",  bg: "rgba(10,6,2,0.60)",      textColor: "#c8a84b" },
];

export default function SettingsPopup({ isOpen, onClose, appearance, onChange }: SettingsPopupProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300 }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 301,
          width: "min(460px, 90vw)",
          background: "rgba(12,8,3,0.97)",
          border: "2px solid #8B6914",
          borderRadius: 6,
          padding: "28px 32px",
          boxShadow: "0 12px 48px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 16, color: "#c8a84b", margin: 0, letterSpacing: "0.12em" }}>
            ⚙ 会話ボックス設定
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#8B6914", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Font size */}
        <section style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, color: "#8B6914", letterSpacing: "0.15em", margin: "0 0 10px", textTransform: "uppercase" }}>
            ─ 文字サイズ
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {FONT_OPTIONS.map(({ key, label, size }) => {
              const active = appearance.fontSize === key;
              return (
                <button
                  key={key}
                  onClick={() => onChange({ ...appearance, fontSize: key })}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    background: active ? "#8B6914" : "rgba(30,20,8,0.8)",
                    border: `1px solid ${active ? "#c8a84b" : "#4a3810"}`,
                    borderRadius: 4,
                    cursor: "pointer",
                    color: active ? "#1a0e06" : "#c8a84b",
                    fontWeight: active ? "bold" : "normal",
                    fontSize: size,
                    letterSpacing: "0.08em",
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Theme */}
        <section>
          <p style={{ fontSize: 11, color: "#8B6914", letterSpacing: "0.15em", margin: "0 0 10px", textTransform: "uppercase" }}>
            ─ 背景テーマ
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {THEME_OPTIONS.map(({ key, label, bg, textColor }) => {
              const active = appearance.theme === key;
              return (
                <button
                  key={key}
                  onClick={() => onChange({ ...appearance, theme: key })}
                  style={{
                    flex: 1,
                    padding: "18px 8px",
                    background: bg,
                    border: `2px solid ${active ? "#c8a84b" : "#4a3810"}`,
                    borderRadius: 4,
                    cursor: "pointer",
                    color: textColor,
                    fontSize: 13,
                    fontWeight: active ? "bold" : "normal",
                    letterSpacing: "0.08em",
                    transition: "border-color 0.15s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Preview label */}
        <p style={{ fontSize: 11, color: "#4a3810", letterSpacing: "0.08em", margin: "20px 0 0", textAlign: "center" }}>
          ─ 変更は即時反映されます ─
        </p>
      </div>
    </>
  );
}
