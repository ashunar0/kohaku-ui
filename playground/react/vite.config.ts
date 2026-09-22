import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    // kohaku の CSS をリポジトリ外（上位ディレクトリ）から読むため
    fs: { allow: ["../.."] },
  },
})
