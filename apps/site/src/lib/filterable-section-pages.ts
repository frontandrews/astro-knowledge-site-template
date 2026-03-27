import type { CollectionEntry } from 'astro:content'

import { getChallengeLevelLabel, sortChallenges } from '@/lib/challenge-meta'
import { assertUniqueStaticPaths } from '@/lib/content-integrity'
import {
  ARTICLE_DIRECTORY_PAGE_SIZE,
  CARD_DIRECTORY_PAGE_SIZE,
  getPaginatedPathNumbers,
} from '@/lib/directory'
import { getDefaultLocale, getNonDefaultLocales } from '@/lib/locale-config'
import {
  CONCEPT_DOMAINS,
  getAvailableConceptGroups,
  getConceptDomainRouteSegment,
  getConceptGroupRouteSegment,
  getLocalizedConceptDomainLabel,
  getLocalizedConceptGroupLabel,
} from '@/lib/concept-taxonomy'
import { resolveEditorialRoadmaps, type EditorialLocale, type ResolvedEditorialRoadmap } from '@/lib/roadmaps'
import { getGlossaryTagEntries } from '@/lib/glossary-tags'
import { getRouteFilterEntries, type RouteFilterDefinition, type RouteFilterEntry } from '@/lib/route-filters'
import { getPageTypeRouteSegment } from '@/lib/section-manifest'
import {
  getActiveChallengesByLocale,
  getActiveConceptsByLocale,
  getActiveGlossaryByLocale,
  getArticleCollection,
} from '@/lib/site-content'
import type { SiteLocale } from '@/lib/site-copy'

type ChallengeEntry = CollectionEntry<'challenges'>
type ConceptEntry = CollectionEntry<'concepts'>
type GlossaryEntry = CollectionEntry<'glossary'>

export type FilterableSectionPageType = 'tracks' | 'concepts' | 'glossary' | 'challenges'

type FilterableSectionSharedProps = {
  challenges?: ChallengeEntry[]
  concepts?: ConceptEntry[]
  locale: string
  pageType: FilterableSectionPageType
  roadmaps?: ResolvedEditorialRoadmap[]
  selectedFilterId: string
  terms?: GlossaryEntry[]
}

type FilterableSectionPaginatedProps = FilterableSectionSharedProps & {
  page: number
}

type StaticPath<Props> = {
  params: Record<string, string>
  props: Props
}

type LoadedSectionData = {
  filterCounts: Map<string, number>
  filters: RouteFilterEntry[]
  props: Omit<FilterableSectionSharedProps, 'selectedFilterId'>
}

const FILTERABLE_PAGE_TYPES: FilterableSectionPageType[] = ['tracks', 'concepts', 'glossary', 'challenges']

function getFilterPageSize(pageType: FilterableSectionPageType) {
  return pageType === 'challenges' ? ARTICLE_DIRECTORY_PAGE_SIZE : CARD_DIRECTORY_PAGE_SIZE
}

function buildTrackFilters(roadmaps: ResolvedEditorialRoadmap[], locale: SiteLocale) {
  const filters = Array.from(
    new Map(
      roadmaps.flatMap((roadmap) => roadmap.tags.map((tag) => [tag.id, tag.label] as const)),
    ).entries(),
  ).map(([id, label]) => ({ id, label }))
  const filterCounts = new Map(
    filters.map(({ id }) => [
      id,
      roadmaps.filter((roadmap) => roadmap.tags.some((tag) => tag.id === id)).length,
    ]),
  )

  return {
    filterCounts,
    filters: getRouteFilterEntries(filters, locale),
  }
}

function buildConceptFilters(concepts: ConceptEntry[], locale: SiteLocale) {
  const filterCounts = new Map<string, number>()
  const availableDomains = CONCEPT_DOMAINS.filter((domain) =>
    concepts.some((concept) => concept.data.domainId === domain.id),
  )
  const filters: RouteFilterDefinition[] = availableDomains.flatMap((domain) => {
    const domainSegment = getConceptDomainRouteSegment(domain.id, locale)
    const groupFilters = getAvailableConceptGroups(concepts, domain.id, locale).map((group) => ({
      id: `${domainSegment}/${getConceptGroupRouteSegment(domain.id, group.id, locale)}`,
      label: getLocalizedConceptGroupLabel(domain.id, group.id, locale),
    }))

    return [
      {
        id: domainSegment,
        label: getLocalizedConceptDomainLabel(domain.id, locale),
      },
      ...groupFilters,
    ]
  })

  for (const concept of concepts) {
    const domainId = getConceptDomainRouteSegment(concept.data.domainId, locale)
    const groupId = `${domainId}/${getConceptGroupRouteSegment(concept.data.domainId, concept.data.groupId, locale)}`

    filterCounts.set(domainId, (filterCounts.get(domainId) ?? 0) + 1)
    filterCounts.set(groupId, (filterCounts.get(groupId) ?? 0) + 1)
  }

  return {
    filterCounts,
    filters: getRouteFilterEntries(filters, locale),
  }
}

function buildGlossaryFilters(terms: GlossaryEntry[], locale: SiteLocale) {
  const glossaryTags = getGlossaryTagEntries(terms, locale)

  return {
    filterCounts: new Map(glossaryTags.map((tag) => [tag.id, tag.termCount])),
    filters: glossaryTags.map(({ id, label, slug }) => ({ id, label, slug })),
  }
}

