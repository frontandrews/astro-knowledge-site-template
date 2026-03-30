import { describe, expect, it } from 'vitest'

import { getArticleHrefFromEntry } from '@/lib/article-links'

describe('article links', () => {
  it('keeps entry-based links in the same locale when the canonical registry is incomplete', () => {
    expect(
      getArticleHrefFromEntry({
        id: 'en/problem-solving-and-interview-thinking/how-to-structure-a-system-design-answer',
        data: {
          articleId: 'how-to-structure-a-system-design-answer',
          locale: 'en',
        },
      }),
    ).toBe('/articles/problem-solving-and-interview-thinking/how-to-structure-a-system-design-answer')
  })
})
