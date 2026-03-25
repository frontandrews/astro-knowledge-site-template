import { expect, test } from '@playwright/test'

test('runs the starter challenge and reveals the solution', async ({ page }) => {
  await page.goto('/challenges/build-a-localized-section-url')

  await page.locator('.cm-content').waitFor()
  await page.waitForTimeout(750)
  await page.getByRole('button', { name: 'Executar' }).click()

  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem('challenge-solved-build-a-localized-section-url')))
    .toBe('1')
  await expect(page.getByText('Todos passando')).toBeVisible()

  const viewSolutionButton = page.getByRole('button', { name: 'View solution' })
  await viewSolutionButton.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  await viewSolutionButton.click()
  await page.getByRole('button', { name: 'View anyway' }).click()

  await expect(page.getByRole('heading', { name: 'Goal' })).toBeVisible()
})
