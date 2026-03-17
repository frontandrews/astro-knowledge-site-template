import type { Deck, ProgressStore, ProgressStatus } from '@prepdeck/schemas'

import { createStudyEntries, type StudyCardEntry } from '@/lib/study-session'
import { getCardStatus } from '@/lib/progress'

const DEFAULT_PROMPT_COUNT = 5

type CandidateEntry = StudyCardEntry & {
  difficultyRank: number
  status: ProgressStatus
  urgencyScore: number
}

export function getMockInterviewEntries(
  store: ProgressStore,
  decks: Deck[],
  promptCount = DEFAULT_PROMPT_COUNT,
): StudyCardEntry[] {
  const groupedEntries = decks
    .map((deck) =>
      createStudyEntries(deck)
        .map((entry) => toCandidateEntry(store, entry))
        .sort(compareCandidateEntries),
    )
    .filter((entries) => entries.length > 0)
    .sort((a, b) => compareCandidateEntries(a[0]!, b[0]!))

  const selectedEntries: CandidateEntry[] = []
  let round = 0

  while (selectedEntries.length < promptCount) {
    let didPickEntry = false

    for (const entries of groupedEntries) {
      const candidate = entries[round]

      if (!candidate) {
        continue
      }

      selectedEntries.push(candidate)
      didPickEntry = true

      if (selectedEntries.length >= promptCount) {
        break
      }
    }

    if (!didPickEntry) {
      break
    }

    round += 1
  }

  return selectedEntries.map((entry) => ({
    card: entry.card,
    deckId: entry.deckId,
    deckTitle: entry.deckTitle,
    topic: entry.topic,
  }))
}

function toCandidateEntry(store: ProgressStore, entry: StudyCardEntry): CandidateEntry {
  const status = getCardStatus(store, entry.deckId, entry.card.id)

  return {
    ...entry,
    difficultyRank: getDifficultyRank(entry.card.difficulty),
    status,
    urgencyScore: getUrgencyScore(status),
  }
}

function compareCandidateEntries(a: CandidateEntry, b: CandidateEntry) {
  const urgencyDelta = b.urgencyScore - a.urgencyScore
  if (urgencyDelta !== 0) {
    return urgencyDelta
  }

  const difficultyDelta = b.difficultyRank - a.difficultyRank
  if (difficultyDelta !== 0) {
    return difficultyDelta
  }

  const followUpDelta = b.card.followUps.length - a.card.followUps.length
  if (followUpDelta !== 0) {
    return followUpDelta
  }

  return a.deckTitle.localeCompare(b.deckTitle)
}

function getUrgencyScore(status: ProgressStatus) {
  if (status === 'not_learned') return 4
  if (status === 'partial') return 3
  if (status === 'unseen') return 2
  return 1
}

function getDifficultyRank(difficulty: Deck['difficulty']) {
  if (difficulty === 'easy') return 0
  if (difficulty === 'medium') return 1
  return 2
}
