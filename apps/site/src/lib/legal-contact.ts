import { siteConfig } from '@/lib/site-config'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ContactLink = {
  href: string
  value: string
}

function resolveEmail(value: string | null | undefined): ContactLink | null {
  const normalized = value?.trim()

  if (!normalized || !emailPattern.test(normalized)) {
    return null
  }

  return {
    href: `mailto:${normalized}`,
    value: normalized,
  }
}

export function getLegalContactLinks() {
  return {
    legalEmail: resolveEmail(siteConfig.legal.legalEmail),
    supportEmail: resolveEmail(siteConfig.legal.supportEmail),
  }
}
