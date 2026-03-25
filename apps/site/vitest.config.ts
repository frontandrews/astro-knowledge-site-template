import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@content': fileURLToPath(new URL('./.content', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    environmentOptions: {
      jsdom: {
        url: 'https://example.com/',
      },
    },
    include: ['src/**/*.test.ts'],
    restoreMocks: true,
  },
})
