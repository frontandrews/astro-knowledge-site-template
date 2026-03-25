// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  buildUrlWithQueryParam,
  clearHash,
  decodeBase64UrlValue,
  encodeBase64UrlValue,
  readBase64QueryParam,
  readQueryParam,
  setQueryParam,
  subscribeToQueryParam,
} from '@/lib/url-state'

describe('url state helpers', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', 'https://example.com/articles?filter=frontend#intro')
  })

  it('reads and mutates query params while preserving the hash by default', () => {
    expect(readQueryParam('filter')).toBe('frontend')

    const nextUrl = buildUrlWithQueryParam('page', '2')
    expect(nextUrl?.toString()).toBe('https://example.com/articles?filter=frontend&page=2#intro')

    setQueryParam('page', '2')
    expect(window.location.pathname + window.location.search + window.location.hash).toBe('/articles?filter=frontend&page=2#intro')
  })

  it('can clear params and hashes explicitly', () => {
    setQueryParam('filter', null, { preserveHash: false })
    expect(window.location.pathname + window.location.search + window.location.hash).toBe('/articles')

    window.history.replaceState(null, '', 'https://example.com/articles?page=2#details')
    clearHash()
    expect(window.location.pathname + window.location.search + window.location.hash).toBe('/articles?page=2')
  })

  it('encodes and decodes base64 query state', () => {
    const encoded = encodeBase64UrlValue('const answer = 42')
    expect(decodeBase64UrlValue(encoded)).toBe('const answer = 42')

    setQueryParam('code', encoded)
    expect(readBase64QueryParam('code')).toBe('const answer = 42')
    expect(decodeBase64UrlValue('%%%')).toBe(null)
  })

  it('subscribes to query changes through popstate', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToQueryParam('page', listener)

    expect(listener).toHaveBeenCalledWith(null)

    window.history.pushState(null, '', 'https://example.com/articles?page=3')
    window.dispatchEvent(new PopStateEvent('popstate'))

    expect(listener).toHaveBeenLastCalledWith('3')
    unsubscribe()
  })
})
