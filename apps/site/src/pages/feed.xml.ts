import rss from '@astrojs/rss'

import { getArticleFeedItems } from '@/lib/rss'
import { getDefaultLocale, getLocaleHtmlLang } from '@/lib/locale-config'
import { getSectionDisabledResponse } from '@/lib/section-gate'
import { getFeedMetadata, siteConfig } from '@/lib/site-config'

export async function GET(context: { site?: URL }) {
  const disabledResponse = getSectionDisabledResponse('articles')

  if (disabledResponse) {
    return disabledResponse
  }

  const locale = getDefaultLocale()
  const metadata = getFeedMetadata(locale)
  const items = await getArticleFeedItems(locale)

  return rss({
    customData: `<language>${getLocaleHtmlLang(locale).toLowerCase()}</language>`,
    description: metadata.description,
    items,
    site: context.site ?? siteConfig.site.siteUrl,
    title: metadata.title,
  })
}
