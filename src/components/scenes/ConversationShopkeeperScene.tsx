import { useMemo, useRef, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import DialogueBox, { type DialogueBoxHandle } from "../ui/dialogue/DialogueBox";
import Character from "../ui/character/Character";
import shopBackground from "#assets/Back/ShopBack.png";
import {
  firstDayShopDialogue,
  shopDialogues,
  shopAfterPurchaseDialogue,
} from "../../data/conversations";

export default function ConversationShopkeeperScene() {
  const { day, advanceScene, setIsInventoryOpen, pendingPostPurchaseScene } = useGameStore();
  const { width, height } = useWindowSize();

// 暗転中に pendingPostPurchaseScene が解除されても、
// 「毎度あり。」から通常の店主会話へ切り替わらないよう入場時の状態を保持する。
const [isPostPurchase] = useState(() => pendingPostPurchaseScene !== null);

const dialogues = useMemo(() => {
  if (day === 1) {
    return isPostPurchase ? shopAfterPurchaseDialogue : firstDayShopDialogue;
  }

  if (isPostPurchase) {
    return [...shopAfterPurchaseDialogue];
  }

  const randomSet = shopDialogues[Math.floor(Math.random() * shopDialogues.length)];
  return [...randomSet];
}, [day, isPostPurchase]);

  const [index, setIndex] = useState(0);
  const dialogueRef = useRef<DialogueBoxHandle>(null);

  const handleAdvance = () => {
    if (index < dialogues.length - 1) setIndex(index + 1);
    else advanceScene();
  };

  const commands = useMemo<DrawCommand[]>(() => [
    { type: "image", x: 0, y: 0, width, height, imageSrc: shopBackground },
  ], [width, height]);

  return (
    <div
      onClick={() => dialogueRef.current?.click()}
      style={{ position: "relative", width, height, overflow: "hidden", cursor: "pointer" }}
    >
      <PixiCanvas commands={commands} />
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
