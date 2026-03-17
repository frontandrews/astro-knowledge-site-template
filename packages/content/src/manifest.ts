import {
  deckManifestSchema,
  type DeckManifest,
  type DeckManifestEntry,
} from '@prepdeck/schemas'

import manifestRaw from './data/decks/index.json'

const manifest = deckManifestSchema.parse(manifestRaw)
const summariesById = Object.fromEntries(
  manifest.decks.map((summary) => [summary.id, summary]),
) as Record<string, DeckManifestEntry>

export function getDeckManifest(): DeckManifest {
  return manifest
}

export function getDeckSummaries(): DeckManifestEntry[] {
  return manifest.decks
}

export function getDeckSummaryById(deckId: string): DeckManifestEntry | undefined {
  return summariesById[deckId]
}

export function getDecksByTopic(): Record<string, DeckManifestEntry[]> {
  return manifest.decks.reduce<Record<string, DeckManifestEntry[]>>((acc, summary) => {
    if (!acc[summary.topic]) {
      acc[summary.topic] = []
    }

    acc[summary.topic].push(summary)
    return acc
  }, {})
}

export function getDecksByTrack(): Record<string, DeckManifestEntry[]> {
  return manifest.decks.reduce<Record<string, DeckManifestEntry[]>>((acc, summary) => {
    if (!acc[summary.track]) {
      acc[summary.track] = []
    }

    acc[summary.track].push(summary)
    return acc
  }, {})
}
