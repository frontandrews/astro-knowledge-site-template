import { expect, test } from '@playwright/test'

test.describe('shell locale flows', () => {
  test.describe('browser locale redirect', () => {
    test.use({ locale: 'pt-BR' })

    test('redirects the home page when the browser prefers pt-br and there is no saved preference', async ({ page }) => {
      await page.addInitScript(() => {
        window.localStorage.removeItem('site-template.locale-preference.v1')
      })

      await page.goto('/')

      await expect(page).toHaveURL(/\/pt-br$/)
      await expect(
        page.getByRole('heading', { name: 'Explicando as coisas que as pessoas fingem entender' }),
      ).toBeVisible()
    })
  })

  test('switches locale from the desktop menu and persists the preference', async ({ page }) => {
    await page.goto('/articles')

    await page.locator('summary[aria-label="Language switcher"]').click()
    await page.getByRole('link', { name: 'Português' }).click()

    await expect(page).toHaveURL(/\/pt-br\/artigos$/)
    await expect(
      page.getByRole('heading', { name: 'Explicando as coisas que as pessoas fingem entender' }),
    ).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('site-template.locale-preference.v1')))
      .toBe('pt-br')
  })
})
