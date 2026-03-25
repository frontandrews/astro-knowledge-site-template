import { brandConfig } from '@/brand/brand.config'
import { getLocalePath, getLocalizedValue } from '@/lib/locale-config'

export function getPrivacyHref(locale = 'en') {
  return getLocalePath(locale, getLocalizedValue(brandConfig.legal.routes.privacy, locale))
}
