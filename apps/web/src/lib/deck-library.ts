import type { DeckManifestEntry } from '@prepdeck/schemas'

import { getTrackLabel } from '@/lib/track-labels'
import { getTopicLabel } from '@/lib/topic-labels'

type DeckCountsLike = {
  allLearned: boolean
  allSeen: boolean
  learned: number
  notLearned: number
  partial: number
  seen: number
  total: number
  unseen: number
}

export type DeckLibraryRecord = {
  counts: DeckCountsLike
  noteCount: number
  reviewDebt: number
  summary: DeckManifestEntry
}

export type DeckLibraryFilters = {
  difficulty: DeckManifestEntry['difficulty'] | 'all'
  query: string
  selectedTrack: string
  status: 'all' | 'has_notes' | 'needs_review' | 'started'
}

export function filterDeckLibraryRecords(
  records: DeckLibraryRecord[],
  filters: DeckLibraryFilters,
): DeckLibraryRecord[] {
  const normalizedQuery = normalize(filters.query)

  const nextRecords = records.filter((record) => {
    if (filters.selectedTrack !== 'all' && record.summary.track !== filters.selectedTrack) {
      return false
    }

    if (filters.difficulty !== 'all' && record.summary.difficulty !== filters.difficulty) {
      return false
    }

    if (filters.status === 'needs_review' && record.reviewDebt === 0) {
      return false
    }

    if (filters.status === 'has_notes' && record.noteCount === 0) {
      return false
    }

    if (filters.status === 'started' && record.counts.seen === 0) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    return buildSearchText(record).includes(normalizedQuery)
  })

  return [...nextRecords].sort((a, b) => {
    const aUrgency = a.counts.notLearned * 3 + a.counts.partial * 2 + Number(a.counts.seen === 0)
    const bUrgency = b.counts.notLearned * 3 + b.counts.partial * 2 + Number(b.counts.seen === 0)

    if (aUrgency !== bUrgency) {
      return bUrgency - aUrgency
    }

    if (a.summary.estimatedMinutes !== b.summary.estimatedMinutes) {
      return a.summary.estimatedMinutes - b.summary.estimatedMinutes
    }

    return a.summary.title.localeCompare(b.summary.title)
  })
}

function buildSearchText(record: DeckLibraryRecord): string {
  return normalize(
    [
      record.summary.title,
      record.summary.description,
      getTrackLabel(record.summary.track),
      getTopicLabel(record.summary.topic),
      ...record.summary.tags,
      ...record.summary.searchTerms,
    ].join(' '),
  )
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}