function buildChallengeFilters(challenges: ChallengeEntry[], locale: SiteLocale) {
  const sortedChallenges = sortChallenges(challenges)
  const levelFilters = ['beginner', 'intermediate', 'advanced']
    .filter((level) => sortedChallenges.some((challenge) => challenge.data.level === level))
    .map((level) => ({
      id: `level:${level}`,
      label: getChallengeLevelLabel(level as 'beginner' | 'intermediate' | 'advanced', locale),
    }))
  const typeFilters = Array.from(
    new Map(
      sortedChallenges.map((challenge) => [
        challenge.data.type,
        {
          id: `type:${challenge.data.type}`,
          label: challenge.data.typeLabel,
        },
      ]),
    ).values(),
  )
  const filters = [...levelFilters, ...typeFilters]
  const filterCounts = new Map<string, number>()

  for (const challenge of sortedChallenges) {
    const levelId = `level:${challenge.data.level}`
    const typeId = `type:${challenge.data.type}`

    filterCounts.set(levelId, (filterCounts.get(levelId) ?? 0) + 1)
    filterCounts.set(typeId, (filterCounts.get(typeId) ?? 0) + 1)
  }

  return {
    filterCounts,
    filters: getRouteFilterEntries(filters, locale),
  }
}

async function loadSectionData(
  pageType: FilterableSectionPageType,
  locale: SiteLocale,
): Promise<LoadedSectionData | null> {
  if (pageType === 'tracks') {
    const articleCollection = await getArticleCollection()
    const roadmaps = resolveEditorialRoadmaps(locale as EditorialLocale, articleCollection)
    const { filterCounts, filters } = buildTrackFilters(roadmaps, locale)

    return {
      filterCounts,
      filters,
      props: {
        locale,
        pageType,
        roadmaps,
      },
    }
  }

  if (pageType === 'concepts') {
    const concepts = await getActiveConceptsByLocale(locale)
    const { filterCounts, filters } = buildConceptFilters(concepts, locale)

    return {
      filterCounts,
      filters,
      props: {
        concepts,
        locale,
        pageType,
      },
    }
  }

  if (pageType === 'glossary') {
    const terms = await getActiveGlossaryByLocale(locale)
    const { filterCounts, filters } = buildGlossaryFilters(terms, locale)

    return {
      filterCounts,
      filters,
      props: {
        locale,
        pageType,
        terms,
      },
    }
  }

  const challenges = await getActiveChallengesByLocale(locale)
  const { filterCounts, filters } = buildChallengeFilters(challenges, locale)

  return {
    filterCounts,
    filters,
    props: {
      challenges,
      locale,
      pageType,
    },
  }
}

async function getFilterableSectionPathsForLocale(locale: SiteLocale, includeLocaleParam: boolean) {
  const allPaths = await Promise.all(
    FILTERABLE_PAGE_TYPES.map(async (pageType) => {
      const section = getPageTypeRouteSegment(pageType, locale)

      if (!section) {
        return []
      }

      const sectionData = await loadSectionData(pageType, locale)

      if (!sectionData) {
        return []
      }

      return sectionData.filters.map<StaticPath<FilterableSectionSharedProps>>((filter) => ({
        params: {
          ...(includeLocaleParam ? { locale } : {}),
          section,
          tag: filter.slug,
        },
        props: {
          ...sectionData.props,
          selectedFilterId: filter.id,
        },
      }))
    }),
  )

  return assertUniqueStaticPaths(allPaths.flat(), 'filterable section tag index')
}

async function getPaginatedFilterableSectionPathsForLocale(locale: SiteLocale, includeLocaleParam: boolean) {
  const allPaths = await Promise.all(
    FILTERABLE_PAGE_TYPES.map(async (pageType) => {
      const section = getPageTypeRouteSegment(pageType, locale)

      if (!section) {
        return []
      }

      const sectionData = await loadSectionData(pageType, locale)

      if (!sectionData) {
        return []
      }

      return sectionData.filters.flatMap<StaticPath<FilterableSectionPaginatedProps>>((filter) =>
        getPaginatedPathNumbers(
          sectionData.filterCounts.get(filter.id) ?? 0,
          getFilterPageSize(pageType),
        ).map((page) => ({
          params: {
            ...(includeLocaleParam ? { locale } : {}),
            page: String(page),
            section,
            tag: filter.slug,
          },
          props: {
            ...sectionData.props,
            page,
            selectedFilterId: filter.id,
          },
        })),
      )
    }),
  )

  return assertUniqueStaticPaths(allPaths.flat(), 'filterable section tag page')
}

export async function getDefaultFilterableSectionPaths() {
  return getFilterableSectionPathsForLocale(getDefaultLocale(), false)
}

export async function getLocalizedFilterableSectionPaths() {
  const localizedPaths = await Promise.all(
    getNonDefaultLocales().map((locale) => getFilterableSectionPathsForLocale(locale, true)),
  )

  return localizedPaths.flat()
}

export async function getDefaultPaginatedFilterableSectionPaths() {
  return getPaginatedFilterableSectionPathsForLocale(getDefaultLocale(), false)
}

export async function getLocalizedPaginatedFilterableSectionPaths() {
  const localizedPaths = await Promise.all(
    getNonDefaultLocales().map((locale) => getPaginatedFilterableSectionPathsForLocale(locale, true)),
  )

  return localizedPaths.flat()
}
