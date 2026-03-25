// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'

import {
  getSearchResultGroupLabel,
  shouldCloseSearchWithShortcut,
  shouldOpenSearchWithShortcut,
} from '@/lib/site-search'

describe('site search helpers', () => {
  it('maps result urls to the matching section label', () => {
    const sections = [
      { href: '/articles', id: 'articles', label: 'Articles' },
      { href: '/topics', id: 'topics', label: 'Topics' },
    ]

    expect(getSearchResultGroupLabel('/articles/example', sections, 'Pages')).toBe('Articles')
    expect(getSearchResultGroupLabel('/topics?page=2', sections, 'Pages')).toBe('Topics')
    expect(getSearchResultGroupLabel('/privacy', sections, 'Pages')).toBe('Pages')
  })

  it('opens with slash only outside editable targets', () => {
    const event = new KeyboardEvent('keydown', { key: '/' })
    Object.defineProperty(event, 'target', { value: document.createElement('button') })

    const inputEvent = new KeyboardEvent('keydown', { key: '/' })
    Object.defineProperty(inputEvent, 'target', { value: document.createElement('input') })

    expect(shouldOpenSearchWithShortcut(event)).toBe(true)
    expect(shouldOpenSearchWithShortcut(inputEvent)).toBe(false)
  })

  it('closes only on escape when already open', () => {
    expect(shouldCloseSearchWithShortcut(new KeyboardEvent('keydown', { key: 'Escape' }), true)).toBe(true)
    expect(shouldCloseSearchWithShortcut(new KeyboardEvent('keydown', { key: 'Escape' }), false)).toBe(false)
    expect(shouldCloseSearchWithShortcut(new KeyboardEvent('keydown', { key: 'Enter' }), true)).toBe(false)
  })
})
