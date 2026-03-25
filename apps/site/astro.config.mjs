import { fileURLToPath } from 'node:url'

import svelte from '@astrojs/svelte'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

const defaultSiteUrl = 'https://example.com'

function resolveSiteUrl(value) {
  try {
    return new URL(value || defaultSiteUrl).toString().replace(/\/$/, '')
  } catch {
    return defaultSiteUrl
  }
}

export default defineConfig({
  integrations: [sitemap(), svelte()],
  output: 'static',
  site: resolveSiteUrl(process.env.PUBLIC_SITE_URL),
  vite: {
    ssr: {
      noExternal: ['bits-ui', /^bits-ui\//],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@content': fileURLToPath(new URL('./.content', import.meta.url)),
        'bits-ui': fileURLToPath(new URL('./node_modules/bits-ui/dist/index.js', import.meta.url)),
      },
    },
    plugins: [tailwindcss()],
  },
})
