import type { CollectionEntry } from 'astro:content'
import {
  getTopicAncestorIds,
  getTopicById,
  getTopicChildren,
  getTopicRouteSegment,
  getTopicGroupLabel,
  getTopicGroupSummary,
  getTopicLabel,
  getTopicRootGroupId,
  getTopicSummary,
  TOPIC_GROUP_DEFINITIONS,
  TOPIC_DEFINITIONS,
} from '@template/content'

import { getSiteCopy, getSiteLocale, type SiteLocale } from '@/lib/site-copy'
import { getTopicGroupHref, getTopicHref, getTopicIndexHref } from '@/lib/topic-links'
import { sortArticles } from '@/lib/article-tree'

type ArticleEntry = CollectionEntry<'articles'>

export type TopicBreadcrumbItem = {
  href: string | null
  label: string
}

const TOPIC_EDITORIAL_ORDER = [
  'delivery',
  'security',
  'coding-interview',
  'javascript',
  'react',
  'data-storage',
  'accessibility',
  'system-design',
  'performance',
  'architecture-patterns',
  'ai-engineering',
  'debugging-production',
  'leadership',
  'node',
  'tech-english',
] as const

export function getLocalizedTopicLabel(topicId: string, locale: SiteLocale) {
  return getTopicLabel(topicId, locale)
}

export function getLocalizedTopicGroupLabel(groupId: string, locale: SiteLocale) {
  return getTopicGroupLabel(groupId, locale)
}

export function getLocalizedTopicSummary(topicId: string, locale: SiteLocale) {
  return getTopicSummary(topicId, locale)
}

export function getLocalizedTopicGroupSummary(groupId: string, locale: SiteLocale) {
  return getTopicGroupSummary(groupId, locale)
}

export function getArticleTopicIds(post: ArticleEntry) {
  return [...new Set(post.data.topicIds.filter((topicId) => Boolean(getTopicById(topicId))))]
}

function getTopicTreeIds(parentId: string): string[] {
  return getTopicChildren(parentId).flatMap((topic) => [topic.id, ...getTopicTreeIds(topic.id)])
}

export function getLocalizedArticleTopics(post: ArticleEntry) {
  const locale = getSiteLocale(post.data.locale)

  return getArticleTopicIds(post).map((topicId) => ({
    href: getTopicHref(topicId, locale),
    id: getTopicRouteSegment(topicId, locale),
    label: getLocalizedTopicLabel(topicId, locale),
  }))
}

export function getArticleTopicIdsInGroup(post: ArticleEntry, groupId: string) {
  return [
    ...new Set(
      getArticleTopicIds(post).flatMap((topicId) => {
        if (getTopicRootGroupId(topicId) !== groupId) {
          return []
        }

        return [...getTopicAncestorIds(topicId), topicId]
      }),
    ),
  ]
}

export function getLocalizedArticleTopicsInGroup(post: ArticleEntry, groupId: string, locale: SiteLocale) {
  return getArticleTopicIdsInGroup(post, groupId).map((topicId) => ({
    href: getTopicHref(topicId, locale),
    id: getTopicRouteSegment(topicId, locale),
    label: getLocalizedTopicLabel(topicId, locale),
  }))
}

export function getTopicBreadcrumb(topicId: string, locale: SiteLocale): TopicBreadcrumbItem[] {
  const groupId = getTopicRootGroupId(topicId)
  const ancestorIds = getTopicAncestorIds(topicId)
  const copy = getSiteCopy(locale)

  return [
    {
      href: getTopicIndexHref(locale),
      label: copy.layout.topics,
    },
    ...(groupId
      ? [
          {
            href: getTopicGroupHref(groupId, locale),
            label: getLocalizedTopicGroupLabel(groupId, locale),
          },
        ]
      : []),
    ...ancestorIds.map((ancestorId) => ({
      href: getTopicHref(ancestorId, locale),
      label: getLocalizedTopicLabel(ancestorId, locale),
    })),
    {
      href: null,
      label: getLocalizedTopicLabel(topicId, locale),
    },
  ]
}

