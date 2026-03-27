const LEADING_AND_TRAILING_SLASHES = /^\/+|\/+$/g

function normalizeString(value: string) {
  return value.normalize('NFC')
}

export function getNormalizedRouteSegments(pathname: string) {
  const normalizedPathname = normalizeString(pathname).replace(LEADING_AND_TRAILING_SLASHES, '')

  return normalizedPathname
    .split('/')
    .filter(Boolean)
}

export function getNormalizedRouteSegment(segment: string) {
  return getNormalizedRouteSegments(segment).join('/')
}

export function getEntryLeafRouteSegment(entryId: string) {
  return getNormalizedRouteSegments(entryId).at(-1) ?? normalizeString(entryId)
}

export function encodeRouteSegment(segment: string) {
  return encodeURIComponent(normalizeString(segment))
}

export function encodeRoutePath(pathname: string) {
  return getNormalizedRouteSegments(pathname)
    .map((segment) => encodeRouteSegment(segment))
    .join('/')
}

export function getRouteHref(pathname: string) {
  const encodedPath = encodeRoutePath(pathname)
  return encodedPath ? `/${encodedPath}` : '/'
}

export function getCanonicalRouteParamsKey(params: Record<string, string>) {
  return JSON.stringify(
    Object.entries(params)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, encodeRouteSegment(value)]),
  )
}

export function getCanonicalRouteLabel(params: Record<string, string>) {
  const orderedSegments = [params.locale, params.section, params.slug].filter(Boolean)

  if (orderedSegments.length > 0) {
    return `/${orderedSegments.map((segment) => encodeRouteSegment(segment)).join('/')}`
  }

  return JSON.stringify(
    Object.fromEntries(
      Object.entries(params)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => [key, encodeRouteSegment(value)]),
    ),
  )
}
