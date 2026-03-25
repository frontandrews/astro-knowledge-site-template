import type { CollectionEntry } from 'astro:content'
import { getTopicRootGroupId } from '@template/content'

import { getSiteCopy } from '@/lib/site-copy'

type ArticleEntry = CollectionEntry<'articles'>
type ArticleLevel = ArticleEntry['data']['level']
const WORDS_PER_MINUTE = 220

export function getArticleReadingTimeMinutes(post: ArticleEntry) {
  const normalized = (post.body ?? '')
    .replace(/`{3}[\s\S]*?`{3}/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
  const words = normalized.split(/\s+/).filter(Boolean).length

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

export function getArticleLevelLabel(level: ArticleLevel, locale?: string | null) {
  return getSiteCopy(locale).articleMeta.levelLabels[level]
}

export function getArticleCategoryLabel(post: ArticleEntry) {
  const copy = getSiteCopy(post.data.locale)
  const rootGroupId = getTopicRootGroupId(post.data.topicIds[0] ?? '')

  if (rootGroupId && copy.articleMeta.categoryLabels[rootGroupId]) {
    return copy.articleMeta.categoryLabels[rootGroupId]
  }

  return post.data.category
}

export function toHashtagLabel(value: string, locale?: string | null) {
  const normalizedLocale = getSiteCopy(locale).locale.lowerCaseLocale
  const normalizedValue = value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase(normalizedLocale)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalizedValue ? `#${normalizedValue}` : null
}
