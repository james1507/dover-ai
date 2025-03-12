import { defineConfig } from "vite";
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

// ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [tailwindcss()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available

  resolve: {
    alias: {
      '@core': resolve(__dirname, './src/core'),
      '@assets': resolve(__dirname, './src/assets'),
      '@features': resolve(__dirname, './src/features'),
      '@shared': resolve(__dirname, './src/shared')
    }
  },

  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
