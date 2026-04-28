import { useMemo, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { MATERIALS, getPotion, colorNum } from "../../data/gameData";
import DialogueBox, { ActionButton } from "../ui/dialogue/DialogueBox";
import BrewMessage from "../ui/brew/BrewMessage";
import MaterialPanel from "../ui/brew/MaterialPanel";

export default function BrewScene() {
  const { materials, brew, advanceScene } = useGameStore();
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedAccent, setSelectedAccent] = useState<string | null>(null);
  const [message, setMessage] = useState("材料を選んで調合しよう！");
  const [cauldronColorHex, setCauldronColorHex] = useState("5f9ea0");
  const { width, height } = useWindowSize();

  const ownedBases   = MATERIALS.filter((m) => m.category === "base"   && (materials[m.id] ?? 0) > 0);
  const ownedAccents = MATERIALS.filter((m) => m.category === "accent" && (materials[m.id] ?? 0) > 0);

  const handleBrew = () => {
    if (!selectedBase || !selectedAccent) { setMessage("材料を2つ選んでください！"); return; }
    const brewed = brew(selectedBase, selectedAccent);
    if (brewed) {
      const potionDef = getPotion(brewed.potionId);
      setCauldronColorHex(potionDef?.colorHex ?? "808080");
      setMessage(`✨ ${potionDef?.name ?? "謎の薬"}（Lv.${brewed.level} / ${brewed.sellPrice}G）が完成！`);
      setSelectedBase(null);
      setSelectedAccent(null);
    } else {
      setMessage("調合できません…材料が足りないか、組み合わせが違うみたい。");
    }
  };

  const handleSelectRecipe = (baseId: string, accentId: string) => {
    setSelectedBase(baseId);
    setSelectedAccent(accentId);
    setMessage("材料をセットしました！「調合する！」を押してください。");
  };

  const commands = useMemo<DrawCommand[]>(() => [
    { type: "rect", x: 0, y: 0, width, height, color: 0x1a1a2e },
    { type: "rect", x: width / 2 - 60, y: height * 0.4, width: 120, height: 100, color: colorNum(cauldronColorHex) },
    { type: "text", x: width / 2 - 22, y: height * 0.4 + 42, text: "大釜", fontSize: 14, textColor: "#fff" },
    { type: "rect", x: width / 2 - 220, y: height * 0.35, width: 80, height: 130, color: 0xffb6c1 },
    { type: "text", x: width / 2 - 210, y: height * 0.35 + 60, text: "魔女", fontSize: 14, textColor: "#888" },
  ], [width, height, cauldronColorHex]);

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas commands={commands} backgroundColor={0x0d0d1a} />
      <BrewMessage message={message} />
      <MaterialPanel
        title="ベース材料"
        items={ownedBases}
        counts={materials}
        selectedId={selectedBase}
        onSelect={setSelectedBase}
        side="left"
      />
      <MaterialPanel
        title="アクセント材料"
        items={ownedAccents}
        counts={materials}
        selectedId={selectedAccent}
        onSelect={setSelectedAccent}
        side="right"
      />
      <DialogueBox
        onRecipeSelect={handleSelectRecipe}
        actions={
          <>
            <ActionButton onClick={handleBrew} disabled={!selectedBase || !selectedAccent}>
              調合する！
            </ActionButton>
            <ActionButton variant="secondary" onClick={advanceScene}>
              陳列へ →
            </ActionButton>
          </>
        }
      />
    </div>
  );
}
