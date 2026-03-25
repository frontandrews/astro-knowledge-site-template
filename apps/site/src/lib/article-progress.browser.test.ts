// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  markArticleCompleted,
  markArticleUnread,
  readCompletedArticles,
  readCompletedArticlesSet,
  subscribeToCompletedArticles,
  writeCompletedArticles,
} from '@/lib/article-progress'
import { siteStorageKeys } from '@/lib/storage-keys'

describe('article progress helpers', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('writes deduplicated completed ids and reads them back', () => {
    expect(writeCompletedArticles(['a-1', 'a-1', 'a-2'])).toBe(true)
    expect(readCompletedArticles()).toEqual(['a-1', 'a-2'])
    expect(readCompletedArticlesSet()).toEqual(new Set(['a-1', 'a-2']))
  })

  it('marks articles complete and unread', () => {
    expect(markArticleCompleted('article-1')).toBe(true)
    expect(markArticleCompleted('article-1')).toBe(true)
    expect(readCompletedArticles()).toEqual(['article-1'])

    expect(markArticleUnread('article-1')).toBe(true)
    expect(readCompletedArticles()).toEqual([])
  })

  it('subscribes to progress changes and storage sync', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToCompletedArticles(listener)

    expect(listener).toHaveBeenCalledWith([], new Set())

    markArticleCompleted('article-2')
    expect(listener).toHaveBeenLastCalledWith(['article-2'], new Set(['article-2']))

    window.localStorage.setItem(siteStorageKeys.completedArticles, JSON.stringify(['article-3']))
    window.dispatchEvent(new StorageEvent('storage', { key: siteStorageKeys.completedArticles }))

    expect(listener).toHaveBeenLastCalledWith(['article-3'], new Set(['article-3']))
    unsubscribe()
  })
})
