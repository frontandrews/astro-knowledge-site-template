import { fileURLToPath } from 'node:url'

import { defineConfig } from '@playwright/test'

const repoRoot = fileURLToPath(new URL('../..', import.meta.url))
const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER === '1'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: false,
  outputDir: 'test-results',
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : 'list',
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node ./apps/site/scripts/run-e2e-dev-server.mjs',
    cwd: repoRoot,
    reuseExistingServer,
    timeout: 120_000,
    url: 'http://127.0.0.1:4173',
  },
})
