import type { Deck, Flashcard, ProgressStore } from '@prepdeck/schemas'

import { getCardStatus, getFirstUnseenCardIndex } from '@/lib/progress'

export type StudyScope = 'all' | 'weak'

export function getStudyScope(value: string | null): StudyScope {
  return value === 'weak' ? 'weak' : 'all'
}

export function getStudyCards(
  store: ProgressStore,
  deck: Deck,
  scope: StudyScope,
): Flashcard[] {
  if (scope === 'weak') {
    return deck.cards.filter((card) => {
      const status = getCardStatus(store, deck.id, card.id)
      return status === 'partial' || status === 'not_learned'
    })
  }

  return deck.cards
}

export function getStudyInitialIndex(
  store: ProgressStore,
  deck: Deck,
  scope: StudyScope,
  mode: string,
): number | null {
  if (scope === 'weak') {
    return 0
  }

  if (mode === 'continue') {
    return getFirstUnseenCardIndex(store, deck)
  }

  return 0
}

export function getStudyScopeLabel(scope: StudyScope): string {
  return scope === 'weak' ? 'Weak cards only' : 'Full deck'
}
