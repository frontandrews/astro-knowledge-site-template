import { describe, expect, it } from 'vitest'

import {
  prioritizeRecentUpdateCandidates,
  type RecentUpdateCandidate,
} from '@/lib/recent-updates'

function createCandidate(overrides: Partial<RecentUpdateCandidate> = {}): RecentUpdateCandidate {
  return {
    description: 'Summary',
    href: '/entry',
    pageType: 'articles',
    publishedAt: new Date('2026-03-10T00:00:00.000Z'),
    title: 'Example entry',
    updatedAt: null,
    ...overrides,
  }
}

describe('recent update helpers', () => {
  it('prioritizes explicit updates ahead of newer first publications', () => {
    const updatedEntry = createCandidate({
      href: '/updated-entry',
      publishedAt: new Date('2026-03-01T00:00:00.000Z'),
      title: 'Updated entry',
      updatedAt: new Date('2026-03-18T00:00:00.000Z'),
    })
    const newEntry = createCandidate({
      href: '/new-entry',
      publishedAt: new Date('2026-03-20T00:00:00.000Z'),
      title: 'New entry',
    })

    expect(prioritizeRecentUpdateCandidates([newEntry, updatedEntry]).map((item) => item.href)).toEqual([
      '/updated-entry',
      '/new-entry',
    ])
  })

  it('applies the requested preview limit after sorting', () => {
    const items = [
      createCandidate({ href: '/entry-1', title: 'Entry 1', updatedAt: new Date('2026-03-21T00:00:00.000Z') }),
      createCandidate({ href: '/entry-2', title: 'Entry 2', updatedAt: new Date('2026-03-19T00:00:00.000Z') }),
      createCandidate({ href: '/entry-3', title: 'Entry 3', publishedAt: new Date('2026-03-18T00:00:00.000Z') }),
    ]

    expect(prioritizeRecentUpdateCandidates(items, 2).map((item) => item.href)).toEqual([
      '/entry-1',
      '/entry-2',
    ])
  })
})
