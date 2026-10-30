import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.docx', '**/*.DOCX'],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})