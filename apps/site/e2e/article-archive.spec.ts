import { expect, test } from '@playwright/test'

test.describe('article archive pagination', () => {
  test('navigates to the second english archive page', async ({ page }) => {
    await page.goto('/articles')

    await expect(page.getByRole('link', { name: 'Next page' })).toBeVisible()
    await page.getByRole('link', { name: 'Next page' }).click()

    await expect(page).toHaveURL(/\/articles\/page\/2$/)
    await expect(page.getByText('Customize the template after the first clone').first()).toBeVisible()
  })

  test('navigates to the second portuguese archive page', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('site-template.locale-preference.v1', 'pt-br')
    })

    await page.goto('/pt-br/artigos')

    await expect(page.getByRole('link', { name: 'Próxima página' })).toBeVisible()
    await page.getByRole('link', { name: 'Próxima página' }).click()

    await expect(page).toHaveURL(/\/pt-br\/artigos\/page\/2$/)
    await expect(page.getByText('Personalize o template depois do primeiro clone').first()).toBeVisible()
  })
})
