import { useMemo, useState } from "react";
import { css } from "#styled-system/css";
import { useGameStore } from "../../store/useGameStore";
import { useWindowSize } from "../../hooks/useWindowSize";
import PixiCanvas, { type DrawCommand } from "../PixiCanvas";
import { RECIPES, getPotion, calcSellPrice } from "../../data/gameData";
import DialogueBox from "../ui/dialogue/DialogueBox";
import RecipeOptionCards from "../ui/recipe/RecipeOptionCards";
import { IconRefresh } from "../ui/icons";
import Character from "../ui/character/Character";

export default function RecipeLearningScene() {
  const { dailyRecipeOptions, recipeLevel, learnRecipe, reloadDailyOptions, money, advanceScene, setIsInventoryOpen } =
    useGameStore();
  const { width, height } = useWindowSize();
  

  const commands = useMemo<DrawCommand[]>(() => [
    { type: "rect", x: 0, y: 0, width, height, color: 0xfde8f0 },
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

  return (
    <div style={{ width, height }} className={css({ position: "relative", overflow: "hidden" })}>
      <PixiCanvas commands={commands} backgroundColor={0xfde8f0} />
      <Character character="witch" />
      <RecipeOptionCards options={options} onLearn={handleLearn} />
      <DialogueBox
        onInventory={() => setIsInventoryOpen(true)}
      />
    </div>
  );
}
