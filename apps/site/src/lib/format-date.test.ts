import { afterEach, describe, expect, it, vi } from 'vitest'

import { formatEditorialDate } from '@/lib/format-date'

describe('formatEditorialDate', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('omits the year and uses a short month for current-year dates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-01T00:00:00.000Z'))

    expect(formatEditorialDate(new Date('2026-03-24T00:00:00.000Z'), 'en-US')).toBe('Mar 24')
    expect(formatEditorialDate(new Date('2026-03-24T00:00:00.000Z'), 'pt-BR')).toBe('24 de Mar')
  })

  it('includes the year for non-current-year dates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-01T00:00:00.000Z'))

    expect(formatEditorialDate(new Date('2025-03-24T00:00:00.000Z'), 'en-US')).toBe('March 24 2025')
    expect(formatEditorialDate(new Date('2025-03-24T00:00:00.000Z'), 'pt-BR')).toBe('24 de Março de 2025')
  })
})
