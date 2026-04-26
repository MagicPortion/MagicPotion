import type { MaterialDef, RecipeDef, PotionDef } from "./types";
import materialsJson from "./materials.json";
import recipesJson from "./recipes.json";
import potionsJson from "./potions.json";

export type { MaterialDef, RecipeDef, PotionDef };

export const MATERIALS: MaterialDef[] = materialsJson as MaterialDef[];
export const RECIPES: RecipeDef[] = recipesJson as RecipeDef[];
export const POTIONS: PotionDef[] = potionsJson as PotionDef[];

export const SHOP_SLOTS_BY_LEVEL: Record<number, number> = { 1: 3, 2: 5, 3: 7 };

export function colorNum(hex: string): number {
  return parseInt(hex, 16);
}

export function getMaterial(id: string): MaterialDef | undefined {
  return MATERIALS.find((m) => m.id === id);
}

export function getRecipe(id: string): RecipeDef | undefined {
  return RECIPES.find((r) => r.id === id);
}

export function getPotion(id: string): PotionDef | undefined {
  return POTIONS.find((p) => p.id === id);
}

export function findRecipeByIngredients(baseId: string, accentId: string): RecipeDef | undefined {
  return RECIPES.find((r) => r.baseId === baseId && r.accentId === accentId);
}

export function calcSellPrice(basePrice: number, level: number): number {
  return Math.floor(basePrice * (1 + 0.3 * (level - 1)));
}

export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
