import type { DialogueTheme } from "../../../store/useGameStore";

export const SPEECH_SIDE = 24;

export type ThemeTokens = {
  bg: string;
  border: string;
  text: string;
  nameText: string;
  btnBg: string;
  btnBorder: string;
  btnText: string;
  choiceBg: string;
  choiceBgHover: string;
};

export const THEMES: Record<DialogueTheme, ThemeTokens> = {
  dark: {
    bg: "rgba(10,6,2,0.93)",
    border: "#8B6914",
    text: "#e8d8b8",
    nameText: "#c8a84b",
    btnBg: "rgba(14,8,2,0.92)",
    btnBorder: "#5a4418",
    btnText: "#c8a84b",
    choiceBg: "rgba(26,14,6,0.9)",
    choiceBgHover: "rgba(60,36,8,0.95)",
  },
  parchment: {
    bg: "rgba(240,220,170,0.96)",
    border: "#7a4a10",
    text: "#2c1810",
    nameText: "#7a4a10",
    btnBg: "rgba(122,74,16,0.14)",
    btnBorder: "#7a4a10",
    btnText: "#7a4a10",
    choiceBg: "rgba(200,160,80,0.25)",
    choiceBgHover: "rgba(200,160,80,0.45)",
  },
  semi: {
    bg: "rgba(10,6,2,0.68)",
    border: "rgba(139,105,20,0.55)",
    text: "#f0e8d0",
    nameText: "#c8a84b",
    btnBg: "rgba(14,8,2,0.75)",
    btnBorder: "rgba(139,105,20,0.45)",
    btnText: "#c8a84b",
    choiceBg: "rgba(26,14,6,0.75)",
    choiceBgHover: "rgba(60,36,8,0.85)",
  },
};

