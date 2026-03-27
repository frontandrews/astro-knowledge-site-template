import { expect, test } from '@playwright/test'
import { e2eHookSelectors } from './support/hooks'

test.describe('track progress and share flows', () => {
  test('shows a completed track state when the only article is already finished', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'site-template.completed-articles.v1',
        JSON.stringify(['customize-the-template-after-clone']),
      )
    })

    await page.goto('/tracks/first-clone-checklist')

    await expect(page.locator(e2eHookSelectors.trackProgressRoot)).toHaveClass(/is-complete/)
    await expect(page.locator(e2eHookSelectors.trackProgressValue)).toHaveText('100%')
  })

  test('renders concept nodes inline and exposes richer track preview metadata', async ({ page }) => {
    await page.goto('/tracks')

    const trackCard = page.getByRole('link', { name: 'First clone checklist' })

    await expect(trackCard).toBeVisible()
    await expect(trackCard).toContainText(/Beginner • 1 step • ~1 min/)

    await page.goto('/tracks/first-clone-checklist')

    await expect(page.locator(e2eHookSelectors.trackConcept)).toBeVisible()
    await expect(page.locator(e2eHookSelectors.trackConcept)).toContainText('Start with a safe first pass')
  })

  test('copies the article share link through the share panel', async ({ page }) => {
    await page.addInitScript(() => {
      let copiedText = ''

      Object.defineProperty(window, '__copiedText', {
        configurable: true,
        get: () => copiedText,
      })

      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            copiedText = value
          },
        },
      })
    })

    await page.goto('/articles/foundations/customize-the-template-after-the-first-clone')
    const shareCopyButton = page.locator(e2eHookSelectors.articleShareCopyButton)

    await expect(page.locator(e2eHookSelectors.articleShareReady)).toBeVisible()
    await expect(shareCopyButton).toBeVisible()
    await shareCopyButton.click()

    await expect(page.locator(e2eHookSelectors.articleShareFeedback)).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => (window as Window & { __copiedText?: string }).__copiedText ?? ''))
      .toContain('/articles/foundations/customize-the-template-after-the-first-clone')
  })
})
