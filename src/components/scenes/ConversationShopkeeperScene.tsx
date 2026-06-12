import { useMemo, useRef, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import DialogueBox, { type DialogueBoxHandle } from "../ui/dialogue/DialogueBox";
import Character from "../ui/character/Character";

export default function ConversationShopkeeperScene() {
  const { advanceScene, setIsInventoryOpen } = useGameStore();
  const { width, height } = useWindowSize();

  const dialogues = [
    "いらっしゃい。冷やかしなら帰ってくれよ",
    "いい材料が揃ってるよ。ゆっくり選んでくれ。",
  ];

  const [index, setIndex] = useState(0);
  const dialogueRef = useRef<DialogueBoxHandle>(null);

  const handleAdvance = () => {
    if (index < dialogues.length - 1) setIndex(index + 1);
    else advanceScene();
  };

  const commands = useMemo<DrawCommand[]>(() => [
    { type: "rect", x: 0, y: 0, width, height, color: 0xfff5e0 },
  ], [width, height]);

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas commands={commands} backgroundColor={0xfff5e0} />
      <Character character="shopkeeper" animate={true} />
      <DialogueBox
        ref={dialogueRef}
        speakerName="店主"
        text={dialogues[index]}
        onAdvance={handleAdvance}
        onInventory={() => setIsInventoryOpen(true)}
      />
    </div>
  );
}