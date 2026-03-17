import type { Deck, DeckManifestEntry } from '@prepdeck/schemas'

import { createMockInterviewHref, createStudyHref } from '@/lib/study-session'
import { getTopicLabel } from '@/lib/topic-labels'

type DeckCountsLike = {
  allSeen: boolean
  learned: number
  notLearned: number
  partial: number
  seen: number
  unseen: number
}

type DeckRecordLike = {
  counts: DeckCountsLike
  deck: Deck
  summary: DeckManifestEntry
}

export type SessionPreset = {
  detail: string
  href: string
  id: 'continue' | 'interview' | 'mock' | 'weak' | 'warmup'
  label: string
  meta: string[]
  title: string
}

export function getSessionPresets(records: DeckRecordLike[]): SessionPreset[] {
  const presets: SessionPreset[] = []
  const usedDeckIds = new Set<string>()

  const continueRecord = getContinueRecord(records)
  if (continueRecord) {
    presets.push(createContinuePreset(continueRecord))
    usedDeckIds.add(continueRecord.deck.id)
  }

  presets.push(createMockPreset())

  const interviewRecord = getInterviewRecord(records, usedDeckIds)
  if (interviewRecord) {
    presets.push(createInterviewPreset(interviewRecord))
    usedDeckIds.add(interviewRecord.deck.id)
  }

  const weakRecord = getWeakRecord(records, usedDeckIds)
  if (weakRecord) {
    presets.push(createWeakPreset(weakRecord))
    usedDeckIds.add(weakRecord.deck.id)
  } else {
    const warmupRecord = getWarmupRecord(records, usedDeckIds)
    if (warmupRecord) {
      presets.push(createWarmupPreset(warmupRecord))
    }
  }

  return presets
}

function createMockPreset(): SessionPreset {
  return {
    detail:
      'Rotate through multiple topics in one timed run so the session feels closer to a real screen.',
    href: createMockInterviewHref(),
    id: 'mock',
    label: 'Start mock interview',
    meta: ['Mixed topics', 'Interview mode', '5 prompts'],
    title: 'Mixed mock interview',
  }
}

function createContinuePreset(record: DeckRecordLike): SessionPreset {
  const isContinue = record.counts.seen > 0 && !record.counts.allSeen

  return {
    detail: isContinue
      ? `Pick up ${record.deck.title} exactly where you left it.`
      : `Start a short deck and get momentum without overthinking where to begin.`,
    href: createStudyHref(record.deck.id, { mode: isContinue ? 'continue' : 'start' }),
    id: 'continue',
    label: isContinue ? 'Continue latest' : 'Start warm-up',
    meta: [getTopicLabel(record.summary.topic), 'Flashcards', `~${record.summary.estimatedMinutes} min`],
    title: record.deck.title,
  }
}

function createInterviewPreset(record: DeckRecordLike): SessionPreset {
  return {
    detail: `Run a timed rep on ${record.deck.title} and pressure-test the phrasing before you reveal the answer.`,
    href: createStudyHref(record.deck.id, { format: 'interview', mode: 'start' }),
    id: 'interview',
    label: 'Run interview rep',
    meta: [getTopicLabel(record.summary.topic), 'Interview mode', getInterviewDurationLabel(record)],
    title: record.deck.title,
  }
}

function createWeakPreset(record: DeckRecordLike): SessionPreset {
  const weakCount = record.counts.partial + record.counts.notLearned

  return {
    detail: `${weakCount} card${weakCount === 1 ? '' : 's'} still need work here. Clear the weak queue before it grows.`,
    href: createStudyHref(record.deck.id, { mode: 'start', scope: 'weak' }),
    id: 'weak',
    label: 'Fix weak cards',
    meta: [getTopicLabel(record.summary.topic), 'Weak cards', `~${estimateWeakMinutes(record)} min`],
    title: record.deck.title,
  }
}

