import type { CollectionEntry } from 'astro:content'
import { TOPIC_GROUP_DEFINITIONS, getTopicGroupRouteSegment } from '@template/content'

import { getChallengeSlugFromEntry } from '@/lib/challenge-links'
import { getConceptSlugFromEntry } from '@/lib/concepts-links'
import { getDefaultLocale } from '@/lib/locale-config'
import {
  resolveEditorialRoadmaps,
  type EditorialLocale,
  type ResolvedEditorialRoadmap,
} from '@/lib/roadmaps'
import {
  getEnabledSections,
  type SectionLocale,
  type SectionPageType,
  type SiteSection,
} from '@/lib/section-manifest'
import {
  getActiveArticlesByLocale,
  getActiveChallengesByLocale,
  getActiveConceptsByLocale,
  getActiveGlossaryByLocale,
  getArticleCollection,
} from '@/lib/site-content'
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

export async function getDynamicSectionIndexPaths(locale: SectionLocale) {
  const isDefaultLocale = locale === getDefaultLocale()
  const sections = getRoutableSections(locale)
  const articles = await getArticleCollection()
  const activeConcepts = await getActiveConceptsByLocale(locale)
  const activeGlossary = await getActiveGlossaryByLocale(locale)
  const activeChallenges = await getActiveChallengesByLocale(locale)

  return sections.map<StaticPath<DynamicSectionIndexProps>>((section) => {
    const props: DynamicSectionIndexProps = {
      locale,
      pageType: section.pageType,
      sectionId: section.id,
    }

    if (section.pageType === 'tracks') {
      props.roadmaps = resolveEditorialRoadmaps(locale as EditorialLocale, articles)
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
  const articles = await getArticleCollection()
  const activeArticles = await getActiveArticlesByLocale(locale)
  const activeConcepts = await getActiveConceptsByLocale(locale)
  const activeGlossary = await getActiveGlossaryByLocale(locale)
  const activeChallenges = await getActiveChallengesByLocale(locale)

  return sections.flatMap<StaticPath<DynamicSectionDetailProps>>((section) => {
    if (section.pageType === 'tracks') {
      return resolveEditorialRoadmaps(locale as EditorialLocale, articles).map((roadmap) => ({
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
        const topics = getAvailableTopicsInGroup(activeArticles, group.id, locale)
        const posts = getTopicGroupArticles(activeArticles, group.id, locale)

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
              sectionId: section.id,
              slug,
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
