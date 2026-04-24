import { useMemo, useRef, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import DialogueBox, { type DialogueBoxHandle } from "../ui/DialogueBox";

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
  const dialogueRef = useRef<DialogueBoxHandle>(null);

  const handleAdvance = () => {
    if (index < dialogues.length - 1) setIndex(index + 1);
    else advanceScene();
  };

  const commands = useMemo<DrawCommand[]>(() => [
    { type: "rect", x: 0, y: 0, width, height, color: 0xfde8f0 },
    { type: "rect", x: width * 0.5 - 50, y: height * 0.2, width: 100, height: 160, color: 0xffb6c1 },
    { type: "text", x: width * 0.5 - 26, y: height * 0.2 + 68, text: "魔女", fontSize: 14, textColor: "#888" },
  ], [width, height]);

  return (
    <div
      style={{ position: "relative", width, height, overflow: "hidden", cursor: "pointer" }}
      onClick={() => dialogueRef.current?.click()}
    >
      <PixiCanvas commands={commands} backgroundColor={0xfff0f5} />
      <DialogueBox
        ref={dialogueRef}
        speakerName="魔女"
        text={dialogues[index]}
        onAdvance={handleAdvance}
        advanceLabel={index < dialogues.length - 1 ? "▶ 次へ" : "▶ レシピ習得へ"}
      />
    </div>
  );
}
