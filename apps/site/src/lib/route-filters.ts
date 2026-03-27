import type { SiteLocale } from '@/lib/site-copy'

export type RouteFilterDefinition = {
  id: string
  label: string
}

export type RouteFilterEntry = RouteFilterDefinition & {
  slug: string
}

function slugifyLabel(value: string) {
  const normalizedValue = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalizedValue || 'tag'
}

export function getRouteFilterEntries(
  filters: RouteFilterDefinition[],
  locale: SiteLocale,
): RouteFilterEntry[] {
  const sortedFilters = [...filters].sort((left, right) =>
    left.label.localeCompare(right.label, locale, { sensitivity: 'base' }),
  )
  const baseSlugCounts = new Map<string, number>()

  for (const filter of sortedFilters) {
    const baseSlug = slugifyLabel(filter.label)
    baseSlugCounts.set(baseSlug, (baseSlugCounts.get(baseSlug) ?? 0) + 1)
  }

  return sortedFilters.map((filter) => {
    const baseSlug = slugifyLabel(filter.label)
    const slug = (baseSlugCounts.get(baseSlug) ?? 0) > 1
      ? `${baseSlug}-${slugifyLabel(filter.id)}`
      : baseSlug

    return {
      ...filter,
      slug,
    }
  })
}

export function getRouteFilterEntryById(
  filters: RouteFilterDefinition[],
  locale: SiteLocale,
  filterId: string,
) {
  return getRouteFilterEntries(filters, locale).find((filter) => filter.id === filterId) ?? null
}

export function getRouteFilterEntryBySlug(
  filters: RouteFilterDefinition[],
  locale: SiteLocale,
  filterSlug: string,
) {
  return getRouteFilterEntries(filters, locale).find((filter) => filter.slug === filterSlug) ?? null
}
