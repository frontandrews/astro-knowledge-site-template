import { getGuideRoutePathFromEntryId, getGuideSectionSegment, SUPPORTED_GUIDE_LOCALES } from '@prepdeck/content'

const SUPPORTED_GUIDE_LOCALE_SET = new Set<string>(SUPPORTED_GUIDE_LOCALES)

export function getGuideHrefFromEntryId(entryId: string) {
  return `/${getGuideRoutePathFromEntryId(entryId)}`
}

export function getGuideIndexHref(locale = 'en') {
  return `/${locale}/${getGuideSectionSegment(locale)}`
}

export function getGuideLocaleFromPathname(pathname: string) {
  const [, maybeLocale] = pathname.split('/')
  return maybeLocale && SUPPORTED_GUIDE_LOCALE_SET.has(maybeLocale) ? maybeLocale : 'en'
}

