import { css } from "#styled-system/css";
import type { DialogueAppearance, DialogueTheme } from "../../store/useGameStore";
import { IconSettings, IconClose } from "../ui/icons";

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  appearance: DialogueAppearance;
  onChange: (next: DialogueAppearance) => void;
}

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
        data-sound="cancel"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className={css({ position: "absolute", inset: 0, bg: "parchment.overlay", zIndex: 300 })}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={css({
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          zIndex: 301, width: "900px",
          bg: "parchment.bg", border: "2px solid", borderColor: "parchment.border",
          borderRadius: "12px", padding: "44px 48px", boxShadow: "0 20px 96px rgba(0,0,0,0.78)",
        })}
      >
        <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "36px" })}>
          <h2 className={css({ display: "flex", alignItems: "center", gap: "12px", fontSize: "30px", color: "parchment.accent", m: 0, letterSpacing: "0.12em" })}>
            <IconSettings size={28} /> 会話ボックス設定
          </h2>
          <button data-sound="cancel" onClick={onClose} className={css({ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "parchment.textMuted", lineHeight: 1 })}>
            <IconClose size={32} />
          </button>
        </div>

        <section>
          <p className={css({ fontSize: "24px", color: "parchment.textMuted", letterSpacing: "0.15em", margin: "0 0 16px" })}>
            ─ 背景テーマ
          </p>
          <div className={css({ display: "flex", gap: "12px" })}>
            {THEME_OPTIONS.map(({ key, label, bg, textColor }) => {
              const active = appearance.theme === key;
              return (
                <button
                  key={key}
                  onClick={() => onChange({ ...appearance, theme: key })}
                  className={css({
                    flex: 1, padding: "24px 12px",
                    borderRadius: "8px", cursor: "pointer",
                    fontSize: "26px",
                    fontWeight: active ? "bold" : "normal",
                    letterSpacing: "0.08em", transition: "border-color 0.15s",
                  })}
                  style={{
                    // テーマごとの見本色（羊皮紙/石の闇/半透明）はユーザー選択肢そのものを表す色で、
                    // 共通トークンではなく可変値のため style で直接指定する
                    background: bg,
                    border: `2px solid ${active ? "#c8a84b" : "#4a3810"}`,
                    color: textColor,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <p className={css({ fontSize: "24px", color: "parchment.borderMuted", letterSpacing: "0.08em", margin: "28px 0 0", textAlign: "center" })}>
          ─ 変更は即時反映されます ─
        </p>
      </div>
    </>
  );
}
