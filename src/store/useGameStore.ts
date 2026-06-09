import { create } from "zustand";
import {
  findRecipeByIngredients,
  getPotion,
  calcSellPrice,
  RECIPES,
  shuffleArray,
} from "../data/gameData";
import type { BrewedPotion, SaleRecord } from "../data/types";

export type DialogueTheme = "dark" | "parchment" | "semi";
export interface DialogueAppearance { theme: DialogueTheme; }
export const DEFAULT_APPEARANCE: DialogueAppearance = { theme: "dark" };

export type Scene =
  | "title"
  | "conversation"
  | "recipe_learning"
  | "conversation_move"
  | "conversation_shopkeeper"
  | "shop"
  | "conversation_brew"
  | "brew"
  | "display";

const SCENE_ORDER: Scene[] = [
  "conversation",
  "recipe_learning",
  "conversation_move",
  "conversation_shopkeeper",
  "shop",
  "conversation_brew",
  "brew",
  "display",
];

let instanceCounter = 0;

function pickDailyOptions(): string[] {
  const nonMystery = RECIPES.filter((r) => r.potionId !== "mystery");
  return shuffleArray(nonMystery.map((r) => r.id)).slice(0, 5);
}

export interface GameState {
  money: number;
  day: number;
  scene: Scene;
  shopLevel: number;
  materials: Record<string, number>;
  brewedPotions: BrewedPotion[];
  displayedPotions: BrewedPotion[];
  recipeLevel: Record<string, number>;
  dailyRecipeOptions: string[];
  lastSaleResult: SaleRecord[];
  knownPotionIds: string[];

  dialogueAppearance: DialogueAppearance;
  setDialogueAppearance: (a: DialogueAppearance) => void;

  setScene: (scene: Scene) => void;
  buyMaterial: (id: string, price: number) => boolean;
  brew: (baseId: string, accentId: string) => BrewedPotion | null;
  learnRecipe: (recipeId: string) => void;
  reloadDailyOptions: () => boolean;
  confirmDisplay: (potions: BrewedPotion[]) => void;
  advanceScene: () => void;
  sellAll: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  money: 1000,
  day: 1,
  scene: "title",
  shopLevel: 1,
  materials: {},
  brewedPotions: [],
  displayedPotions: [],
  recipeLevel: {},
  dailyRecipeOptions: pickDailyOptions(),
  lastSaleResult: [],
  knownPotionIds: [],
  dialogueAppearance: DEFAULT_APPEARANCE,
  setDialogueAppearance: (a) => set({ dialogueAppearance: a }),

  setScene: (scene) => set({ scene }),

  buyMaterial: (id, price) => {
    const s = get();
    if (s.money < price) return false;
    set({
      money: s.money - price,
      materials: { ...s.materials, [id]: (s.materials[id] ?? 0) + 1 },
    });
    return true;
  },

  brew: (baseId, accentId) => {
    const s = get();
    if ((s.materials[baseId] ?? 0) < 1 || (s.materials[accentId] ?? 0) < 1) return null;
    const recipe = findRecipeByIngredients(baseId, accentId);
    if (!recipe) return null;
    const potionDef = getPotion(recipe.potionId);
    if (!potionDef) return null;

    const currentLevel = s.recipeLevel[recipe.id] ?? 0;
    const level = currentLevel === 0 ? 1 : currentLevel;
    const updatedLevels =
      currentLevel === 0
        ? { ...s.recipeLevel, [recipe.id]: 1 }
        : s.recipeLevel;

    // isNew はポーション単位で判定（同じポーションの別レシピでもNEWにしない）
    const isNewPotion = !s.knownPotionIds.includes(recipe.potionId);

    const brewed: BrewedPotion = {
      instanceId: `p_${++instanceCounter}`,
      potionId: recipe.potionId,
      recipeId: recipe.id,
      level,
      sellPrice: calcSellPrice(potionDef.basePrice, level),
      isNew: isNewPotion,
    };

    set({
      materials: {
        ...s.materials,
        [baseId]: s.materials[baseId] - 1,
        [accentId]: s.materials[accentId] - 1,
      },
      brewedPotions: [...s.brewedPotions, brewed],
      recipeLevel: updatedLevels,
      knownPotionIds: isNewPotion
        ? [...s.knownPotionIds, recipe.potionId]
        : s.knownPotionIds,
    });
    return brewed;
  },

  learnRecipe: (recipeId) => {
    const s = get();
    const current = s.recipeLevel[recipeId] ?? 0;
    set({ recipeLevel: { ...s.recipeLevel, [recipeId]: current + 1 } });
  },

  reloadDailyOptions: () => {
    const s = get();
    if (s.money < 10) return false;
    set({ money: s.money - 10, dailyRecipeOptions: pickDailyOptions() });
    return true;
  },

  confirmDisplay: (potions) => {
    const s = get();
    const ids = new Set(potions.map((p) => p.instanceId));
    set({
      displayedPotions: potions,
      brewedPotions: s.brewedPotions.filter((p) => !ids.has(p.instanceId)),
    });
  },

  advanceScene: () => {
    const s = get();
    const idx = SCENE_ORDER.indexOf(s.scene);
    if (idx === -1 || idx < SCENE_ORDER.length - 1) {
      const next = SCENE_ORDER[idx + 1] ?? "conversation";
      set({ scene: next });
      return;
    }
    // display → next morning: auto-sell
    const saleResult: SaleRecord[] = s.displayedPotions.map((p) => ({
      name: getPotion(p.potionId)?.name ?? "ポーション",
      price: p.sellPrice,
    }));
    const earned = saleResult.reduce((sum, r) => sum + r.price, 0);
    set({
      day: s.day + 1,
      money: s.money + earned,
      displayedPotions: [],
      lastSaleResult: saleResult,
      scene: "conversation",
      dailyRecipeOptions: pickDailyOptions(),
    });
  },

  sellAll: () => {
    const s = get();
    const allPotions = [...s.brewedPotions];
    const saleResult: SaleRecord[] = allPotions.map((p) => ({
      name: getPotion(p.potionId)?.name ?? "ポーション",
      price: p.sellPrice,
    }));
    const earned = saleResult.reduce((sum, r) => sum + r.price, 0);
    set({
      money: s.money + earned,
      day: s.day + 1,
      brewedPotions: [],
      displayedPotions: [],
      lastSaleResult: saleResult,
      dailyRecipeOptions: pickDailyOptions(),
    });
  },
}));
