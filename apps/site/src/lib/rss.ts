import { getCollection } from 'astro:content'

import { getGuideHrefFromEntry } from '@/lib/guide-links'
import { getGuideRecencyDate } from '@/lib/guide-tree'
import type { SiteLocale } from '@/lib/site-copy'

type GuideFeedItem = {
  description: string
  link: string
  pubDate: Date
  title: string
}

export function getFeedMetadata(locale: SiteLocale) {
  if (locale === 'pt-br') {
    return {
      description: 'Artigos editoriais do SeniorPath em portugues, com explicacoes claras para pensar melhor antes de resolver.',
      title: 'SeniorPath PT-BR',
    }
  }

  return {
    description: 'SeniorPath editorial articles in English, with clear explanations for thinking better before you solve.',
    title: 'SeniorPath',
  }
}

export async function getGuideFeedItems(locale: SiteLocale): Promise<GuideFeedItem[]> {
  const guides = await getCollection('guides')

  return guides
    .filter((entry) => entry.data.locale === locale && entry.data.status !== 'archived')
    .sort((left, right) => getGuideRecencyDate(right).getTime() - getGuideRecencyDate(left).getTime())
    .map((entry) => ({
      description: entry.data.description,
      link: getGuideHrefFromEntry(entry),
      pubDate: getGuideRecencyDate(entry),
      title: entry.data.title,
    }))
}
