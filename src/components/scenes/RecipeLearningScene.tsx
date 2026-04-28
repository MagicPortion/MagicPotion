import { useMemo, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { RECIPES, getPotion, calcSellPrice } from "../../data/gameData";
import DialogueBox, { ActionButton } from "../ui/dialogue/DialogueBox";
import RecipeOptionCards from "../ui/recipe/RecipeOptionCards";
import { IconRefresh } from "../ui/icons";

export default function RecipeLearningScene() {
  const { dailyRecipeOptions, recipeLevel, learnRecipe, reloadDailyOptions, money, advanceScene } =
    useGameStore();
  const { width, height } = useWindowSize();
  const [reloadMsg, setReloadMsg] = useState<string | null>(null);

  const commands = useMemo<DrawCommand[]>(() => [
    { type: "rect", x: 0, y: 0, width, height, color: 0xfde8f0 },
    { type: "rect", x: width * 0.5 - 50, y: height * 0.12, width: 100, height: 150, color: 0xffb6c1 },
    { type: "text", x: width * 0.5 - 26, y: height * 0.12 + 65, text: "魔女", fontSize: 14, textColor: "#888" },
  ], [width, height]);

  const options = dailyRecipeOptions.flatMap((id) => {
    const recipe = RECIPES.find((r) => r.id === id);
    if (!recipe) return [];
    const potion = getPotion(recipe.potionId);
    if (!potion) return [];
    const level = recipeLevel[id] ?? 0;
    const nextLevel = level + 1;
    return [{ id, potion, level, nextLevel, nextPrice: calcSellPrice(potion.basePrice, nextLevel) }];
  });

  const handleLearn = (recipeId: string) => {
    learnRecipe(recipeId);
    advanceScene();
  };

  const handleReload = () => {
    const ok = reloadDailyOptions();
    setReloadMsg(ok ? null : "お金が足りません…");
  };

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <PixiCanvas commands={commands} backgroundColor={0xfde8f0} />
      <RecipeOptionCards options={options} onLearn={handleLearn} />
      <DialogueBox
        actions={
          <>
            {reloadMsg && (
              <span style={{ fontSize: 13, color: "#e07070", marginRight: 4 }}>{reloadMsg}</span>
            )}
            <ActionButton
              variant="secondary"
              onClick={handleReload}
              disabled={money < 10}
            >
              <IconRefresh size={14} /> 10Gで引き直す
            </ActionButton>
            <ActionButton variant="secondary" onClick={advanceScene}>
              スキップ →
            </ActionButton>
          </>
        }
      />
    </div>
  );
}
