import type { CollectionEntry } from 'astro:content'

import { getCanonicalRouteLabel, getCanonicalRouteParamsKey } from '@/lib/route-segments'

type ArticleEntry = CollectionEntry<'articles'>

type StaticPathLike = {
  params: Record<string, string>
}

function buildStaticPathKey(params: Record<string, string>) {
  return getCanonicalRouteParamsKey(params)
}

function buildStaticPathLabel(params: Record<string, string>) {
  return getCanonicalRouteLabel(params)
}

export function assertUniqueStaticPaths<Path extends StaticPathLike>(
  paths: Path[],
  pathTypeLabel: string,
) {
  const seenPaths = new Map<string, string>()

  for (const path of paths) {
    const pathKey = buildStaticPathKey(path.params)
    const currentLabel = buildStaticPathLabel(path.params)
    const previousLabel = seenPaths.get(pathKey)

    if (previousLabel) {
      throw new Error(
        `[content-integrity] Duplicate ${pathTypeLabel} route detected for ${currentLabel}. ` +
          'Check duplicated slugs, locale collisions, or repeated section routes in the synced content.',
      )
    }

    seenPaths.set(pathKey, currentLabel)
  }

  return paths
}

export function resolveActiveRelatedArticles(
  articles: ArticleEntry[],
  locale: string,
  relatedArticleIds: string[],
) {
  const activeArticlesById = new Map(
    articles
      .filter((entry) => entry.data.locale === locale && entry.data.status === 'active')
      .map((entry) => [entry.data.articleId, entry] as const),
  )

  return [...new Set(relatedArticleIds)].flatMap((articleId) => {
    const article = activeArticlesById.get(articleId)
    return article ? [article] : []
  })
}
