import { useMemo, useRef, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import DialogueBox, { type DialogueBoxHandle } from "../ui/dialogue/DialogueBox";
import Character from "../ui/character/Character";
import { firstDayMorningDialogue,firstDayMoveDialogue,firstDayBrewDialogue,morningDialogues,moveDialogues,brewDialogues,endingDialogues} from "../../data/conversations";
import witchEndImage from "#assets/characters/witch-end.png";
import witchCoatImage from "#assets/characters/witch-coat.png";
import type { Scene } from "../../store/useGameStore";
import witchBackground from "#assets/Back/WitchBack.png";

interface ConversationSceneProps {
  sceneOverride?: Scene;
}

// ランダムな会話セットの抽選（Math.randomを含むため、呼び出し側はeffect/イベント内から呼ぶこと）
function pickDialogues(scene: Scene, day: number): string[] {
  if (scene === "conversation_move") {
    if (day === 1) return [...firstDayMoveDialogue];
    return [...moveDialogues[Math.floor(Math.random() * moveDialogues.length)]];
  }
  if (scene === "conversation_brew") {
    if (day === 1) return [...firstDayBrewDialogue];
    return [...brewDialogues[Math.floor(Math.random() * brewDialogues.length)]];
  }
  if (scene === "conversation_end") {
    return [...endingDialogues];
  }
  if (day === 1) return [...firstDayMorningDialogue];
  return [...morningDialogues[Math.floor(Math.random() * morningDialogues.length)]];
}

export default function ConversationScene({ sceneOverride }: ConversationSceneProps) {
  const { day, advanceScene, scene: storeScene, setIsInventoryOpen } = useGameStore();
  const scene = sceneOverride ?? storeScene;
  const { width, height } = useWindowSize();

  // シーンは日ごと・遷移ごとに GameManager 側で key 付きで再マウントされるため、
  // 初回マウント時に一度だけ抽選すれば十分（useStateの遅延初期化）
  const [dialogues] = useState<string[]>(() => pickDialogues(scene, day));
  const [index, setIndex] = useState(0);

  const dialogueRef = useRef<DialogueBoxHandle>(null);

  const handleAdvance = () => {
    if (index < dialogues.length - 1) setIndex(index + 1);
    else advanceScene();
  };

  const commands = useMemo<DrawCommand[]>(() => {
    const list: DrawCommand[] = [
      { type: "image", x: 0, y: 0, width, height, imageSrc: witchBackground },
    ];
    // 調合前の会話（夜）は背景を暗く落とす
    if (scene === "conversation_brew") {
      list.push(
        { type: "rect", x: 0, y: 0, width, height, color: 0x05040c, alpha: 0.78 }
      );
    }
    return list;
  }, [width, height, scene]);

  return (
    <div
      onClick={() => dialogueRef.current?.click()}
      style={{ position: "relative", width, height, overflow: "hidden", cursor: "pointer" }}
    >
      <PixiCanvas commands={commands} />
      <Character
        character="witch"
        imageSrc={
          scene === "conversation_end"
            ? witchEndImage
            : scene === "conversation_brew"
            ? witchCoatImage
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
