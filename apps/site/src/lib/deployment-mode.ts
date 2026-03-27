export const DEFAULT_SITE_URL = 'https://example.com'
export const LOCAL_PREVIEW_SITE_URL = 'http://127.0.0.1:4321'

export type SiteDeploymentMode = 'local' | 'preview' | 'production'

type ResolveSiteDeploymentInput = {
  activeSiteUrl?: string | null
  configuredSiteUrl?: string | null
}

function normalizeSiteUrl(value: string | null | undefined) {
  try {
    return new URL(value ?? '').toString().replace(/\/$/, '')
  } catch {
    return null
  }
}

export function resolveSiteDeployment({
  activeSiteUrl,
  configuredSiteUrl,
}: ResolveSiteDeploymentInput) {
  const normalizedConfiguredSiteUrl = normalizeSiteUrl(configuredSiteUrl) ?? DEFAULT_SITE_URL
  const normalizedActiveSiteUrl =
    normalizeSiteUrl(activeSiteUrl)
    ?? (normalizedConfiguredSiteUrl !== DEFAULT_SITE_URL
      ? normalizedConfiguredSiteUrl
      : LOCAL_PREVIEW_SITE_URL)

  const mode: SiteDeploymentMode =
    normalizedActiveSiteUrl === normalizedConfiguredSiteUrl
      ? normalizedConfiguredSiteUrl === DEFAULT_SITE_URL
        ? 'local'
        : 'production'
      : normalizedActiveSiteUrl === LOCAL_PREVIEW_SITE_URL
        ? 'local'
        : 'preview'

  return {
    configuredSiteUrl: normalizedConfiguredSiteUrl,
    mode,
    shouldAdvertiseFeed: mode !== 'preview',
    shouldIndex: mode === 'production',
    siteUrl: normalizedActiveSiteUrl,
  }
}

export function resolveRobotsMetaContent({
  pageNoindex = false,
  siteShouldIndex,
}: {
  pageNoindex?: boolean
  siteShouldIndex: boolean
}) {
  if (!siteShouldIndex) {
    return 'noindex,nofollow'
  }

  return pageNoindex ? 'noindex,follow' : null
}

export function buildRobotsTxt({
  shouldIndex,
  sitemapUrl,
}: {
  shouldIndex: boolean
  sitemapUrl: string
}) {
  if (!shouldIndex) {
    return 'User-agent: *\nDisallow: /\n'
  }

  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`
}
