import { defineConfig } from 'vite'
import vituum from 'vituum'
import liquid from '@vituum/vite-plugin-liquid'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Deploy path of the site. "/" for a root domain (Cloudflare Pages, custom domain);
// "/<repo>/" for a GitHub project page. Set it with BASE_PATH at build time.
const rawBase = process.env.BASE_PATH ?? '/'
const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')

// The templates link to pages with root-relative URLs ("/components/tag"), which Vite
// does not rewrite. Prefix them with the base so the site works under a sub-path.
const prefixRootLinks = () => ({
  name: 'cubito-prefix-root-links',
  transformIndexHtml: {
    order: 'post' as const,
    handler: (html: string) =>
      base === '/'
        ? html
        : html.replace(/(\s(?:href|src)=")\/(?!\/)/g, (match, attr, offset, source) =>
            source.startsWith(base, offset + attr.length) ? match : `${attr}${base}`
          ),
  },
})

export default defineConfig({
  base,
  plugins: [
    vituum(),
    liquid({ root: './src' }),
    prefixRootLinks(),
  ],
  resolve: {
    alias: {
      cubito: path.resolve(__dirname, '../lib'),
    },
  },
  build: {
    // The library relies on light-dark(). Without an explicit modern target, lightningcss
    // rewrites it into a custom-property hack that breaks tokens passed through var().
    // Older browsers are covered by the @supports fallback inside the library.
    cssTarget: ['chrome123', 'safari17.5', 'firefox120'],
    rollupOptions: {
      input: ['./src/pages/**/*.liquid']
    }
  }
})
