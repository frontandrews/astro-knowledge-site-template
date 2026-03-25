import { getSiteCopy } from '@/lib/site-copy'
import type { SiteLocale } from '@/lib/site-copy'

export function translateSiteLabel(label: string, locale?: string | null) {
  return getSiteCopy(locale).siteLabels[label] ?? label
}

export function translateSiteLabels(labels: string[], locale?: string | null) {
  return labels.map((label) => translateSiteLabel(label, locale))
}

export function getTranslatedSiteLabel(label: string, locale: SiteLocale) {
  return translateSiteLabel(label, locale)
}
