import { getLocaleHtmlLang, type SiteLocale } from '@/lib/locale-config'
import { siteConfig, siteUrls } from '@/lib/site-config'

type StructuredData = Record<string, unknown>

type ArticleSchemaInput = {
  dateModified?: string | null
  datePublished: string
  description: string
  keywords?: string[]
  locale: SiteLocale
  title: string
  url: string
}

type BreadcrumbSchemaInput = {
  items: {
    name: string
    url: string
  }[]
}

type WebsiteSchemaInput = {
  description: string
  locale: SiteLocale
  url: string
}

function compactObject<T extends StructuredData>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => {
      if (entryValue === null || entryValue === undefined) {
        return false
      }

      if (Array.isArray(entryValue)) {
        return entryValue.length > 0
      }

      return true
    }),
  ) as T
}

export function normalizeStructuredData(
  value?: StructuredData | StructuredData[] | null,
) {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

export function serializeStructuredData(value: StructuredData) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function createWebsiteSchema({
  description,
  locale,
  url,
}: WebsiteSchemaInput) {
  return compactObject({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    description,
    image: siteUrls.socialImage,
    inLanguage: getLocaleHtmlLang(locale),
    name: siteConfig.site.name,
    url,
  })
}

export function createArticleSchema({
  dateModified,
  datePublished,
  description,
  keywords = [],
  locale,
  title,
  url,
}: ArticleSchemaInput) {
  return compactObject({
    '@context': 'https://schema.org',
    '@type': 'Article',
    author: {
      '@type': 'Organization',
      name: siteConfig.site.name,
    },
    dateModified: dateModified ?? datePublished,
    datePublished,
    description,
    headline: title,
    image: [siteUrls.socialImage],
    inLanguage: getLocaleHtmlLang(locale),
    keywords,
    mainEntityOfPage: url,
    publisher: {
      '@type': 'Organization',
      logo: {
        '@type': 'ImageObject',
        url: siteUrls.socialImage,
      },
      name: siteConfig.site.name,
    },
    url,
  })
}

export function createBreadcrumbSchema({ items }: BreadcrumbSchemaInput) {
  return compactObject({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      item: item.url,
      name: item.name,
      position: index + 1,
    })),
  })
}
