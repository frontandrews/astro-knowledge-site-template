import { getAllDecks, getDeckManifest } from '@prepdeck/content'

import { createEmptyProgressStore, getDeckCounts, setCardStatus } from '@/lib/progress'
import { getSessionPresets } from '@/lib/session-presets'

function buildRecords(store = createEmptyProgressStore()) {
  const summaries = getDeckManifest().decks

  return getAllDecks().map((deck) => ({
    counts: getDeckCounts(store, deck),
    deck,
    summary: summaries.find((entry) => entry.id === deck.id)!,
  }))
}

describe('session presets', () => {
  it('builds a useful starter set for a clean library', () => {
    const presets = getSessionPresets(buildRecords())

    expect(presets).toHaveLength(4)
    expect(presets[0]?.label).toBe('Start warm-up')
    expect(presets.some((preset) => preset.label === 'Start mock interview')).toBe(true)
    expect(presets.some((preset) => preset.label === 'Run interview rep')).toBe(true)
    expect(presets.some((preset) => preset.label === 'Take a quick warm-up')).toBe(true)
  })

  it('promotes continue and weak sessions when progress exists', () => {
    let store = createEmptyProgressStore()
    store = setCardStatus(store, 'react-rendering-core', 'react-derived-state-danger', 'partial')

    const presets = getSessionPresets(buildRecords(store))

    expect(presets[0]?.label).toBe('Continue latest')
    expect(presets.some((preset) => preset.label === 'Fix weak cards')).toBe(true)
  })
})
