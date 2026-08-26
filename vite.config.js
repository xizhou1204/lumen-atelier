import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const staticFiles = [
  'logo.png',
  'favicon.svg',
  'favicon-32.png',
  'favicon.ico',
  'apple-touch-icon.png',
  'site.webmanifest',
]

function copyStaticFiles() {
  return {
    name: 'copy-lumen-static-files',
    closeBundle() {
      for (const file of staticFiles) {
        const source = resolve(process.cwd(), file)
        const target = resolve(process.cwd(), 'dist', file)
        if (existsSync(source)) copyFileSync(source, target)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), copyStaticFiles()],
  base: '/lumen-atelier/',
})
