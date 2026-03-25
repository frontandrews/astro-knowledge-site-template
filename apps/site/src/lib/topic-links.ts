import { getTopicGroupRouteSegment, getTopicRouteSegment } from '@template/content'
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
  const baseHref = getTopicIndexHref(locale)

  return `${baseHref}/${getTopicGroupRouteSegment(groupId, locale)}`
}

export function getTopicGroupPageHref(groupId: string, locale = 'en', page = 1) {
  const baseHref = getTopicGroupHref(groupId, locale)
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1

  return normalizedPage <= 1 ? baseHref : `${baseHref}/page/${normalizedPage}`
}

export function getTopicHref(topicId: string, locale = 'en') {
  const params = new URLSearchParams({
    topic: getTopicRouteSegment(topicId, locale),
  })

  return `${getTopicIndexHref(locale)}?${params.toString()}`
}
