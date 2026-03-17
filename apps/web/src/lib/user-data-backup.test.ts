import { describe, expect, it } from 'vitest'

import { createDefaultPreferencesState } from '@/lib/preferences'
import { createEmptyProgressStore, setCardNote, setCardStatus } from '@/lib/progress'
import {
  createEmptySessionHistoryStore,
  recordCompletedSession,
} from '@/lib/session-history'
import {
  createUserDataBackup,
  getUserDataBackupFilename,
  parseUserDataBackup,
  serializeUserDataBackup,
} from '@/lib/user-data-backup'

describe('user data backup helpers', () => {
  it('serializes and restores a valid backup payload', () => {
    let progressStore = createEmptyProgressStore()
    progressStore = setCardStatus(progressStore, 'react-rendering-core', 'derived-state', 'learned')
    progressStore = setCardNote(
      progressStore,
      'react-rendering-core',
      'derived-state',
      'Lead with sync risk',
    )
    let sessionHistoryStore = createEmptySessionHistoryStore()
    sessionHistoryStore = recordCompletedSession(
      sessionHistoryStore,
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
      '2026-03-17T12:00:00.000Z',
    )

    const serialized = serializeUserDataBackup(
      {
        preferencesState: {
          dailyGoalTarget: 2,
          interviewTimerPreset: 'deep',
          keepScreenAwake: false,
          version: 1,
          weeklyGoalTarget: 7,
        },
        progressStore,
        sessionHistoryStore,
      },
      '2026-03-17T12:00:00.000Z',
    )
    const restored = parseUserDataBackup(serialized)

    expect(restored).toEqual({
      preferencesState: {
        dailyGoalTarget: 2,
        interviewTimerPreset: 'deep',
        keepScreenAwake: false,
        version: 1,
        weeklyGoalTarget: 7,
      },
      progressStore,
      sessionHistoryStore,
    })
  })

  it('builds a predictable filename for exported backups', () => {
    expect(getUserDataBackupFilename(new Date('2026-03-17T12:00:00.000Z'))).toBe(
      'prepdeck-backup-2026-03-17.json',
    )
  })

  it('rejects files that are not prepdeck backups', () => {
    const payload = createUserDataBackup({
      preferencesState: createDefaultPreferencesState(),
      progressStore: createEmptyProgressStore(),
      sessionHistoryStore: createEmptySessionHistoryStore(),
    })

    expect(() =>
      parseUserDataBackup(JSON.stringify({ ...payload, app: 'other-app' })),
    ).toThrow('This file is not a Prepdeck backup.')
  })

  it('accepts older backups that do not include session history yet', () => {
    const restored = parseUserDataBackup(
      JSON.stringify({
        app: 'prepdeck',
        exportedAt: '2026-03-17T12:00:00.000Z',
        userData: createEmptyProgressStore(),
        version: 1,
      }),
    )

    expect(restored.preferencesState).toEqual(createDefaultPreferencesState())
    expect(restored.progressStore).toEqual(createEmptyProgressStore())
    expect(restored.sessionHistoryStore).toEqual(createEmptySessionHistoryStore())
  })

  it('accepts v2 backups that do not include preferences yet', () => {
    const sessionHistoryStore = recordCompletedSession(
      createEmptySessionHistoryStore(),
      {
        cardCount: 2,
        deckId: 'react-rendering-core',
        deckTitle: 'React Rendering Core',
        format: 'flashcards',
        kind: 'deck',
        learnedCount: 1,
        notLearnedCount: 0,
        partialCount: 1,
        scopeLabel: 'Full deck',
        sessionLabel: 'React Rendering Core',
      },
      '2026-03-17T12:00:00.000Z',
    )

    const restored = parseUserDataBackup(
      JSON.stringify({
        app: 'prepdeck',
        exportedAt: '2026-03-17T12:00:00.000Z',
        sessionHistory: sessionHistoryStore,
        userData: createEmptyProgressStore(),
        version: 2,
      }),
    )

    expect(restored.preferencesState).toEqual(createDefaultPreferencesState())
    expect(restored.sessionHistoryStore).toEqual(sessionHistoryStore)
  })
})
