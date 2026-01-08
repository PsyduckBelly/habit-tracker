import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Uncomment and update base path if deploying to GitHub Pages with a repository name
  // base: '/habit_tracker/',
})

