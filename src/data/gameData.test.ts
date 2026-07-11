import { afterEach, describe, expect, it, vi } from "vitest";
import {
  MATERIALS,
  RECIPES,
  POTIONS,
  SHOP_SLOTS_BY_LEVEL,
  colorNum,
  getMaterial,
  getRecipe,
  getPotion,
  findRecipeByIngredients,
  weightedChoice,
  sampleWeightedChoices,
  calcSellPrice,
  shuffleArray,
} from "./gameData";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("data tables", () => {
  it("loads non-empty material, recipe, and potion tables", () => {
    expect(MATERIALS.length).toBeGreaterThan(0);
    expect(RECIPES.length).toBeGreaterThan(0);
    expect(POTIONS.length).toBeGreaterThan(0);
  });

  it("exposes shop slot counts per level", () => {
    expect(SHOP_SLOTS_BY_LEVEL).toEqual({ 1: 3, 2: 5, 3: 7 });
  });

  it("references potions and materials that exist for every recipe", () => {
    for (const recipe of RECIPES) {
      expect(getPotion(recipe.potionId)).toBeDefined();
      expect(getMaterial(recipe.baseId)).toBeDefined();
      expect(getMaterial(recipe.accentId)).toBeDefined();
    }
  });
});

describe("colorNum", () => {
  it("parses hex color strings into numbers", () => {
    expect(colorNum("ffffff")).toBe(0xffffff);
    expect(colorNum("000000")).toBe(0);
    expect(colorNum("87ceeb")).toBe(0x87ceeb);
  });
});

describe("lookup helpers", () => {
  it("getMaterial returns a match or undefined", () => {
    expect(getMaterial("holy_water")?.name).toBe("聖水");
    expect(getMaterial("does_not_exist")).toBeUndefined();
  });

  it("getRecipe returns a match or undefined", () => {
    expect(getRecipe("holy_water_dragon_tail")?.potionId).toBe("premium_potion");
    expect(getRecipe("does_not_exist")).toBeUndefined();
  });

  it("getPotion returns a match or undefined", () => {
    expect(getPotion("premium_potion")?.basePrice).toBe(1000);
    expect(getPotion("does_not_exist")).toBeUndefined();
  });

  it("findRecipeByIngredients matches base and accent order", () => {
    const recipe = findRecipeByIngredients("holy_water", "dragon_tail");
    expect(recipe?.id).toBe("holy_water_dragon_tail");
    // accent/base order matters
    expect(findRecipeByIngredients("dragon_tail", "holy_water")).toBeUndefined();
    expect(findRecipeByIngredients("holy_water", "unknown")).toBeUndefined();
  });
});

describe("weightedChoice", () => {
  it("returns undefined for an empty list", () => {
    expect(weightedChoice([])).toBeUndefined();
  });

  it("picks the item whose cumulative weight contains the random target", () => {
    const items = [
      { id: "a", spawnWeight: 1 },
      { id: "b", spawnWeight: 1 },
      { id: "c", spawnWeight: 1 },
    ];
    // total weight = 3; target = 0.5*3 = 1.5 -> falls in second bucket
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    expect(weightedChoice(items)?.id).toBe("b");
  });

  it("selects the first item when the target is at the low end", () => {
    const items = [
      { id: "a", spawnWeight: 2 },
      { id: "b", spawnWeight: 8 },
    ];
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(weightedChoice(items)?.id).toBe("a");
  });

  it("falls back to the last item when random is at the top of the range", () => {
    const items = [
      { id: "a", spawnWeight: 1 },
      { id: "b", spawnWeight: 1 },
    ];
    // Math.random() is exclusive of 1 in practice, but guard the boundary anyway.
    vi.spyOn(Math, "random").mockReturnValue(0.999999);
    expect(weightedChoice(items)?.id).toBe("b");
  });
});

describe("sampleWeightedChoices", () => {
  it("returns exactly count items", () => {
    const items = [
      { id: "a", spawnWeight: 1 },
      { id: "b", spawnWeight: 1 },
    ];
    expect(sampleWeightedChoices(items, 3)).toHaveLength(3);
    expect(sampleWeightedChoices(items, 0)).toHaveLength(0);
  });

  it("returns an empty array when the source is empty", () => {
    expect(sampleWeightedChoices([], 5)).toHaveLength(0);
  });
});

describe("calcSellPrice", () => {
  it("returns the base price at level 1", () => {
    expect(calcSellPrice(1000, 1)).toBe(1000);
  });

  it("scales by 30% per level above 1 and floors the result", () => {
    expect(calcSellPrice(100, 2)).toBe(130);
    expect(calcSellPrice(100, 3)).toBe(160);
    // 250 * (1 + 0.3*2) = 400
    expect(calcSellPrice(250, 3)).toBe(400);
    // 130 * 1.3 = 169
    expect(calcSellPrice(130, 2)).toBe(169);
  });
});

describe("shuffleArray", () => {
  it("does not mutate the original array", () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffleArray(original);
    expect(original).toEqual(copy);
  });

  it("preserves all elements", () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    expect(shuffled).toHaveLength(original.length);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(original);
  });

  it("produces a deterministic order with a mocked RNG", () => {
    // With Math.random() always 0, j is always 0, so each element swaps with index 0.
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(shuffleArray([1, 2, 3])).toEqual([2, 3, 1]);
  });
});
