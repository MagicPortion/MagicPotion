import { useState } from "react";
import { css } from "../../styled-system/css";
import { useGameStore } from "../store/useGameStore";
import { useWindowSize } from "../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "./PixiCanvas";
import { POTIONS } from "../data/gameData";

export default function SellScene() {
  const { potions, sellPotion, setScene } = useGameStore();
  const [message, setMessage] = useState("ポーションを販売しよう！");
  const { width, height } = useWindowSize();

  const ownedPotions = POTIONS.filter((p) => (potions[p.id] ?? 0) > 0);

  const handleSell = (potionId: string) => {
    const potion = POTIONS.find((p) => p.id === potionId);
    const success = sellPotion(potionId);
    if (success && potion) {
      setMessage(`${potion.name}を ${potion.sellPrice}G で販売しました！`);
    }
  };

  // 背景モック（後でポーション販売画面の画像に差し替え）
  const commands: DrawCommand[] = [
    { type: "rect", x: 0, y: 0, width, height, color: 0x16213e },
  ];

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas
        width={width}
        height={height}
        commands={commands}
        backgroundColor={0x0d0d20}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {/* 販売パネル（中央） */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          width: "min(480px, 88vw)",
          maxHeight: "60vh",
          overflowY: "auto",
        }}
        className={css({
          bg: "pastel.cream",
          borderRadius: "18px",
          p: "24px 28px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
          border: "2px solid",
          borderColor: "pastel.peach",
        })}
      >
        <p style={{ fontSize: 14, color: "#6b5b73", margin: "0 0 14px", textAlign: "center" }}>{message}</p>

        {ownedPotions.length === 0 ? (
          <p style={{ textAlign: "center", color: "#aaa", fontSize: 14 }}>販売できるポーションがありません。</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ownedPotions.map((potion) => (
              <div
                key={potion.id}
                className={css({ display: "flex", alignItems: "center", justifyContent: "space-between", bg: "white", borderRadius: "10px", p: "10px 14px" })}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ display: "inline-block", width: 22, height: 22, borderRadius: "50%", backgroundColor: `#${potion.color.toString(16).padStart(6, "0")}` }} />
                  <span style={{ fontSize: 14, color: "#4a3f55" }}>{potion.name} ×{potions[potion.id]}</span>
                  <span style={{ fontSize: 12, color: "#aaa" }}>{potion.sellPrice}G</span>
                </div>
                <button
                  onClick={() => handleSell(potion.id)}
                  className={css({ bg: "pastel.mint", border: "none", borderRadius: "8px", p: "6px 16px", cursor: "pointer", fontSize: "13px", fontWeight: "bold", color: "#4a3f55", _hover: { bg: "pastel.sage" } })}
                >
                  販売
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setScene("brew")}
          className={css({ mt: "18px", display: "block", mx: "auto", bg: "pastel.lavender", border: "none", borderRadius: "10px", p: "10px 28px", cursor: "pointer", fontSize: "13px", color: "#4a3f55", _hover: { bg: "pastel.lilac" } })}
        >
          ← 調合画面に戻る
        </button>
      </div>
    </div>
  );
}
