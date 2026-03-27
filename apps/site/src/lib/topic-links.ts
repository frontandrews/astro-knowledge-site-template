import { getTopicGroupRouteSegment, getTopicPathSegments } from '@template/content'
import { getLocalePath } from '@/lib/locale-config'
import { getPageTypeHref } from '@/lib/section-manifest'

export function getTopicIndexHref(locale = 'en') {
  return getPageTypeHref('topics', locale) ?? getLocalePath(locale)
}

export function getTopicIndexPageHref(locale = 'en', page = 1) {
  const indexHref = getTopicIndexHref(locale)
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1

  return normalizedPage <= 1 ? indexHref : `${indexHref}/page/${normalizedPage}`
}

export function getTopicGroupHref(groupId: string, locale = 'en') {
  return getPageTypeHref('topics', locale, getTopicGroupRouteSegment(groupId, locale)) ?? getTopicIndexHref(locale)
}

export function getTopicGroupPageHref(groupId: string, locale = 'en', page = 1) {
  const baseHref = getTopicGroupHref(groupId, locale)
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1

  return normalizedPage <= 1 ? baseHref : `${baseHref}/page/${normalizedPage}`
}

export function getTopicHref(topicId: string, locale = 'en') {
  const topicPath = getTopicPathSegments(topicId, locale)
  const [groupSegment, ...topicSegments] = topicPath

  if (!groupSegment || topicSegments.length === 0) {
    return getTopicIndexHref(locale)
  }

  return `${getTopicIndexHref(locale)}/${groupSegment}/${topicSegments.join('/')}`
}

export function getTopicPageHref(topicId: string, locale = 'en', page = 1) {
  const baseHref = getTopicHref(topicId, locale)
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1

  return normalizedPage <= 1 ? baseHref : `${baseHref}/page/${normalizedPage}`
}
