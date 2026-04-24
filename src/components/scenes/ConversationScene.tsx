import { useMemo, useState } from "react";
import { css } from "../../../styled-system/css";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";

export default function ConversationScene() {
  const { day, lastSaleResult, advanceScene } = useGameStore();
  const { width, height } = useWindowSize();

  const dialogues = useMemo(() => {
    if (day === 1) {
      return [
        "魔法のポーション屋へようこそ！",
        "今日からお店を開こう。まずはレシピを覚えてね。",
        "材料を仕入れて、ポーションを調合しよう♪",
      ];
    }
    const lines: string[] = [];
    if (lastSaleResult.length > 0) {
      const total = lastSaleResult.reduce((s, r) => s + r.price, 0);
      lines.push(`昨日は${lastSaleResult.length}本が売れて合計 ${total}G 稼いだよ！`);
      const best = [...lastSaleResult].sort((a, b) => b.price - a.price)[0];
      lines.push(`一番高かったのは「${best.name}」の ${best.price}G だったね。`);
    } else {
      lines.push("昨日はポーションが売れなかった…");
      lines.push("今日こそいい薬を作って売り上げを上げよう！");
    }
    lines.push("今日も頑張ろう！まずはレシピを選んでね。");
    return lines;
  }, [day, lastSaleResult]);

  const [index, setIndex] = useState(0);

  const handleClick = () => {
    if (index < dialogues.length - 1) {
      setIndex(index + 1);
    } else {
      advanceScene();
    }
  };

  const commands: DrawCommand[] = [
    // 背景モック（後で朝の部屋画像に差し替え）
    { type: "rect", x: 0, y: 0, width, height, color: 0xfde8f0 },
    // 魔女モック（後でキャラクター画像に差し替え）
    { type: "rect", x: width * 0.5 - 50, y: height * 0.2, width: 100, height: 160, color: 0xffb6c1 },
    { type: "text", x: width * 0.5 - 26, y: height * 0.2 + 68, text: "魔女", fontSize: 14, textColor: "#888" },
  ];

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas
        width={width}
        height={height}
        commands={commands}
        backgroundColor={0xfff0f5}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      <div
        onClick={handleClick}
        className={css({
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(720px, 90vw)",
          bg: "pastel.lavender",
          p: "24px 32px",
          borderRadius: "16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          border: "2px solid",
          borderColor: "pastel.lilac",
          transition: "background 0.2s",
          _hover: { bg: "pastel.rose" },
        })}
        style={{ zIndex: 10 }}
      >
        <p style={{ fontSize: 18, color: "#4a3f55", margin: 0 }}>
          {dialogues[index]}
        </p>
        <span style={{ fontSize: 13, color: "#8b7f99", whiteSpace: "nowrap" }}>
          {index < dialogues.length - 1 ? "▶ 次へ" : "▶ レシピ習得へ"}
        </span>
      </div>
    </div>
  );
}
