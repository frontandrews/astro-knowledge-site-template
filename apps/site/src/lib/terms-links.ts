import { brandConfig } from '@/brand/brand.config'
import { getLocalePath, getLocalizedValue } from '@/lib/locale-config'

export function getTermsHref(locale = 'en') {
  return getLocalePath(locale, getLocalizedValue(brandConfig.legal.routes.terms, locale))
}
