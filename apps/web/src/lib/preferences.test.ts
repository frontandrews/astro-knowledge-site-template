import {
  createDefaultPreferencesState,
  getInterviewTimerMultiplier,
  readPreferencesState,
  writePreferencesState,
} from '@/lib/preferences'

describe('preferences', () => {
  it('returns defaults when storage is empty', () => {
    expect(readPreferencesState()).toEqual(createDefaultPreferencesState())
  })

  it('persists valid local preferences', () => {
    const state = {
      dailyGoalTarget: 2,
      interviewTimerPreset: 'deep' as const,
      version: 1 as const,
      weeklyGoalTarget: 7,
    }

    writePreferencesState(state)

    expect(readPreferencesState()).toEqual(state)
  })

  it('falls back to defaults when stored data is invalid', () => {
    window.localStorage.setItem(
      'prepdeck.preferences.v1',
      JSON.stringify({
        dailyGoalTarget: 0,
        interviewTimerPreset: 'fast',
        version: 1,
        weeklyGoalTarget: 99,
      }),
    )

    expect(readPreferencesState()).toEqual(createDefaultPreferencesState())
  })

  it('maps timer presets to stable multipliers', () => {
    expect(getInterviewTimerMultiplier('short')).toBe(0.8)
    expect(getInterviewTimerMultiplier('standard')).toBe(1)
    expect(getInterviewTimerMultiplier('deep')).toBe(1.2)
  })
})
