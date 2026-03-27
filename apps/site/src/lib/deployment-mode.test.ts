import { describe, expect, it } from 'vitest'

import {
  buildRobotsTxt,
  DEFAULT_SITE_URL,
  LOCAL_PREVIEW_SITE_URL,
  resolveRobotsMetaContent,
  resolveSiteDeployment,
} from '@/lib/deployment-mode'

describe('resolveSiteDeployment', () => {
  it('treats matching configured and active non-template URLs as production', () => {
    expect(
      resolveSiteDeployment({
        activeSiteUrl: 'https://seniorpath.dev',
        configuredSiteUrl: 'https://seniorpath.dev',
      }),
    ).toMatchObject({
      mode: 'production',
      shouldAdvertiseFeed: true,
      shouldIndex: true,
      siteUrl: 'https://seniorpath.dev',
    })
  })

  it('treats a different active site URL as preview', () => {
    expect(
      resolveSiteDeployment({
        activeSiteUrl: 'https://feature-branch.vercel.app',
        configuredSiteUrl: 'https://seniorpath.dev',
      }),
    ).toMatchObject({
      mode: 'preview',
      shouldAdvertiseFeed: false,
      shouldIndex: false,
      siteUrl: 'https://feature-branch.vercel.app',
    })
  })

  it('falls back to the local preview URL when only the template URL exists', () => {
    expect(
      resolveSiteDeployment({
        activeSiteUrl: null,
        configuredSiteUrl: DEFAULT_SITE_URL,
      }),
    ).toMatchObject({
      mode: 'local',
      shouldAdvertiseFeed: true,
      shouldIndex: false,
      siteUrl: LOCAL_PREVIEW_SITE_URL,
    })
  })
})

describe('preview robots helpers', () => {
  it('forces noindex,nofollow for preview and local deployments', () => {
    expect(resolveRobotsMetaContent({ pageNoindex: false, siteShouldIndex: false })).toBe(
      'noindex,nofollow',
    )
    expect(resolveRobotsMetaContent({ pageNoindex: true, siteShouldIndex: false })).toBe(
      'noindex,nofollow',
    )
  })

  it('keeps noindex,follow for paginated production pages', () => {
    expect(resolveRobotsMetaContent({ pageNoindex: true, siteShouldIndex: true })).toBe(
      'noindex,follow',
    )
    expect(resolveRobotsMetaContent({ pageNoindex: false, siteShouldIndex: true })).toBeNull()
  })

  it('builds a restrictive robots.txt outside production', () => {
    expect(
      buildRobotsTxt({
        shouldIndex: false,
        sitemapUrl: 'https://preview.example.com/sitemap-index.xml',
      }),
    ).toBe('User-agent: *\nDisallow: /\n')

    expect(
      buildRobotsTxt({
        shouldIndex: true,
        sitemapUrl: 'https://seniorpath.dev/sitemap-index.xml',
      }),
    ).toBe('User-agent: *\nAllow: /\n\nSitemap: https://seniorpath.dev/sitemap-index.xml\n')
  })
})
