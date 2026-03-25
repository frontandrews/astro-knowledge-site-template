import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'
import { TOPIC_GROUP_DEFINITIONS, getTopicGroupRouteSegment } from '@template/content'

import { getChallengeSlugFromEntry } from '@/lib/challenge-links'
import { getConceptSlugFromEntry } from '@/lib/concepts-links'
import { getDefaultLocale } from '@/lib/locale-config'
import { resolveEditorialRoadmaps, type ResolvedEditorialRoadmap } from '@/lib/roadmaps'
import {
  getEnabledSections,
  type SectionLocale,
  type SectionPageType,
  type SiteSection,
} from '@/lib/section-manifest'
import { getAvailableTopicsInGroup, getTopicGroupArticles } from '@/lib/topic-taxonomy'

type ArticleEntry = CollectionEntry<'articles'>
type ChallengeEntry = CollectionEntry<'challenges'>
type ConceptEntry = CollectionEntry<'concepts'>
type GlossaryEntry = CollectionEntry<'glossary'>

type DynamicIndexPageType = Exclude<SectionPageType, 'articles'>

type DynamicSectionIndexProps = {
  challenges?: ChallengeEntry[]
  concepts?: ConceptEntry[]
  locale: SectionLocale
  pageType: DynamicIndexPageType
  posts?: ArticleEntry[]
  roadmaps?: ResolvedEditorialRoadmap[]
  sectionId: string
  terms?: GlossaryEntry[]
}

type DynamicSectionDetailProps = {
  challenge?: ChallengeEntry
  concept?: ConceptEntry
  groupId?: string
  locale: SectionLocale
  pageType: DynamicIndexPageType
  posts?: ArticleEntry[]
  roadmap?: ResolvedEditorialRoadmap
  sectionId: string
  slug: string
  term?: GlossaryEntry
  topics?: ReturnType<typeof getAvailableTopicsInGroup>
}

type StaticPath<Props> = {
  params: Record<string, string>
  props: Props
}

const DYNAMIC_SECTION_PAGE_TYPES = new Set<DynamicIndexPageType>([
  'tracks',
  'topics',
  'concepts',
  'glossary',
  'challenges',
])

function isDynamicSection(section: SiteSection): section is SiteSection & { pageType: DynamicIndexPageType } {
  return section.pageType !== 'articles'
}

function getRoutableSections(locale: SectionLocale) {
  return getEnabledSections().filter(
    (section): section is SiteSection & { pageType: DynamicIndexPageType } =>
      isDynamicSection(section) &&
      DYNAMIC_SECTION_PAGE_TYPES.has(section.pageType) &&
      Boolean(section.routes[locale]),
  )
}

function getActiveArticles(posts: ArticleEntry[], locale: SectionLocale) {
  return posts.filter((post) => post.data.locale === locale && post.data.status === 'active')
}

function getActiveConcepts(concepts: ConceptEntry[], locale: SectionLocale) {
  return concepts.filter((concept) => concept.data.locale === locale && concept.data.status === 'active')
}

function getActiveGlossaryTerms(terms: GlossaryEntry[], locale: SectionLocale) {
  return terms.filter((term) => term.data.locale === locale && term.data.status === 'active')
}

function getActiveChallenges(challenges: ChallengeEntry[], locale: SectionLocale) {
  return challenges.filter(
    (challenge) => challenge.data.locale === locale && challenge.data.status === 'active',
  )
}

