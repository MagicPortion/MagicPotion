import { useState } from "react";
import { css } from "../../styled-system/css";
import { useGameStore } from "../store/useGameStore";
import { useWindowSize } from "../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "./PixiCanvas";
import { MATERIALS, getPotion } from "../data/gameData";

export default function BrewScene() {
  const { materials, brew, setScene, advancePhase } = useGameStore();
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedAccent, setSelectedAccent] = useState<string | null>(null);
  const [message, setMessage] = useState("材料を選んで調合しよう！");
  const [lastBrewedColor, setLastBrewedColor] = useState<number | null>(null);
  const { width, height } = useWindowSize();

  const ownedBases = MATERIALS.filter((m) => m.category === "base" && (materials[m.id] ?? 0) > 0);
  const ownedAccents = MATERIALS.filter((m) => m.category === "accent" && (materials[m.id] ?? 0) > 0);

  const handleBrew = () => {
    if (!selectedBase || !selectedAccent) { setMessage("材料を2つ選んでください！"); return; }
    const potionId = brew(selectedBase, selectedAccent);
    if (potionId) {
      const potion = getPotion(potionId);
      setLastBrewedColor(potion?.color ?? 0x808080);
      setMessage(`✨ ${potion?.name ?? "不思議な薬"}が完成！`);
      setSelectedBase(null);
      setSelectedAccent(null);
    } else {
      setMessage("調合に失敗した…材料が足りないみたい。");
    }
  };

  const cauldronColor = lastBrewedColor ?? 0x5f9ea0;

  const commands: DrawCommand[] = [
    // 背景モック（後で夜の調合部屋画像に差し替え）
    { type: "rect", x: 0, y: 0, width, height, color: 0x1a1a2e },
    // 大釜モック（後で大釜画像に差し替え）
    { type: "rect", x: width / 2 - 60, y: height * 0.4, width: 120, height: 100, color: cauldronColor },
    { type: "text", x: width / 2 - 22, y: height * 0.4 + 42, text: "大釜", fontSize: 14, textColor: "#fff" },
    // 魔女モック（後でキャラクター画像に差し替え）
    { type: "rect", x: width / 2 - 220, y: height * 0.35, width: 80, height: 130, color: 0xffb6c1 },
    { type: "text", x: width / 2 - 210, y: height * 0.35 + 60, text: "魔女", fontSize: 14, textColor: "#888" },
  ];

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas
        width={width}
        height={height}
        commands={commands}
        backgroundColor={0x0d0d1a}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {/* メッセージ（中央上） */}
      <div
        style={{ position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
        className={css({ bg: "pastel.lavender", px: "20px", py: "8px", borderRadius: "20px", boxShadow: "0 3px 12px rgba(0,0,0,0.25)", fontSize: "15px", color: "#4a3f55", whiteSpace: "nowrap" })}
      >
        {message}
      </div>

      {/* ベース材料パネル（左） */}
      <div
        style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", zIndex: 10, minWidth: 180 }}
        className={css({ bg: "pastel.peach", borderRadius: "14px", p: "14px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" })}
      >
        <p style={{ fontSize: 13, color: "#6b5b73", margin: "0 0 8px", fontWeight: "bold" }}>ベース材料</p>
        {ownedBases.length === 0
          ? <p style={{ fontSize: 12, color: "#aaa" }}>なし</p>
          : ownedBases.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedBase(m.id)}
              className={css({
                display: "block", width: "100%", mb: "4px", p: "7px 10px",
                borderRadius: "8px", border: "2px solid",
                borderColor: selectedBase === m.id ? "pastel.pink" : "transparent",
                bg: selectedBase === m.id ? "pastel.rose" : "white",
                cursor: "pointer", fontSize: "12px", color: "#4a3f55",
                _hover: { bg: "pastel.lemon" },
              })}
            >
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", backgroundColor: `#${m.color.toString(16).padStart(6, "0")}`, marginRight: 6, verticalAlign: "middle" }} />
              {m.name} ×{materials[m.id]}
            </button>
          ))}
      </div>

      {/* アクセント材料パネル（右） */}
      <div
        style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", zIndex: 10, minWidth: 180 }}
        className={css({ bg: "pastel.sky", borderRadius: "14px", p: "14px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" })}
      >
        <p style={{ fontSize: 13, color: "#6b5b73", margin: "0 0 8px", fontWeight: "bold" }}>アクセント材料</p>
        {ownedAccents.length === 0
          ? <p style={{ fontSize: 12, color: "#aaa" }}>なし</p>
          : ownedAccents.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedAccent(m.id)}
              className={css({
                display: "block", width: "100%", mb: "4px", p: "7px 10px",
                borderRadius: "8px", border: "2px solid",
                borderColor: selectedAccent === m.id ? "pastel.lilac" : "transparent",
                bg: selectedAccent === m.id ? "pastel.lavender" : "white",
                cursor: "pointer", fontSize: "12px", color: "#4a3f55",
                _hover: { bg: "pastel.lemon" },
              })}
            >
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", backgroundColor: `#${m.color.toString(16).padStart(6, "0")}`, marginRight: 6, verticalAlign: "middle" }} />
              {m.name} ×{materials[m.id]}
            </button>
          ))}
      </div>

      {/* アクションボタン（下部中央） */}
      <div
        style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", gap: 10 }}
      >
        <button
          onClick={handleBrew}
          disabled={!selectedBase || !selectedAccent}
          className={css({
            bg: "pastel.pink", border: "none", borderRadius: "14px", p: "12px 32px",
            cursor: "pointer", fontSize: "16px", fontWeight: "bold", color: "#4a3f55",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            _hover: { bg: "pastel.rose" },
            _disabled: { opacity: "0.45", cursor: "not-allowed" },
          })}
        >
          調合する！
        </button>
        <button onClick={() => setScene("sell")} className={css({ bg: "pastel.mint", border: "none", borderRadius: "10px", p: "10px 18px", cursor: "pointer", fontSize: "13px", color: "#4a3f55", boxShadow: "0 3px 10px rgba(0,0,0,0.15)", _hover: { bg: "pastel.sage" } })}>
          販売へ
        </button>
        <button onClick={() => setScene("recipe")} className={css({ bg: "pastel.lilac", border: "none", borderRadius: "10px", p: "10px 18px", cursor: "pointer", fontSize: "13px", color: "#4a3f55", boxShadow: "0 3px 10px rgba(0,0,0,0.15)", _hover: { bg: "pastel.lavender" } })}>
          レシピ帳
        </button>
        <button onClick={advancePhase} className={css({ bg: "pastel.lemon", border: "none", borderRadius: "10px", p: "10px 18px", cursor: "pointer", fontSize: "13px", color: "#4a3f55", boxShadow: "0 3px 10px rgba(0,0,0,0.15)", _hover: { bg: "pastel.peach" } })}>
          1日を終える →
        </button>
      </div>
    </div>
  );
}
