import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [icon()],
  output: 'static',
})
