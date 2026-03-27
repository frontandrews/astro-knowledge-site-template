import { describe, expect, it } from 'vitest'

import { assertUniqueStaticPaths, resolveActiveRelatedArticles } from '@/lib/content-integrity'

function createArticleEntry(options: {
  articleId: string
  entryId?: string
  locale?: string
  status?: 'active' | 'archived' | 'draft'
  title?: string
}) {
  const {
    articleId,
    entryId = `en/foundations/${articleId}`,
    locale = 'en',
    status = 'active',
    title = articleId,
  } = options

  return {
    data: {
      articleId,
      locale,
      status,
      title,
    },
    id: entryId,
  } as never
}

describe('content integrity helpers', () => {
  it('resolves related articles in editorial order while dropping missing and inactive ids', () => {
    const articles = [
      createArticleEntry({ articleId: 'article-1', title: 'First' }),
      createArticleEntry({ articleId: 'article-2', status: 'archived', title: 'Archived' }),
      createArticleEntry({ articleId: 'article-3', locale: 'pt-br', title: 'Other locale' }),
      createArticleEntry({ articleId: 'article-4', title: 'Fourth' }),
    ]

    expect(
      resolveActiveRelatedArticles(
        articles,
        'en',
        ['article-4', 'missing-article', 'article-1', 'article-4', 'article-2', 'article-3'],
      ).map((entry) => entry.data.articleId),
    ).toEqual(['article-4', 'article-1'])
  })

  it('returns unique static paths unchanged when there are no collisions', () => {
    const paths = [
      { params: { locale: 'en', section: 'tracks', slug: 'first-track' } },
      { params: { locale: 'en', section: 'tracks', slug: 'second-track' } },
    ]

    expect(assertUniqueStaticPaths(paths, 'dynamic section detail')).toEqual(paths)
  })

  it('throws a readable error when static paths collide', () => {
    expect(() =>
      assertUniqueStaticPaths(
        [
          { params: { locale: 'en', section: 'tracks', slug: 'duplicate-track' } },
          { params: { locale: 'en', section: 'tracks', slug: 'duplicate-track' } },
        ],
        'dynamic section detail',
      ),
    ).toThrowError(
      '[content-integrity] Duplicate dynamic section detail route detected for /en/tracks/duplicate-track. ' +
        'Check duplicated slugs, locale collisions, or repeated section routes in the synced content.',
    )
  })

  it('treats NFC/NFD and encoded public collisions as the same route', () => {
    expect(() =>
      assertUniqueStaticPaths(
        [
          { params: { locale: 'pt-br', section: 'trilhas', slug: 'café-guia' } },
          { params: { locale: 'pt-br', section: 'trilhas', slug: 'cafe\u0301-guia' } },
        ],
        'dynamic section detail',
      ),
    ).toThrowError(
      '[content-integrity] Duplicate dynamic section detail route detected for /pt-br/trilhas/caf%C3%A9-guia. ' +
        'Check duplicated slugs, locale collisions, or repeated section routes in the synced content.',
    )
  })
})
