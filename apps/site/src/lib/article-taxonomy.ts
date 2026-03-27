import type { CollectionEntry } from 'astro:content'

import { getArticleRoutePath, getArticleRoutePathFromEntryId } from '@/lib/article-registry'
import { getArticlePillarHref, getArticlesIndexHref } from '@/lib/article-links'
import {
  getLearningPathBranchById,
  getLearningPathPillarById,
  type LearningPathBranch,
  type LearningPathPillar,
} from '@/lib/learning-paths'
import { getDefaultLocale } from '@/lib/locale-config'
import { getEntryLeafRouteSegment, getNormalizedRouteSegments } from '@/lib/route-segments'
import { getSiteCopy, getSiteLocale, type SiteLocale } from '@/lib/site-copy'
import { translateSiteLabel } from '@/lib/site-labels'

export type ArticleEntry = CollectionEntry<'articles'>

export type ArticleBreadcrumbItem = {
  href: string | null
  label: string
}

export type ArticleCanonicalParams = {
  pillar: string
  slug: string
}

export type ArticleTaxonomy = {
  branch: LearningPathBranch | null
  locale: SiteLocale
  pillar: LearningPathPillar | null
}

export function getArticleSlugFromEntryId(entryId: string) {
  return getEntryLeafRouteSegment(entryId)
}

export function getArticleCanonicalParams(post: ArticleEntry): ArticleCanonicalParams | null {
  const routePath = getArticleRoutePath(post.data.articleId, post.data.locale)
    ?? getArticleRoutePathFromEntryId(post.id)

  if (!routePath) {
    return null
  }

  const parts = getNormalizedRouteSegments(routePath)
  const segments = post.data.locale === getDefaultLocale() ? parts.slice(1) : parts.slice(2)

  if (segments.length !== 2) {
    return null
  }

  const [pillar, slug] = segments

  return {
    pillar,
    slug,
  }
}

export function getArticleTaxonomy(post: ArticleEntry): ArticleTaxonomy {
  const locale = getSiteLocale(post.data.locale)
  const pillar = post.data.pillarId
    ? getLearningPathPillarById(post.data.pillarId) ?? null
    : null
  const branch =
    post.data.pillarId && post.data.branchId
      ? getLearningPathBranchById(post.data.pillarId, post.data.branchId) ?? null
      : null

  return {
    branch,
    locale,
    pillar,
  }
}

export function getLocalizedPillarLabel(pillar: LearningPathPillar, locale: SiteLocale) {
  return translateSiteLabel(pillar.title, locale)
}

export function getLocalizedBranchLabel(branch: LearningPathBranch, locale: SiteLocale) {
  return translateSiteLabel(branch.title, locale)
}

export function getArticleBreadcrumb(post: ArticleEntry): ArticleBreadcrumbItem[] {
  const { locale, pillar } = getArticleTaxonomy(post)
  const copy = getSiteCopy(locale)
  const items: ArticleBreadcrumbItem[] = [
    {
      href: getArticlesIndexHref(locale),
      label: copy.learn,
    },
  ]

  if (pillar) {
    items.push({
      href: getArticlePillarHref(pillar.id, locale),
      label: getLocalizedPillarLabel(pillar, locale),
    })
  }

  items.push({
    href: null,
    label: post.data.title,
  })

  return items
}

export function getPillarBreadcrumb(
  pillar: LearningPathPillar,
  locale: SiteLocale,
): ArticleBreadcrumbItem[] {
  const copy = getSiteCopy(locale)

  return [
    {
      href: getArticlesIndexHref(locale),
      label: copy.learn,
    },
    {
      href: null,
      label: getLocalizedPillarLabel(pillar, locale),
    },
  ]
}

export function getBranchBreadcrumb(
  pillar: LearningPathPillar,
  branch: LearningPathBranch,
  locale: SiteLocale,
): ArticleBreadcrumbItem[] {
  const copy = getSiteCopy(locale)

  return [
    {
      href: getArticlesIndexHref(locale),
      label: copy.learn,
    },
    {
      href: getArticlePillarHref(pillar.id, locale),
      label: getLocalizedPillarLabel(pillar, locale),
    },
    {
      href: null,
      label: getLocalizedBranchLabel(branch, locale),
    },
  ]
}
