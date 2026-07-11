import { beforeEach, describe, expect, it } from "vitest";
import { CLEAR_MONEY_THRESHOLD, END_DAY, useGameStore } from "./useGameStore";
import type { Scene } from "./useGameStore";
import type { BrewedPotion } from "../data/types";
import { calcSellPrice, findRecipeByIngredients, getPotion, getRecipe } from "../data/gameData";

// Reset the store to a clean game before every test.
beforeEach(() => {
  useGameStore.getState().startNewGame();
});

const setState = (partial: Partial<ReturnType<typeof useGameStore.getState>>) =>
  useGameStore.setState(partial);

function makePotion(overrides: Partial<BrewedPotion> = {}): BrewedPotion {
  return {
    instanceId: overrides.instanceId ?? "p_test",
    potionId: overrides.potionId ?? "premium_potion",
    recipeId: overrides.recipeId ?? "holy_water_dragon_tail",
    level: overrides.level ?? 1,
    sellPrice: overrides.sellPrice ?? 1000,
    isNew: overrides.isNew ?? false,
    isNewRecipe: overrides.isNewRecipe ?? false,
    isFailed: overrides.isFailed ?? false,
  };
}

describe("constants", () => {
  it("exposes clear conditions", () => {
    expect(END_DAY).toBe(5);
    expect(CLEAR_MONEY_THRESHOLD).toBe(10000);
  });
});

describe("startNewGame", () => {
  it("initializes a fresh run in the introduction scene", () => {
    const s = useGameStore.getState();
    expect(s.money).toBe(1000);
    expect(s.day).toBe(1);
    expect(s.scene).toBe("introduction");
    expect(s.shopLevel).toBe(1);
    expect(s.materials).toEqual({});
    expect(s.brewedPotions).toEqual([]);
    expect(s.knownPotionIds).toEqual([]);
    expect(s.dailyRecipeOptions.length).toBeGreaterThan(0);
  });

  it("picks up to 5 recipe-id options, all real recipes and none for mystery", () => {
    const options = useGameStore.getState().dailyRecipeOptions;
    expect(options.length).toBeLessThanOrEqual(5);
    expect(new Set(options).size).toBe(options.length); // no duplicates
    for (const id of options) {
      const recipe = getRecipe(id);
      expect(recipe).toBeDefined();
      expect(recipe!.potionId).not.toBe("mystery");
    }
  });
});

describe("simple setters", () => {
  it("setScene updates the current scene", () => {
    useGameStore.getState().setScene("shop");
    expect(useGameStore.getState().scene).toBe("shop");
  });

  it("setIsInventoryOpen toggles inventory visibility", () => {
    useGameStore.getState().setIsInventoryOpen(true);
    expect(useGameStore.getState().isInventoryOpen).toBe(true);
  });

  it("setDialogueAppearance replaces the appearance", () => {
    useGameStore.getState().setDialogueAppearance({ theme: "parchment" });
    expect(useGameStore.getState().dialogueAppearance).toEqual({ theme: "parchment" });
  });

  it("setPendingPostPurchaseScene stores the pending scene", () => {
    useGameStore.getState().setPendingPostPurchaseScene("brew");
    expect(useGameStore.getState().pendingPostPurchaseScene).toBe("brew");
  });
});

describe("buyMaterial", () => {
  it("deducts money, adds the material, and records the expense", () => {
    const ok = useGameStore.getState().buyMaterial("holy_water", 100);
    const s = useGameStore.getState();
    expect(ok).toBe(true);
    expect(s.money).toBe(900);
    expect(s.materials.holy_water).toBe(1);
    expect(s.dailyFinanceReports).toContainEqual({ day: 1, expense: 100, income: 0 });
  });

  it("accumulates the same material across purchases", () => {
    useGameStore.getState().buyMaterial("holy_water", 100);
    useGameStore.getState().buyMaterial("holy_water", 100);
    expect(useGameStore.getState().materials.holy_water).toBe(2);
    expect(useGameStore.getState().money).toBe(800);
  });

  it("fails and changes nothing when money is insufficient", () => {
    setState({ money: 50 });
    const ok = useGameStore.getState().buyMaterial("holy_water", 100);
    const s = useGameStore.getState();
    expect(ok).toBe(false);
    expect(s.money).toBe(50);
    expect(s.materials.holy_water).toBeUndefined();
  });
});

