import type { Page } from '@playwright/test'
import { desktopLocaleMenuDomHooks } from '../../src/lib/dom-hooks'

export type LocaleCode = 'en' | 'pt-br'

export async function openLocaleSwitcher(page: Page) {
  await page.locator(desktopLocaleMenuDomHooks.trigger.selector).click()
}

export function getLocaleSwitcherLinkSelector(localeCode: LocaleCode) {
  return `${desktopLocaleMenuDomHooks.link.selector}[${desktopLocaleMenuDomHooks.link.attr}="${localeCode}"]`
}

export async function switchLocale(page: Page, localeCode: LocaleCode) {
  await openLocaleSwitcher(page)
  await page.locator(getLocaleSwitcherLinkSelector(localeCode)).click()
}
