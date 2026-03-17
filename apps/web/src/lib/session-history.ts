import type {
  SessionHistoryEntry,
  SessionHistoryFormat,
  SessionHistoryKind,
  SessionHistoryStore,
} from '@prepdeck/schemas'
import { sessionHistoryStoreSchema } from '@prepdeck/schemas'

import { getBrowserStorageAdapter, type StorageAdapter } from '@/lib/storage-adapter'

export const SESSION_HISTORY_STORAGE_KEY = 'prepdeck.session-history.v1'

const SESSION_HISTORY_LIMIT = 60

const DEFAULT_SESSION_HISTORY_STORE: SessionHistoryStore = {
  version: 1,
  sessions: [],
}

export type SessionHistoryInput = Omit<SessionHistoryEntry, 'completedAt' | 'id'>

export type SessionHistorySnapshot = {
  currentStreak: number
  lastCompletedAt: string | null
  recentSessions: SessionHistoryEntry[]
  sessionsToday: number
  sessionsThisWeek: number
  totalSessions: number
}

export function createEmptySessionHistoryStore(): SessionHistoryStore {
  return structuredClone(DEFAULT_SESSION_HISTORY_STORE)
}

export function readSessionHistoryStore(
  storage: StorageAdapter | null = getBrowserStorageAdapter(),
): SessionHistoryStore {
  if (!storage) {
    return createEmptySessionHistoryStore()
  }

  const raw = storage.getItem(SESSION_HISTORY_STORAGE_KEY)

  if (!raw) {
    return createEmptySessionHistoryStore()
  }

  try {
    const parsedStore = sessionHistoryStoreSchema.parse(JSON.parse(raw))

    return normalizeSessionHistoryStore(parsedStore)
  } catch {
    return createEmptySessionHistoryStore()
  }
}

export function writeSessionHistoryStore(
  store: SessionHistoryStore,
  storage: StorageAdapter | null = getBrowserStorageAdapter(),
): void {
  if (!storage) {
    return
  }

  storage.setItem(SESSION_HISTORY_STORAGE_KEY, JSON.stringify(store))
}

export function recordCompletedSession(
  store: SessionHistoryStore,
  session: SessionHistoryInput,
  completedAt: string = new Date().toISOString(),
): SessionHistoryStore {
  const nextEntry: SessionHistoryEntry = {
    ...session,
    completedAt,
    id: createSessionHistoryEntryId(session.kind, session.format, completedAt),
  }

  return {
    ...store,
    sessions: normalizeSessionEntries([nextEntry, ...store.sessions]),
  }
}

export function resetSessionHistory(): SessionHistoryStore {
  return createEmptySessionHistoryStore()
}

export function normalizeSessionHistoryStore(
  store: SessionHistoryStore,
): SessionHistoryStore {
  return {
    ...store,
    sessions: normalizeSessionEntries(store.sessions),
  }
}

export function getSessionHistorySnapshot(
  store: SessionHistoryStore,
  now: Date = new Date(),
): SessionHistorySnapshot {
  return {
    currentStreak: getCurrentSessionStreak(store, now),
    lastCompletedAt: store.sessions[0]?.completedAt ?? null,
    recentSessions: store.sessions.slice(0, 4),
    sessionsToday: getSessionsCompletedToday(store, now),
    sessionsThisWeek: getSessionsCompletedThisWeek(store, now),
    totalSessions: store.sessions.length,
  }
}

export function getCurrentSessionStreak(
  store: SessionHistoryStore,
  now: Date = new Date(),
): number {
  if (store.sessions.length === 0) {
    return 0
  }

  const dayKeys = new Set(store.sessions.map((entry) => toLocalDayKey(new Date(entry.completedAt))))
  const today = startOfLocalDay(now)
  const yesterday = addDays(today, -1)
  const todayKey = toLocalDayKey(today)
  const yesterdayKey = toLocalDayKey(yesterday)

  if (!dayKeys.has(todayKey) && !dayKeys.has(yesterdayKey)) {
    return 0
  }

  let streak = 0
  let cursor = dayKeys.has(todayKey) ? today : yesterday

  while (dayKeys.has(toLocalDayKey(cursor))) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  return streak
}

export function getSessionsCompletedThisWeek(
  store: SessionHistoryStore,
  now: Date = new Date(),
): number {
  const weekStart = startOfLocalDay(addDays(now, -6)).getTime()

  return store.sessions.filter((entry) => {
    const completedAt = Date.parse(entry.completedAt)
    return !Number.isNaN(completedAt) && completedAt >= weekStart
  }).length
}

export function getSessionsCompletedToday(
  store: SessionHistoryStore,
  now: Date = new Date(),
): number {
  const todayKey = toLocalDayKey(now)

  return store.sessions.filter((entry) => toLocalDayKey(new Date(entry.completedAt)) === todayKey)
    .length
}

export function getSessionKindLabel(kind: SessionHistoryKind): string {
  if (kind === 'daily_queue') return 'Daily queue'
  if (kind === 'mock_interview') return 'Mock interview'
  return 'Deck session'
}

export function getSessionFormatLabel(format: SessionHistoryFormat): string {
  return format === 'interview' ? 'Interview mode' : 'Flashcards'
}

function createSessionHistoryEntryId(
  kind: SessionHistoryKind,
  format: SessionHistoryFormat,
  completedAt: string,
) {
  const randomPart = Math.random().toString(36).slice(2, 8)
  return `${kind}-${format}-${completedAt}-${randomPart}`
}

function normalizeSessionEntries(entries: SessionHistoryEntry[]) {
  return [...entries]
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))
    .slice(0, SESSION_HISTORY_LIMIT)
}

function startOfLocalDay(value: Date): Date {
  const next = new Date(value)
  next.setHours(0, 0, 0, 0)
  return next
}

function addDays(value: Date, days: number): Date {
  const next = new Date(value)
  next.setDate(next.getDate() + days)
  return next
}

function toLocalDayKey(value: Date) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
