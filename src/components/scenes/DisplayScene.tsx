import { useMemo, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { SHOP_SLOTS_BY_LEVEL } from "../../data/gameData";
import type { BrewedPotion } from "../../data/types";
import DialogueBox, { ActionButton } from "../ui/dialogue/DialogueBox";
import PotionSelectPanel from "../ui/display/PotionSelectPanel";

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
      <PotionSelectPanel
        brewedPotions={brewedPotions}
        slots={slots}
        shopLevel={shopLevel}
        selected={selected}
        onToggle={toggleSelect}
      />
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
