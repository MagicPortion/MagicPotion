import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  theme: {
    extend: {
      tokens: {
        colors: {
          pastel: {
            pink: { value: "#FFB6C1" },
            lavender: { value: "#E6E6FA" },
            mint: { value: "#B2F2BB" },
            peach: { value: "#FFDAB9" },
            sky: { value: "#B3E5FC" },
            lemon: { value: "#FFF9C4" },
            lilac: { value: "#D8B4FE" },
            rose: { value: "#FECDD3" },
            cream: { value: "#FFF8E1" },
            sage: { value: "#C8E6C9" },
          },
          // 設定/ヒント/レシピ帳/ショップ/持ち物など、暗い羊皮紙×金のテーマで使う共通トークン
          parchment: {
            overlay: { value: "rgba(0,0,0,0.6)" },
            bg: { value: "rgba(12,8,3,0.98)" },
            bgSoft: { value: "rgba(30,20,8,0.78)" },
            surface: { value: "#1a0e06" },
            border: { value: "#8B6914" },
            borderMuted: { value: "#4a3810" },
            accent: { value: "#c8a84b" },
            text: { value: "#e8d8b8" },
            textMuted: { value: "#8B6914" },
            subtleText: { value: "#6b5040" },
            danger: { value: "#a6534f" },
            dangerBorder: { value: "#d87872" },
            dangerText: { value: "#fff4e0" },
            success: { value: "#789b4a" },
            successText: { value: "#a7cb70" },
            accentBright: { value: "#e0c56f" },
            disabled: { value: "#4a4238" },
            disabledText: { value: "#7a6655" },
            surfaceSoft: { value: "#1e1408" },
            surfaceHover: { value: "#2a1d0c" },
          },
          // 購入確認（レシート）画面専用のクリーム系テーマ
          receipt: {
            bg: { value: "#fff8e6" },
            bgSoft: { value: "#fafafa" },
            border: { value: "#7a4a2e" },
            text: { value: "#4a3321" },
            textMuted: { value: "#777777" },
            base: { value: "#ff4d4f" },
            baseBg: { value: "#fff1f0" },
            baseBorder: { value: "#ffccc7" },
            baseText: { value: "#a8071a" },
            accentItem: { value: "#52c41a" },
            accentItemBg: { value: "#f6ffed" },
            accentItemBorder: { value: "#b7eb8f" },
            accentItemText: { value: "#237804" },
            confirmText: { value: "#ffffff" },
            cancelBg: { value: "#bae7ff" },
            cancelText: { value: "#0050b3" },
          },
        },
      },
      keyframes: {
        fadeInButton: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  outdir: "styled-system",
});
