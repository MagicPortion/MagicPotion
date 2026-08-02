import { GAME_W, GAME_H } from "./gameConstants";

/**
 * 縦持ち時は画面を90度回転させて横持ち表示にするため、
 * その場合は呼び出し側で viewportW/viewportH を入れ替えて渡す。
 */
export function useGameScale(viewportW: number, viewportH: number) {
  return Math.min(viewportW / GAME_W, viewportH / GAME_H);
}
