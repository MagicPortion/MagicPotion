import { describe, expect, it } from "vitest";
import { GAME_H, GAME_W } from "./gameConstants";

describe("gameConstants", () => {
  it("uses the fixed 1920x1080 game resolution", () => {
    expect(GAME_W).toBe(1920);
    expect(GAME_H).toBe(1080);
  });
});
