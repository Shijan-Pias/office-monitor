import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), // <-- Tailwind Vite প্লাগিন হিসেবে এখানে থাকবে
    react(),
    babel({ presets: [reactCompilerPreset()] }) // <-- এখান থেকে tailwindcss() সরিয়ে দেওয়া হয়েছে
  ],
})