export async function getDynamicSectionIndexPaths(locale: SectionLocale) {
  const isDefaultLocale = locale === getDefaultLocale()
  const sections = getRoutableSections(locale)
  const articles = await getCollection('articles')
  const concepts = await getCollection('concepts')
  const glossary = await getCollection('glossary')
  const challenges = await getCollection('challenges')
  const activeArticles = getActiveArticles(articles, locale)
  const activeConcepts = getActiveConcepts(concepts, locale)
  const activeGlossary = getActiveGlossaryTerms(glossary, locale)
  const activeChallenges = getActiveChallenges(challenges, locale)

  return sections.map<StaticPath<DynamicSectionIndexProps>>((section) => {
    const props: DynamicSectionIndexProps = {
      locale,
      pageType: section.pageType,
      sectionId: section.id,
    }

    if (section.pageType === 'tracks') {
      props.roadmaps = resolveEditorialRoadmaps(locale === 'pt-br' ? 'pt-br' : 'en', articles)
    } else if (section.pageType === 'topics') {
      props.posts = activeArticles
    } else if (section.pageType === 'concepts') {
      props.concepts = activeConcepts
    } else if (section.pageType === 'glossary') {
      props.terms = activeGlossary
    } else if (section.pageType === 'challenges') {
      props.challenges = activeChallenges
    }

    return {
      params: {
        ...(isDefaultLocale ? {} : { locale }),
        section: section.routes[locale],
      },
      props,
    }
  })
}

export async function getDynamicSectionDetailPaths(locale: SectionLocale) {
  const isDefaultLocale = locale === getDefaultLocale()
  const sections = getRoutableSections(locale)
  const articles = await getCollection('articles')
  const concepts = await getCollection('concepts')
  const glossary = await getCollection('glossary')
  const challenges = await getCollection('challenges')
  const activeConcepts = getActiveConcepts(concepts, locale)
  const activeGlossary = getActiveGlossaryTerms(glossary, locale)
  const activeChallenges = getActiveChallenges(challenges, locale)

  return sections.flatMap<StaticPath<DynamicSectionDetailProps>>((section) => {
    if (section.pageType === 'tracks') {
      return resolveEditorialRoadmaps(locale === 'pt-br' ? 'pt-br' : 'en', articles).map((roadmap) => ({
        params: {
          ...(isDefaultLocale ? {} : { locale }),
          section: section.routes[locale],
          slug: roadmap.slug,
        },
        props: {
          locale,
          pageType: section.pageType,
          roadmap,
          sectionId: section.id,
          slug: roadmap.slug,
        },
      }))
    }

    if (section.pageType === 'topics') {
      return TOPIC_GROUP_DEFINITIONS.flatMap((group) => {
        const topics = getAvailableTopicsInGroup(articles, group.id, locale)
        const posts = getTopicGroupArticles(articles, group.id, locale)

        if (topics.length === 0 && posts.length === 0) {
          return []
        }

        const slug = getTopicGroupRouteSegment(group.id, locale)

        return [
          {
            params: {
              ...(isDefaultLocale ? {} : { locale }),
              section: section.routes[locale],
              slug,
            },
            props: {
              groupId: group.id,
              locale,
              pageType: section.pageType,
              posts,
              sectionId: section.id,
              slug,
              topics,
            },
          },
        ]
      })
    }

    if (section.pageType === 'concepts') {
      return activeConcepts.map((concept) => {
        const slug = getConceptSlugFromEntry(concept)

        return {
          params: {
            ...(isDefaultLocale ? {} : { locale }),
            section: section.routes[locale],
            slug,
          },
          props: {
            concept,
            locale,
            pageType: section.pageType,
            sectionId: section.id,
            slug,
          },
        }
      })
    }

    if (section.pageType === 'glossary') {
      return activeGlossary.map((term) => {
        const slug = term.id.split('/').slice(1).join('/')

        return {
          params: {
            ...(isDefaultLocale ? {} : { locale }),
            section: section.routes[locale],
            slug,
          },
          props: {
            locale,
            pageType: section.pageType,
            sectionId: section.id,
            slug,
            term,
          },
        }
      })
    }

    if (section.pageType === 'challenges') {
      return activeChallenges.map((challenge) => {
        const slug = getChallengeSlugFromEntry(challenge)

        return {
          params: {
            ...(isDefaultLocale ? {} : { locale }),
            section: section.routes[locale],
            slug,
          },
          props: {
            challenge,
            locale,
            pageType: section.pageType,
            sectionId: section.id,
            slug,
          },
        }
      })
    }

    return []
  })
}
