import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  mockGetActiveChallengesByLocale,
  mockGetActiveConceptsByLocale,
  mockGetActiveGlossaryByLocale,
  mockGetArticleCollection,
  mockResolveEditorialRoadmaps,
} = vi.hoisted(() => ({
  mockGetActiveChallengesByLocale: vi.fn(),
  mockGetActiveConceptsByLocale: vi.fn(),
  mockGetActiveGlossaryByLocale: vi.fn(),
  mockGetArticleCollection: vi.fn(),
  mockResolveEditorialRoadmaps: vi.fn(),
}))

vi.mock('@/lib/site-content', () => ({
  getActiveChallengesByLocale: mockGetActiveChallengesByLocale,
  getActiveConceptsByLocale: mockGetActiveConceptsByLocale,
  getActiveGlossaryByLocale: mockGetActiveGlossaryByLocale,
  getArticleCollection: mockGetArticleCollection,
}))

vi.mock('@/lib/roadmaps', () => ({
  resolveEditorialRoadmaps: mockResolveEditorialRoadmaps,
}))

import {
  getDefaultFilterableSectionPaths,
  getDefaultPaginatedFilterableSectionPaths,
  getLocalizedFilterableSectionPaths,
} from '@/lib/filterable-section-pages'

function createGlossaryEntry(options: {
  id: string
  locale: 'en' | 'pt-br'
  tags: string[]
  title: string
}) {
  const { id, locale, tags, title } = options

  return {
    data: {
      aliases: [],
      description: `${title} description`,
      locale,
      pubDate: new Date('2026-01-01'),
      status: 'active',
      tags,
      termId: id.split('/').at(-1) ?? id,
      title,
      updatedDate: null,
    },
    id,
  } as never
}

describe('filterable section tag paths', () => {
  beforeEach(() => {
    mockGetArticleCollection.mockResolvedValue([])
    mockResolveEditorialRoadmaps.mockReturnValue([])
    mockGetActiveConceptsByLocale.mockResolvedValue([])
    mockGetActiveChallengesByLocale.mockResolvedValue([])

    const englishGlossaryEntries = Array.from({ length: 13 }, (_, index) =>
      createGlossaryEntry({
        id: `en/glossary/term-${index + 1}`,
        locale: 'en',
        tags: ['coding-interview'],
        title: `Term ${index + 1}`,
      }),
    )
    const portugueseGlossaryEntries = [
      createGlossaryEntry({
        id: 'pt-br/glossary/termo-1',
        locale: 'pt-br',
        tags: ['coding-interview'],
        title: 'Termo 1',
      }),
    ]

    mockGetActiveGlossaryByLocale.mockImplementation(async (locale: string) =>
      locale === 'pt-br' ? portugueseGlossaryEntries : englishGlossaryEntries,
    )
  })

  it('generates the default glossary tag index route for coding-interview', async () => {
    const paths = await getDefaultFilterableSectionPaths()
    const glossaryTagRoute = paths.find(
      (path) => path.params.section === 'glossary' && path.params.tag === 'coding-interview',
    )

    expect(glossaryTagRoute).toEqual(
      expect.objectContaining({
        params: {
          section: 'glossary',
          tag: 'coding-interview',
        },
        props: expect.objectContaining({
          locale: 'en',
          pageType: 'glossary',
          selectedFilterId: 'coding-interview',
        }),
      }),
    )
  })

  it('generates the localized glossary tag index route with the translated pt-br slug', async () => {
    const paths = await getLocalizedFilterableSectionPaths()
    const glossaryTagRoute = paths.find(
      (path) => path.params.locale === 'pt-br' && path.params.section === 'glossario',
    )

    expect(glossaryTagRoute).toEqual(
      expect.objectContaining({
        params: {
          locale: 'pt-br',
          section: 'glossario',
          tag: 'entrevista-de-codigo',
        },
        props: expect.objectContaining({
          locale: 'pt-br',
          pageType: 'glossary',
          selectedFilterId: 'coding-interview',
        }),
      }),
    )
  })

  it('generates paginated glossary tag routes after the first 12 items', async () => {
    const paths = await getDefaultPaginatedFilterableSectionPaths()
    const glossaryTagArchive = paths.find(
      (path) =>
        path.params.section === 'glossary'
        && path.params.tag === 'coding-interview'
        && path.params.page === '2',
    )

    expect(glossaryTagArchive).toEqual(
      expect.objectContaining({
        params: {
          page: '2',
          section: 'glossary',
          tag: 'coding-interview',
        },
        props: expect.objectContaining({
          locale: 'en',
          page: 2,
          pageType: 'glossary',
          selectedFilterId: 'coding-interview',
        }),
      }),
    )
  })
})
