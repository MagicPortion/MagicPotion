import { useMemo, useRef, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import DialogueBox, { type DialogueBoxHandle } from "../ui/dialogue/DialogueBox";
import Character from "../ui/character/Character";

export default function ConversationScene() {
  const { day, lastSaleResult, advanceScene, scene, setIsInventoryOpen } = useGameStore();
  const { width, height } = useWindowSize();

  const dialogues = useMemo(() => {
    if (scene === "conversation_move") {
      return [
        "さあ、材料を仕入れに行こう！",
        "お店に向かうよ。準備はいい？",
      ];
    }
    if (scene === "conversation_brew") {
      return [
        "材料が揃ったね！",
        "さあ、ポーションを調合しよう！",
      ];
    }
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
  }, [day, lastSaleResult, scene]);

  const [index, setIndex] = useState(0);
  const dialogueRef = useRef<DialogueBoxHandle>(null);

  const handleAdvance = () => {
    if (index < dialogues.length - 1) setIndex(index + 1);
    else advanceScene();
  };

  const commands = useMemo<DrawCommand[]>(() => [
    { type: "rect", x: 0, y: 0, width, height, color: 0xfde8f0 },
  ], [width, height]);

  return (
    <div
      style={{ position: "relative", width, height, overflow: "hidden", cursor: "pointer" }} 
    >
      <PixiCanvas commands={commands} backgroundColor={0xfff0f5} />
      <Character
        character="witch"
        imageSrc={
          scene === "conversation_brew"
            ? "/MagicPotion/assets/witch-coat.png"
            : undefined
        }
      />
      <DialogueBox
        ref={dialogueRef}
        speakerName="魔女"
        text={dialogues[index]}
        onAdvance={handleAdvance}
        onInventory={() => setIsInventoryOpen(true)}
      />
    </div>
  );
}
