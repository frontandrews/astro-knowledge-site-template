import { expect, test } from '@playwright/test'
import { e2eHookSelectors } from './support/hooks'

test.describe('reference section navigation', () => {
  test('navigates from the topics index into the populated starter group', async ({ page }) => {
    await page.goto('/topics')

    await page.locator('a[href="/topics/thinking"]').first().click()

    await expect(page).toHaveURL(/\/topics\/thinking$/)
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator(e2eHookSelectors.directoryItem).first()).toBeVisible()
  })

  test('navigates from the concepts index to the starter concept page', async ({ page }) => {
    await page.goto('/concepts')

    await page.locator('a[href="/concepts/content-contract"]').first().click()

    await expect(page).toHaveURL(/\/concepts\/content-contract$/)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('navigates from the glossary index to the starter glossary term', async ({ page }) => {
    await page.goto('/glossary')

    await page.locator('a[href="/glossary/section-manifest"]').first().click()

    await expect(page).toHaveURL(/\/glossary\/section-manifest$/)
    await expect(page.locator('h1').first()).toBeVisible()
  })
})
