import {
  brandConfig,
  type BrandLocale,
  type HomeDefaultSection,
  type LocalizedBrandText,
  type ShellFeature,
} from '@/brand/brand.config'
import { getLocalizedValue, normalizeSiteLocale } from '@/lib/locale-config'
import {
  getEnabledSections,
  getSection,
  getSectionByPageType,
  isSupportedSectionPageType,
  isSectionEnabled as isEnabledInManifest,
} from '@/lib/section-manifest'

type ConfigLocale = BrandLocale

const FEED_METADATA: Record<string, (siteName: string) => { description: string; title: string }> = {
  en: (siteName) => ({
    description: `${siteName} in English, with articles, tracks, concepts, and reference content organized for study.`,
    title: siteName,
  }),
  'pt-br': (siteName) => ({
    description: `${siteName} em portugues, com artigos, trilhas, conceitos e referencias organizadas para estudo.`,
    title: `${siteName} PT-BR`,
  }),
}

const LEGAL_FALLBACKS = {
  governingLaw: {
    en: 'the laws applicable to the operator',
    'pt-br': 'as leis aplicaveis ao operador',
  },
  governingVenue: {
    en: 'the courts applicable to the operator',
    'pt-br': 'o foro aplicavel ao operador',
  },
  operatorLocation: {
    en: 'the operator jurisdiction',
    'pt-br': 'a jurisdicao do operador',
  },
  operatorName: {
    en: 'the site operator',
    'pt-br': 'o operador do site',
  },
  templateNotice: {
    en: 'This is a starter template legal page. Review and adapt the policy and terms before publishing this project to production.',
    'pt-br': 'Este texto e um modelo inicial de template. Revise e adapte a politica e os termos antes de publicar este projeto em producao.',
  },
} as const

function readPublicEnv(value: string | undefined) {
  const normalized = value?.trim()

  return normalized && normalized.length > 0 ? normalized : null
}

function normalizeSiteUrl(value: string | null) {
  try {
    const resolved = new URL(value ?? brandConfig.site.url)
    return resolved.toString().replace(/\/$/, '')
  } catch {
    return brandConfig.site.url
  }
}

function normalizeStorageNamespace(value: string | null) {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized && normalized.length > 0 ? normalized : brandConfig.site.storageNamespace
}

function getLocalizedFallback(locale: ConfigLocale, values: Record<string, string>) {
  const normalizedLocale = normalizeSiteLocale(locale)

  return values[normalizedLocale] ?? values[brandConfig.locales.default] ?? Object.values(values)[0]
}

function resolveLocalizedBrandText(locale: ConfigLocale, text: LocalizedBrandText) {
  return getLocalizedValue(text, locale)
}

export const siteConfig = {
  features: { ...brandConfig.features },
  home: {
    ...brandConfig.home,
  },
  integrations: {
    comments: {
      ...brandConfig.integrations.comments,
    },
    newsletter: {
      ...brandConfig.integrations.newsletter,
    },
  },
  legal: {
    governingLaw: readPublicEnv(import.meta.env.PUBLIC_GOVERNING_LAW) ?? brandConfig.legal.governingLaw,
    governingVenue:
      readPublicEnv(import.meta.env.PUBLIC_GOVERNING_VENUE) ?? brandConfig.legal.governingVenue,
    legalEmail: readPublicEnv(import.meta.env.PUBLIC_LEGAL_EMAIL) ?? brandConfig.legal.legalEmail,
    ownerLocation:
      readPublicEnv(import.meta.env.PUBLIC_LEGAL_OWNER_LOCATION) ?? brandConfig.legal.ownerLocation,
    ownerName: readPublicEnv(import.meta.env.PUBLIC_LEGAL_OWNER_NAME) ?? brandConfig.legal.ownerName,
    supportEmail:
      readPublicEnv(import.meta.env.PUBLIC_SUPPORT_EMAIL) ?? brandConfig.legal.supportEmail,
  },
  site: {
    description:
      readPublicEnv(import.meta.env.PUBLIC_SITE_DESCRIPTION) ?? brandConfig.site.description,
    name: readPublicEnv(import.meta.env.PUBLIC_SITE_NAME) ?? brandConfig.site.name,
    siteUrl: normalizeSiteUrl(readPublicEnv(import.meta.env.PUBLIC_SITE_URL)),
    storageNamespace: normalizeStorageNamespace(
      readPublicEnv(import.meta.env.PUBLIC_STORAGE_NAMESPACE),
    ),
  },
} as const

