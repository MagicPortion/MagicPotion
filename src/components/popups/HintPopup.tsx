import { css } from "#styled-system/css";
import { IconHint, IconClose, IconDiamond } from "../ui/icons";

const DEFAULT_HINTS = [
  "画面のどこかをクリックするとセリフが進む",
  "調合では Base 素材と Accent 素材を1つずつ選ぶ",
  "同じレシピを繰り返し選ぶとレシピレベルが上がる",
  "レシピレベルが上がるとポーションの売値が高くなる",
  "毎朝、昨日陳列したポーションがすべて売れる",
  "10G 払うとレシピ習得画面のラインナップを引き直せる",
];

interface HintPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HintPopup({ isOpen, onClose }: HintPopupProps) {
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
        <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "28px" })}>
          <h2 className={css({ display: "flex", alignItems: "center", gap: "12px", fontSize: "30px", color: "parchment.accent", m: 0, letterSpacing: "0.12em" })}>
            <IconHint size={28} /> ヒント
          </h2>
          <button data-sound="cancel" onClick={onClose} className={css({ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "parchment.textMuted", lineHeight: 1 })}>
            <IconClose size={32} />
          </button>
        </div>

        <ul className={css({ margin: 0, padding: "0 0 0 4px", listStyle: "none", display: "flex", flexDirection: "column", gap: "18px" })}>
          {DEFAULT_HINTS.map((hint, i) => (
            <li key={i} className={css({ display: "flex", gap: "14px", fontSize: "26px", color: "parchment.text", lineHeight: 1.6, letterSpacing: "0.03em" })}>
              <span className={css({ color: "parchment.textMuted", flexShrink: 0, mt: "8px" })}>
                <IconDiamond size={16} />
              </span>
              {hint}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
