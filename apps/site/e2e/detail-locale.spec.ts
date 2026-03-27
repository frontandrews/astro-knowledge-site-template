import { expect, test, type Page } from '@playwright/test'
import { getLocaleSwitcherLinkSelector, openLocaleSwitcher, switchLocale } from './support/locale'

async function switchLocaleToPortuguese(page: Page) {
  await switchLocale(page, 'pt-br')
}

test.describe('detail locale alternates', () => {
  test('switches an article detail page to the localized route', async ({ page }) => {
    await page.goto('/articles/foundations/customize-the-template-after-the-first-clone')

    await switchLocaleToPortuguese(page)

    await expect(page).toHaveURL(
      /\/pt-br\/artigos\/fundamentos\/personalize-o-template-depois-do-primeiro-clone$/,
    )
    await expect(page.locator('h1').first()).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('site-template.locale-preference.v1')))
      .toBe('pt-br')
  })

  test('switches a concept detail page to the localized route', async ({ page }) => {
    await page.goto('/concepts/content-contract')

    await switchLocaleToPortuguese(page)

    await expect(page).toHaveURL(/\/pt-br\/conceitos\/contrato-de-conteudo$/)
    await expect(page.locator('h1').first()).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('site-template.locale-preference.v1')))
      .toBe('pt-br')
  })

  test('switches a track detail page to the localized route', async ({ page }) => {
    await page.goto('/tracks/first-clone-checklist')

    await switchLocaleToPortuguese(page)

    await expect(page).toHaveURL(/\/pt-br\/trilhas\/checklist-do-primeiro-clone$/)
    await expect(page.locator('h1').first()).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('site-template.locale-preference.v1')))
      .toBe('pt-br')
  })

  test('hides locales that are unavailable for an asymmetric track detail page', async ({ page }) => {
    await page.goto('/pt-br/trilhas/trilha-apenas-pt-br-e2e')

    await openLocaleSwitcher(page)

    await expect(page.locator(getLocaleSwitcherLinkSelector('pt-br'))).toBeVisible()
    await expect(page.locator(getLocaleSwitcherLinkSelector('en'))).toHaveCount(0)
  })
})
