import type { CollectionEntry } from 'astro:content'

import {
  getArticleEditorialContext,
  getEditorialRoadmapById,
  getEditorialRoadmapBySlug,
  resolveEditorialRoadmaps,
  type EditorialArticleContext,
  type EditorialLocale,
  type ResolvedEditorialRoadmap,
  type ResolvedRoadmapArticleNode,
} from '@content/roadmaps/roadmaps'

type RoadmapPosition = {
  x: number
  y: number
}

export type RoadmapArticleNode = {
  articleId: string
  id: string
  kind: 'article'
  position: RoadmapPosition
}

export type RoadmapConceptNode = {
  id: string
  kind: 'concept'
  panelBody: Record<EditorialLocale, string>
  position: RoadmapPosition
  relatedArticleIds: string[]
  summary: Record<EditorialLocale, string>
  title: Record<EditorialLocale, string>
}

export type RoadmapNode = RoadmapArticleNode | RoadmapConceptNode

export type EditorialRoadmap = {
  id: string
  intro: Record<EditorialLocale, string>
  label: Record<EditorialLocale, string>
  locales?: EditorialLocale[]
  nodes: RoadmapNode[]
  slug: Record<EditorialLocale, string>
  summary: Record<EditorialLocale, string>
  tags: Array<{
    id: string
    label: Record<EditorialLocale, string>
  }>
  title: Record<EditorialLocale, string>
}

export type ResolvedRoadmapConceptNode = {
  id: string
  kind: 'concept'
  panelBody: string
  position: RoadmapPosition
  relatedArticles: CollectionEntry<'articles'>[]
  summary: string
  title: string
}

export type ResolvedRoadmapNode = ResolvedRoadmapArticleNode | ResolvedRoadmapConceptNode

export {
  getArticleEditorialContext,
  resolveEditorialRoadmaps,
  type EditorialArticleContext,
  type EditorialLocale,
  type ResolvedEditorialRoadmap,
  type ResolvedRoadmapArticleNode,
}

export function resolveEditorialRoadmap(
  locale: EditorialLocale,
  articles: CollectionEntry<'articles'>[],
  roadmapId: string,
) {
  return getEditorialRoadmapById(locale, articles, roadmapId)
}

export function resolveEditorialRoadmapBySlug(
  locale: EditorialLocale,
  articles: CollectionEntry<'articles'>[],
  slug: string,
) {
  return getEditorialRoadmapBySlug(locale, articles, slug)
}

export function getPrimaryEditorialRoadmap(
  locale: EditorialLocale,
  articles: CollectionEntry<'articles'>[],
) {
  return resolveEditorialRoadmaps(locale, articles)[0] ?? null
}

export function getPrimaryEditorialRoadmapHref(
  locale: EditorialLocale,
  articles: CollectionEntry<'articles'>[],
) {
  return getPrimaryEditorialRoadmap(locale, articles)?.href ?? null
}
