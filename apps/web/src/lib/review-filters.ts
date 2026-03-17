import type { Flashcard } from '@prepdeck/schemas'

export type ReviewCardRecord = {
  card: Flashcard
  note: string
}

export type ReviewFilterMode = 'all' | 'follow_ups' | 'notes'

export function filterReviewCardRecords(
  records: ReviewCardRecord[],
  filters: {
    mode: ReviewFilterMode
    query: string
  },
) {
  const normalizedQuery = normalize(filters.query)

  return records.filter(({ card, note }) => {
    if (filters.mode === 'notes' && !note) {
      return false
    }

    if (filters.mode === 'follow_ups' && card.followUps.length === 0) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    return normalize(
      [
        card.question,
        card.shortAnswer,
        note,
        ...card.tags,
        ...card.followUps,
      ].join(' '),
    ).includes(normalizedQuery)
  })
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}
