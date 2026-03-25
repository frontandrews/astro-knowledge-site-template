import {
  getLearningPathBranchRouteSegment,
  getLearningPathLocationByArticleId,
  getLearningPathPillarRouteSegment,
} from './learning-paths'

export type ArticleRegistryEntry = {
  articleId: string
  locale: string
  routePath: string
}

export const ARTICLE_SECTION_BY_LOCALE = {
  en: 'articles',
  'pt-br': 'artigos',
} as const

export type ArticleLocale = keyof typeof ARTICLE_SECTION_BY_LOCALE

export const SUPPORTED_ARTICLE_LOCALES = Object.keys(ARTICLE_SECTION_BY_LOCALE) as ArticleLocale[]

const ARTICLE_ENTRY_IDS_BY_ARTICLE_ID = {
  'customize-the-template-after-clone': {
    en: 'en/foundations/customize-the-template-after-the-first-clone',
    'pt-br': 'pt-br/fundamentos/personalize-o-template-depois-do-primeiro-clone',
  },
} as const

function normalizeArticleLocale(locale?: string): ArticleLocale {
  return (locale && locale in ARTICLE_SECTION_BY_LOCALE ? locale : 'en') as ArticleLocale
}

export function getArticleSectionSegment(locale = 'en') {
  return ARTICLE_SECTION_BY_LOCALE[normalizeArticleLocale(locale)] ?? ARTICLE_SECTION_BY_LOCALE.en
}

export function deriveArticleRoutePathFromEntryId(entryId: string) {
  const normalizedEntryId = entryId.replace(/^\/+|\/+$/g, '')
  const [locale = 'en', pillar, slug] = normalizedEntryId.split('/').filter(Boolean)
  const normalizedLocale = normalizeArticleLocale(locale)
  const section = getArticleSectionSegment(normalizedLocale)

  if (!pillar || !slug) {
    return normalizedLocale === 'en'
      ? `${section}/${normalizedEntryId}`
      : `${normalizedLocale}/${section}/${normalizedEntryId.replace(/^pt-br\//, '')}`
  }

  return normalizedLocale === 'en'
    ? `${section}/${pillar}/${slug}`
    : `${normalizedLocale}/${section}/${pillar}/${slug}`
}

export function getArticleRegistry() {
  return Object.entries(ARTICLE_ENTRY_IDS_BY_ARTICLE_ID).flatMap(([articleId, locales]) =>
    Object.entries(locales).map(([locale, entryId]) => ({
      articleId,
      locale,
      routePath: deriveArticleRoutePathFromEntryId(entryId),
    })),
  )
}

export function getArticleEntry(articleId: string, locale = 'en') {
  const normalizedLocale = normalizeArticleLocale(locale)
  const entryId =
    ARTICLE_ENTRY_IDS_BY_ARTICLE_ID[articleId as keyof typeof ARTICLE_ENTRY_IDS_BY_ARTICLE_ID]?.[normalizedLocale]
    ?? ARTICLE_ENTRY_IDS_BY_ARTICLE_ID[articleId as keyof typeof ARTICLE_ENTRY_IDS_BY_ARTICLE_ID]?.en

  if (!entryId) {
    return null
  }

  return {
    articleId,
    locale: normalizedLocale,
    routePath: deriveArticleRoutePathFromEntryId(entryId),
  }
}

export function getArticlePillarRoutePath(pillarId: string, locale = 'en') {
  const normalizedLocale = normalizeArticleLocale(locale)
  const section = getArticleSectionSegment(normalizedLocale)
  const pillarSegment = getLearningPathPillarRouteSegment(pillarId, normalizedLocale)

  if (!pillarSegment) {
    return null
  }

  return normalizedLocale === 'en'
    ? `${section}/${pillarSegment}`
    : `${normalizedLocale}/${section}/${pillarSegment}`
}

export function getArticleBranchRoutePath(pillarId: string, branchId: string, locale = 'en') {
  const normalizedLocale = normalizeArticleLocale(locale)
  const pillarPath = getArticlePillarRoutePath(pillarId, normalizedLocale)
  const branchSegment = getLearningPathBranchRouteSegment(pillarId, branchId, normalizedLocale)

  return pillarPath && branchSegment ? `${pillarPath}/${branchSegment}` : null
}

export function getArticleRoutePath(articleId: string, locale = 'en') {
  return getArticleEntry(articleId, locale)?.routePath ?? null
}

export function getArticleRoutePathFromEntryId(entryId: string) {
  const normalizedEntryId = entryId.replace(/^\/+|\/+$/g, '')
  const matchedArticle = Object.entries(ARTICLE_ENTRY_IDS_BY_ARTICLE_ID).find(([, locales]) =>
    Object.values(locales).includes(normalizedEntryId as never),
  )

  if (!matchedArticle) {
    return deriveArticleRoutePathFromEntryId(normalizedEntryId)
  }

  const [articleId] = matchedArticle
  const normalizedLocale = normalizeArticleLocale(normalizedEntryId.split('/').at(0))

  return getArticleRoutePath(articleId, normalizedLocale) ?? deriveArticleRoutePathFromEntryId(normalizedEntryId)
}
