import { getSiteGiscusLang, type SiteLocale } from '@/lib/site-copy'
import { hasCommentsEnabled, siteUrls } from '@/lib/site-config'

export type GiscusConfig = {
  category: string
  categoryId: string
  emitMetadata: string
  inputPosition: string
  lang: string
  mapping: string
  reactionsEnabled: string
  repo: string
  repoId: string
  strict: string
  theme: string
}

export function getGiscusConfig(locale: SiteLocale): GiscusConfig | null {
  if (!hasCommentsEnabled()) {
    return null
  }

  const repo = import.meta.env.PUBLIC_GISCUS_REPO
  const repoId = import.meta.env.PUBLIC_GISCUS_REPO_ID
  const category = import.meta.env.PUBLIC_GISCUS_CATEGORY
  const categoryId = import.meta.env.PUBLIC_GISCUS_CATEGORY_ID

  if (!repo || !repoId || !category || !categoryId) {
    return null
  }

  const configuredTheme = import.meta.env.PUBLIC_GISCUS_THEME

  return {
    category,
    categoryId,
    emitMetadata: import.meta.env.PUBLIC_GISCUS_EMIT_METADATA ?? '0',
    inputPosition: import.meta.env.PUBLIC_GISCUS_INPUT_POSITION ?? 'bottom',
    lang: getSiteGiscusLang(locale),
    mapping: import.meta.env.PUBLIC_GISCUS_MAPPING ?? 'pathname',
    reactionsEnabled: import.meta.env.PUBLIC_GISCUS_REACTIONS_ENABLED ?? '1',
    repo,
    repoId,
    strict: import.meta.env.PUBLIC_GISCUS_STRICT ?? '0',
    theme: configuredTheme && configuredTheme !== 'app' ? configuredTheme : siteUrls.giscusTheme,
  }
}
