// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'

import { createResizeObserver } from '@/lib/resize-observer'

describe('createResizeObserver', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns null when ResizeObserver is unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined)

    expect(createResizeObserver(() => {})).toBeNull()
  })

  it('creates an observer when the browser API exists', () => {
    const disconnect = vi.fn()
    const ResizeObserverMock = vi.fn(() => ({ disconnect }))
    const callback = vi.fn()

    vi.stubGlobal('ResizeObserver', ResizeObserverMock)

    expect(createResizeObserver(callback as ResizeObserverCallback)).toEqual({ disconnect })
    expect(ResizeObserverMock).toHaveBeenCalledWith(callback)
  })
})
