import { getDeckById } from '@prepdeck/content'

import { createEmptyProgressStore, setCardStatus } from '@/lib/progress'
import {
  getStudyCards,
  getStudyInitialIndex,
  getStudyScope,
  getStudyScopeLabel,
} from '@/lib/study-session'

function getReactDeck() {
  const deck = getDeckById('react-rendering-core')

  if (!deck) {
    throw new Error('react-rendering-core deck is required for tests')
  }

  return deck
}

describe('study session helpers', () => {
  it('defaults unknown query values to the full deck scope', () => {
    expect(getStudyScope(null)).toBe('all')
    expect(getStudyScope('random')).toBe('all')
    expect(getStudyScope('weak')).toBe('weak')
    expect(getStudyScopeLabel('weak')).toBe('Weak cards only')
  })

  it('filters weak study cards to partial and not learned only', () => {
    const deck = getReactDeck()
    let store = createEmptyProgressStore()

    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'partial')

    const weakCards = getStudyCards(store, deck, 'weak')

    expect(weakCards.map((card) => card.id)).toEqual([deck.cards[1].id])
  })

  it('uses first unseen for continue mode on full deck sessions', () => {
    const deck = getReactDeck()
    let store = createEmptyProgressStore()

    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')

    expect(getStudyInitialIndex(store, deck, 'all', 'continue')).toBe(1)
    expect(getStudyInitialIndex(store, deck, 'weak', 'continue')).toBe(0)
  })
})
