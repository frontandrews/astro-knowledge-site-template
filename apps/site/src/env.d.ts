/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_LEGAL_EMAIL?: string
  readonly PUBLIC_SUPPORT_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
