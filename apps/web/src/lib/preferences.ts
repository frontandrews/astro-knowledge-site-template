import { getBrowserStorageAdapter, type StorageAdapter } from '@/lib/storage-adapter'

export const PREFERENCES_STORAGE_KEY = 'prepdeck.preferences.v1'

export type InterviewTimerPreset = 'deep' | 'short' | 'standard'

export type PreferencesState = {
  dailyGoalTarget: number
  interviewTimerPreset: InterviewTimerPreset
  keepScreenAwake: boolean
  version: 1
  weeklyGoalTarget: number
}

const DEFAULT_PREFERENCES_STATE: PreferencesState = {
  dailyGoalTarget: 1,
  interviewTimerPreset: 'standard',
  keepScreenAwake: true,
  version: 1,
  weeklyGoalTarget: 5,
}

export function createDefaultPreferencesState(): PreferencesState {
  return { ...DEFAULT_PREFERENCES_STATE }
}

export function readPreferencesState(
  storage: StorageAdapter | null = getBrowserStorageAdapter(),
): PreferencesState {
  if (!storage) {
    return createDefaultPreferencesState()
  }

  const raw = storage.getItem(PREFERENCES_STORAGE_KEY)

  if (!raw) {
    return createDefaultPreferencesState()
  }

  try {
    return normalizePreferencesState(JSON.parse(raw))
  } catch {
    return createDefaultPreferencesState()
  }
}

export function writePreferencesState(
  state: PreferencesState,
  storage: StorageAdapter | null = getBrowserStorageAdapter(),
): void {
  if (!storage) {
    return
  }

  storage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state))
}

export function getInterviewTimerMultiplier(preset: InterviewTimerPreset): number {
  if (preset === 'short') return 0.8
  if (preset === 'deep') return 1.2
  return 1
}

export function normalizePreferencesState(value: unknown): PreferencesState {
  const parsed = value as Partial<PreferencesState>

  if (
    parsed.version === 1 &&
    isValidGoalTarget(parsed.dailyGoalTarget) &&
    isValidGoalTarget(parsed.weeklyGoalTarget) &&
    isValidInterviewTimerPreset(parsed.interviewTimerPreset) &&
    isValidKeepScreenAwake(parsed.keepScreenAwake)
  ) {
    return {
      ...createDefaultPreferencesState(),
      ...parsed,
    }
  }

  return createDefaultPreferencesState()
}

function isValidGoalTarget(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 14
}

function isValidInterviewTimerPreset(value: unknown): value is InterviewTimerPreset {
  return value === 'short' || value === 'standard' || value === 'deep'
}

function isValidKeepScreenAwake(value: unknown): value is boolean | undefined {
  return typeof value === 'boolean' || typeof value === 'undefined'
}
