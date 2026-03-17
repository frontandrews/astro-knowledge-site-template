import { getAllDecks } from '@prepdeck/content'

import { createEmptyProgressStore, setCardStatus } from '@/lib/progress'
import { getMockInterviewEntries } from '@/lib/mock-interview'

describe('mock interview helpers', () => {
  it('builds a mixed interview run with one card per deck before repeating decks', () => {
    const entries = getMockInterviewEntries(createEmptyProgressStore(), getAllDecks(), 5)

    expect(entries).toHaveLength(5)
    expect(new Set(entries.map((entry) => entry.deckId)).size).toBe(5)
  })

  it('prioritizes weak cards ahead of unseen cards', () => {
    let store = createEmptyProgressStore()
    store = setCardStatus(store, 'react-rendering-core', 'react-context-performance', 'partial')

    const entries = getMockInterviewEntries(store, getAllDecks(), 3)

    expect(entries[0]?.deckId).toBe('react-rendering-core')
    expect(entries[0]?.card.id).toBe('react-context-performance')
  })
})
