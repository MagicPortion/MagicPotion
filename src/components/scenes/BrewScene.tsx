import { useMemo, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { MATERIALS, getPotion, colorNum } from "../../data/gameData";
import DialogueBox, { ActionButton } from "../ui/dialogue/DialogueBox";
import BrewPanel, { type BrewResult } from "../ui/brew/BrewPanel";
import MaterialPickerPopup from "../ui/brew/MaterialPickerPopup";
import BrewResultPopup from "../ui/brew/BrewResultPopup";
import PotionShelf from "../ui/brew/PotionShelf";

export default function BrewScene() {
  const { materials, brew, advanceScene } = useGameStore();
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedAccent, setSelectedAccent] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState<"base" | "accent" | null>(null);
  const [cauldronColorHex, setCauldronColorHex] = useState("3d3d5c");
  const [brewCount, setBrewCount] = useState(1);
  const [brewResults, setBrewResults] = useState<BrewResult[] | null>(null);
  const { width, height } = useWindowSize();

  const allBases   = MATERIALS.filter((m) => m.category === "base");
  const allAccents = MATERIALS.filter((m) => m.category === "accent");

  const maxBrew = selectedBase && selectedAccent
    ? Math.min(materials[selectedBase] ?? 0, materials[selectedAccent] ?? 0)
    : 0;

  const handleSelectBase = (id: string) => {
    setSelectedBase(id);
    setBrewCount(1);
  };

  const handleSelectAccent = (id: string) => {
    setSelectedAccent(id);
    setBrewCount(1);
  };

  const handleBrew = () => {
    if (!selectedBase || !selectedAccent) return;
    const results: BrewResult[] = [];
    let lastColorHex = "808080";
    for (let i = 0; i < brewCount; i++) {
      const brewed = brew(selectedBase, selectedAccent);
      if (!brewed) break;
      const potionDef = getPotion(brewed.potionId);
      if (potionDef) {
        lastColorHex = potionDef.colorHex;
        results.push({ name: potionDef.name, colorHex: potionDef.colorHex, level: brewed.level, sellPrice: brewed.sellPrice });
      }
    }
    if (results.length > 0) {
      setCauldronColorHex(lastColorHex);
      setBrewResults(results);
      setSelectedBase(null);
      setSelectedAccent(null);
      setBrewCount(1);
    }
  };

  const handleClosePopup = () => {
    setBrewResults(null);
  };

  const handleSelectRecipe = (baseId: string, accentId: string) => {
    setSelectedBase(baseId);
    setSelectedAccent(accentId);
    setBrewCount(1);
  };

  const commands = useMemo<DrawCommand[]>(() => [
    { type: "rect",   x: 0,               y: 0,              width,      height,      color: 0x0a0816 },
    { type: "rect",   x: width / 2 - 190, y: height * 0.52,  width: 380, height: 290, color: 0x1c1c2e },
    { type: "rect",   x: width / 2 - 210, y: height * 0.52,  width: 420, height: 38,  color: 0x26263a },
    { type: "circle", x: width / 2,        y: height * 0.64,  radius: 148,             color: colorNum(cauldronColorHex) },
    { type: "rect",   x: width / 2 - 168,  y: height * 0.80,  width: 38,  height: 58,  color: 0x1c1c2e },
    { type: "rect",   x: width / 2 + 130,  y: height * 0.80,  width: 38,  height: 58,  color: 0x1c1c2e },
  ], [width, height, cauldronColorHex]);

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas commands={commands} backgroundColor={0x0a0816} />

      <PotionShelf />

      <BrewPanel
        selectedBase={selectedBase}
        selectedAccent={selectedAccent}
        onPickBase={() => setPickerOpen("base")}
        onPickAccent={() => setPickerOpen("accent")}
        result={null}
        onBrew={handleBrew}
        brewCount={brewCount}
        maxBrew={maxBrew}
        onBrewCountChange={setBrewCount}
      />

      {pickerOpen === "base" && (
        <MaterialPickerPopup
          title="ベース材料"
          items={allBases}
          counts={materials}
          selectedId={selectedBase}
          onSelect={handleSelectBase}
          onClose={() => setPickerOpen(null)}
        />
      )}
      {pickerOpen === "accent" && (
        <MaterialPickerPopup
          title="アクセント材料"
          items={allAccents}
          counts={materials}
          selectedId={selectedAccent}
          onSelect={handleSelectAccent}
          onClose={() => setPickerOpen(null)}
        />
      )}

      {brewResults !== null && (
        <BrewResultPopup results={brewResults} onClose={handleClosePopup} />
      )}

      <DialogueBox
        onRecipeSelect={handleSelectRecipe}
        actions={
          <ActionButton variant="secondary" onClick={advanceScene}>
            陳列へ →
          </ActionButton>
        }
      />
    </div>
  );
}
