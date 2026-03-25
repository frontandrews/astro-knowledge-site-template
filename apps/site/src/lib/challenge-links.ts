import { getLocalePath, normalizeSiteLocale } from '@/lib/locale-config'
import { getPageTypeHref } from '@/lib/section-manifest'

export function getChallengeIndexHref(locale = 'en') {
  return getPageTypeHref('challenges', locale) ?? getLocalePath(locale)
}

type ChallengeEntryLike = {
  id: string
  data: {
    locale?: string | null
  }
}

export function getChallengeSlugFromEntry(entry: ChallengeEntryLike) {
  return entry.id.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean).at(-1) ?? ''
}

export function getChallengeHrefFromEntry(entry: ChallengeEntryLike) {
  const locale = normalizeSiteLocale(entry.data.locale)
  const slug = getChallengeSlugFromEntry(entry)

  return slug ? `${getChallengeIndexHref(locale)}/${slug}` : getChallengeIndexHref(locale)
}
