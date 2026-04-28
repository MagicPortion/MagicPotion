import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@styled-system': fileURLToPath(new URL('./styled-system', import.meta.url)),
    },
  },
  base: "/MagicPotion/",
})
