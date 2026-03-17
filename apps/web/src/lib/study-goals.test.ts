import { describe, expect, it } from 'vitest'

import { getStudyGoalsSnapshot } from '@/lib/study-goals'

describe('study goals', () => {
  it('pushes the daily queue when today is still empty', () => {
    const goals = getStudyGoalsSnapshot({
      currentStreak: 0,
      lastCompletedAt: null,
      recentSessions: [],
      sessionsToday: 0,
      sessionsThisWeek: 1,
      totalSessions: 1,
    })

    expect(goals.daily.isComplete).toBe(false)
    expect(goals.weekly.isComplete).toBe(false)
    expect(goals.nextAction.label).toBe('Start daily queue')
  })

  it('pushes a mock interview once the daily goal is already done', () => {
    const goals = getStudyGoalsSnapshot({
      currentStreak: 3,
      lastCompletedAt: '2026-03-17T12:00:00.000Z',
      recentSessions: [],
      sessionsToday: 1,
      sessionsThisWeek: 3,
      totalSessions: 8,
    })

    expect(goals.daily.isComplete).toBe(true)
    expect(goals.weekly.isComplete).toBe(false)
    expect(goals.nextAction.label).toBe('Run mock interview')
  })

  it('switches to bonus rep messaging once both goals are complete', () => {
    const goals = getStudyGoalsSnapshot({
      currentStreak: 6,
      lastCompletedAt: '2026-03-17T12:00:00.000Z',
      recentSessions: [],
      sessionsToday: 2,
      sessionsThisWeek: 5,
      totalSessions: 14,
    })

    expect(goals.daily.isComplete).toBe(true)
    expect(goals.weekly.isComplete).toBe(true)
    expect(goals.nextAction.label).toBe('Add a bonus rep')
  })

  it('uses custom local targets when preferences change the pace', () => {
    const goals = getStudyGoalsSnapshot(
      {
        currentStreak: 1,
        lastCompletedAt: '2026-03-17T12:00:00.000Z',
        recentSessions: [],
        sessionsToday: 1,
        sessionsThisWeek: 4,
        totalSessions: 10,
      },
      {
        daily: 2,
        weekly: 7,
      },
    )

    expect(goals.daily.isComplete).toBe(false)
    expect(goals.daily.remaining).toBe(1)
    expect(goals.weekly.isComplete).toBe(false)
    expect(goals.weekly.remaining).toBe(3)
    expect(goals.nextAction.label).toBe('Start daily queue')
  })
})
