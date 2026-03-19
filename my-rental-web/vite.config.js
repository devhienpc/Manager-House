import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Manager-House/',
  plugins: [
    react(),
    tailwindcss(),   // Tailwind v4 Vite plugin
  ],
})
