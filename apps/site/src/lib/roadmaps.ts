import type { CollectionEntry } from 'astro:content'

import { getArticleReadingTimeMinutes } from '@/lib/article-meta'
import {
  getArticleEditorialContext as getArticleEditorialContextFromContent,
  resolveEditorialRoadmap as resolveEditorialRoadmapFromContent,
  resolveEditorialRoadmapBySlug as resolveEditorialRoadmapBySlugFromContent,
  resolveEditorialRoadmaps as resolveEditorialRoadmapsFromContent,
  type EditorialArticleContext as ContentEditorialArticleContext,
  type EditorialLocale,
  type ResolvedEditorialRoadmap as ContentResolvedEditorialRoadmap,
  type ResolvedRoadmapArticleNode,
  type ResolvedRoadmapConceptNode,
  type ResolvedRoadmapNode,
} from '@content/roadmaps/roadmaps'

export type RoadmapLevel = CollectionEntry<'articles'>['data']['level']

type ResolvedEditorialRoadmapLike = ContentResolvedEditorialRoadmap & Partial<{
  estimatedReadingMinutes: number
  level: string
  stepCount: number
}>

export type ResolvedEditorialRoadmap = ContentResolvedEditorialRoadmap & {
  estimatedReadingMinutes: number
  level: RoadmapLevel
  stepCount: number
}

export type EditorialArticleContext = Omit<ContentEditorialArticleContext, 'roadmap'> & {
  roadmap: ResolvedEditorialRoadmap
}

export {
  type EditorialLocale,
  type ResolvedRoadmapArticleNode,
  type ResolvedRoadmapConceptNode,
  type ResolvedRoadmapNode,
}

function isRenderableRoadmapArticleNode(node: ResolvedRoadmapArticleNode) {
  return node.post.data.status === 'active' && node.post.data.trackEligible
}

function sanitizeRoadmapNodes(nodes: ResolvedRoadmapNode[]) {
  return nodes.flatMap<ResolvedRoadmapNode>((node) => {
    if (node.kind === 'article') {
      return isRenderableRoadmapArticleNode(node) ? [node] : []
    }

    return [
      {
        ...node,
        relatedArticles: node.relatedArticles.filter(
          (article) => article.data.status === 'active' && article.data.trackEligible,
        ),
      },
    ]
  })
}

function normalizeRoadmapLevel(value: unknown): RoadmapLevel {
  return value === 'beginner' || value === 'advanced' || value === 'intermediate'
    ? value
    : 'intermediate'
}

function getRoadmapEstimatedReadingMinutes(articleNodes: ResolvedRoadmapArticleNode[]) {
  return articleNodes.reduce((sum, node) => sum + getArticleReadingTimeMinutes(node.post), 0)
}

function enhanceResolvedRoadmap(
  roadmap: ContentResolvedEditorialRoadmap | null,
): ResolvedEditorialRoadmap | null {
  if (!roadmap) {
    return null
  }

  const contentRoadmap = roadmap as ResolvedEditorialRoadmapLike
  const articleNodes = roadmap.articleNodes.filter(isRenderableRoadmapArticleNode)
  const nodes = sanitizeRoadmapNodes(roadmap.nodes)

  return {
    ...roadmap,
    articleNodes,
    estimatedReadingMinutes:
      typeof contentRoadmap.estimatedReadingMinutes === 'number' &&
      Number.isFinite(contentRoadmap.estimatedReadingMinutes)
        ? contentRoadmap.estimatedReadingMinutes
        : getRoadmapEstimatedReadingMinutes(articleNodes),
    level: normalizeRoadmapLevel(contentRoadmap.level),
    nodes,
    stepCount:
      typeof contentRoadmap.stepCount === 'number' &&
      Number.isFinite(contentRoadmap.stepCount) &&
      contentRoadmap.stepCount >= 0
        ? contentRoadmap.stepCount
        : articleNodes.length,
  }
}

export function resolveEditorialRoadmaps(
  locale: EditorialLocale,
  articles: CollectionEntry<'articles'>[],
): ResolvedEditorialRoadmap[] {
  return resolveEditorialRoadmapsFromContent(locale, articles)
    .map((roadmap) => enhanceResolvedRoadmap(roadmap))
    .filter((roadmap): roadmap is ResolvedEditorialRoadmap => Boolean(roadmap && roadmap.articleNodes.length > 0))
}

export function resolveEditorialRoadmap(
  locale: EditorialLocale,
  articles: CollectionEntry<'articles'>[],
  roadmapId?: string,
) {
  return enhanceResolvedRoadmap(resolveEditorialRoadmapFromContent(locale, articles, roadmapId))
}

export function resolveEditorialRoadmapBySlug(
  locale: EditorialLocale,
  articles: CollectionEntry<'articles'>[],
  slug: string,
) {
  return enhanceResolvedRoadmap(resolveEditorialRoadmapBySlugFromContent(locale, articles, slug))
}

export function getArticleEditorialContext(
  post: CollectionEntry<'articles'>,
  articles: CollectionEntry<'articles'>[],
): EditorialArticleContext | null {
  const context = getArticleEditorialContextFromContent(post, articles)

  if (!context) {
    return null
  }

  const roadmap = enhanceResolvedRoadmap(context.roadmap)

  if (!roadmap) {
    return null
  }

  return {
    ...context,
    roadmap,
  }
}

export function getPrimaryEditorialRoadmap(
  locale: EditorialLocale,
  articles: CollectionEntry<'articles'>[],
): ResolvedEditorialRoadmap | null {
  return resolveEditorialRoadmaps(locale, articles)[0] ?? null
}

export function getPrimaryEditorialRoadmapHref(
  locale: EditorialLocale,
  articles: CollectionEntry<'articles'>[],
) {
  return getPrimaryEditorialRoadmap(locale, articles)?.href ?? null
}
