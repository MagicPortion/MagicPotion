import { css } from "../../../../styled-system/css";
import { getPotion } from "../../../data/gameData";
import type { BrewedPotion } from "../../../data/types";

interface PotionSelectPanelProps {
  brewedPotions: BrewedPotion[];
  slots: number;
  shopLevel: number;
  selected: BrewedPotion[];
  onToggle: (potion: BrewedPotion) => void;
}

export default function PotionSelectPanel({ brewedPotions, slots, shopLevel, selected, onToggle }: PotionSelectPanelProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        width: "min(520px, 90vw)",
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
      }}
      className={css({
        bg: "pastel.cream", borderRadius: "20px", p: "28px 32px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
        border: "2px solid", borderColor: "pastel.peach",
      })}
    >
      <h2 style={{ fontSize: 17, fontWeight: "bold", color: "#6b5b73", margin: "0 0 6px" }}>
        お店に並べるポーションを選ぼう
      </h2>
      <p style={{ fontSize: 13, color: "#9b8aaa", margin: "0 0 16px" }}>
        {selected.length} / {slots} スロット選択中（店Lv.{shopLevel}）
      </p>

      {brewedPotions.length === 0 ? (
        <p style={{ textAlign: "center", color: "#aaa", fontSize: 14, padding: "16px 0" }}>
          在庫がありません。調合画面に戻って薬を作りましょう！
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {brewedPotions.map((potion) => {
            const def = getPotion(potion.potionId);
            const isSelected = selected.some((p) => p.instanceId === potion.instanceId);
            const isFull = selected.length >= slots && !isSelected;
            return (
              <button
                key={potion.instanceId}
                onClick={() => onToggle(potion)}
                disabled={isFull}
                className={css({
                  display: "flex", alignItems: "center", gap: "10px",
                  bg: isSelected ? "pastel.mint" : "white",
                  border: "2px solid",
                  borderColor: isSelected ? "pastel.sage" : "pastel.lavender",
                  borderRadius: "12px", p: "11px 14px",
                  cursor: isFull ? "not-allowed" : "pointer",
                  textAlign: "left", transition: "all 0.15s",
                  _hover: { bg: isFull ? "white" : (isSelected ? "pastel.sage" : "pastel.sky") },
                  _disabled: { opacity: "0.5" },
                })}
              >
                <span style={{ display: "inline-block", width: 22, height: 22, borderRadius: "50%", backgroundColor: def ? `#${def.colorHex}` : "#aaa", flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: "#4a3f55", flex: 1 }}>{def?.name ?? "謎の薬"}</span>
                <span style={{ fontSize: 12, color: "#8b7f99" }}>Lv.{potion.level}</span>
                <span style={{ fontSize: 14, fontWeight: "bold", color: "#6b5b73" }}>{potion.sellPrice}G</span>
                {isSelected && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a3f55" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
