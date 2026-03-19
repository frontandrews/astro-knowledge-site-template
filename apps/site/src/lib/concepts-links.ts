import { getConceptDomainRouteSegment, getConceptGroupRouteSegment } from '@/lib/concept-taxonomy'

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
  const baseHref = locale === 'pt-br' ? '/pt-br/conceitos' : '/concepts'

  if (!domainSegment) {
    return baseHref
  }

  if (!groupSegment) {
    return `${baseHref}/${domainSegment}`
  }

  if (!slug) {
    return `${baseHref}/${domainSegment}/${groupSegment}`
  }

  return `${baseHref}/${domainSegment}/${groupSegment}/${slug}`
}

export function getConceptSlugFromEntry(entry: ConceptEntryLike) {
  return entry.id.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean).at(-1) ?? ''
}

export function getConceptHrefFromEntry(entry: ConceptEntryLike) {
  const locale = entry.data.locale === 'pt-br' ? 'pt-br' : 'en'
  const domainSegment = getConceptDomainRouteSegment(entry.data.domainId, locale)
  const groupSegment = getConceptGroupRouteSegment(entry.data.domainId, entry.data.groupId, locale)
  const slug = getConceptSlugFromEntry(entry)

  return getConceptsHref(locale, domainSegment, groupSegment, slug)
}
