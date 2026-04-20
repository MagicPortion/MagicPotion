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
        },
      },
    },
  },
  outdir: "styled-system",
});
