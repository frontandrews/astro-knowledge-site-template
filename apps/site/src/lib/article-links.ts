import {
  getArticleBranchRoutePath,
  getArticlePillarRoutePath,
  getArticleRoutePath,
  getArticleRoutePathFromEntryId,
  getArticleSectionSegment,
  SUPPORTED_ARTICLE_LOCALES,
} from '@/lib/article-registry'
import { getDefaultLocale, getLocalePath, isSupportedLocale } from '@/lib/locale-config'
import { getRouteHref } from '@/lib/route-segments'

const SUPPORTED_ARTICLE_LOCALE_SET = new Set<string>(SUPPORTED_ARTICLE_LOCALES)

function normalizeArticleLocale(locale?: string | null) {
  if (locale && SUPPORTED_ARTICLE_LOCALE_SET.has(locale)) {
    return locale
  }

  const defaultLocale = getDefaultLocale()

  return SUPPORTED_ARTICLE_LOCALE_SET.has(defaultLocale)
    ? defaultLocale
    : SUPPORTED_ARTICLE_LOCALES[0]
}

function getFlatArticleRoutePathFromEntryId(entryId: string) {
  const parts = entryId.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  const [locale = 'en', pillarOrKind, slug] = parts
  const normalizedLocale = normalizeArticleLocale(locale)

  if (!slug || (pillarOrKind !== 'article' && pillarOrKind !== 'artigo')) {
    return null
  }

  const section = getArticleSectionSegment(normalizedLocale)

  return normalizedLocale === getDefaultLocale()
    ? `${section}/${slug}`
    : `${normalizedLocale}/${section}/${slug}`
}

export function getArticleHrefFromEntryId(entryId: string) {
  return getRouteHref(getFlatArticleRoutePathFromEntryId(entryId) ?? getArticleRoutePathFromEntryId(entryId))
}

type ArticleEntryLike = {
  id: string
  data: {
    articleId: string
    locale?: string | null
  }
}

export function getArticleHref(articleId: string, locale = 'en') {
  const routePath = getArticleRoutePath(articleId, locale)

  return routePath ? getRouteHref(routePath) : null
}

export function getArticleHrefFromEntry(entry: ArticleEntryLike) {
  return getArticleHref(entry.data.articleId, entry.data.locale ?? 'en') ?? getArticleHrefFromEntryId(entry.id)
}

export function getArticlePillarHref(pillarId: string, locale = 'en') {
  const routePath = getArticlePillarRoutePath(pillarId, locale)

  return routePath ? getRouteHref(routePath) : null
}

export function getArticleBranchHref(pillarId: string, branchId: string, locale = 'en') {
  const routePath = getArticleBranchRoutePath(pillarId, branchId, locale)

  return routePath ? getRouteHref(routePath) : null
}

export function getArticlesIndexHref(locale = 'en') {
  const normalizedLocale = normalizeArticleLocale(locale)
  const section = getArticleSectionSegment(normalizedLocale)

  return getLocalePath(normalizedLocale, section)
}

export function getArticlesPageHref(locale = 'en', page = 1) {
  const indexHref = getArticlesIndexHref(locale)
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1

  return normalizedPage <= 1 ? indexHref : `${indexHref}/page/${normalizedPage}`
}

export function getArticleLocaleFromPathname(pathname: string) {
  const [, maybeLocale] = pathname.split('/')
  return maybeLocale && isSupportedLocale(maybeLocale) && SUPPORTED_ARTICLE_LOCALE_SET.has(maybeLocale)
    ? maybeLocale
    : normalizeArticleLocale()
}