describe("brew", () => {
  const base = "holy_water";
  const accent = "dragon_tail"; // -> premium_potion, a non-failed recipe

  it("returns null when materials are missing", () => {
    expect(useGameStore.getState().brew(base, accent)).toBeNull();
  });

  it("returns null when no recipe matches the ingredients", () => {
    setState({ materials: { holy_water: 1, holy_water_x: 1 } });
    expect(useGameStore.getState().brew("holy_water", "holy_water_x")).toBeNull();
  });

  it("consumes materials and produces a potion for a valid recipe", () => {
    setState({ materials: { [base]: 1, [accent]: 1 } });
    const potion = useGameStore.getState().brew(base, accent);
    const recipe = findRecipeByIngredients(base, accent)!;
    const def = getPotion(recipe.potionId)!;

    expect(potion).not.toBeNull();
    expect(potion!.potionId).toBe(recipe.potionId);
    expect(potion!.level).toBe(1);
    expect(potion!.sellPrice).toBe(calcSellPrice(def.basePrice, 1));
    expect(potion!.isNew).toBe(true);
    expect(potion!.isNewRecipe).toBe(true);
    expect(potion!.isFailed).toBe(false);

    const s = useGameStore.getState();
    expect(s.materials[base]).toBe(0);
    expect(s.materials[accent]).toBe(0);
    expect(s.brewedPotions).toHaveLength(1);
    expect(s.recipeLevel[recipe.id]).toBe(1);
    expect(s.knownPotionIds).toContain(recipe.potionId);
  });

  it("marks a potion as not new when its potion id is already known", () => {
    const recipe = findRecipeByIngredients(base, accent)!;
    setState({ materials: { [base]: 1, [accent]: 1 }, knownPotionIds: [recipe.potionId] });
    const potion = useGameStore.getState().brew(base, accent);
    expect(potion!.isNew).toBe(false);
  });

  it("does not level up or learn a failed (meh) recipe", () => {
    // strong_sake + herb_accent -> meh_potion (isFailed)
    const failBase = "strong_sake";
    const failAccent = "herb_accent";
    const recipe = findRecipeByIngredients(failBase, failAccent)!;
    expect(recipe.potionId).toBe("meh_potion");

    setState({ materials: { [failBase]: 1, [failAccent]: 1 } });
    const potion = useGameStore.getState().brew(failBase, failAccent);
    expect(potion!.isFailed).toBe(true);
    expect(potion!.isNewRecipe).toBe(false);
    expect(useGameStore.getState().recipeLevel[recipe.id]).toBeUndefined();
  });

  it("assigns unique instance ids across brews", () => {
    setState({ materials: { [base]: 2, [accent]: 2 } });
    const first = useGameStore.getState().brew(base, accent);
    const second = useGameStore.getState().brew(base, accent);
    expect(first!.instanceId).not.toBe(second!.instanceId);
    // second brew of a known recipe is no longer a new recipe
    expect(second!.isNewRecipe).toBe(false);
  });
});

describe("learnRecipe", () => {
  it("increments the level of a recipe from zero", () => {
    useGameStore.getState().learnRecipe("holy_water_dragon_tail");
    expect(useGameStore.getState().recipeLevel.holy_water_dragon_tail).toBe(1);
  });

  it("increments an already-known recipe", () => {
    setState({ recipeLevel: { holy_water_dragon_tail: 2 } });
    useGameStore.getState().learnRecipe("holy_water_dragon_tail");
    expect(useGameStore.getState().recipeLevel.holy_water_dragon_tail).toBe(3);
  });
});

describe("reloadDailyOptions", () => {
  it("charges 10 money and refreshes options", () => {
    const before = useGameStore.getState().dailyRecipeOptions;
    const ok = useGameStore.getState().reloadDailyOptions();
    const s = useGameStore.getState();
    expect(ok).toBe(true);
    expect(s.money).toBe(990);
    expect(s.dailyRecipeOptions).not.toBe(before);
    expect(s.dailyFinanceReports).toContainEqual({ day: 1, expense: 10, income: 0 });
  });

  it("fails when money is below 10", () => {
    setState({ money: 5 });
    const ok = useGameStore.getState().reloadDailyOptions();
    expect(ok).toBe(false);
    expect(useGameStore.getState().money).toBe(5);
  });
});

describe("confirmDisplay", () => {
  it("moves selected potions to the display and removes them from brewed", () => {
    const a = makePotion({ instanceId: "p_a" });
    const b = makePotion({ instanceId: "p_b" });
    const c = makePotion({ instanceId: "p_c" });
    setState({ brewedPotions: [a, b, c] });
    useGameStore.getState().confirmDisplay([a, c]);
    const s = useGameStore.getState();
    expect(s.displayedPotions).toEqual([a, c]);
    expect(s.brewedPotions).toEqual([b]);
  });
});

