import { getTopicGroupRouteSegment } from '@template/content'

import {
  ARTICLE_DIRECTORY_PAGE_SIZE,
  TOPIC_GROUP_DIRECTORY_PAGE_SIZE,
  TOPIC_INDEX_PAGE_SIZE,
  getPaginatedPathNumbers,
} from '@/lib/directory'
import { getArticleSectionSegment } from '@/lib/article-registry'
import { getDefaultLocale, getNonDefaultLocales } from '@/lib/locale-config'
import { getPageTypeRouteSegment } from '@/lib/section-manifest'
import { getActiveArticlesByLocale } from '@/lib/site-content'
import { getAvailableTopicGroups, getTopicGroupArticles } from '@/lib/topic-taxonomy'

type PaginatedIndexPageType = 'articles' | 'topics'

type PaginatedIndexProps = {
  locale: string
  page: number
  pageType: PaginatedIndexPageType
}

type PaginatedTopicGroupProps = {
  groupId: string
  locale: string
  page: number
  pageType: 'topics'
}

type StaticPath<Props> = {
  params: Record<string, string>
  props: Props
}

async function getPaginatedIndexPathsForLocale(locale: string, includeLocaleParam: boolean) {
  const activeArticles = await getActiveArticlesByLocale(locale)
  const articleSection = getArticleSectionSegment(locale)
  const topicSection = getPageTypeRouteSegment('topics', locale)

  const articlePaths = getPaginatedPathNumbers(activeArticles.length, ARTICLE_DIRECTORY_PAGE_SIZE).map<
    StaticPath<PaginatedIndexProps>
  >((page) => ({
    params: {
      ...(includeLocaleParam ? { locale } : {}),
      page: String(page),
      section: articleSection,
    },
    props: {
      locale,
      page,
      pageType: 'articles',
    },
  }))

  if (!topicSection) {
    return articlePaths
  }

  const groupItems = getAvailableTopicGroups(activeArticles, locale)
  const topicPaths = getPaginatedPathNumbers(groupItems.length, TOPIC_INDEX_PAGE_SIZE).map<
    StaticPath<PaginatedIndexProps>
  >((page) => ({
    params: {
      ...(includeLocaleParam ? { locale } : {}),
      page: String(page),
      section: topicSection,
    },
    props: {
      locale,
      page,
      pageType: 'topics',
    },
  }))

  return [...articlePaths, ...topicPaths]
}

async function getPaginatedTopicGroupPathsForLocale(locale: string, includeLocaleParam: boolean) {
  const activeArticles = await getActiveArticlesByLocale(locale)
  const topicSection = getPageTypeRouteSegment('topics', locale)

  if (!topicSection) {
    return []
  }

  return getAvailableTopicGroups(activeArticles, locale).flatMap<StaticPath<PaginatedTopicGroupProps>>((group) =>
    getPaginatedPathNumbers(
      getTopicGroupArticles(activeArticles, group.id, locale).length,
      TOPIC_GROUP_DIRECTORY_PAGE_SIZE,
    ).map((page) => ({
      params: {
        ...(includeLocaleParam ? { locale } : {}),
        page: String(page),
        section: topicSection,
        slug: getTopicGroupRouteSegment(group.id, locale),
      },
      props: {
        groupId: group.id,
        locale,
        page,
        pageType: 'topics',
      },
    })),
  )
}

export async function getDefaultPaginatedIndexPaths() {
  return getPaginatedIndexPathsForLocale(getDefaultLocale(), false)
}

export async function getLocalizedPaginatedIndexPaths() {
  const localizedPaths = await Promise.all(
    getNonDefaultLocales().map((locale) => getPaginatedIndexPathsForLocale(locale, true)),
  )

  return localizedPaths.flat()
}

export async function getDefaultPaginatedTopicGroupPaths() {
  return getPaginatedTopicGroupPathsForLocale(getDefaultLocale(), false)
}

export async function getLocalizedPaginatedTopicGroupPaths() {
  const localizedPaths = await Promise.all(
    getNonDefaultLocales().map((locale) => getPaginatedTopicGroupPathsForLocale(locale, true)),
  )

  return localizedPaths.flat()
}
