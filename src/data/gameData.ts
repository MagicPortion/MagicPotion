import type { MaterialDef, MaterialDefWithUrl, RecipeDef, PotionDef } from "./types";
import materialsJson from "./materials.json";
import recipesJson from "./recipes.json";
import potionsJson from "./potions.json";

// Vite がビルド時に全画像を解決して URL マップを作る
// 相対パスで確実に解決
// import: "default" なら Record<string, string> が返る (mod が直接URL文字列)
const itemImageModules = import.meta.glob<string>("../assets/items/*.png", {
  eager: true,
  import: "default",
});
// JSON の imagePath (例: "items/SlimeGel.png") と一致させるため、
// glob のキーから `../assets/` を除いた `items/xxx.png` をキーにする
const itemImageMap: Record<string, string> = {};
for (const [path, url] of Object.entries(itemImageModules)) {
  // path: "../assets/items/SlimeGel.png" -> "items/SlimeGel.png"
  const key = path.replace("../assets/", "");
  itemImageMap[key] = url;
}

// ポーション画像も、存在する素材だけをビルド時に URL として解決する。
// 画像がまだ用意されていないポーションは、呼び出し側で従来の色演出にフォールバックできる。
const potionImageModules = import.meta.glob<string>("../assets/potions/*.png", {
  eager: true,
  import: "default",
});
const potionImageMap: Record<string, string> = {};
for (const [path, url] of Object.entries(potionImageModules)) {
  potionImageMap[path.replace("../assets/potions/", "")] = url;
}

export type { MaterialDef, MaterialDefWithUrl, RecipeDef, PotionDef };

const rawMaterials = materialsJson as MaterialDef[];
export const MATERIALS: MaterialDefWithUrl[] = rawMaterials.map((m) => ({
  ...m,
  imageUrl: itemImageMap[m.imagePath] ?? m.imagePath,
}));
export const RECIPES: RecipeDef[] = recipesJson as RecipeDef[];
export const POTIONS: PotionDef[] = potionsJson as PotionDef[];

export const SHOP_SLOTS_BY_LEVEL: Record<number, number> = { 1: 3, 2: 5, 3: 7 };

export function colorNum(hex: string): number {
  return parseInt(hex, 16);
}

export function getMaterial(id: string): MaterialDefWithUrl | undefined {
  return MATERIALS.find((m) => m.id === id);
}

export function getRecipe(id: string): RecipeDef | undefined {
  return RECIPES.find((r) => r.id === id);
}

export function getPotion(id: string): PotionDef | undefined {
  return POTIONS.find((p) => p.id === id);
}

export function getPotionImageUrl(image?: string): string | undefined {
  return image ? potionImageMap[image] : undefined;
}

export function findRecipeByIngredients(baseId: string, accentId: string): RecipeDef | undefined {
  return RECIPES.find((r) => r.baseId === baseId && r.accentId === accentId);
}

export function weightedChoice<T extends { spawnWeight: number }>(items: T[]): T | undefined {
  if (items.length === 0) return undefined;

  const totalWeight = items.reduce((sum, item) => sum + item.spawnWeight, 0);
  const target = Math.random() * totalWeight;
  let cumulative = 0;

  for (const item of items) {
    cumulative += item.spawnWeight;
    if (target < cumulative) return item;
  }

  return items[items.length - 1];
}

export function sampleWeightedChoices<T extends { spawnWeight: number }>(items: T[], count: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    const choice = weightedChoice(items);
    if (choice) result.push(choice);
  }
  return result;
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
