import type { InterviewTimerPreset } from '@/lib/preferences'
import type { Deck, Flashcard, ProgressStore } from '@prepdeck/schemas'

import { getCardStatus, getFirstUnseenCardIndex } from '@/lib/progress'
import { getInterviewTimerMultiplier } from '@/lib/preferences'

export type StudyFormat = 'flashcards' | 'interview'
export type StudyScope = 'all' | 'weak'
export type StudyCardEntry = {
  card: Flashcard
  deckId: string
  deckTitle: string
  topic: string
}

const INTERVIEW_SECONDS_BY_DIFFICULTY = {
  easy: 60,
  hard: 120,
  medium: 90,
} as const

type StudyHrefOptions = {
  format?: StudyFormat
  mode?: string
  scope?: StudyScope
  state?: 'success'
}

export function createStudyHref(deckId: string, options: StudyHrefOptions = {}): string {
  const params = new URLSearchParams()

  if (options.mode) {
    params.set('mode', options.mode)
  }

  if (options.scope && options.scope !== 'all') {
    params.set('scope', options.scope)
  }

  if (options.format && options.format !== 'flashcards') {
    params.set('format', options.format)
  }

  if (options.state) {
    params.set('state', options.state)
  }

  const query = params.toString()

  return query ? `/study/${deckId}?${query}` : `/study/${deckId}`
}

export function createMockInterviewHref(state?: 'success'): string {
  const params = new URLSearchParams()

  if (state) {
    params.set('state', state)
  }

  const query = params.toString()

  return query ? `/mock-interview?${query}` : '/mock-interview'
}

export function createDailyQueueHref(state?: 'success'): string {
  const params = new URLSearchParams()

  if (state) {
    params.set('state', state)
  }

  const query = params.toString()

  return query ? `/daily-queue?${query}` : '/daily-queue'
}

export function getInterviewDurationSeconds(
  card: Flashcard,
  preset: InterviewTimerPreset = 'standard',
): number {
  return Math.round(
    INTERVIEW_SECONDS_BY_DIFFICULTY[card.difficulty] *
      getInterviewTimerMultiplier(preset),
  )
}

export function getStudyFormat(value: string | null): StudyFormat {
  return value === 'interview' ? 'interview' : 'flashcards'
}

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

export function createStudyEntries(
  deck: Deck,
  cards: Flashcard[] = deck.cards,
): StudyCardEntry[] {
  return cards.map((card) => ({
    card,
    deckId: deck.id,
    deckTitle: deck.title,
    topic: deck.topic,
  }))
}

export function getStudyEntries(
  store: ProgressStore,
  deck: Deck,
  scope: StudyScope,
): StudyCardEntry[] {
  return createStudyEntries(deck, getStudyCards(store, deck, scope))
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

export function getStudyFormatLabel(format: StudyFormat): string {
  return format === 'interview' ? 'Interview mode' : 'Flashcards'
}
