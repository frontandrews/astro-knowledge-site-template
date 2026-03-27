import { expect, test } from '@playwright/test'

import { e2eHookSelectors } from './support/hooks'

const legalCases = [
  {
    checklistHeading: 'Publication checklist',
    operationalHeading: 'Operational privacy status',
    path: '/privacy',
    preferredLocale: 'en',
    title: 'Privacy Policy',
  },
  {
    checklistHeading: 'Publication checklist',
    operationalHeading: 'Operational privacy status',
    path: '/terms-and-services',
    preferredLocale: 'en',
    title: 'Terms of Service',
  },
  {
    checklistHeading: 'Checklist de publicacao',
    operationalHeading: 'Estado operacional de privacidade',
    path: '/pt-br/politica-de-privacidade',
    preferredLocale: 'pt-br',
    title: 'Politica de Privacidade',
  },
  {
    checklistHeading: 'Checklist de publicacao',
    operationalHeading: 'Estado operacional de privacidade',
    path: '/pt-br/termos-e-servicos',
    preferredLocale: 'pt-br',
    title: 'Termos de Uso',
  },
] as const

test.describe('legal pages', () => {
  for (const legalCase of legalCases) {
    test(`renders publication guidance for ${legalCase.path}`, async ({ page }) => {
      await page.addInitScript((preferredLocale) => {
        window.localStorage.setItem('site-template.locale-preference.v1', preferredLocale)
      }, legalCase.preferredLocale)

      await page.goto(legalCase.path)

      await expect(page.getByRole('heading', { name: legalCase.title })).toBeVisible()
      await expect(page.locator(e2eHookSelectors.legalPublicationChecklist)).toBeVisible()
      await expect(page.locator(e2eHookSelectors.legalOperationalReview)).toBeVisible()
      await expect(page.getByRole('heading', { name: legalCase.checklistHeading })).toBeVisible()
      await expect(page.getByRole('heading', { name: legalCase.operationalHeading })).toBeVisible()
      await expect(
        page.locator(`${e2eHookSelectors.legalPublicationChecklist} li`),
      ).toHaveCount(4)
      await expect(
        page.locator(`${e2eHookSelectors.legalOperationalReview} li`).first(),
      ).toBeVisible()
    })
  }
})
