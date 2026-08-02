import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { VitePWA } from 'vite-plugin-pwa'

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
    VitePWA({
      // manifest.webmanifest は public/ に手動で用意したものをそのまま使う
      manifest: false,
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      workbox: {
        // アプリ本体（JS/CSS/HTML）だけ事前キャッシュし、容量の大きい画像・音声は
        // アクセスした分だけ随時キャッシュする（初回インストール時の転送量を抑えるため）
        globPatterns: ['**/*.{js,css,html}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image' || request.destination === 'audio',
            handler: 'CacheFirst',
            options: {
              cacheName: 'game-assets',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
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
