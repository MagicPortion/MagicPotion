import { useMemo, useRef, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import DialogueBox, { type DialogueBoxHandle } from "../ui/dialogue/DialogueBox";
import Character from "../ui/character/Character";
import { firstDayMorningDialogue,firstDayMoveDialogue,firstDayBrewDialogue,morningDialogues,moveDialogues,brewDialogues,endingDialogues} from "../../data/conversations";

export default function ConversationScene() {
  const { day, lastSaleResult, advanceScene, scene, setIsInventoryOpen } = useGameStore();
  const { width, height } = useWindowSize();

  const dialogues = useMemo(() => {
    //魔女-昼お店移動の会話
    if (scene === "conversation_move") {
      // 初日
      if (day === 1) {
        return firstDayMoveDialogue;
      }
      // 2日目以降
      const randomSet =
        moveDialogues[
          Math.floor(Math.random() * moveDialogues.length)
        ];
      return [...randomSet];
    }
    //魔女-夜ポーション調合の会話
    if (scene === "conversation_brew") {
      // 初日
      if (day === 1) {
        return firstDayBrewDialogue;
      }
      // 2日目以降
      const randomSet =
        brewDialogues[
          Math.floor(Math.random() * brewDialogues.length)
        ];
      return [...randomSet];
    }

    if (scene === "conversation_end") {
      return endingDialogues;
    }

    //魔女-朝レシピ選択の会話
    // 初日
    if (day === 1) {
      return firstDayMorningDialogue;
    }
    // 2日目以降
    const randomSet =
      morningDialogues[
        Math.floor(Math.random() * morningDialogues.length)
      ];
    return [...randomSet];
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
