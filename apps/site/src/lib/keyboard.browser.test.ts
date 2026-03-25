// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'

import { isEditableKeyboardTarget } from '@/lib/keyboard'

describe('isEditableKeyboardTarget', () => {
  it('returns true for native editable form elements', () => {
    expect(isEditableKeyboardTarget(document.createElement('input'))).toBe(true)
    expect(isEditableKeyboardTarget(document.createElement('textarea'))).toBe(true)
    expect(isEditableKeyboardTarget(document.createElement('select'))).toBe(true)
  })

  it('returns true for contenteditable elements and false otherwise', () => {
    const editable = document.createElement('div')
    Object.defineProperty(editable, 'isContentEditable', { value: true })

    expect(isEditableKeyboardTarget(editable)).toBe(true)
    expect(isEditableKeyboardTarget(document.createElement('button'))).toBe(false)
    expect(isEditableKeyboardTarget(null)).toBe(false)
  })
})
