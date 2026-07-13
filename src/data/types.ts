export type MaterialCategory = "base" | "accent";

export interface MaterialDef {
  id: string;
  name: string;
  category: MaterialCategory;
  colorHex: string;
  price: number;
  spawnWeight: number;
}

export interface RecipeDef {
  id: string;
  baseId: string;
  accentId: string;
  potionId: string;
}

export interface PotionDef {
  id: string;
  name: string;
  colorHex: string;
  basePrice: number;
}

export interface BrewedPotion {
  instanceId: string;
  potionId: string;
  recipeId: string;
  level: number;
  sellPrice: number;
  isNew: boolean; // ポーション初回（未発見のポーション）
  isNewRecipe: boolean; // レシピ初回（未習得のレシピ）
  isFailed: boolean; // 失敗（微妙なポーション）
}

export interface SaleRecord {
  name: string;
  price: number;
}
