import { describe, expect, it } from 'vitest'

import {
  getAgentsIndexHref,
  getDiscoverabilityCoreCards,
  renderLlmsTxt,
} from '@/lib/discoverability'

describe('discoverability helpers', () => {
  it('builds localized agent index hrefs', () => {
    expect(getAgentsIndexHref('en')).toBe('/agents')
    expect(getAgentsIndexHref('pt-br')).toBe('/pt-br/agents')
  })

  it('returns current-locale discovery cards and feed when articles are enabled', () => {
    const cards = getDiscoverabilityCoreCards('pt-br')

    expect(cards.map((card) => card.href)).toContain('/llms.txt')
    expect(cards.map((card) => card.href)).toContain('/pt-br/feed.xml')
    expect(cards.map((card) => card.href)).toContain('/pt-br')
  })

  it('renders llms.txt with global entry points and localized agent pages', () => {
    const body = renderLlmsTxt('https://example.com')

    expect(body).toContain('# Site Template')
    expect(body).toContain('llms.txt: https://example.com/llms.txt')
    expect(body).toContain('English agent index: https://example.com/agents')
    expect(body).toContain('Português agent index: https://example.com/pt-br/agents')
    expect(body).toContain('Articles: long-form editorial explanations.')
  })
})
