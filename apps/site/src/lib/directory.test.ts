import { describe, expect, it } from 'vitest'

import { getPaginatedPathNumbers, getPaginationWindow, paginateItems } from '@/lib/directory'

describe('directory pagination helpers', () => {
  it('paginates items with bounds protection', () => {
    const items = Array.from({ length: 25 }, (_, index) => `item-${index + 1}`)
    const result = paginateItems(items, 2, 24)

    expect(result.currentPage).toBe(2)
    expect(result.pageCount).toBe(2)
    expect(result.hasPreviousPage).toBe(true)
    expect(result.hasNextPage).toBe(false)
    expect(result.previousPage).toBe(1)
    expect(result.nextPage).toBe(null)
    expect(result.items).toEqual(['item-25'])
  })

  it('normalizes invalid pages to the nearest valid page', () => {
    const items = Array.from({ length: 3 }, (_, index) => index)

    expect(paginateItems(items, -5, 2).currentPage).toBe(1)
    expect(paginateItems(items, 99, 2).currentPage).toBe(2)
  })

  it('builds a compact page window around the current page', () => {
    expect(getPaginationWindow(1, 10)).toEqual([1, 2, 3])
    expect(getPaginationWindow(5, 10)).toEqual([3, 4, 5, 6, 7])
    expect(getPaginationWindow(10, 10)).toEqual([8, 9, 10])
  })

  it('returns only the extra page numbers for generated archive paths', () => {
    expect(getPaginatedPathNumbers(24, 24)).toEqual([])
    expect(getPaginatedPathNumbers(25, 24)).toEqual([2])
    expect(getPaginatedPathNumbers(73, 24)).toEqual([2, 3, 4])
  })
})
