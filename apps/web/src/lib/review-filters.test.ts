import type { Flashcard } from '@prepdeck/schemas'

import { filterReviewCardRecords } from '@/lib/review-filters'

function createCard(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    commonTraps: [],
    difficulty: 'medium',
    expectedAnswer: 'Expected answer',
    followUps: [],
    id: 'card-1',
    keyPoints: ['point'],
    question: 'Why is derived state dangerous?',
    shortAnswer: 'It creates duplicate sources of truth.',
    sourceRefs: [],
    tags: ['react', 'state'],
    type: 'concept',
    ...overrides,
  }
}

describe('review filters', () => {
  const records = [
    {
      card: createCard(),
      note: 'Talk about synchronization risk and stale values',
    },
    {
      card: createCard({
        followUps: ['When would memoization be enough?'],
        id: 'card-2',
        question: 'When should I prefer memoization?',
        tags: ['react', 'memoization'],
      }),
      note: '',
    },
  ]

  it('matches query across notes and follow-up content', () => {
    expect(
      filterReviewCardRecords(records, {
        mode: 'all',
        query: 'synchronization',
      }).map((record) => record.card.id),
    ).toEqual(['card-1'])

    expect(
      filterReviewCardRecords(records, {
        mode: 'all',
        query: 'memoization',
      }).map((record) => record.card.id),
    ).toEqual(['card-2'])
  })

  it('filters by notes and follow-up availability', () => {
    expect(
      filterReviewCardRecords(records, {
        mode: 'notes',
        query: '',
      }).map((record) => record.card.id),
    ).toEqual(['card-1'])

    expect(
      filterReviewCardRecords(records, {
        mode: 'follow_ups',
        query: '',
      }).map((record) => record.card.id),
    ).toEqual(['card-2'])
  })
})
