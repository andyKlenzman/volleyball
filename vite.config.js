// ABOUTME: Vite configuration for the volleyball serve tracker React app
// ABOUTME: Enables React fast refresh; sets base path for GitHub Pages deployment
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// When running in GitHub Actions, GITHUB_REPOSITORY is "owner/repo".
// GitHub Pages project sites are served at /repo-name/, so we derive the base from it.
const base = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
  : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