export function getTopicGroupBreadcrumb(groupId: string, locale: SiteLocale): TopicBreadcrumbItem[] {
  const copy = getSiteCopy(locale)
  return [
    {
      href: getTopicIndexHref(locale),
      label: copy.layout.topics,
    },
    {
      href: null,
      label: getLocalizedTopicGroupLabel(groupId, locale),
    },
  ]
}

export function getTopicArticles(posts: ArticleEntry[], topicId: string, locale: SiteLocale) {
  return sortArticles(
    posts.filter(
      (post) => post.data.locale === locale && post.data.status !== 'archived' && getArticleTopicIds(post).includes(topicId),
    ),
  )
}

export function getTopicTreeArticles(posts: ArticleEntry[], topicId: string, locale: SiteLocale) {
  const topicIds = new Set([topicId, ...getTopicTreeIds(topicId)])

  return sortArticles(
    posts.filter(
      (post) =>
        post.data.locale === locale &&
        post.data.status !== 'archived' &&
        getArticleTopicIds(post).some((articleTopicId) => topicIds.has(articleTopicId)),
    ),
  )
}

export function getTopicGroupArticles(posts: ArticleEntry[], groupId: string, locale: SiteLocale) {
  const topicIds = new Set(getTopicTreeIds(groupId))

  return sortArticles(
    posts.filter(
      (post) =>
        post.data.locale === locale &&
        post.data.status !== 'archived' &&
        getArticleTopicIds(post).some((topicId) => topicIds.has(topicId)),
    ),
  )
}

function hasArticlesInTopicTree(posts: ArticleEntry[], parentId: string, locale: SiteLocale): boolean {
  if (TOPIC_DEFINITIONS.some((topic) => topic.id === parentId) && getTopicArticles(posts, parentId, locale).length > 0) {
    return true
  }

  return getTopicChildren(parentId).some((topic) => hasArticlesInTopicTree(posts, topic.id, locale))
}

export function getAvailableTopicGroups(posts: ArticleEntry[], locale: SiteLocale) {
  return TOPIC_GROUP_DEFINITIONS.filter((group) => hasArticlesInTopicTree(posts, group.id, locale))
}

export function getAvailableChildTopics(posts: ArticleEntry[], parentId: string, locale: SiteLocale) {
  return getTopicChildren(parentId).filter((topic) => hasArticlesInTopicTree(posts, topic.id, locale))
}

export function getAvailableTopicsInGroup(posts: ArticleEntry[], groupId: string, locale: SiteLocale) {
  return getTopicTreeIds(groupId)
    .map((topicId) => getTopicById(topicId))
    .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic))
    .filter((topic) => hasArticlesInTopicTree(posts, topic.id, locale))
}

export function getOrderedAvailableTopicFilters(posts: ArticleEntry[], locale: SiteLocale) {
  const availableTopicIds = new Set(
    posts
      .filter((post) => post.data.locale === locale && post.data.status !== 'archived')
      .flatMap((post) => getArticleTopicIds(post)),
  )

  const priorityIds = TOPIC_EDITORIAL_ORDER.filter((topicId) => availableTopicIds.has(topicId))
  const remainingIds = TOPIC_DEFINITIONS
    .filter((topic) => availableTopicIds.has(topic.id) && !priorityIds.includes(topic.id as (typeof TOPIC_EDITORIAL_ORDER)[number]))
    .sort((left, right) => getLocalizedTopicLabel(left.id, locale).localeCompare(getLocalizedTopicLabel(right.id, locale)))
    .map((topic) => topic.id)

  return [...priorityIds, ...remainingIds].map((topicId) => ({
    id: getTopicRouteSegment(topicId, locale),
    label: getLocalizedTopicLabel(topicId, locale),
  }))
}
