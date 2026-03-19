export function getTracksHref(locale = 'en', slug?: string | null) {
  const baseHref = locale === 'pt-br' ? '/pt-br/trilhas' : '/tracks'

  if (!slug) {
    return baseHref
  }

  return `${baseHref}/${slug}`
}
