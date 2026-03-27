import type { CollectionEntry } from 'astro:content'

import { getArticleHrefFromEntry } from '@/lib/article-links'
import { getChallengeHrefFromEntry } from '@/lib/challenge-links'
import { getConceptHrefFromEntry } from '@/lib/concepts-links'
import { formatEditorialDate } from '@/lib/format-date'
import { getGlossaryHrefFromEntry } from '@/lib/glossary-links'
import { getSiteCopy, getSiteDateLocale, type SiteLocale } from '@/lib/site-copy'

type RecentUpdatePageType = 'articles' | 'challenges' | 'concepts' | 'glossary'

type RecentUpdateEntryMap = {
  articles: CollectionEntry<'articles'>
  challenges: CollectionEntry<'challenges'>
  concepts: CollectionEntry<'concepts'>
  glossary: CollectionEntry<'glossary'>
}

export type RecentUpdateCandidate = {
  description: string
  href: string
  pageType: RecentUpdatePageType
  publishedAt: Date
  title: string
  updatedAt: Date | null
}

export type RecentUpdateItem = {
  description: string
  href: string
  meta: string
  title: string
}

export const RECENT_UPDATES_PREVIEW_SIZE = 3

function hasExplicitUpdate(candidate: Pick<RecentUpdateCandidate, 'publishedAt' | 'updatedAt'>) {
  return Boolean(candidate.updatedAt && candidate.updatedAt.getTime() > candidate.publishedAt.getTime())
}

function getRecentUpdateDate(candidate: Pick<RecentUpdateCandidate, 'publishedAt' | 'updatedAt'>) {
  return hasExplicitUpdate(candidate) ? (candidate.updatedAt as Date) : candidate.publishedAt
}

export function prioritizeRecentUpdateCandidates(
  candidates: RecentUpdateCandidate[],
  limit = RECENT_UPDATES_PREVIEW_SIZE,
) {
  const normalizedLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : RECENT_UPDATES_PREVIEW_SIZE

  return [...candidates]
    .sort((left, right) => {
      const explicitUpdateDelta = Number(hasExplicitUpdate(right)) - Number(hasExplicitUpdate(left))

      if (explicitUpdateDelta !== 0) {
        return explicitUpdateDelta
      }

      const recencyDelta = getRecentUpdateDate(right).getTime() - getRecentUpdateDate(left).getTime()

      if (recencyDelta !== 0) {
        return recencyDelta
      }

      const publishedDelta = right.publishedAt.getTime() - left.publishedAt.getTime()

      if (publishedDelta !== 0) {
        return publishedDelta
      }

      return left.title.localeCompare(right.title)
    })
    .slice(0, normalizedLimit)
}

function createRecentUpdateCandidate<PageType extends RecentUpdatePageType>(
  pageType: PageType,
  entry: RecentUpdateEntryMap[PageType],
) {
  const href =
    pageType === 'articles'
      ? getArticleHrefFromEntry(entry as RecentUpdateEntryMap['articles'])
      : pageType === 'challenges'
        ? getChallengeHrefFromEntry(entry as RecentUpdateEntryMap['challenges'])
        : pageType === 'concepts'
          ? getConceptHrefFromEntry(entry as RecentUpdateEntryMap['concepts'])
          : getGlossaryHrefFromEntry(entry as RecentUpdateEntryMap['glossary'])

  return {
    description: entry.data.summary,
    href,
    pageType,
    publishedAt: entry.data.pubDate,
    title: entry.data.title,
    updatedAt:
      entry.data.updatedDate && entry.data.updatedDate.getTime() > entry.data.pubDate.getTime()
        ? entry.data.updatedDate
        : null,
  } satisfies RecentUpdateCandidate
}

function formatRecentUpdateMeta(candidate: RecentUpdateCandidate, locale: SiteLocale) {
  const copy = getSiteCopy(locale)
  const dateLocale = getSiteDateLocale(locale)
  const freshnessDate = getRecentUpdateDate(candidate)

  return `${copy.article.updatedPrefix}${formatEditorialDate(freshnessDate, dateLocale)}`
}

export async function resolveRecentUpdateItems(
  locale: SiteLocale,
  limit = RECENT_UPDATES_PREVIEW_SIZE,
): Promise<RecentUpdateItem[]> {
  const {
    getActiveArticlesByLocale,
    getActiveChallengesByLocale,
    getActiveConceptsByLocale,
    getActiveGlossaryByLocale,
  } = await import('@/lib/site-content')

  const [articles, challenges, concepts, glossary] = await Promise.all([
    getActiveArticlesByLocale(locale),
    getActiveChallengesByLocale(locale),
    getActiveConceptsByLocale(locale),
    getActiveGlossaryByLocale(locale),
  ])

  const candidates = [
    ...articles.map((entry) => createRecentUpdateCandidate('articles', entry)),
    ...challenges.map((entry) => createRecentUpdateCandidate('challenges', entry)),
    ...concepts.map((entry) => createRecentUpdateCandidate('concepts', entry)),
    ...glossary.map((entry) => createRecentUpdateCandidate('glossary', entry)),
  ]

  return prioritizeRecentUpdateCandidates(candidates, limit).map((candidate) => ({
    description: candidate.description,
    href: candidate.href,
    meta: formatRecentUpdateMeta(candidate, locale),
    title: candidate.title,
  }))
}
