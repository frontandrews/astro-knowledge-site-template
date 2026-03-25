import { getConceptDomainRouteSegment, getConceptGroupRouteSegment } from '@/lib/concept-taxonomy'
import { getLocalePath, normalizeSiteLocale } from '@/lib/locale-config'
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

  return `${baseHref}/${slug}`
}

export function getConceptSlugFromEntry(entry: ConceptEntryLike) {
  return entry.id.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean).at(-1) ?? ''
}

export function getConceptHrefFromEntry(entry: ConceptEntryLike) {
  const locale = normalizeSiteLocale(entry.data.locale)
  const domainSegment = getConceptDomainRouteSegment(entry.data.domainId, locale)
  const groupSegment = getConceptGroupRouteSegment(entry.data.domainId, entry.data.groupId, locale)
  const slug = getConceptSlugFromEntry(entry)

  return getConceptsHref(locale, domainSegment, groupSegment, slug)
}
