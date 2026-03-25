import { brandConfig } from '@/brand/brand.config'
import { getDefaultLocale, getLocalizedValue, getNonDefaultLocales, normalizeSiteLocale } from '@/lib/locale-config'

export type LegalPageId = 'privacy' | 'terms'

const LEGAL_PAGE_IDS: LegalPageId[] = ['privacy', 'terms']

export function getLegalPageSlug(pageId: LegalPageId, locale?: string | null) {
  const normalizedLocale = normalizeSiteLocale(locale)

  return getLocalizedValue(brandConfig.legal.routes[pageId], normalizedLocale)
}

export function getLegalPageIdBySlug(slug: string, locale?: string | null) {
  const normalizedLocale = normalizeSiteLocale(locale)

  return (
    LEGAL_PAGE_IDS.find((pageId) => getLegalPageSlug(pageId, normalizedLocale) === slug)
    ?? null
  )
}

export function getDefaultLegalPagePaths() {
  return LEGAL_PAGE_IDS.map((pageId) => ({
    params: {
      legal: getLegalPageSlug(pageId, getDefaultLocale()),
    },
    props: {
      locale: getDefaultLocale(),
      pageId,
    },
  }))
}

export function getLocalizedLegalPagePaths() {
  return getNonDefaultLocales().flatMap((locale) =>
    LEGAL_PAGE_IDS.map((pageId) => ({
      params: {
        legal: getLegalPageSlug(pageId, locale),
        locale,
      },
      props: {
        locale,
        pageId,
      },
    })),
  )
}
