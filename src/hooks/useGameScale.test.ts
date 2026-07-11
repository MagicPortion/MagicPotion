import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useGameScale } from "./useGameScale";
import { GAME_H, GAME_W } from "./gameConstants";

function setWindowSize(width: number, height: number) {
  Object.defineProperty(window, "innerWidth", { value: width, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: height, configurable: true });
}

afterEach(() => {
  setWindowSize(1024, 768);
});

describe("useGameScale", () => {
  it("returns the scale limited by the smaller axis ratio", () => {
    // width ratio = 1920/1920 = 1, height ratio = 540/1080 = 0.5 -> min is 0.5
    setWindowSize(GAME_W, GAME_H / 2);
    const { result } = renderHook(() => useGameScale());
    expect(result.current).toBe(0.5);
  });

  it("recomputes the scale on window resize", () => {
    setWindowSize(GAME_W, GAME_H);
    const { result } = renderHook(() => useGameScale());
    expect(result.current).toBe(1);

    act(() => {
      setWindowSize(GAME_W / 2, GAME_H);
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe(0.5);
  });

  it("removes the resize listener on unmount", () => {
    setWindowSize(GAME_W, GAME_H);
    const { unmount, result } = renderHook(() => useGameScale());
    unmount();
    // After unmount, resize events must no longer change the last value.
    const last = result.current;
    act(() => {
      setWindowSize(GAME_W / 4, GAME_H);
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe(last);
  });
});
