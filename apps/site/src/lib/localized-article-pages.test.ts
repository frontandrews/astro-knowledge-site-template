import type { CollectionEntry } from 'astro:content'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/site-content', () => ({
  getActiveArticlesByLocale: vi.fn(),
  getArticleCollection: vi.fn(),
}))

const { getArticleCanonicalParamsForLocale } = await import('@/lib/localized-article-pages')

function createArticleEntry(
  entry: Partial<CollectionEntry<'articles'>> & {
    data: Partial<CollectionEntry<'articles'>['data']> & {
      articleId: string
      locale: string
      pillarId: string
    }
    id: string
  },
) {
  return entry as CollectionEntry<'articles'>
}

describe('getArticleCanonicalParamsForLocale', () => {
  it('keeps canonical params for a locale that is already published', () => {
    expect(
      getArticleCanonicalParamsForLocale({
        id: 'en/problem-solving-and-interview-thinking/arrays-and-hashmaps-the-patterns-behind-most-questions',
        data: {
          articleId: 'arrays-and-hashmaps-the-patterns-behind-most-questions',
          locale: 'en',
          pillarId: 'problem-solving-and-interview-thinking',
        },
      } as ReturnType<typeof createArticleEntry>, 'en'),
    ).toEqual({
      pillar: 'problem-solving-and-interview-thinking',
      slug: 'arrays-and-hashmaps-the-patterns-behind-most-questions',
    })
  })

  it('derives the default-locale placeholder route from the article id when the translation is missing', () => {
    expect(
      getArticleCanonicalParamsForLocale({
        id: 'pt-br/arquitetura-backend-na-pratica/anti-corrupcao-entre-dominios-internos-sem-virar-camada-ornamental',
        data: {
          articleId: 'anti-corruption-between-internal-domains-without-becoming-an-ornamental-layer',
          locale: 'pt-br',
          pillarId: 'backend-architecture-in-practice',
        },
      } as ReturnType<typeof createArticleEntry>, 'en'),
    ).toEqual({
      pillar: 'backend-architecture-in-practice',
      slug: 'anti-corruption-between-internal-domains-without-becoming-an-ornamental-layer',
    })
  })

  it('does not build placeholder routes for notes', () => {
    expect(
      getArticleCanonicalParamsForLocale({
        id: 'pt-br/artigo/o-que-construir-o-seniorpath-esta-mudando-em-como-eu-ensino',
        data: {
          articleId: 'what-building-seniorpath-is-changing-in-how-i-teach',
          kind: 'note',
          locale: 'pt-br',
          pillarId: 'article',
        },
      } as ReturnType<typeof createArticleEntry>, 'en'),
    ).toBeNull()
  })
})
