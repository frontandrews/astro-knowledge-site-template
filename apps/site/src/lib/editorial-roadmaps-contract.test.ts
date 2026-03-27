import { describe, expect, it } from 'vitest'

import * as starterRoadmaps from '../../../../examples/starter-content/collections/roadmaps/roadmaps'
import * as templateRoadmaps from '../../../../templates/content-repo/collections/roadmaps/roadmaps'

function createArticleEntry(options: {
  entryId: string
  locale: 'en' | 'pt-br'
  title: string
  wordCount?: number
}) {
  const {
    entryId,
    locale,
    title,
    wordCount = 220,
  } = options

  return {
    body: 'word '.repeat(wordCount),
    data: {
      articleId: 'customize-the-template-after-clone',
      description: `${title} description`,
      level: 'beginner',
      locale,
      status: 'active',
      title,
      trackEligible: true,
    },
    id: entryId,
  } as never
}

describe('starter/template roadmap contract', () => {
  const englishArticle = createArticleEntry({
    entryId: 'en/foundations/customize-the-template-after-the-first-clone',
    locale: 'en',
    title: 'Customize the template after the first clone',
  })
  const portugueseArticle = createArticleEntry({
    entryId: 'pt-br/fundamentos/personalize-o-template-depois-do-primeiro-clone',
    locale: 'pt-br',
    title: 'Personalize o template depois do primeiro clone',
  })

  it('resolves the starter roadmap with concept nodes and derived metrics', () => {
    const [roadmap] = starterRoadmaps.resolveEditorialRoadmaps('en', [englishArticle])

    expect(roadmap).toMatchObject({
      estimatedReadingMinutes: 1,
      href: '/tracks/first-clone-checklist',
      level: 'beginner',
      slug: 'first-clone-checklist',
      stepCount: 1,
    })
    expect(roadmap.nodes.map((node) => node.kind)).toEqual(['concept', 'article'])

    const conceptNode = roadmap.nodes[0]

    expect(conceptNode.kind).toBe('concept')
    if (conceptNode.kind === 'concept') {
      expect(conceptNode.relatedArticles).toHaveLength(1)
      expect(conceptNode.relatedArticles[0]?.data.articleId).toBe('customize-the-template-after-clone')
    }
  })

  it('keeps the asymmetric fixture hidden in english and available in pt-br', () => {
    expect(starterRoadmaps.resolveEditorialRoadmapBySlug('en', [englishArticle], 'pt-br-only-e2e-track')).toBeNull()

    expect(
      starterRoadmaps.resolveEditorialRoadmapBySlug(
        'pt-br',
        [portugueseArticle],
        'trilha-apenas-pt-br-e2e',
      ),
    ).toMatchObject({
      availableLocales: ['pt-br'],
      href: '/pt-br/trilhas/trilha-apenas-pt-br-e2e',
      level: 'beginner',
      stepCount: 1,
    })
  })

  it('drops roadmaps whose article targets are missing instead of crashing', () => {
    expect(starterRoadmaps.resolveEditorialRoadmaps('en', [])).toEqual([])
    expect(starterRoadmaps.resolveEditorialRoadmap('en', [], 'first-clone-checklist')).toBeNull()
  })

  it('keeps starter and template runtime outputs identical', () => {
    expect(templateRoadmaps.resolveEditorialRoadmaps('en', [englishArticle])).toEqual(
      starterRoadmaps.resolveEditorialRoadmaps('en', [englishArticle]),
    )
    expect(templateRoadmaps.resolveEditorialRoadmaps('pt-br', [portugueseArticle])).toEqual(
      starterRoadmaps.resolveEditorialRoadmaps('pt-br', [portugueseArticle]),
    )
  })
})