function createWarmupPreset(record: DeckRecordLike): SessionPreset {
  return {
    detail: `Use a lower-friction deck to warm up the recall loop before you jump into harder topics.`,
    href: createStudyHref(record.deck.id, { mode: 'start' }),
    id: 'warmup',
    label: 'Take a quick warm-up',
    meta: [getTopicLabel(record.summary.topic), 'Warm-up', `~${record.summary.estimatedMinutes} min`],
    title: record.deck.title,
  }
}

function estimateWeakMinutes(record: DeckRecordLike): number {
  return Math.max(3, Math.min(record.summary.estimatedMinutes, (record.counts.partial + record.counts.notLearned) * 3))
}

function getInterviewDurationLabel(record: DeckRecordLike): string {
  return `${record.deck.cards.length} prompts`
}

function getContinueRecord(records: DeckRecordLike[]): DeckRecordLike | null {
  const continuing = [...records]
    .filter((record) => record.counts.seen > 0 && !record.counts.allSeen)
    .sort((a, b) => b.counts.seen - a.counts.seen)[0]

  return continuing ?? getWarmupRecord(records, new Set())
}

function getInterviewRecord(records: DeckRecordLike[], usedDeckIds: Set<string>): DeckRecordLike | null {
  return [...records]
    .filter((record) => !usedDeckIds.has(record.deck.id))
    .sort((a, b) => {
      const urgencyDelta = getUrgencyScore(b) - getUrgencyScore(a)
      if (urgencyDelta !== 0) {
        return urgencyDelta
      }

      const difficultyDelta = getDifficultyRank(b.summary.difficulty) - getDifficultyRank(a.summary.difficulty)
      if (difficultyDelta !== 0) {
        return difficultyDelta
      }

      return a.summary.estimatedMinutes - b.summary.estimatedMinutes
    })[0] ?? null
}

function getWeakRecord(records: DeckRecordLike[], usedDeckIds: Set<string>): DeckRecordLike | null {
  const uniqueWeakRecord = [...records]
    .filter(
      (record) =>
        !usedDeckIds.has(record.deck.id) &&
        record.counts.partial + record.counts.notLearned > 0,
    )
    .sort((a, b) => {
      const weakDelta =
        b.counts.partial + b.counts.notLearned - (a.counts.partial + a.counts.notLearned)
      if (weakDelta !== 0) {
        return weakDelta
      }

      return b.counts.seen - a.counts.seen
    })[0]

  if (uniqueWeakRecord) {
    return uniqueWeakRecord
  }

  return [...records]
    .filter((record) => record.counts.partial + record.counts.notLearned > 0)
    .sort((a, b) => {
      const weakDelta =
        b.counts.partial + b.counts.notLearned - (a.counts.partial + a.counts.notLearned)
      if (weakDelta !== 0) {
        return weakDelta
      }

      return b.counts.seen - a.counts.seen
    })[0] ?? null
}

function getWarmupRecord(records: DeckRecordLike[], usedDeckIds: Set<string>): DeckRecordLike | null {
  return [...records]
    .filter((record) => !usedDeckIds.has(record.deck.id))
    .sort((a, b) => {
      const unseenDelta = Number(b.counts.unseen > 0) - Number(a.counts.unseen > 0)
      if (unseenDelta !== 0) {
        return unseenDelta
      }

      const difficultyDelta = getDifficultyRank(a.summary.difficulty) - getDifficultyRank(b.summary.difficulty)
      if (difficultyDelta !== 0) {
        return difficultyDelta
      }

      return a.summary.estimatedMinutes - b.summary.estimatedMinutes
    })[0] ?? null
}

function getUrgencyScore(record: DeckRecordLike) {
  return record.counts.notLearned * 3 + record.counts.partial * 2 + Number(record.counts.unseen > 0)
}

function getDifficultyRank(difficulty: DeckManifestEntry['difficulty']) {
  if (difficulty === 'easy') return 0
  if (difficulty === 'medium') return 1
  return 2
}
