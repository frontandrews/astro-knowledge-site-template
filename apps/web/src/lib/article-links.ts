import { getGuideRoutePath } from '@prepdeck/content'
import type { Deck } from '@prepdeck/schemas'

const LEGACY_GUIDE_SEGMENTS = ['/guides', '/guias']

function getSiteBase(siteBaseUrl?: string): string {
  const normalizedBase = siteBaseUrl?.trim().replace(/\/+$/, '') ?? ''

  if (!normalizedBase) {
    return ''
  }

  const legacySegment = LEGACY_GUIDE_SEGMENTS.find((segment) => normalizedBase.endsWith(segment))

  return legacySegment
    ? normalizedBase.slice(0, normalizedBase.length - legacySegment.length)
    : normalizedBase
}

export function resolveArticleHref(routePath: string, siteBaseUrl?: string): string {
  const normalizedRoutePath = routePath.replace(/^\/+/, '')
  const siteBase = getSiteBase(siteBaseUrl)

  return siteBase ? `${siteBase}/${normalizedRoutePath}` : `/${normalizedRoutePath}`
}

export function getArticleHref(guideId: string): string | null {
  const routePath = getGuideRoutePath(guideId)

  if (!routePath) {
    return null
  }

  return resolveArticleHref(routePath, import.meta.env.VITE_PUBLIC_SITE_URL)
}

export type DeckArticleLink = {
  guideId: string
  question: string
  routePath: string
}

export function getDeckArticleLinks(deck: Deck): DeckArticleLink[] {
  const seenGuideIds = new Set<string>()

  return deck.cards.flatMap((card) => {
    if (!card.learnMoreGuideId || seenGuideIds.has(card.learnMoreGuideId)) {
      return []
    }

    const routePath = getGuideRoutePath(card.learnMoreGuideId)

    if (!routePath) {
      return []
    }

    seenGuideIds.add(card.learnMoreGuideId)

    return [
      {
        guideId: card.learnMoreGuideId,
        question: card.question,
        routePath,
      },
    ]
  })
}
