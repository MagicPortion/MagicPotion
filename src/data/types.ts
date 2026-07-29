export type MaterialCategory = "base" | "accent";

export interface MaterialDef {
  id: string;
  name: string;
  category: MaterialCategory;
  colorHex: string;
  imagePath: string;
  price: number;
  spawnWeight: number;
}

export interface MaterialDefWithUrl extends MaterialDef {
  imageUrl: string;
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

// ★ 指摘対応：ReceiptItem 型をここで一元化（他ファイルで import して使えます）
export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export const TOTAL_DAYS = 5;
// ★ 指摘対応：実際のクリア条件に合わせて 100,000 から 10,000G（1万G）に変更
export const GOAL_MONEY = 10000;

export const formatDayLabel = (day: number, totalDays: number = TOTAL_DAYS) => {
  if (day >= totalDays) {
    return `最終日 / ${totalDays}日`;
  }
  return `${day}日目 / ${totalDays}日`;
};