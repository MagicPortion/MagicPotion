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
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300 }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          zIndex: 301, width: "900px",
          background: "rgba(12,8,3,0.97)", border: "2px solid #8B6914",
          borderRadius: 12, padding: "44px 48px", boxShadow: "0 20px 96px rgba(0,0,0,0.78)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 30, color: "#c8a84b", margin: 0, letterSpacing: "0.12em" }}>
            <IconHint size={28} /> ヒント
          </h2>
          <button data-sound="cancel" onClick={onClose} style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "#8B6914", lineHeight: 1 }}>
            <IconClose size={32} />
          </button>
        </div>

        <ul style={{ margin: 0, padding: "0 0 0 4px", listStyle: "none", display: "flex", flexDirection: "column", gap: 18 }}>
          {DEFAULT_HINTS.map((hint, i) => (
            <li key={i} style={{ display: "flex", gap: 14, fontSize: 26, color: "#e8d8b8", lineHeight: 1.6, letterSpacing: "0.03em" }}>
              <span style={{ color: "#8B6914", flexShrink: 0, marginTop: 8 }}>
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
