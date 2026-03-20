import type { CollectionEntry } from 'astro:content'
import {
  getTopicAncestorIds,
  getTopicById,
  getTopicChildren,
  getTopicGroupLabel,
  getTopicGroupSummary,
  getTopicLabel,
  getTopicRootGroupId,
  getTopicSummary,
  TOPIC_GROUP_DEFINITIONS,
  TOPIC_DEFINITIONS,
} from '@seniorpath/content'

import { getSiteLocale, type SiteLocale } from '@/lib/site-copy'
import { getTopicGroupHref, getTopicHref, getTopicIndexHref } from '@/lib/topic-links'
import { sortGuides } from '@/lib/guide-tree'

type GuideEntry = CollectionEntry<'guides'>

export type TopicBreadcrumbItem = {
  href: string | null
  label: string
}

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

export function getGuideTopicIds(post: GuideEntry) {
  return [...new Set(post.data.topicIds.filter((topicId) => Boolean(getTopicById(topicId))))]
}

export function getLocalizedGuideTopics(post: GuideEntry) {
  const locale = getSiteLocale(post.data.locale)

  return getGuideTopicIds(post).map((topicId) => ({
    href: getTopicHref(topicId, locale),
    id: topicId,
    label: getLocalizedTopicLabel(topicId, locale),
  }))
}

export function getTopicBreadcrumb(topicId: string, locale: SiteLocale): TopicBreadcrumbItem[] {
  const groupId = getTopicRootGroupId(topicId)
  const ancestorIds = getTopicAncestorIds(topicId)

  return [
    {
      href: getTopicIndexHref(locale),
      label: locale === 'pt-br' ? 'Topicos' : 'Topics',
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
  return [
    {
      href: getTopicIndexHref(locale),
      label: locale === 'pt-br' ? 'Topicos' : 'Topics',
    },
    {
      href: null,
      label: getLocalizedTopicGroupLabel(groupId, locale),
    },
  ]
}

export function getTopicGuides(posts: GuideEntry[], topicId: string, locale: SiteLocale) {
  return sortGuides(
    posts.filter(
      (post) =>
        post.data.locale === locale && post.data.status !== 'archived' && getGuideTopicIds(post).includes(topicId),
    ),
  )
}

function hasGuidesInTopicTree(posts: GuideEntry[], parentId: string, locale: SiteLocale): boolean {
  if (TOPIC_DEFINITIONS.some((topic) => topic.id === parentId) && getTopicGuides(posts, parentId, locale).length > 0) {
    return true
  }

  return getTopicChildren(parentId).some((topic) => hasGuidesInTopicTree(posts, topic.id, locale))
}

export function getAvailableTopicGroups(posts: GuideEntry[], locale: SiteLocale) {
  return TOPIC_GROUP_DEFINITIONS.filter((group) => hasGuidesInTopicTree(posts, group.id, locale))
}

export function getAvailableChildTopics(posts: GuideEntry[], parentId: string, locale: SiteLocale) {
  return getTopicChildren(parentId).filter((topic) => hasGuidesInTopicTree(posts, topic.id, locale))
}
