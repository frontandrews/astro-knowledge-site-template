import { expect, test, type Page } from '@playwright/test'

async function switchLocaleToPortuguese(page: Page) {
  await page.locator('summary[aria-label="Language switcher"]').click()
  await page.getByRole('link', { name: 'Português' }).click()
}

test.describe('detail locale alternates', () => {
  test('switches an article detail page to the localized route', async ({ page }) => {
    await page.goto('/articles/foundations/customize-the-template-after-the-first-clone')

    await switchLocaleToPortuguese(page)

    await expect(page).toHaveURL(
      /\/pt-br\/artigos\/fundamentos\/personalize-o-template-depois-do-primeiro-clone$/,
    )
    await expect(page.getByRole('heading', { name: 'Personalize o template depois do primeiro clone' })).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('site-template.locale-preference.v1')))
      .toBe('pt-br')
  })

  test('switches a concept detail page to the localized route', async ({ page }) => {
    await page.goto('/concepts/content-contract')

    await switchLocaleToPortuguese(page)

    await expect(page).toHaveURL(/\/pt-br\/conceitos\/contrato-de-conteudo$/)
    await expect(page.getByRole('heading', { name: 'Contrato de conteudo' })).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('site-template.locale-preference.v1')))
      .toBe('pt-br')
  })

  test('switches a track detail page to the localized route', async ({ page }) => {
    await page.goto('/tracks/first-clone-checklist')

    await switchLocaleToPortuguese(page)

    await expect(page).toHaveURL(/\/pt-br\/trilhas\/checklist-do-primeiro-clone$/)
    await expect(page.getByRole('heading', { name: 'Checklist do primeiro clone' })).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('site-template.locale-preference.v1')))
      .toBe('pt-br')
  })
})
