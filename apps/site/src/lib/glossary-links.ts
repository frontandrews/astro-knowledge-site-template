import { getLocalePath, normalizeSiteLocale } from '@/lib/locale-config'
import { getEntryLeafRouteSegment } from '@/lib/route-segments'
import { getPageTypeHref } from '@/lib/section-manifest'

type GlossaryEntryLike = {
  id: string
  data: {
    locale?: string | null
  }
}

export function getGlossaryIndexHref(locale = 'en') {
  return getPageTypeHref('glossary', locale) ?? getLocalePath(locale)
}

export function getGlossaryIndexPageHref(locale = 'en', page = 1) {
  const indexHref = getGlossaryIndexHref(locale)
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1

  return normalizedPage <= 1 ? indexHref : `${indexHref}/page/${normalizedPage}`
}

export function getGlossaryTagHref(locale = 'en', tagSlug: string) {
  return `${getGlossaryIndexHref(locale)}/tag/${encodeURIComponent(tagSlug)}`
}

export function getGlossaryTagPageHref(locale = 'en', tagSlug: string, page = 1) {
  const indexHref = getGlossaryTagHref(locale, tagSlug)
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1

  return normalizedPage <= 1 ? indexHref : `${indexHref}/page/${normalizedPage}`
}

export function getGlossaryHrefFromEntry(entry: GlossaryEntryLike) {
  const locale = normalizeSiteLocale(entry.data.locale)
  const slug = getEntryLeafRouteSegment(entry.id)

  return getPageTypeHref('glossary', locale, slug) ?? getGlossaryIndexHref(locale)
}
