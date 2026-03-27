import { describe, expect, it } from 'vitest'

import { getLegalPageCopy } from '@/lib/legal-page-copy'

describe('legal page copy', () => {
  it('exposes publication guidance in english', () => {
    const copy = getLegalPageCopy('en')

    expect(copy.privacy.publishChecklist.items.length).toBeGreaterThan(2)
    expect(copy.terms.publishChecklist.items.length).toBeGreaterThan(2)
    expect(copy.privacy.templateNoteLabel.toLowerCase()).not.toContain('template')
    expect(copy.terms.templateNoteLabel.toLowerCase()).not.toContain('template')
  })

  it('exposes publication guidance in portuguese', () => {
    const copy = getLegalPageCopy('pt-br')

    expect(copy.privacy.publishChecklist.items.length).toBeGreaterThan(2)
    expect(copy.terms.publishChecklist.items.length).toBeGreaterThan(2)
    expect(copy.privacy.templateNoteLabel.toLowerCase()).not.toContain('template')
    expect(copy.terms.templateNoteLabel.toLowerCase()).not.toContain('template')
  })
})
