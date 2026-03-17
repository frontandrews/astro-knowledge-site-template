import { getDeckById } from '@prepdeck/content'

import { getDeckArticleLinks, resolveArticleHref } from '@/lib/article-links'

describe('article links', () => {
  it('falls back to the same-domain blog path when no site URL is configured', () => {
    expect(resolveArticleHref('en/state-and-ui-thinking/react-derived-state-without-extra-bugs')).toBe(
      '/guides/en/state-and-ui-thinking/react-derived-state-without-extra-bugs',
    )
  })

  it('builds article links from a separate site origin', () => {
    expect(
      resolveArticleHref(
        'en/runtime-and-execution/javascript-event-loop-without-hand-waving',
        'http://localhost:4321',
      ),
    ).toBe('http://localhost:4321/guides/en/runtime-and-execution/javascript-event-loop-without-hand-waving')
  })

  it('avoids duplicating the blog segment when the configured URL already includes it', () => {
    expect(
      resolveArticleHref(
        'en/runtime-and-execution/node-single-threaded-does-not-mean-what-people-think',
        'https://prepdeck.dev/guides/',
      ),
    ).toBe('https://prepdeck.dev/guides/en/runtime-and-execution/node-single-threaded-does-not-mean-what-people-think')
  })

  it('collects unique article links from a deck', () => {
    const deck = getDeckById('react-rendering-core')

    expect(deck).toBeDefined()
    expect(getDeckArticleLinks(deck!)).toEqual([
      {
        guideId: 'react-derived-state',
        question: 'Why is derived state dangerous in React?',
        routePath: 'en/state-and-ui-thinking/react-derived-state-without-extra-bugs',
      },
    ])
  })
})
