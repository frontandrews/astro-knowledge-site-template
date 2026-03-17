import { getGuideRoutePath } from '@prepdeck/content'
import type { Deck } from '@prepdeck/schemas'

const GUIDES_PATH = '/guides'

function getGuidesBase(siteBaseUrl?: string): string {
  const normalizedBase = siteBaseUrl?.trim().replace(/\/+$/, '') ?? ''

  if (!normalizedBase) {
    return GUIDES_PATH
  }

  return normalizedBase.endsWith(GUIDES_PATH)
    ? normalizedBase
    : `${normalizedBase}${GUIDES_PATH}`
}

export function resolveArticleHref(routePath: string, siteBaseUrl?: string): string {
  return `${getGuidesBase(siteBaseUrl)}/${routePath}`
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
