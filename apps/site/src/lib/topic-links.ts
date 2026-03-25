import { getTopicGroupRouteSegment, getTopicRouteSegment } from '@template/content'
import { getLocalePath } from '@/lib/locale-config'
import { getPageTypeHref } from '@/lib/section-manifest'

export function getTopicIndexHref(locale = 'en') {
  return getPageTypeHref('topics', locale) ?? getLocalePath(locale)
}

export function getTopicGroupHref(groupId: string, locale = 'en') {
  const baseHref = getTopicIndexHref(locale)

  return `${baseHref}/${getTopicGroupRouteSegment(groupId, locale)}`
}

export function getTopicHref(topicId: string, locale = 'en') {
  const params = new URLSearchParams({
    topic: getTopicRouteSegment(topicId, locale),
  })

  return `${getTopicIndexHref(locale)}?${params.toString()}`
}
