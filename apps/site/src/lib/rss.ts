import { getCollection } from 'astro:content'

import { getArticleHrefFromEntry } from '@/lib/article-links'
import { getArticleRecencyDate } from '@/lib/article-tree'
import type { SiteLocale } from '@/lib/site-copy'

type ArticleFeedItem = {
  description: string
  link: string
  pubDate: Date
  title: string
}

export async function getArticleFeedItems(locale: SiteLocale): Promise<ArticleFeedItem[]> {
  const articles = await getCollection('articles')

  return articles
    .filter((entry) => entry.data.locale === locale && entry.data.status !== 'archived')
    .sort((left, right) => getArticleRecencyDate(right).getTime() - getArticleRecencyDate(left).getTime())
    .map((entry) => ({
      description: entry.data.description,
      link: getArticleHrefFromEntry(entry),
      pubDate: getArticleRecencyDate(entry),
      title: entry.data.title,
    }))
}
