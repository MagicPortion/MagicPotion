const DEFAULT_HINTS = [
  "画面のどこかをクリックするとセリフが進む",
  "調合ではベース材料とアクセント材料を1つずつ選ぶ",
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
          width: "min(440px, 90vw)",
          background: "rgba(12,8,3,0.97)",
          border: "2px solid #8B6914",
          borderRadius: 6,
          padding: "28px 32px",
          boxShadow: "0 12px 48px rgba(0,0,0,0.7)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, color: "#c8a84b", margin: 0, letterSpacing: "0.12em" }}>
            ❓ ヒント
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#8B6914", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <ul style={{ margin: 0, padding: "0 0 0 4px", listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {DEFAULT_HINTS.map((hint, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 10,
                fontSize: 14,
                color: "#e8d8b8",
                lineHeight: 1.7,
                letterSpacing: "0.03em",
              }}
            >
              <span style={{ color: "#8B6914", flexShrink: 0, marginTop: 2 }}>❖</span>
              {hint}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
