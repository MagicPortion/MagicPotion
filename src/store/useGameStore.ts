import { create } from "zustand";
import { findRecipe, getPotion, type RecipeDef } from "../data/gameData";

export type Phase = "morning" | "noon" | "night";

export type Scene =
  | "conversation"
  | "shop"
  | "brew"
  | "recipe"
  | "sell";

export interface GameState {
  money: number;
  day: number;
  phase: Phase;
  scene: Scene;
  materials: Record<string, number>;
  potions: Record<string, number>;
  discoveredRecipes: RecipeDef[];

  setScene: (scene: Scene) => void;
  buyMaterial: (id: string, price: number) => boolean;
  brew: (baseId: string, accentId: string) => string | null;
  sellPotion: (potionId: string) => boolean;
  advancePhase: () => void;
}

const phaseOrder: Phase[] = ["morning", "noon", "night"];
const sceneForPhase: Record<Phase, Scene> = {
  morning: "conversation",
  noon: "shop",
  night: "brew",
};

export const useGameStore = create<GameState>((set, get) => ({
  money: 1000,
  day: 1,
  phase: "morning",
  scene: "conversation",
  materials: {},
  potions: {},
  discoveredRecipes: [],

  setScene: (scene) => set({ scene }),

  buyMaterial: (id, price) => {
    const state = get();
    if (state.money < price) return false;
    set({
      money: state.money - price,
      materials: {
        ...state.materials,
        [id]: (state.materials[id] ?? 0) + 1,
      },
    });
    return true;
  },

  brew: (baseId, accentId) => {
    const state = get();
    if ((state.materials[baseId] ?? 0) < 1) return null;
    if ((state.materials[accentId] ?? 0) < 1) return null;

    const recipe = findRecipe(baseId, accentId);
    if (!recipe) return null;

    const potionId = recipe.potionId;

    const alreadyDiscovered = state.discoveredRecipes.some(
      (r) => r.baseId === baseId && r.accentId === accentId
    );
    const updatedRecipes = alreadyDiscovered
      ? state.discoveredRecipes
      : [...state.discoveredRecipes, recipe];

    set({
      materials: {
        ...state.materials,
        [baseId]: state.materials[baseId] - 1,
        [accentId]: state.materials[accentId] - 1,
      },
      potions: {
        ...state.potions,
        [potionId]: (state.potions[potionId] ?? 0) + 1,
      },
      discoveredRecipes: updatedRecipes,
    });

    return potionId;
  },

  sellPotion: (potionId) => {
    const state = get();
    if ((state.potions[potionId] ?? 0) < 1) return false;
    const potion = getPotion(potionId);
    if (!potion) return false;
    set({
      potions: {
        ...state.potions,
        [potionId]: state.potions[potionId] - 1,
      },
      money: state.money + potion.sellPrice,
    });
    return true;
  },

  advancePhase: () => {
    const state = get();
    const idx = phaseOrder.indexOf(state.phase);
    if (idx < phaseOrder.length - 1) {
      const nextPhase = phaseOrder[idx + 1];
      set({ phase: nextPhase, scene: sceneForPhase[nextPhase] });
    } else {
      set({
        day: state.day + 1,
        phase: "morning",
        scene: "conversation",
      });
    }
  },
}));
