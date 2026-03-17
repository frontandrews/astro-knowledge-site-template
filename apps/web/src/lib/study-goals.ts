import type { SessionHistorySnapshot } from '@/lib/session-history'
import { createDailyQueueHref, createMockInterviewHref } from '@/lib/study-session'

export const DAILY_SESSION_TARGET = 1
export const WEEKLY_SESSION_TARGET = 5

export type GoalProgress = {
  current: number
  isComplete: boolean
  label: string
  remaining: number
  target: number
}

export type StudyGoalsSnapshot = {
  daily: GoalProgress
  nextAction: {
    detail: string
    href: string
    label: string
  }
  weekly: GoalProgress
}

export function getStudyGoalsSnapshot(
  sessionHistory: SessionHistorySnapshot,
): StudyGoalsSnapshot {
  const daily = createGoalProgress('Daily goal', sessionHistory.sessionsToday, DAILY_SESSION_TARGET)
  const weekly = createGoalProgress(
    'Weekly goal',
    sessionHistory.sessionsThisWeek,
    WEEKLY_SESSION_TARGET,
  )

  return {
    daily,
    nextAction: getNextAction(daily, weekly),
    weekly,
  }
}

function createGoalProgress(label: string, current: number, target: number): GoalProgress {
  const clampedCurrent = Math.max(0, current)

  return {
    current: clampedCurrent,
    isComplete: clampedCurrent >= target,
    label,
    remaining: Math.max(0, target - clampedCurrent),
    target,
  }
}

function getNextAction(daily: GoalProgress, weekly: GoalProgress) {
  if (!daily.isComplete) {
    return {
      detail: 'A short daily queue is the fastest way to keep the streak alive without overcommitting.',
      href: createDailyQueueHref(),
      label: 'Start daily queue',
    }
  }

  if (!weekly.isComplete) {
    return {
      detail: 'You already hit today. A mock interview is the best way to add another quality rep this week.',
      href: createMockInterviewHref(),
      label: 'Run mock interview',
    }
  }

  return {
    detail: 'Goals are clear. Use another deck only if you want extra reps or tougher phrasing practice.',
    href: createMockInterviewHref(),
    label: 'Add a bonus rep',
  }
}
