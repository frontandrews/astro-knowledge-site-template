import { getLocalePath, normalizeSiteLocale } from '@/lib/locale-config'
import { getPageTypeHref } from '@/lib/section-manifest'

type GlossaryEntryLike = {
  id: string
  data: {
    locale?: string | null
  }
}

export function getGlossaryIndexHref(locale = 'en') {
  return getPageTypeHref('glossary', locale) ?? getLocalePath(locale)
}

export function getGlossaryHrefFromEntry(entry: GlossaryEntryLike) {
  const locale = normalizeSiteLocale(entry.data.locale)
  const slug = entry.id.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean).at(-1)

  return slug ? `${getGlossaryIndexHref(locale)}/${slug}` : getGlossaryIndexHref(locale)
}
