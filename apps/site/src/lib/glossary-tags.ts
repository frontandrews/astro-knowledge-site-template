import type { CollectionEntry } from 'astro:content'

import { translateSiteLabel } from '@/lib/site-labels'
import type { SiteLocale } from '@/lib/site-copy'

type GlossaryEntry = CollectionEntry<'glossary'>

export type GlossaryTagEntry = {
  id: string
  label: string
  slug: string
  termCount: number
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

export function getGlossaryTagEntries(terms: GlossaryEntry[], locale: SiteLocale): GlossaryTagEntry[] {
  const tagMap = new Map<string, Omit<GlossaryTagEntry, 'slug'>>()

  for (const term of terms) {
    for (const tagId of term.data.tags) {
      const existingTag = tagMap.get(tagId)

      if (existingTag) {
        existingTag.termCount += 1
        continue
      }

      tagMap.set(tagId, {
        id: tagId,
        label: translateSiteLabel(tagId, locale),
        termCount: 1,
      })
    }
  }

  const sortedTags = [...tagMap.values()].sort((left, right) =>
    left.label.localeCompare(right.label, locale, { sensitivity: 'base' }),
  )
  const baseSlugCounts = new Map<string, number>()

  for (const tag of sortedTags) {
    const baseSlug = slugifyLabel(tag.label)
    baseSlugCounts.set(baseSlug, (baseSlugCounts.get(baseSlug) ?? 0) + 1)
  }

  return sortedTags.map((tag) => {
    const baseSlug = slugifyLabel(tag.label)
    const slug = (baseSlugCounts.get(baseSlug) ?? 0) > 1
      ? `${baseSlug}-${slugifyLabel(tag.id)}`
      : baseSlug

    return {
      ...tag,
      slug,
    }
  })
}

export function getGlossaryTagEntryById(
  terms: GlossaryEntry[],
  locale: SiteLocale,
  tagId: string,
) {
  return getGlossaryTagEntries(terms, locale).find((tag) => tag.id === tagId) ?? null
}

export function getGlossaryTagEntryBySlug(
  terms: GlossaryEntry[],
  locale: SiteLocale,
  tagSlug: string,
) {
  return getGlossaryTagEntries(terms, locale).find((tag) => tag.slug === tagSlug) ?? null
}
