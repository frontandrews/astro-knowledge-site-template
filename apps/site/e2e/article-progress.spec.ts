import { expect, test } from '@playwright/test'

function readCompletedArticleIds() {
  const storageKey = Object.keys(window.localStorage).find((key) => key.endsWith('.completed-articles.v1'))

  if (!storageKey) {
    return []
  }

  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? '[]')
  } catch {
    return []
  }
}

test('persists article completion and allows resetting it', async ({ page }) => {
  await page.goto('/articles/foundations/customize-the-template-after-the-first-clone')

  await page.evaluate(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'auto' })
  })

  await expect
    .poll(() => page.evaluate(readCompletedArticleIds))
    .toContain('customize-the-template-after-clone')

  await expect(page.getByRole('complementary').getByText('You finished this article')).toBeVisible()

  await page.reload()
  await expect(page.getByRole('complementary').getByText('You finished this article')).toBeVisible()

  await page.getByRole('complementary').getByRole('button', { name: 'Mark as unread' }).click()

  await expect
    .poll(() => page.evaluate(readCompletedArticleIds))
    .not.toContain('customize-the-template-after-clone')
})
