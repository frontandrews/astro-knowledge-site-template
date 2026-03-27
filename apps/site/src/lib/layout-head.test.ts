import { describe, expect, it } from 'vitest'

import { resolveLayoutHeadContext } from '@/lib/layout-head'

describe('resolveLayoutHeadContext', () => {
  it('omits unavailable locale links when explicit alternates are provided', () => {
    const result = resolveLayoutHeadContext({
      alternateLocaleHrefs: {
        en: '/articles/example',
        'pt-br': null,
      },
      canonicalUrl: 'https://example.com/articles/example',
      currentLocale: 'en',
      description: 'Example article',
      homeHref: '/',
      localeHrefs: {
        en: '/articles/example',
        'pt-br': '/pt-br/artigos/exemplo',
      },
      pathname: '/articles/example',
      siteUrl: 'https://example.com',
      structuredData: [],
    })

    expect(result.localeSwitchLinks.map((link) => link.code)).toEqual(['en'])
    expect(result.seoAlternateLinks).toEqual([
      {
        absoluteHref: 'https://example.com/articles/example',
        code: 'en',
        htmlLang: 'en',
      },
    ])
    expect(result.defaultAlternateHref).toBe('https://example.com/articles/example')
  })

  it('adds website schema only on the localized home route', () => {
    const homeResult = resolveLayoutHeadContext({
      canonicalUrl: 'https://example.com/pt-br',
      currentLocale: 'pt-br',
      description: 'Localized home',
      homeHref: '/pt-br',
      localeHrefs: {
        en: '/',
        'pt-br': '/pt-br',
      },
      pathname: '/pt-br',
      siteUrl: 'https://example.com',
      structuredData: [{ '@type': 'Thing', name: 'Existing schema' }],
    })

    const detailResult = resolveLayoutHeadContext({
      canonicalUrl: 'https://example.com/pt-br/articles/example',
      currentLocale: 'pt-br',
      description: 'Localized detail',
      homeHref: '/pt-br',
      localeHrefs: {
        en: '/articles/example',
        'pt-br': '/pt-br/articles/example',
      },
      pathname: '/pt-br/articles/example',
      siteUrl: 'https://example.com',
      structuredData: [{ '@type': 'Thing', name: 'Existing schema' }],
    })

    expect(homeResult.rssHref).toBe('/pt-br/feed.xml')
    expect(homeResult.structuredDataItems).toHaveLength(2)
    expect(homeResult.structuredDataItems[1]).toMatchObject({
      '@type': 'WebSite',
      url: 'https://example.com/pt-br',
    })
    expect(detailResult.structuredDataItems).toHaveLength(1)
  })
})
