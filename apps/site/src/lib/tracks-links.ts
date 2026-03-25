import { getPageTypeHref } from '@/lib/section-manifest'

export function getTracksHref(locale = 'en', slug?: string | null) {
  const baseHref = getPageTypeHref('tracks', locale)

  if (!baseHref || !slug) {
    return baseHref
  }

  return `${baseHref}/${slug}`
}
