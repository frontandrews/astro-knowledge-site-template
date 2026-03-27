import { getTopicGroupRouteSegment } from '@template/content'

import {
  ARTICLE_DIRECTORY_PAGE_SIZE,
  CARD_DIRECTORY_PAGE_SIZE,
  TOPIC_GROUP_DIRECTORY_PAGE_SIZE,
  TOPIC_INDEX_PAGE_SIZE,
  buildTopicDirectoryItems,
  getPaginatedPathNumbers,
} from '@/lib/directory'
import { getArticleSectionSegment } from '@/lib/article-registry'
import { getDefaultLocale, getNonDefaultLocales } from '@/lib/locale-config'
import { resolveEditorialRoadmaps, type EditorialLocale, type ResolvedEditorialRoadmap } from '@/lib/roadmaps'
import { getPageTypeRouteSegment } from '@/lib/section-manifest'
import {
  getActiveArticlesByLocale,
  getActiveChallengesByLocale,
  getActiveConceptsByLocale,
  getActiveGlossaryByLocale,
  getArticleCollection,
} from '@/lib/site-content'
import { getAvailableTopicGroups, getAvailableTopicsInGroup, getTopicGroupArticles, getTopicTreeArticles } from '@/lib/topic-taxonomy'
import type { CollectionEntry } from 'astro:content'
import { getTopicPathSegments } from '@template/content'

type ChallengeEntry = CollectionEntry<'challenges'>
type ConceptEntry = CollectionEntry<'concepts'>
type GlossaryEntry = CollectionEntry<'glossary'>
type PaginatedIndexPageType = 'articles' | 'tracks' | 'topics' | 'concepts' | 'glossary' | 'challenges'

type PaginatedIndexProps = {
  challenges?: ChallengeEntry[]
  concepts?: ConceptEntry[]
  locale: string
  page: number
  pageType: PaginatedIndexPageType
  roadmaps?: ResolvedEditorialRoadmap[]
  terms?: GlossaryEntry[]
}

type PaginatedTopicGroupProps = {
  groupId: string
  locale: string
  page: number
  pageType: 'topics'
  topicId?: string
}

type StaticPath<Props> = {
  params: Record<string, string>
  props: Props
}

async function getPaginatedIndexPathsForLocale(locale: string, includeLocaleParam: boolean) {
  const activeArticles = await getActiveArticlesByLocale(locale)
  const articleCollection = await getArticleCollection()
  const activeChallenges = await getActiveChallengesByLocale(locale)
  const activeConcepts = await getActiveConceptsByLocale(locale)
  const activeGlossary = await getActiveGlossaryByLocale(locale)
  const articleSection = getArticleSectionSegment(locale)
  const tracksSection = getPageTypeRouteSegment('tracks', locale)
  const topicSection = getPageTypeRouteSegment('topics', locale)
  const conceptsSection = getPageTypeRouteSegment('concepts', locale)
  const glossarySection = getPageTypeRouteSegment('glossary', locale)
  const challengesSection = getPageTypeRouteSegment('challenges', locale)
  const roadmaps = resolveEditorialRoadmaps(locale as EditorialLocale, articleCollection)

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

  const tracksPaths = !tracksSection
    ? []
    : getPaginatedPathNumbers(roadmaps.length, CARD_DIRECTORY_PAGE_SIZE).map<
        StaticPath<PaginatedIndexProps>
      >((page) => ({
        params: {
          ...(includeLocaleParam ? { locale } : {}),
          page: String(page),
          section: tracksSection,
        },
        props: {
          locale,
          page,
          pageType: 'tracks',
          roadmaps,
        },
      }))

  const topicPaths = !topicSection
    ? []
    : getPaginatedPathNumbers(buildTopicDirectoryItems(activeArticles, locale).length, TOPIC_INDEX_PAGE_SIZE).map<
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

  const conceptsPaths = !conceptsSection
    ? []
    : getPaginatedPathNumbers(activeConcepts.length, CARD_DIRECTORY_PAGE_SIZE).map<
        StaticPath<PaginatedIndexProps>
      >((page) => ({
        params: {
          ...(includeLocaleParam ? { locale } : {}),
          page: String(page),
          section: conceptsSection,
        },
        props: {
          concepts: activeConcepts,
          locale,
          page,
          pageType: 'concepts',
        },
      }))

  const glossaryPaths = !glossarySection
    ? []
    : getPaginatedPathNumbers(activeGlossary.length, CARD_DIRECTORY_PAGE_SIZE).map<
        StaticPath<PaginatedIndexProps>
      >((page) => ({
        params: {
          ...(includeLocaleParam ? { locale } : {}),
          page: String(page),
          section: glossarySection,
        },
        props: {
          locale,
          page,
          pageType: 'glossary',
          terms: activeGlossary,
        },
      }))

  const challengePaths = !challengesSection
    ? []
    : getPaginatedPathNumbers(activeChallenges.length, ARTICLE_DIRECTORY_PAGE_SIZE).map<
        StaticPath<PaginatedIndexProps>
      >((page) => ({
        params: {
          ...(includeLocaleParam ? { locale } : {}),
          page: String(page),
          section: challengesSection,
        },
        props: {
          challenges: activeChallenges,
          locale,
          page,
          pageType: 'challenges',
        },
      }))

  return [
    ...articlePaths,
    ...tracksPaths,
    ...topicPaths,
    ...conceptsPaths,
    ...glossaryPaths,
    ...challengePaths,
  ]
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

async function getPaginatedTopicDetailPathsForLocale(locale: string, includeLocaleParam: boolean) {
  const activeArticles = await getActiveArticlesByLocale(locale)
  const topicSection = getPageTypeRouteSegment('topics', locale)

  if (!topicSection) {
    return []
  }

  return getAvailableTopicGroups(activeArticles, locale).flatMap<StaticPath<PaginatedTopicGroupProps>>((group) =>
    getAvailableTopicsInGroup(activeArticles, group.id, locale).flatMap((topic) => {
      const [, ...topicSegments] = getTopicPathSegments(topic.id, locale)

      return getPaginatedPathNumbers(
        getTopicTreeArticles(activeArticles, topic.id, locale).length,
        TOPIC_GROUP_DIRECTORY_PAGE_SIZE,
      ).map((page) => ({
        params: {
          ...(includeLocaleParam ? { locale } : {}),
          group: getTopicGroupRouteSegment(group.id, locale),
          page: String(page),
          section: topicSection,
          topic: topicSegments.join('/'),
        },
        props: {
          groupId: group.id,
          locale,
          page,
          pageType: 'topics',
          topicId: topic.id,
        },
      }))
    }),
  )
}

export async function getDefaultPaginatedTopicDetailPaths() {
  return getPaginatedTopicDetailPathsForLocale(getDefaultLocale(), false)
}

export async function getLocalizedPaginatedTopicDetailPaths() {
  const localizedPaths = await Promise.all(
    getNonDefaultLocales().map((locale) => getPaginatedTopicDetailPathsForLocale(locale, true)),
  )

  return localizedPaths.flat()
}
