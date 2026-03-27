import { getPageTypeHref } from '@/lib/section-manifest'

export function getTracksHref(locale = 'en', slug?: string | null) {
  return getPageTypeHref('tracks', locale, slug)
}

export function getTracksPageHref(locale = 'en', page = 1) {
  const indexHref = getTracksHref(locale)
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1

  return normalizedPage <= 1 || !indexHref ? indexHref : `${indexHref}/page/${normalizedPage}`
}

export function getTracksTagHref(locale = 'en', tagSlug: string) {
  return `${getTracksHref(locale)}/tag/${encodeURIComponent(tagSlug)}`
}

export function getTracksTagPageHref(locale = 'en', tagSlug: string, page = 1) {
  const indexHref = getTracksTagHref(locale, tagSlug)
  const normalizedPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1

  return normalizedPage <= 1 ? indexHref : `${indexHref}/page/${normalizedPage}`
}
