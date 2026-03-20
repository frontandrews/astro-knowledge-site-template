const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ContactLink = {
  href: string
  value: string
}

function resolveEmail(value: string | undefined): ContactLink | null {
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
    legalEmail: resolveEmail(import.meta.env.PUBLIC_LEGAL_EMAIL),
    supportEmail: resolveEmail(import.meta.env.PUBLIC_SUPPORT_EMAIL),
  }
}
