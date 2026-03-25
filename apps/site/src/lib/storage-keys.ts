import { siteStorageKeys } from '@/lib/site-config'

export { siteStorageKeys }

export type SiteStorageKey = (typeof siteStorageKeys)[keyof typeof siteStorageKeys]
