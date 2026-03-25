type HistoryMode = 'push' | 'replace'

type UrlMutationOptions = {
  mode?: HistoryMode
  preserveHash?: boolean
}

function getBrowserUrl() {
  if (typeof window === 'undefined') {
    return null
  }

  return new URL(window.location.href)
}

function updateQueryParam(
  searchParams: URLSearchParams,
  key: string,
  value: string | null | undefined,
) {
  if (value && value.length > 0) {
    searchParams.set(key, value)
    return
  }

  searchParams.delete(key)
}

function toHistoryUrl(url: URL, preserveHash = true) {
  return `${url.pathname}${url.search}${preserveHash ? url.hash : ''}`
}

export function readQueryParam(key: string) {
  return getBrowserUrl()?.searchParams.get(key) ?? null
}

export function buildUrlWithQueryParam(
  key: string,
  value: string | null | undefined,
  options: Pick<UrlMutationOptions, 'preserveHash'> = {},
) {
  const url = getBrowserUrl()

  if (!url) {
    return null
  }

  updateQueryParam(url.searchParams, key, value)

  if (options.preserveHash === false) {
    url.hash = ''
  }

  return url
}

export function setQueryParam(
  key: string,
  value: string | null | undefined,
  options: UrlMutationOptions = {},
) {
  if (typeof window === 'undefined') {
    return
  }

  const url = buildUrlWithQueryParam(key, value, { preserveHash: options.preserveHash })

  if (!url) {
    return
  }

  const nextUrl = toHistoryUrl(url, options.preserveHash !== false)
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`

  if (nextUrl === currentUrl) {
    return
  }

  if (options.mode === 'push') {
    window.history.pushState(null, '', nextUrl)
    return
  }

  window.history.replaceState(null, '', nextUrl)
}

export function subscribeToQueryParam(
  key: string,
  listener: (value: string | null) => void,
) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const sync = () => {
    listener(readQueryParam(key))
  }

  sync()
  window.addEventListener('popstate', sync)

  return () => {
    window.removeEventListener('popstate', sync)
  }
}

export function clearHash(options: Pick<UrlMutationOptions, 'mode'> = {}) {
  if (typeof window === 'undefined' || !window.location.hash) {
    return
  }

  const nextUrl = `${window.location.pathname}${window.location.search}`

  if (options.mode === 'push') {
    window.history.pushState(null, '', nextUrl)
    return
  }

  window.history.replaceState(null, '', nextUrl)
}

export function encodeBase64UrlValue(value: string) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
}

export function decodeBase64UrlValue(value: string) {
  try {
    const binary = atob(value)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))

    return new TextDecoder().decode(bytes)
  } catch {
    return null
  }
}

export function readBase64QueryParam(key: string) {
  const raw = readQueryParam(key)

  if (!raw) {
    return null
  }

  return decodeBase64UrlValue(raw)
}
