import { useMemo, useState } from "react";
import { css } from "../../../styled-system/css";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { getPotion, SHOP_SLOTS_BY_LEVEL } from "../../data/gameData";
import type { BrewedPotion } from "../../data/types";
import DialogueBox, { ActionButton } from "../ui/dialogue/DialogueBox";

export default function DisplayScene() {
  const { brewedPotions, shopLevel, confirmDisplay, advanceScene, setScene } = useGameStore();
  const { width, height } = useWindowSize();
  const slots = SHOP_SLOTS_BY_LEVEL[shopLevel] ?? 3;
  const [selected, setSelected] = useState<BrewedPotion[]>([]);

  const toggleSelect = (potion: BrewedPotion) => {
    if (selected.some((p) => p.instanceId === potion.instanceId)) {
      setSelected(selected.filter((p) => p.instanceId !== potion.instanceId));
    } else if (selected.length < slots) {
      setSelected([...selected, potion]);
    }
  };

  const handleConfirm = () => {
    confirmDisplay(selected);
    advanceScene();
  };

  const commands = useMemo<DrawCommand[]>(() => [
    { type: "rect", x: 0, y: 0, width, height, color: 0x16213e },
  ], [width, height]);

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas commands={commands} backgroundColor={0x0d0d20} />

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
          bg: "pastel.cream",
          borderRadius: "20px",
          p: "28px 32px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
          border: "2px solid",
          borderColor: "pastel.peach",
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
                  onClick={() => toggleSelect(potion)}
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
                  {isSelected && <span style={{ fontSize: 18 }}>✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <DialogueBox
        actions={
          <>
            <ActionButton variant="secondary" onClick={() => setScene("brew")}>
              ← 調合に戻る
            </ActionButton>
            <ActionButton onClick={handleConfirm}>
              {selected.length === 0 ? "何も置かずに翌朝へ →" : `${selected.length}本を陳列して翌朝へ →`}
            </ActionButton>
          </>
        }
      />
    </div>
  );
}