export const siteUrls = {
  giscusTheme: new URL('/giscus-theme.css?v=1', `${siteConfig.site.siteUrl}/`).toString(),
  socialImage: new URL('/og-image.svg', `${siteConfig.site.siteUrl}/`).toString(),
  sitemap: new URL('/sitemap-index.xml', `${siteConfig.site.siteUrl}/`).toString(),
} as const

export const siteStorageKeys = {
  completedArticles: `${siteConfig.site.storageNamespace}.completed-articles.v1`,
  localePreference: `${siteConfig.site.storageNamespace}.locale-preference.v1`,
} as const

export const siteEvents = {
  articleReadingReset: `${siteConfig.site.storageNamespace}:article-reading-reset`,
  challengeSolved: `${siteConfig.site.storageNamespace}:challenge-solved`,
  completedArticlesChanged: `${siteConfig.site.storageNamespace}:completed-articles-changed`,
} as const

export function getSitePageTitle(title: string) {
  return `${title} | ${siteConfig.site.name}`
}

export function getSiteName() {
  return siteConfig.site.name
}

export function getSiteDescription() {
  return siteConfig.site.description
}

export function isFeatureEnabled(feature: ShellFeature) {
  return siteConfig.features[feature]
}

export function isSectionEnabled(sectionId: string) {
  return isEnabledInManifest(sectionId)
}

export function getEnabledSectionKeys() {
  return getEnabledSections().map((section) => section.id)
}

export function getHomeDefaultSection(): HomeDefaultSection {
  if (siteConfig.home.defaultSection === 'landing') {
    return 'landing'
  }

  if (siteConfig.home.defaultSection && getSection(siteConfig.home.defaultSection)) {
    return siteConfig.home.defaultSection
  }

  if (siteConfig.home.defaultSection) {
    const pageTypeSection = isSupportedSectionPageType(siteConfig.home.defaultSection)
      ? getSectionByPageType(siteConfig.home.defaultSection)
      : null

    if (pageTypeSection) {
      return pageTypeSection.id
    }
  }

  const firstEnabledSection = getEnabledSections()[0]

  return firstEnabledSection?.id ?? 'landing'
}

export function getHomeLandingCopy(locale: ConfigLocale) {
  return {
    description: resolveLocalizedBrandText(locale, siteConfig.home.landing.description),
    eyebrow: resolveLocalizedBrandText(locale, siteConfig.home.landing.eyebrow),
    title: resolveLocalizedBrandText(locale, siteConfig.home.landing.title),
  }
}

export function getNewsletterActionUrl() {
  const configuredAction = readPublicEnv(import.meta.env.PUBLIC_NEWSLETTER_URL)

  if (!siteConfig.features.newsletter || !siteConfig.integrations.newsletter.enabled) {
    return null
  }

  return configuredAction
}

export function hasCommentsEnabled() {
  return siteConfig.features.comments && siteConfig.integrations.comments.enabled
}

export function getFeedMetadata(locale: ConfigLocale) {
  const normalizedLocale = normalizeSiteLocale(locale)
  return (FEED_METADATA[normalizedLocale] ?? FEED_METADATA[brandConfig.locales.default])(siteConfig.site.name)
}

export function getLegalOperatorName(locale: ConfigLocale) {
  return siteConfig.legal.ownerName ?? getLocalizedFallback(locale, LEGAL_FALLBACKS.operatorName)
}

export function getLegalOperatorLocation(locale: ConfigLocale) {
  return siteConfig.legal.ownerLocation ?? getLocalizedFallback(locale, LEGAL_FALLBACKS.operatorLocation)
}

export function getLegalGoverningLaw(locale: ConfigLocale) {
  return siteConfig.legal.governingLaw ?? getLocalizedFallback(locale, LEGAL_FALLBACKS.governingLaw)
}

export function getLegalVenue(locale: ConfigLocale) {
  return siteConfig.legal.governingVenue ?? getLocalizedFallback(locale, LEGAL_FALLBACKS.governingVenue)
}

export function getLegalTemplateNotice(locale: ConfigLocale) {
  return getLocalizedFallback(locale, LEGAL_FALLBACKS.templateNotice)
}
