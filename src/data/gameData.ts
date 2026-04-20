export type MaterialCategory = "base" | "accent";

export interface MaterialDef {
  id: string;
  name: string;
  category: MaterialCategory;
  color: number;
  price: number;
}

export interface RecipeDef {
  baseId: string;
  accentId: string;
  potionId: string;
}

export interface PotionDef {
  id: string;
  name: string;
  color: number;
  sellPrice: number;
}

export const MATERIALS: MaterialDef[] = [
  { id: "water", name: "聖水", category: "base", color: 0x87ceeb, price: 50 },
  { id: "herb", name: "薬草", category: "base", color: 0x90ee90, price: 60 },
  { id: "mushroom", name: "キノコ", category: "base", color: 0xdeb887, price: 70 },
  { id: "slime", name: "スライム液", category: "base", color: 0x98fb98, price: 80 },
  { id: "fire_essence", name: "火のエッセンス", category: "accent", color: 0xff6347, price: 100 },
  { id: "moon_dust", name: "月の粉", category: "accent", color: 0xe6e6fa, price: 120 },
  { id: "fairy_wing", name: "妖精の羽", category: "accent", color: 0xffb6c1, price: 90 },
  { id: "crystal", name: "クリスタル", category: "accent", color: 0xb0e0e6, price: 110 },
];

export const POTIONS: PotionDef[] = [
  { id: "heal", name: "回復薬", color: 0xff69b4, sellPrice: 200 },
  { id: "mana", name: "マナ薬", color: 0x7b68ee, sellPrice: 220 },
  { id: "strength", name: "力の薬", color: 0xff4500, sellPrice: 250 },
  { id: "speed", name: "速さの薬", color: 0x00ced1, sellPrice: 230 },
  { id: "shield", name: "守りの薬", color: 0x4682b4, sellPrice: 240 },
  { id: "luck", name: "幸運の薬", color: 0xffd700, sellPrice: 260 },
  { id: "sleep", name: "睡眠薬", color: 0x9370db, sellPrice: 180 },
  { id: "antidote", name: "解毒薬", color: 0x3cb371, sellPrice: 190 },
  { id: "mystery", name: "謎の薬", color: 0x808080, sellPrice: 150 },
];

export const RECIPES: RecipeDef[] = [
  { baseId: "water", accentId: "fire_essence", potionId: "heal" },
  { baseId: "water", accentId: "moon_dust", potionId: "mana" },
  { baseId: "herb", accentId: "fire_essence", potionId: "strength" },
  { baseId: "herb", accentId: "fairy_wing", potionId: "speed" },
  { baseId: "mushroom", accentId: "crystal", potionId: "shield" },
  { baseId: "mushroom", accentId: "fairy_wing", potionId: "luck" },
  { baseId: "slime", accentId: "moon_dust", potionId: "sleep" },
  { baseId: "slime", accentId: "crystal", potionId: "antidote" },
  { baseId: "water", accentId: "fairy_wing", potionId: "mystery" },
  { baseId: "water", accentId: "crystal", potionId: "mystery" },
  { baseId: "herb", accentId: "moon_dust", potionId: "mystery" },
  { baseId: "herb", accentId: "crystal", potionId: "mystery" },
  { baseId: "mushroom", accentId: "fire_essence", potionId: "mystery" },
  { baseId: "mushroom", accentId: "moon_dust", potionId: "mystery" },
  { baseId: "slime", accentId: "fire_essence", potionId: "mystery" },
  { baseId: "slime", accentId: "fairy_wing", potionId: "mystery" },
];

export function findRecipe(baseId: string, accentId: string): RecipeDef | undefined {
  return RECIPES.find((r) => r.baseId === baseId && r.accentId === accentId);
}

export function getMaterial(id: string): MaterialDef | undefined {
  return MATERIALS.find((m) => m.id === id);
}

export function getPotion(id: string): PotionDef | undefined {
  return POTIONS.find((p) => p.id === id);
}
