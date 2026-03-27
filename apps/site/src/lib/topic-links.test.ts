import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  mockGetActiveArticlesByLocale,
  mockGetActiveChallengesByLocale,
  mockGetActiveConceptsByLocale,
  mockGetActiveGlossaryByLocale,
  mockGetArticleCollection,
  mockResolveEditorialRoadmaps,
} = vi.hoisted(() => ({
  mockGetActiveArticlesByLocale: vi.fn(),
  mockGetActiveChallengesByLocale: vi.fn(),
  mockGetActiveConceptsByLocale: vi.fn(),
  mockGetActiveGlossaryByLocale: vi.fn(),
  mockGetArticleCollection: vi.fn(),
  mockResolveEditorialRoadmaps: vi.fn(),
}))

vi.mock('@/lib/site-content', () => ({
  getActiveArticlesByLocale: mockGetActiveArticlesByLocale,
  getActiveChallengesByLocale: mockGetActiveChallengesByLocale,
  getActiveConceptsByLocale: mockGetActiveConceptsByLocale,
  getActiveGlossaryByLocale: mockGetActiveGlossaryByLocale,
  getArticleCollection: mockGetArticleCollection,
}))

vi.mock('@/lib/roadmaps', () => ({
  resolveEditorialRoadmaps: mockResolveEditorialRoadmaps,
}))

import { getDynamicTopicDetailPaths } from '@/lib/dynamic-section-pages'
import { getDefaultPaginatedTopicDetailPaths } from '@/lib/paginated-section-pages'
import { getTopicHref, getTopicPageHref } from '@/lib/topic-links'

function createArticleEntry(options: {
  articleId: string
  locale: 'en' | 'pt-br'
  topicIds: string[]
}) {
  const { articleId, locale, topicIds } = options

  return {
    data: {
      articleId,
      branchId: null,
      description: `${articleId} description`,
      kind: 'article',
      level: 'beginner',
      locale,
      order: 1,
      path: [articleId],
      pillarId: null,
      pubDate: new Date('2026-01-01'),
      relationships: [],
      status: 'active',
      tags: [],
      title: articleId,
      topicIds,
      updatedDate: null,
    },
    id: `${locale}/articles/${articleId}`,
  } as never
}

describe('topic links and topic detail routes', () => {
  beforeEach(() => {
    mockResolveEditorialRoadmaps.mockReturnValue([])
    mockGetArticleCollection.mockResolvedValue([])
    mockGetActiveChallengesByLocale.mockResolvedValue([])
    mockGetActiveConceptsByLocale.mockResolvedValue([])
    mockGetActiveGlossaryByLocale.mockResolvedValue([])

    const englishEntries = [
      createArticleEntry({
        articleId: 'react-rendering',
        locale: 'en',
        topicIds: ['react'],
      }),
      ...Array.from({ length: 25 }, (_, index) =>
        createArticleEntry({
          articleId: `coding-interview-${index + 1}`,
          locale: 'en',
          topicIds: ['coding-interview'],
        })),
    ]

    mockGetActiveArticlesByLocale.mockImplementation(async (locale: string) =>
      locale === 'pt-br' ? [] : englishEntries,
    )
  })

  it('builds canonical nested topic hrefs instead of query-param topic links', () => {
    expect(getTopicHref('react', 'en')).toBe('/topics/frontend/javascript/react')
    expect(getTopicPageHref('coding-interview', 'en', 2)).toBe('/topics/thinking/coding-interview/page/2')
  })

  it('generates nested static topic routes for leaf topics', async () => {
    const paths = await getDynamicTopicDetailPaths('en')
    const reactTopicRoute = paths.find(
      (path) =>
        path.params.section === 'topics'
        && path.params.group === 'frontend'
        && path.params.topic === 'javascript/react',
    )

    expect(reactTopicRoute).toEqual(
      expect.objectContaining({
        params: {
          group: 'frontend',
          section: 'topics',
          topic: 'javascript/react',
        },
        props: expect.objectContaining({
          groupId: 'frontend',
          pageType: 'topics',
          topicId: 'react',
        }),
      }),
    )
  })

  it('generates paginated topic detail routes when a topic has more than 24 articles', async () => {
    const paths = await getDefaultPaginatedTopicDetailPaths()
    const archiveRoute = paths.find(
      (path) =>
        path.params.section === 'topics'
        && path.params.group === 'thinking'
        && path.params.topic === 'coding-interview'
        && path.params.page === '2',
    )

    expect(archiveRoute).toEqual(
      expect.objectContaining({
        params: {
          group: 'thinking',
          page: '2',
          section: 'topics',
          topic: 'coding-interview',
        },
        props: expect.objectContaining({
          groupId: 'thinking',
          page: 2,
          pageType: 'topics',
          topicId: 'coding-interview',
        }),
      }),
    )
  })
})
