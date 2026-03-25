/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_APP_URL?: string
  readonly PUBLIC_GISCUS_CATEGORY?: string
  readonly PUBLIC_GISCUS_CATEGORY_ID?: string
  readonly PUBLIC_GISCUS_EMIT_METADATA?: string
  readonly PUBLIC_GISCUS_INPUT_POSITION?: string
  readonly PUBLIC_GISCUS_MAPPING?: string
  readonly PUBLIC_GISCUS_REACTIONS_ENABLED?: string
  readonly PUBLIC_GISCUS_REPO?: string
  readonly PUBLIC_GISCUS_REPO_ID?: string
  readonly PUBLIC_GISCUS_STRICT?: string
  readonly PUBLIC_GISCUS_THEME?: string
  readonly PUBLIC_GOVERNING_LAW?: string
  readonly PUBLIC_GOVERNING_VENUE?: string
  readonly PUBLIC_LEGAL_EMAIL?: string
  readonly PUBLIC_LEGAL_OWNER_LOCATION?: string
  readonly PUBLIC_LEGAL_OWNER_NAME?: string
  readonly PUBLIC_NEWSLETTER_URL?: string
  readonly PUBLIC_SITE_DESCRIPTION?: string
  readonly PUBLIC_SITE_NAME?: string
  readonly PUBLIC_SITE_URL?: string
  readonly PUBLIC_STORAGE_NAMESPACE?: string
  readonly PUBLIC_SUPPORT_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
