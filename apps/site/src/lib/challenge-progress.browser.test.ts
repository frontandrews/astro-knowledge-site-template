// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getChallengeSolvedStorageKey,
  markChallengeSolved,
  readChallengeSolvedState,
} from '@/lib/challenge-progress'
import { siteEvents } from '@/lib/site-config'

describe('challenge progress helpers', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('builds the solved storage key and reads missing state as false', () => {
    expect(getChallengeSolvedStorageKey('challenge-1')).toBe('challenge-solved-challenge-1')
    expect(readChallengeSolvedState('challenge-1')).toBe(false)
    expect(readChallengeSolvedState('')).toBe(false)
  })

  it('stores solved state and emits the solved event', () => {
    const listener = vi.fn()
    window.addEventListener(siteEvents.challengeSolved, listener)

    markChallengeSolved('challenge-2')

    expect(window.localStorage.getItem('challenge-solved-challenge-2')).toBe('1')
    expect(readChallengeSolvedState('challenge-2')).toBe(true)
    expect(listener).toHaveBeenCalledTimes(1)

    window.removeEventListener(siteEvents.challengeSolved, listener)
  })
})
