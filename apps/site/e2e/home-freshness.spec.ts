import { expect, test } from '@playwright/test'

import { e2eHookSelectors } from './support/hooks'

test.describe('home freshness recirculation', () => {
  test('shows the recently updated section on the localized home page', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator(e2eHookSelectors.recentUpdatesRoot)).toBeVisible()
    await expect(page.locator(e2eHookSelectors.recentUpdatesItem).first()).toBeVisible()
  })
})