describe("beginNextDayTransition", () => {
  it("returns false when not in the display scene", () => {
    setState({ scene: "shop" });
    expect(useGameStore.getState().beginNextDayTransition()).toBe(false);
  });

  it("returns true (game end) when the day reaches END_DAY", () => {
    setState({ scene: "display", day: END_DAY });
    expect(useGameStore.getState().beginNextDayTransition()).toBe(true);
    // no day advance on game end
    expect(useGameStore.getState().day).toBe(END_DAY);
  });

  it("sells displayed potions, advances the day, and records income", () => {
    const potion = makePotion({ instanceId: "p_a", potionId: "premium_potion", sellPrice: 1000 });
    setState({ scene: "display", day: 2, money: 500, displayedPotions: [potion] });
    const result = useGameStore.getState().beginNextDayTransition();
    const s = useGameStore.getState();
    expect(result).toBe(false);
    expect(s.money).toBe(1500);
    expect(s.day).toBe(3);
    expect(s.displayedPotions).toEqual([]);
    expect(s.lastSaleResult).toEqual([{ name: getPotion("premium_potion")!.name, price: 1000 }]);
    expect(s.dailyFinanceReports).toContainEqual({ day: 2, expense: 0, income: 1000 });
  });

  it("falls back to brewed potions when nothing is displayed", () => {
    const potion = makePotion({ instanceId: "p_b", sellPrice: 250 });
    setState({ scene: "display", day: 2, money: 0, displayedPotions: [], brewedPotions: [potion] });
    const result = useGameStore.getState().beginNextDayTransition();
    expect(result).toBe(false);
    expect(useGameStore.getState().money).toBe(250);
    expect(useGameStore.getState().brewedPotions).toEqual([]);
  });
});

describe("advanceScene", () => {
  it("follows the SCENE_ORDER for a mid-flow scene", () => {
    setState({ scene: "shop", pendingPostPurchaseScene: null });
    useGameStore.getState().advanceScene();
    expect(useGameStore.getState().scene).toBe("conversation_brew");
  });

  it("routes shop -> shopkeeper conversation when a pending scene exists", () => {
    setState({ scene: "shop", pendingPostPurchaseScene: "brew" });
    useGameStore.getState().advanceScene();
    const s = useGameStore.getState();
    expect(s.scene).toBe("conversation_shopkeeper");
    expect(s.pendingPostPurchaseScene).toBe("brew");
  });

  it("resolves the pending scene after the shopkeeper conversation", () => {
    setState({ scene: "conversation_shopkeeper", pendingPostPurchaseScene: "brew" });
    useGameStore.getState().advanceScene();
    const s = useGameStore.getState();
    expect(s.scene).toBe("brew");
    expect(s.pendingPostPurchaseScene).toBeNull();
  });

  it("returns to conversation without selling when display has no potions", () => {
    setState({ scene: "display", money: 100, displayedPotions: [], brewedPotions: [] });
    useGameStore.getState().advanceScene(false);
    const s = useGameStore.getState();
    expect(s.scene).toBe("conversation");
    expect(s.money).toBe(100);
  });

  it("sells and moves to conversation on a normal display advance", () => {
    const potion = makePotion({ sellPrice: 300 });
    setState({ scene: "display", day: 1, money: 0, displayedPotions: [potion] });
    useGameStore.getState().advanceScene(false);
    const s = useGameStore.getState();
    expect(s.scene).toBe("conversation");
    expect(s.money).toBe(300);
    expect(s.displayedPotions).toEqual([]);
  });

  it("sells and moves to conversation_end when shouldEnd is true", () => {
    const potion = makePotion({ sellPrice: 300 });
    setState({ scene: "display", day: 1, money: 0, displayedPotions: [potion] });
    useGameStore.getState().advanceScene(true);
    const s = useGameStore.getState();
    expect(s.scene).toBe("conversation_end");
    expect(s.money).toBe(300);
  });

  it.each<[Scene, Scene]>([
    ["conversation_end", "ending_transition"],
    ["ending_transition", "financial_report"],
    ["financial_report", "game_end"],
  ])("progresses ending flow from %s to %s", (from, to) => {
    setState({ scene: from });
    useGameStore.getState().advanceScene();
    expect(useGameStore.getState().scene).toBe(to);
  });
});

describe("sellAll", () => {
  it("sells all brewed potions, advances the day, and refreshes options", () => {
    const a = makePotion({ instanceId: "p_a", potionId: "premium_potion", sellPrice: 1000 });
    const b = makePotion({ instanceId: "p_b", potionId: "meh_potion", sellPrice: 130 });
    setState({ brewedPotions: [a, b], day: 2, money: 100 });
    useGameStore.getState().sellAll();
    const s = useGameStore.getState();
    expect(s.money).toBe(100 + 1000 + 130);
    expect(s.day).toBe(3);
    expect(s.brewedPotions).toEqual([]);
    expect(s.displayedPotions).toEqual([]);
    expect(s.lastSaleResult).toHaveLength(2);
    expect(s.dailyFinanceReports).toContainEqual({ day: 2, expense: 0, income: 1130 });
  });
});
