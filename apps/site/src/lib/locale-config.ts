import { brandConfig, type BrandLocaleDefinition } from '@/brand/brand.config'

export type SiteLocale = string
export type SiteLocaleDefinition = BrandLocaleDefinition
export type LocalizedText = Record<string, string>
type LocalizedEntryLike = {
  data: {
    locale?: string | null
  }
}

const localeDefinitions = [...brandConfig.locales.supported]
const localeByCode = new Map(localeDefinitions.map((locale) => [locale.code, locale]))

export function getSupportedLocaleDefinitions() {
  return localeDefinitions
}

export function getSupportedLocales() {
  return localeDefinitions.map((locale) => locale.code)
}

export function getDefaultLocale() {
  return brandConfig.locales.default
}

export function getNonDefaultLocales() {
  const defaultLocale = getDefaultLocale()

  return getSupportedLocales().filter((locale) => locale !== defaultLocale)
}

export function isSupportedLocale(value?: string | null): value is SiteLocale {
  return Boolean(value && localeByCode.has(value))
}

export function normalizeSiteLocale(value?: string | null): SiteLocale {
  return isSupportedLocale(value) ? value : getDefaultLocale()
}

export function getLocaleDefinition(locale?: string | null) {
  return localeByCode.get(normalizeSiteLocale(locale)) ?? localeDefinitions[0]
}

export function getLocaleHtmlLang(locale?: string | null) {
  return getLocaleDefinition(locale)?.htmlLang ?? getDefaultLocale()
}

export function getLocaleLabel(locale?: string | null) {
  return getLocaleDefinition(locale)?.label ?? normalizeSiteLocale(locale)
}

export function getLocaleShortLabel(locale?: string | null) {
  return getLocaleDefinition(locale)?.shortLabel ?? normalizeSiteLocale(locale).toUpperCase()
}

export function getLocalePrefix(locale?: string | null) {
  const normalizedLocale = normalizeSiteLocale(locale)

  return normalizedLocale === getDefaultLocale() ? '' : `/${normalizedLocale}`
}

export function getLocalePath(locale?: string | null, pathname = '') {
  const prefix = getLocalePrefix(locale)
  const normalizedPath = pathname.replace(/^\/+|\/+$/g, '')

  if (!normalizedPath) {
    return prefix || '/'
  }

  return prefix ? `${prefix}/${normalizedPath}` : `/${normalizedPath}`
}

export function getPathLocale(pathname: string) {
  const firstSegment = pathname.replace(/^\/+/, '').split('/').filter(Boolean).at(0)

  if (firstSegment && isSupportedLocale(firstSegment) && firstSegment !== getDefaultLocale()) {
    return firstSegment
  }

  return getDefaultLocale()
}

export function getLocaleFeedHref(locale?: string | null) {
  return getLocalePath(locale, 'feed.xml')
}

export function getLocalizedValue(text: LocalizedText | null | undefined, locale?: string | null) {
  if (!text) {
    return ''
  }

  const normalizedLocale = normalizeSiteLocale(locale)

  return text[normalizedLocale] ?? text[getDefaultLocale()] ?? Object.values(text)[0] ?? ''
}

export function getLocaleHrefMap(baseHrefs?: Record<string, string | null | undefined>) {
  return Object.fromEntries(
    getSupportedLocales().map((locale) => [
      locale,
      baseHrefs?.[locale] ?? getLocalePath(locale),
    ]),
  )
}

export function resolveLocaleMap<T>(resolveValue: (locale: SiteLocale) => T) {
  return Object.fromEntries(
    getSupportedLocales().map((locale) => [locale, resolveValue(locale)]),
  ) as Record<string, T>
}

export function resolveLocaleHrefMap(
  resolveHref: (locale: SiteLocale) => string | null | undefined,
) {
  return getLocaleHrefMap(
    resolveLocaleMap((locale) => resolveHref(locale) ?? null),
  )
}

export function resolveLocalizedEntryHrefMap<Entry extends LocalizedEntryLike>(
  entries: Entry[],
  getHref: (entry: Entry) => string | null | undefined,
  fallbackHref?: (locale: SiteLocale) => string | null | undefined,
) {
  return resolveLocaleHrefMap((locale) => {
    const localizedEntry = entries.find(
      (entry) => normalizeSiteLocale(entry.data.locale) === locale,
    )

    return localizedEntry
      ? getHref(localizedEntry)
      : fallbackHref?.(locale) ?? null
  })
}
