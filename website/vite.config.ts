import { defineConfig } from 'vite'
import vituum from 'vituum'
import liquid from '@vituum/vite-plugin-liquid'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    vituum(),
    liquid({ root: './src' }),
  ],
  resolve: {
    alias: {
      cubito: path.resolve(__dirname, '../lib'),
    },
  },
  build: {
    rollupOptions: {
      input: ['./src/pages/**/*.liquid']
    }
  }
})
