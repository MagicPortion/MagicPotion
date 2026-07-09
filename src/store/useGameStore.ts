import { create } from "zustand";
import {
  findRecipeByIngredients,
  getPotion,
  calcSellPrice,
  RECIPES,
  shuffleArray,
} from "../data/gameData";
import type { BrewedPotion, RecipeDef, SaleRecord } from "../data/types";

export type DialogueTheme = "dark" | "parchment" | "semi";
export interface DialogueAppearance { theme: DialogueTheme; }
export const DEFAULT_APPEARANCE: DialogueAppearance = { theme: "dark" };

export type Scene =
  | "title"
  | "introduction"
  | "conversation"
  | "recipe_learning"
  | "conversation_move"
  | "conversation_shopkeeper"
  | "shop"
  | "conversation_brew"
  | "brew"
  | "display"
  | "conversation_end"
  | "ending_transition"
  | "financial_report"
  | "game_end";

const SCENE_ORDER: Scene[] = [
  "introduction",
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

// クリア判定の条件定義
export const END_DAY = 5;
export const CLEAR_MONEY_THRESHOLD = 10000;

const shouldTriggerGameEnd = (day: number) => day >= END_DAY;

export interface DailyFinanceReport {
  day: number;
  expense: number;
  income: number;
}

function addDailyFinance(
  reports: DailyFinanceReport[],
  day: number,
  changes: Partial<Pick<DailyFinanceReport, "expense" | "income">>,
): DailyFinanceReport[] {
  const index = reports.findIndex((report) => report.day === day);
  if (index === -1) {
    return [
      ...reports,
      {
        day,
        expense: changes.expense ?? 0,
        income: changes.income ?? 0,
      },
    ].sort((a, b) => a.day - b.day);
  }

  return reports.map((report, i) =>
    i === index
      ? {
          ...report,
          expense: report.expense + (changes.expense ?? 0),
          income: report.income + (changes.income ?? 0),
        }
      : report,
  );
}

function buildSaleResult(potions: BrewedPotion[]): SaleRecord[] {
  return potions.map((p) => ({
    name: getPotion(p.potionId)?.name ?? "ポーション",
    price: p.sellPrice,
  }));
}

function pickDailyOptions(): string[] {
  const recipeGroups = RECIPES.reduce<Record<string, RecipeDef[]>>((acc, recipe) => {
    if (recipe.potionId === "mystery") return acc;
    const list = acc[recipe.potionId] ?? [];
    return { ...acc, [recipe.potionId]: [...list, recipe] };
  }, {});

  const uniquePotionRecipes = Object.values(recipeGroups).map((group) => {
    const shuffledGroup = shuffleArray(group);
    return shuffledGroup[0];
  });

  return shuffleArray(uniquePotionRecipes).slice(0, 5).map((recipe) => recipe.id);
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
  dailyFinanceReports: DailyFinanceReport[];
  knownPotionIds: string[];

  isInventoryOpen: boolean;
  setIsInventoryOpen: (open: boolean) => void;

  dialogueAppearance: DialogueAppearance;
  setDialogueAppearance: (a: DialogueAppearance) => void;

  pendingPostPurchaseScene: Scene | null;
  setPendingPostPurchaseScene: (scene: Scene | null) => void;

  setScene: (scene: Scene) => void;
  startNewGame: () => void;
  buyMaterial: (id: string, price: number) => boolean;
  brew: (baseId: string, accentId: string) => BrewedPotion | null;
  learnRecipe: (recipeId: string) => void;
  reloadDailyOptions: () => boolean;
  confirmDisplay: (potions: BrewedPotion[]) => void;
  beginNextDayTransition: () => boolean;
  advanceScene: (shouldEnd?: boolean) => void;
  sellAll: () => void;
}

type GameProgressState = Pick<
  GameState,
  | "money"
  | "day"
  | "scene"
  | "shopLevel"
  | "materials"
  | "brewedPotions"
  | "displayedPotions"
  | "recipeLevel"
  | "dailyRecipeOptions"
  | "lastSaleResult"
  | "dailyFinanceReports"
  | "knownPotionIds"
  | "isInventoryOpen"
  | "pendingPostPurchaseScene"
>;

function createInitialGameProgress(scene: Scene): GameProgressState {
  return {
    money: 1000,
    day: 1,
    scene,
    shopLevel: 1,
    materials: {},
    brewedPotions: [],
    displayedPotions: [],
    recipeLevel: {},
    dailyRecipeOptions: pickDailyOptions(),
    lastSaleResult: [],
    dailyFinanceReports: [],
    knownPotionIds: [],
    isInventoryOpen: false,
    pendingPostPurchaseScene: null,
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  ...createInitialGameProgress("title"),
  setIsInventoryOpen: (open) => set({ isInventoryOpen: open }),
  dialogueAppearance: DEFAULT_APPEARANCE,
  setDialogueAppearance: (a) => set({ dialogueAppearance: a }),
  setPendingPostPurchaseScene: (scene) => set({ pendingPostPurchaseScene: scene }),

  setScene: (scene) => set({ scene }),
  startNewGame: () => {
    instanceCounter = 0;
    set(createInitialGameProgress("introduction"));
  },

  buyMaterial: (id, price) => {
    const s = get();
    if (s.money < price) return false;
    set({
      money: s.money - price,
      materials: { ...s.materials, [id]: (s.materials[id] ?? 0) + 1 },
      dailyFinanceReports: addDailyFinance(s.dailyFinanceReports, s.day, { expense: price }),
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

    // isFailed は微妙なポーションかどうか
    const isFailed = recipe.potionId === "meh_potion";

    const currentLevel = s.recipeLevel[recipe.id] ?? 0;
    const level = currentLevel === 0 ? 1 : currentLevel;
    // 失敗の場合はレシピレベルを更新しない
    const updatedLevels =
      !isFailed && currentLevel === 0
        ? { ...s.recipeLevel, [recipe.id]: 1 }
        : s.recipeLevel;

    // isNew はポーション単位で判定（同じポーションの別レシピでもNEWにしない）
    const isNewPotion = !s.knownPotionIds.includes(recipe.potionId);
    // isNewRecipe はレシピ単位で判定（未習得のレシピ、かつ失敗でない場合）
    const isNewRecipe = currentLevel === 0 && !isFailed;

    const brewed: BrewedPotion = {
      instanceId: `p_${++instanceCounter}`,
      potionId: recipe.potionId,
      recipeId: recipe.id,
      level,
      sellPrice: calcSellPrice(potionDef.basePrice, level),
      isNew: isNewPotion,
      isNewRecipe,
      isFailed,
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
    set({
      money: s.money - 10,
      dailyRecipeOptions: pickDailyOptions(),
      dailyFinanceReports: addDailyFinance(s.dailyFinanceReports, s.day, { expense: 10 }),
    });
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

  beginNextDayTransition: () => {
    const s = get();
    if (s.scene !== "display") return false;

    if (shouldTriggerGameEnd(s.day)) return true;

    const potionsToSell = s.displayedPotions.length > 0 ? s.displayedPotions : s.brewedPotions;
    const saleResult = buildSaleResult(potionsToSell);
    const earned = saleResult.reduce((sum, r) => sum + r.price, 0);

    set({
      money: s.money + earned,
      day: s.day + 1,
      displayedPotions: [],
      brewedPotions: [],
      lastSaleResult: saleResult,
      dailyFinanceReports: addDailyFinance(s.dailyFinanceReports, s.day, { income: earned }),
    });
    return false;
  },

  advanceScene: (shouldEnd = false) => {
    const s = get();

    if (s.scene === "shop" && s.pendingPostPurchaseScene) {
      set({ scene: "conversation_shopkeeper", pendingPostPurchaseScene: s.pendingPostPurchaseScene });
      return;
    }

    if (s.scene === "conversation_shopkeeper" && s.pendingPostPurchaseScene) {
      set({ scene: s.pendingPostPurchaseScene, pendingPostPurchaseScene: null });
      return;
    }

    if (s.scene === "display") {
      const potionsToSell = s.displayedPotions.length > 0 ? s.displayedPotions : s.brewedPotions;
      const saleResult = buildSaleResult(potionsToSell);
      const earned = saleResult.reduce((sum, r) => sum + r.price, 0);
      const nextMoney = s.money + earned;

      if (potionsToSell.length === 0 && !shouldEnd) {
        set({
          scene: "conversation",
          dailyRecipeOptions: pickDailyOptions(),
        });
        return;
      }

      if (shouldEnd) {
        set({
          money: nextMoney,
          displayedPotions: [],
          brewedPotions: [],
          lastSaleResult: saleResult,
          dailyFinanceReports: addDailyFinance(s.dailyFinanceReports, s.day, { income: earned }),
          scene: "conversation_end",
        });
        return;
      }

      set({
        money: nextMoney,
        displayedPotions: [],
        brewedPotions: [],
        lastSaleResult: saleResult,
        dailyFinanceReports: addDailyFinance(s.dailyFinanceReports, s.day, { income: earned }),
        scene: "conversation",
        dailyRecipeOptions: pickDailyOptions(),
      });
      return;
    }

    if (s.scene === "conversation_end") {
      set({ scene: "ending_transition" });
      return;
    }

    if (s.scene === "ending_transition") {
      set({ scene: "financial_report" });
      return;
    }

    if (s.scene === "financial_report") {
      set({ scene: "game_end" });
      return;
    }

    const idx = SCENE_ORDER.indexOf(s.scene);
    if (idx === -1 || idx < SCENE_ORDER.length - 1) {
      const next = SCENE_ORDER[idx + 1] ?? "conversation";
      set({ scene: next });
      return;
    }
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
      dailyFinanceReports: addDailyFinance(s.dailyFinanceReports, s.day, { income: earned }),
      dailyRecipeOptions: pickDailyOptions(),
    });
  },
}));
