import { describe, expect, it } from 'vitest'

import {
  getEntityOgImagePath,
  renderOgImageSvg,
  resolveEntityOgImageUrl,
} from '@/lib/og-image'

describe('og image helpers', () => {
  it('builds stable entity image paths', () => {
    expect(getEntityOgImagePath('articles', 'pt-br', 'first-clone')).toBe(
      '/og/articles/pt-br/first-clone.svg',
    )
    expect(
      resolveEntityOgImageUrl(
        'https://example.com/articles/first-clone',
        'tracks',
        'en',
        'first-clone-checklist',
      ),
    ).toBe('https://example.com/og/tracks/en/first-clone-checklist.svg')
  })

  it('renders escaped svg content with localized eyebrow and meta', () => {
    const svg = renderOgImageSvg({
      description: 'Use <components> safely in OG cards.',
      eyebrow: 'Articles',
      locale: 'pt-br',
      metaLine: 'Frontend | Beginner | 8 min',
      title: 'Safe title <with> escaping',
    })

    expect(svg).toContain('ARTICLES')
    expect(svg).toContain('Frontend | Beginner | 8 min')
    expect(svg).toContain('PT')
    expect(svg).toContain('Safe title &lt;with&gt; escaping')
    expect(svg).toContain('Use &lt;components&gt; safely in OG cards.')
  })
})
