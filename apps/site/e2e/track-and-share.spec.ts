import { expect, test } from '@playwright/test'

test.describe('track progress and share flows', () => {
  test('shows a completed track state when the only article is already finished', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'site-template.completed-articles.v1',
        JSON.stringify(['customize-the-template-after-clone']),
      )
    })

    await page.goto('/tracks/first-clone-checklist')

    await expect(page.getByText('100%')).toBeVisible()
    await expect(page.getByText('Track progress: Track completed')).toBeVisible()
    await expect(page.getByRole('link', { name: /Review the track/ })).toBeVisible()
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
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(750)
    await page.getByRole('button', { name: 'Copy link' }).click()

    await expect(page.getByText('Link copied. You can paste it into any chat.')).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => (window as Window & { __copiedText?: string }).__copiedText ?? ''))
      .toContain('/articles/foundations/customize-the-template-after-the-first-clone')
  })
})
