import { getLocalePath, normalizeSiteLocale } from '@/lib/locale-config'
import { getEntryLeafRouteSegment } from '@/lib/route-segments'
import { getPageTypeHref } from '@/lib/section-manifest'

export function getChallengeIndexHref(locale = 'en') {
  return getPageTypeHref('challenges', locale) ?? getLocalePath(locale)
}

export function getChallengeIndexPageHref(locale = 'en', page = 1) {
  const indexHref = getChallengeIndexHref(locale)
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1

  return normalizedPage <= 1 ? indexHref : `${indexHref}/page/${normalizedPage}`
}

export function getChallengeTagHref(locale = 'en', tagSlug: string) {
  return `${getChallengeIndexHref(locale)}/tag/${encodeURIComponent(tagSlug)}`
}

export function getChallengeTagPageHref(locale = 'en', tagSlug: string, page = 1) {
  const indexHref = getChallengeTagHref(locale, tagSlug)
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1

  return normalizedPage <= 1 ? indexHref : `${indexHref}/page/${normalizedPage}`
}

type ChallengeEntryLike = {
  id: string
  data: {
    locale?: string | null
  }
}

export function getChallengeSlugFromEntry(entry: ChallengeEntryLike) {
  return getEntryLeafRouteSegment(entry.id)
}

export function getChallengeHrefFromEntry(entry: ChallengeEntryLike) {
  const locale = normalizeSiteLocale(entry.data.locale)
  const slug = getChallengeSlugFromEntry(entry)

  return getPageTypeHref('challenges', locale, slug) ?? getChallengeIndexHref(locale)
}
