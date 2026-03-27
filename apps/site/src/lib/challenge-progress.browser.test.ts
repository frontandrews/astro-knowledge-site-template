// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getChallengeSolvedStorageKey,
  markChallengeSolved,
  readChallengeSolvedState,
} from '@/lib/challenge-progress'
import { siteEvents, siteStorageKeys } from '@/lib/site-config'

describe('challenge progress helpers', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('builds the solved storage key and reads missing state as false', () => {
    expect(getChallengeSolvedStorageKey('challenge-1')).toBe(
      `${siteStorageKeys.challengeSolvedPrefix}.challenge-1.v1`,
    )
    expect(readChallengeSolvedState('challenge-1')).toBe(false)
    expect(readChallengeSolvedState('')).toBe(false)
  })

  it('stores solved state and emits the solved event', () => {
    const listener = vi.fn()
    window.addEventListener(siteEvents.challengeSolved, listener)

    expect(markChallengeSolved('challenge-2')).toBe(true)

    expect(window.localStorage.getItem(`${siteStorageKeys.challengeSolvedPrefix}.challenge-2.v1`)).toBe('1')
    expect(readChallengeSolvedState('challenge-2')).toBe(true)
    expect(listener).toHaveBeenCalledTimes(1)

    window.removeEventListener(siteEvents.challengeSolved, listener)
  })

  it('still reads the legacy solved key while the new namespaced key rolls out', () => {
    window.localStorage.setItem('challenge-solved-challenge-4', '1')

    expect(readChallengeSolvedState('challenge-4')).toBe(true)
  })

  it('keeps the solved flow usable when storage writes are blocked', () => {
    const listener = vi.fn()
    const localStorageSpy = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    window.addEventListener(siteEvents.challengeSolved, listener)

    expect(markChallengeSolved('challenge-3')).toBe(false)
    expect(readChallengeSolvedState('challenge-3')).toBe(false)
    expect(listener).toHaveBeenCalledTimes(1)

    window.removeEventListener(siteEvents.challengeSolved, listener)
    localStorageSpy.mockRestore()
  })
})
