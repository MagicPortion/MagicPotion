import { describe, expect, it } from "vitest";
import { useWindowSize } from "./useWindowSize";
import { GAME_H, GAME_W } from "./gameConstants";

describe("useWindowSize", () => {
  it("always returns the fixed game dimensions", () => {
    expect(useWindowSize()).toEqual({ width: GAME_W, height: GAME_H });
  });
});
