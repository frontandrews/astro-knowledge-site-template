import { expect, test } from '@playwright/test'

import { e2eHookSelectors } from './support/hooks'

test.describe('search shell after client transitions', () => {
  test('keeps the JS search trigger active after internal navigation', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator(e2eHookSelectors.searchLauncherDesktopTrigger)).toBeVisible()
    await expect(page.locator(e2eHookSelectors.searchLauncherNoJsFallback)).toBeHidden()

    await page.locator('footer a[href="/articles"]').first().click()

    await expect(page).toHaveURL(/\/articles$/)
    await expect(page.locator('html')).toHaveAttribute('data-js', 'true')
    await expect(page.locator(e2eHookSelectors.searchLauncherDesktopTrigger)).toBeVisible()
    await expect(page.locator(e2eHookSelectors.searchLauncherNoJsFallback)).toBeHidden()
  })
})
