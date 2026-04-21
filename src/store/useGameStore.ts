import { create } from "zustand";
import {
  findRecipeByIngredients,
  getPotion,
  calcSellPrice,
  RECIPES,
  shuffleArray,
} from "../data/gameData";
import type { BrewedPotion, SaleRecord } from "../data/types";

export type Scene =
  | "conversation"
  | "recipe_learning"
  | "shop"
  | "brew"
  | "display"
  | "recipe_book";

const SCENE_ORDER: Scene[] = ["conversation", "recipe_learning", "shop", "brew", "display"];

let instanceCounter = 0;

function pickDailyOptions(): string[] {
  return shuffleArray(RECIPES.map((r) => r.id)).slice(0, 5);
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
  bookReturnScene: Scene;

  setScene: (scene: Scene) => void;
  openRecipeBook: (returnTo: Scene) => void;
  buyMaterial: (id: string, price: number) => boolean;
  brew: (baseId: string, accentId: string) => BrewedPotion | null;
  learnRecipe: (recipeId: string) => void;
  reloadDailyOptions: () => boolean;
  confirmDisplay: (potions: BrewedPotion[]) => void;
  advanceScene: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  money: 1000,
  day: 1,
  scene: "conversation",
  shopLevel: 1,
  materials: {},
  brewedPotions: [],
  displayedPotions: [],
  recipeLevel: {},
  dailyRecipeOptions: pickDailyOptions(),
  lastSaleResult: [],
  bookReturnScene: "brew" as Scene,

  setScene: (scene) => set({ scene }),
  openRecipeBook: (returnTo) => set({ scene: "recipe_book", bookReturnScene: returnTo }),

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

    const brewed: BrewedPotion = {
      instanceId: `p_${++instanceCounter}`,
      potionId: recipe.potionId,
      recipeId: recipe.id,
      level,
      sellPrice: calcSellPrice(potionDef.basePrice, level),
    };

    set({
      materials: {
        ...s.materials,
        [baseId]: s.materials[baseId] - 1,
        [accentId]: s.materials[accentId] - 1,
      },
      brewedPotions: [...s.brewedPotions, brewed],
      recipeLevel: updatedLevels,
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
}));
