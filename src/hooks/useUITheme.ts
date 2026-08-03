import { useGameStore } from "../store/useGameStore";
import { THEMES } from "../components/ui/dialogue/dialogueThemes";

// 設定画面で選んだ会話ボックスの背景テーマ（石の闇/羊皮紙/半透明）を
// ショップ・レシピ選択・調合画面など他のUIからも参照するための共通フック
export function useUITheme() {
  const { dialogueAppearance } = useGameStore();
  return THEMES[dialogueAppearance.theme];
}
