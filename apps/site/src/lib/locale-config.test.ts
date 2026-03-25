import { describe, expect, it } from 'vitest'

import {
  getLocaleHrefMap,
  getLocalePath,
  getPathLocale,
  normalizeSiteLocale,
  resolveLocaleHrefMap,
  resolveLocaleMap,
} from '@/lib/locale-config'

describe('locale config helpers', () => {
  it('normalizes unsupported locales to the default locale', () => {
    expect(normalizeSiteLocale('en')).toBe('en')
    expect(normalizeSiteLocale('pt-br')).toBe('pt-br')
    expect(normalizeSiteLocale('es')).toBe('en')
    expect(normalizeSiteLocale(null)).toBe('en')
  })

  it('builds locale paths with a flat default locale', () => {
    expect(getLocalePath('en')).toBe('/')
    expect(getLocalePath('en', 'articles')).toBe('/articles')
    expect(getLocalePath('pt-br', 'artigos')).toBe('/pt-br/artigos')
  })

  it('detects the locale from the pathname', () => {
    expect(getPathLocale('/')).toBe('en')
    expect(getPathLocale('/articles')).toBe('en')
    expect(getPathLocale('/pt-br/artigos')).toBe('pt-br')
  })

  it('resolves locale maps and href maps for all supported locales', () => {
    expect(resolveLocaleMap((locale) => locale.toUpperCase())).toEqual({
      en: 'EN',
      'pt-br': 'PT-BR',
    })

    expect(resolveLocaleHrefMap((locale) => (locale === 'pt-br' ? '/pt-br/artigos' : '/articles'))).toEqual({
      en: '/articles',
      'pt-br': '/pt-br/artigos',
    })

    expect(getLocaleHrefMap({ en: '/articles' })).toEqual({
      en: '/articles',
      'pt-br': '/pt-br',
    })
  })
})
