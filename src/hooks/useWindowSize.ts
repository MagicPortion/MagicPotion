import { GAME_W, GAME_H } from "./gameConstants";

export function useWindowSize() {
  return { width: GAME_W, height: GAME_H };
}
