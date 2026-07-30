import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
    }),
  ],
  resolve: {
    alias: {
      '#styled-system': fileURLToPath(new URL('./styled-system', import.meta.url)),
      '#assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
    },
  },
  base: "/MagicPotion/",
})
