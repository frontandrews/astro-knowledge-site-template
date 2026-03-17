import type { DeckLibraryRecord } from '@/lib/deck-library'
import { filterDeckLibraryRecords } from '@/lib/deck-library'

function createRecord(
  overrides: Partial<DeckLibraryRecord> & Pick<DeckLibraryRecord, 'summary'>,
): DeckLibraryRecord {
  return {
    counts: {
      allLearned: false,
      allSeen: false,
      learned: 0,
      notLearned: 0,
      partial: 0,
      seen: 0,
      total: 1,
      unseen: 1,
    },
    noteCount: 0,
    reviewDebt: 0,
    ...overrides,
  }
}

describe('deck library filters', () => {
  const records: DeckLibraryRecord[] = [
    createRecord({
      counts: { allLearned: false, allSeen: false, learned: 0, notLearned: 0, partial: 1, seen: 1, total: 1, unseen: 0 },
      noteCount: 1,
      reviewDebt: 1,
      summary: {
        cardCount: 1,
        description: 'React fundamentals and hook tradeoffs.',
        difficulty: 'medium',
        estimatedMinutes: 8,
        id: 'react-core',
        path: '',
        searchTerms: ['react', 'hooks', 'state'],
        tags: ['react', 'hooks'],
        track: 'programming',
        title: 'React Core',
        topic: 'react',
      },
    }),
    createRecord({
      counts: { allLearned: false, allSeen: false, learned: 0, notLearned: 0, partial: 0, seen: 0, total: 1, unseen: 1 },
      noteCount: 0,
      reviewDebt: 0,
      summary: {
        cardCount: 1,
        description: 'Node runtime and backend execution details.',
        difficulty: 'hard',
        estimatedMinutes: 10,
        id: 'node-core',
        path: '',
        searchTerms: ['node', 'runtime', 'event loop'],
        tags: ['node', 'runtime'],
        track: 'programming',
        title: 'Node Core',
        topic: 'node',
      },
    }),
  ]

  it('filters by search query across titles and tags', () => {
    const result = filterDeckLibraryRecords(records, {
      difficulty: 'all',
      query: 'runtime',
      selectedTrack: 'all',
      status: 'all',
    })

    expect(result.map((record) => record.summary.id)).toEqual(['node-core'])
  })

  it('filters by review debt and local notes', () => {
    const needsReview = filterDeckLibraryRecords(records, {
      difficulty: 'all',
      query: '',
      selectedTrack: 'all',
      status: 'needs_review',
    })

    const hasNotes = filterDeckLibraryRecords(records, {
      difficulty: 'all',
      query: '',
      selectedTrack: 'all',
      status: 'has_notes',
    })

    expect(needsReview.map((record) => record.summary.id)).toEqual(['react-core'])
    expect(hasNotes.map((record) => record.summary.id)).toEqual(['react-core'])
  })
})
