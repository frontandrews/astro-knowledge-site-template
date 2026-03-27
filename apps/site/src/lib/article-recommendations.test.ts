import { describe, expect, it } from 'vitest'

import { resolveArticleRecommendations, type ArticleRecommendationCandidate } from '@/lib/article-recommendations'

const candidates: ArticleRecommendationCandidate[] = [
  {
    articleId: 'track-1',
    href: '/articles/track-1',
    title: 'Track One',
    trackOrder: 1,
  },
  {
    articleId: 'relationship-1',
    href: '/articles/relationship-1',
    relationshipOrder: 1,
    title: 'Relationship One',
  },
  {
    articleId: 'topic-1',
    href: '/articles/topic-1',
    title: 'Topic One',
    topicOverlap: 2,
  },
]

describe('article recommendation helpers', () => {
  it('prioritizes unfinished articles before completed ones', () => {
    const { nextStep, relatedItems } = resolveArticleRecommendations(candidates, new Set(['track-1']))

    expect(nextStep).toEqual({
      articleId: 'relationship-1',
      href: '/articles/relationship-1',
      title: 'Relationship One',
    })
    expect(relatedItems.map((item) => item.articleId)).toEqual(['topic-1', 'track-1'])
  })

  it('prioritizes track continuation, then explicit relationships, then topic overlap', () => {
    const { nextStep, relatedItems } = resolveArticleRecommendations(candidates, new Set())

    expect(nextStep?.articleId).toBe('track-1')
    expect(relatedItems.map((item) => item.articleId)).toEqual(['relationship-1', 'topic-1'])
  })

  it('merges duplicate candidates and falls back to the first ranked item when everything is completed', () => {
    const { nextStep, relatedItems } = resolveArticleRecommendations(
      [
        {
          articleId: 'shared-1',
          href: '/articles/shared-1',
          title: 'Shared One',
          topicOverlap: 1,
        },
        {
          articleId: 'shared-1',
          href: '/articles/shared-1',
          relationshipOrder: 2,
          title: 'Shared One',
        },
        {
          articleId: 'track-2',
          href: '/articles/track-2',
          title: 'Track Two',
          trackOrder: 1,
        },
      ],
      ['shared-1', 'track-2'],
    )

    expect(nextStep).toEqual({
      articleId: 'track-2',
      href: '/articles/track-2',
      title: 'Track Two',
    })
    expect(relatedItems).toEqual([
      {
        articleId: 'shared-1',
        href: '/articles/shared-1',
        title: 'Shared One',
      },
    ])
  })
})
