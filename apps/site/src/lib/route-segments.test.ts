import { describe, expect, it } from 'vitest'

import {
  encodeRoutePath,
  encodeRouteSegment,
  getCanonicalRouteLabel,
  getCanonicalRouteParamsKey,
  getEntryLeafRouteSegment,
  getNormalizedRouteSegments,
  getRouteHref,
} from '@/lib/route-segments'

describe('route segment helpers', () => {
  it('normalizes entry ids to NFC and keeps the leaf slug stable', () => {
    expect(getEntryLeafRouteSegment('pt-br/glossario/cafe\u0301-com-node')).toBe('café-com-node')
  })

  it('percent-encodes reserved characters and keeps long ids intact', () => {
    const longSlug = `guia?de#setup-${'x'.repeat(160)}`

    expect(encodeRouteSegment(longSlug)).toBe(`guia%3Fde%23setup-${'x'.repeat(160)}`)
    expect(getRouteHref(`pt-br/trilhas/${longSlug}`)).toBe(`/pt-br/trilhas/guia%3Fde%23setup-${'x'.repeat(160)}`)
  })

  it('normalizes full paths before encoding', () => {
    expect(getNormalizedRouteSegments('/pt-br/conceitos/cafe\u0301/')).toEqual(['pt-br', 'conceitos', 'café'])
    expect(encodeRoutePath('/pt-br/conceitos/cafe\u0301/')).toBe('pt-br/conceitos/caf%C3%A9')
  })

  it('builds canonical route keys and labels from encoded public params', () => {
    const params = {
      locale: 'pt-br',
      section: 'trilhas avançadas',
      slug: 'café?guia',
    }

    expect(getCanonicalRouteParamsKey(params)).toBe(
      JSON.stringify([
        ['locale', 'pt-br'],
        ['section', 'trilhas%20avan%C3%A7adas'],
        ['slug', 'caf%C3%A9%3Fguia'],
      ]),
    )
    expect(getCanonicalRouteLabel(params)).toBe('/pt-br/trilhas%20avan%C3%A7adas/caf%C3%A9%3Fguia')
  })
})
