import type { DialogueTheme } from "../../../store/useGameStore";

export const SPEECH_SIDE = 24;

export type ThemeTokens = {
  bg: string;
  bgSoft: string;
  surface: string;
  border: string;
  borderMuted: string;
  text: string;
  textMuted: string;
  subtleText: string;
  nameText: string;
  btnBg: string;
  btnBorder: string;
  btnText: string;
  choiceBg: string;
  choiceBgHover: string;
};

// 会話ボックスの背景テーマに依存しない共通のカテゴリ配色（Base/Accent・無効状態など）
export const SEMANTIC = {
  danger: "#a6534f",
  dangerBorder: "#d87872",
  dangerText: "#fff4e0",
  success: "#789b4a",
  successText: "#a7cb70",
  accentBright: "#e0c56f",
  disabled: "#4a4238",
  disabledText: "#7a6655",
};

export const THEMES: Record<DialogueTheme, ThemeTokens> = {
  dark: {
    bg: "rgba(10,6,2,0.93)",
    bgSoft: "rgba(30,20,8,0.78)",
    surface: "#1a0e06",
    border: "#8B6914",
    borderMuted: "#4a3810",
    text: "#e8d8b8",
    textMuted: "#8B6914",
    subtleText: "#6b5040",
    nameText: "#c8a84b",
    btnBg: "rgba(14,8,2,0.92)",
    btnBorder: "#5a4418",
    btnText: "#c8a84b",
    choiceBg: "rgba(26,14,6,0.9)",
    choiceBgHover: "rgba(60,36,8,0.95)",
  },
  parchment: {
    bg: "rgba(240,220,170,0.96)",
    bgSoft: "rgba(250,240,218,0.92)",
    surface: "#f0deb0",
    border: "#7a4a10",
    borderMuted: "#b99a5c",
    text: "#2c1810",
    textMuted: "#6b4a1c",
    subtleText: "#8a6a3c",
    nameText: "#7a4a10",
    // ボタン背景が透明(0.14)に近く文字とのコントラストが低かったため、
    // 濃い茶色の不透明ボタンに変更し、文字色もクリーム色にして視認性を確保
    btnBg: "rgba(122,74,16,0.85)",
    btnBorder: "#4a2e08",
    btnText: "#f5e8cc",
    choiceBg: "rgba(200,160,80,0.25)",
    choiceBgHover: "rgba(200,160,80,0.45)",
  },
  semi: {
    bg: "rgba(10,6,2,0.68)",
    bgSoft: "rgba(30,20,8,0.55)",
    surface: "rgba(20,12,4,0.7)",
    border: "rgba(139,105,20,0.55)",
    borderMuted: "rgba(139,105,20,0.3)",
    text: "#f0e8d0",
    textMuted: "rgba(200,168,75,0.75)",
    subtleText: "rgba(200,168,75,0.5)",
    nameText: "#c8a84b",
    btnBg: "rgba(14,8,2,0.75)",
    btnBorder: "rgba(139,105,20,0.45)",
    btnText: "#c8a84b",
    choiceBg: "rgba(26,14,6,0.75)",
    choiceBgHover: "rgba(60,36,8,0.85)",
  },
};
