import { getConceptDomainRouteSegment, getConceptGroupRouteSegment } from '@/lib/concept-taxonomy'
import { getLocalePath, normalizeSiteLocale } from '@/lib/locale-config'
import { getEntryLeafRouteSegment } from '@/lib/route-segments'
import { getPageTypeHref } from '@/lib/section-manifest'

type ConceptEntryLike = {
  id: string
  data: {
    domainId: string
    groupId: string
    locale?: string | null
  }
}

export function getConceptsHref(
  locale = 'en',
  domainSegment?: string | null,
  groupSegment?: string | null,
  slug?: string | null,
) {
  const baseHref = getPageTypeHref('concepts', locale) ?? getLocalePath(locale)

  if (!slug) {
    if (!domainSegment) {
      return baseHref
    }

    const params = new URLSearchParams({
      scope: groupSegment ? `${domainSegment}/${groupSegment}` : domainSegment,
    })

    return `${baseHref}?${params.toString()}`
  }

  return getPageTypeHref('concepts', locale, slug) ?? baseHref
}

export function getConceptsPageHref(locale = 'en', page = 1) {
  const indexHref = getConceptsHref(locale)
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1

  return normalizedPage <= 1 ? indexHref : `${indexHref}/page/${normalizedPage}`
}

export function getConceptsTagHref(locale = 'en', tagSlug: string) {
  return `${getConceptsHref(locale)}/tag/${encodeURIComponent(tagSlug)}`
}

export function getConceptsTagPageHref(locale = 'en', tagSlug: string, page = 1) {
  const indexHref = getConceptsTagHref(locale, tagSlug)
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1

  return normalizedPage <= 1 ? indexHref : `${indexHref}/page/${normalizedPage}`
}

export function getConceptSlugFromEntry(entry: ConceptEntryLike) {
  return getEntryLeafRouteSegment(entry.id)
}

export function getConceptHrefFromEntry(entry: ConceptEntryLike) {
  const locale = normalizeSiteLocale(entry.data.locale)
  const domainSegment = getConceptDomainRouteSegment(entry.data.domainId, locale)
  const groupSegment = getConceptGroupRouteSegment(entry.data.domainId, entry.data.groupId, locale)
  const slug = getConceptSlugFromEntry(entry)

  return getConceptsHref(locale, domainSegment, groupSegment, slug)
}
