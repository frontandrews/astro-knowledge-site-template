import { describe, expect, it } from 'vitest'

import {
  SESSION_HISTORY_STORAGE_KEY,
  createEmptySessionHistoryStore,
  getCurrentSessionStreak,
  getSessionHistorySnapshot,
  readSessionHistoryStore,
  recordCompletedSession,
  resetSessionHistory,
  writeSessionHistoryStore,
} from '@/lib/session-history'

describe('session history', () => {
  it('records and restores completed sessions from storage', () => {
    let store = createEmptySessionHistoryStore()

    store = recordCompletedSession(
      store,
      {
        cardCount: 5,
        deckId: 'react-rendering-core',
        deckTitle: 'React Rendering Core',
        format: 'flashcards',
        kind: 'deck',
        learnedCount: 3,
        notLearnedCount: 1,
        partialCount: 1,
        scopeLabel: 'Full deck',
        sessionLabel: 'React Rendering Core',
      },
      '2026-03-17T12:00:00.000Z',
    )

    writeSessionHistoryStore(store, window.localStorage)

    expect(readSessionHistoryStore(window.localStorage)).toEqual(store)
  })

  it('builds streak and weekly counts from recent activity', () => {
    let store = createEmptySessionHistoryStore()

    store = recordCompletedSession(
      store,
      {
        cardCount: 7,
        deckId: null,
        deckTitle: null,
        format: 'flashcards',
        kind: 'daily_queue',
        learnedCount: 4,
        notLearnedCount: 1,
        partialCount: 2,
        scopeLabel: 'Daily queue',
        sessionLabel: 'Daily smart queue',
      },
      '2026-03-17T12:00:00.000Z',
    )
    store = recordCompletedSession(
      store,
      {
        cardCount: 5,
        deckId: null,
        deckTitle: null,
        format: 'interview',
        kind: 'mock_interview',
        learnedCount: 2,
        notLearnedCount: 1,
        partialCount: 2,
        scopeLabel: 'Mixed topics',
        sessionLabel: 'Mixed mock interview',
      },
      '2026-03-16T18:00:00.000Z',
    )
    store = recordCompletedSession(
      store,
      {
        cardCount: 2,
        deckId: 'react-rendering-core',
        deckTitle: 'React Rendering Core',
        format: 'flashcards',
        kind: 'deck',
        learnedCount: 2,
        notLearnedCount: 0,
        partialCount: 0,
        scopeLabel: 'Full deck',
        sessionLabel: 'React Rendering Core',
      },
      '2026-03-15T09:30:00.000Z',
    )

    const snapshot = getSessionHistorySnapshot(store, new Date('2026-03-17T20:00:00.000Z'))

    expect(getCurrentSessionStreak(store, new Date('2026-03-17T20:00:00.000Z'))).toBe(3)
    expect(snapshot.sessionsToday).toBe(1)
    expect(snapshot.sessionsThisWeek).toBe(3)
    expect(snapshot.totalSessions).toBe(3)
    expect(snapshot.recentSessions).toHaveLength(3)
    expect(snapshot.lastCompletedAt).toBe('2026-03-17T12:00:00.000Z')
  })

  it('drops the streak when there is a gap longer than a day', () => {
    let store = createEmptySessionHistoryStore()

    store = recordCompletedSession(
      store,
      {
        cardCount: 2,
        deckId: 'react-rendering-core',
        deckTitle: 'React Rendering Core',
        format: 'flashcards',
        kind: 'deck',
        learnedCount: 1,
        notLearnedCount: 1,
        partialCount: 0,
        scopeLabel: 'Full deck',
        sessionLabel: 'React Rendering Core',
      },
      '2026-03-14T12:00:00.000Z',
    )

    expect(getCurrentSessionStreak(store, new Date('2026-03-17T12:00:00.000Z'))).toBe(0)
  })

  it('resets the store back to empty', () => {
    window.localStorage.setItem(
      SESSION_HISTORY_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        sessions: [
          {
            cardCount: 2,
            completedAt: '2026-03-17T12:00:00.000Z',
            deckId: 'react-rendering-core',
            deckTitle: 'React Rendering Core',
            format: 'flashcards',
            id: 'deck-flashcards-1',
            kind: 'deck',
            learnedCount: 2,
            notLearnedCount: 0,
            partialCount: 0,
            scopeLabel: 'Full deck',
            sessionLabel: 'React Rendering Core',
          },
        ],
      }),
    )

    expect(resetSessionHistory()).toEqual(createEmptySessionHistoryStore())
  })
})
