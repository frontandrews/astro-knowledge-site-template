import { describe, expect, it, vi } from 'vitest'

import {
  dismissOfflineReady,
  dismissPwaUpdate,
  getPwaStatusSnapshotForTests,
  initPwaStatus,
  resetPwaStatus,
  setPwaStatus,
} from '@/lib/pwa-status'

describe('pwa status', () => {
  it('registers callbacks and stores the update handler', () => {
    const register = vi.fn((options) => {
      options.onOfflineReady?.()
      options.onNeedRefresh?.()

      return vi.fn()
    })

    initPwaStatus(register)

    expect(register).toHaveBeenCalledWith(
      expect.objectContaining({
        immediate: true,
        onNeedRefresh: expect.any(Function),
        onOfflineReady: expect.any(Function),
      }),
    )
    expect(getPwaStatusSnapshotForTests().offlineReady).toBe(true)
    expect(getPwaStatusSnapshotForTests().needRefresh).toBe(true)
    expect(getPwaStatusSnapshotForTests().updateServiceWorker).not.toBeNull()
  })

  it('dismisses offline-ready and update states independently', () => {
    setPwaStatus({
      needRefresh: true,
      offlineReady: true,
      updateServiceWorker: null,
    })

    dismissOfflineReady()
    expect(getPwaStatusSnapshotForTests().offlineReady).toBe(false)
    expect(getPwaStatusSnapshotForTests().needRefresh).toBe(true)

    dismissPwaUpdate()
    expect(getPwaStatusSnapshotForTests().needRefresh).toBe(false)

    resetPwaStatus()
    expect(getPwaStatusSnapshotForTests()).toEqual({
      needRefresh: false,
      offlineReady: false,
      updateServiceWorker: null,
    })
  })
})
