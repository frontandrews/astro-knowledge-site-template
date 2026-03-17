import type { PropsWithChildren } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  createDefaultPreferencesState,
  readPreferencesState,
  writePreferencesState,
  type InterviewTimerPreset,
  type PreferencesState,
} from '@/lib/preferences'

type PreferencesContextValue = {
  preferences: PreferencesState
  replacePreferences: (state: PreferencesState) => void
  resetPreferences: () => void
  setDailyGoalTarget: (target: number) => void
  setInterviewTimerPreset: (preset: InterviewTimerPreset) => void
  setKeepScreenAwake: (enabled: boolean) => void
  setWeeklyGoalTarget: (target: number) => void
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState<PreferencesState>(() => readPreferencesState())

  useEffect(() => {
    writePreferencesState(preferences)
  }, [preferences])

  const setDailyGoalTarget = useCallback((target: number) => {
    setPreferences((current) => ({
      ...current,
      dailyGoalTarget: target,
    }))
  }, [])

  const setWeeklyGoalTarget = useCallback((target: number) => {
    setPreferences((current) => ({
      ...current,
      weeklyGoalTarget: target,
    }))
  }, [])

  const setInterviewTimerPreset = useCallback((preset: InterviewTimerPreset) => {
    setPreferences((current) => ({
      ...current,
      interviewTimerPreset: preset,
    }))
  }, [])

  const setKeepScreenAwake = useCallback((enabled: boolean) => {
    setPreferences((current) => ({
      ...current,
      keepScreenAwake: enabled,
    }))
  }, [])

  const replacePreferences = useCallback((state: PreferencesState) => {
    setPreferences(state)
  }, [])

  const resetPreferences = useCallback(() => {
    setPreferences(createDefaultPreferencesState())
  }, [])

  const value = useMemo(
    () => ({
      preferences,
      replacePreferences,
      resetPreferences,
      setDailyGoalTarget,
      setInterviewTimerPreset,
      setKeepScreenAwake,
      setWeeklyGoalTarget,
    }),
    [
      preferences,
      replacePreferences,
      resetPreferences,
      setDailyGoalTarget,
      setInterviewTimerPreset,
      setKeepScreenAwake,
      setWeeklyGoalTarget,
    ],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const context = useContext(PreferencesContext)

  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider')
  }

  return context
}
