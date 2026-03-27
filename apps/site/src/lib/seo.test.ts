import { describe, expect, it } from 'vitest'

import {
  createBreadcrumbSchema,
  createDefinedTermSchema,
  createLearningResourceSchema,
  createTrackSchema,
} from '@/lib/seo'

describe('seo schemas', () => {
  it('builds track schema with localized item list metadata', () => {
    const schema = createTrackSchema({
      description: 'Track overview',
      items: [
        {
          description: 'Start here',
          title: 'Intro article',
          url: 'https://example.com/articles/intro',
        },
        {
          description: 'Deep dive',
          title: 'Advanced article',
          url: 'https://example.com/articles/advanced',
        },
      ],
      level: 'advanced',
      locale: 'pt-br',
      title: 'Routing track',
      totalReadingMinutes: 95,
      totalSteps: 2,
      url: 'https://example.com/pt-br/trilhas/routing-track',
    })

    expect(schema).toMatchObject({
      '@type': 'CollectionPage',
      educationalLevel: 'advanced',
      inLanguage: 'pt-BR',
      name: 'Routing track',
      timeRequired: 'PT1H35M',
      url: 'https://example.com/pt-br/trilhas/routing-track',
    })
    expect(schema.mainEntity).toMatchObject({
      '@type': 'ItemList',
      numberOfItems: 2,
    })
    expect(schema.mainEntity).toHaveProperty('itemListElement')
    expect(Array.isArray(schema.mainEntity.itemListElement)).toBe(true)
    expect(schema.mainEntity.itemListElement).toHaveLength(2)
  })

  it('builds glossary term schema with aliases and term set', () => {
    const schema = createDefinedTermSchema({
      aliases: ['Slug localized'],
      description: 'Human-readable URL segment.',
      locale: 'en',
      tags: ['routing', 'url'],
      termCode: 'localized-slug',
      termSetUrl: 'https://example.com/glossary',
      title: 'Localized slug',
      url: 'https://example.com/glossary/localized-slug',
    })

    expect(schema).toMatchObject({
      '@type': 'DefinedTerm',
      alternateName: ['Slug localized'],
      inDefinedTermSet: 'https://example.com/glossary',
      keywords: ['routing', 'url'],
      name: 'Localized slug',
      termCode: 'localized-slug',
      url: 'https://example.com/glossary/localized-slug',
    })
  })

  it('builds challenge schema with teaching signals and duration', () => {
    const schema = createLearningResourceSchema({
      dateModified: null,
      datePublished: '2026-03-26T00:00:00.000Z',
      description: 'Practice URL generation with locale-aware routing.',
      estimatedMinutes: 20,
      keywords: ['Routing', 'TypeScript'],
      level: 'beginner',
      locale: 'en',
      resourceType: 'String handling',
      teaches: ['Normalize locale prefixes', 'Avoid duplicate slashes'],
      title: 'Build a localized section URL',
      url: 'https://example.com/challenges/build-a-localized-section-url',
    })

    expect(schema).toMatchObject({
      '@type': 'LearningResource',
      dateModified: '2026-03-26T00:00:00.000Z',
      educationalLevel: 'beginner',
      isAccessibleForFree: true,
      learningResourceType: 'String handling',
      name: 'Build a localized section URL',
      teaches: ['Normalize locale prefixes', 'Avoid duplicate slashes'],
      timeRequired: 'PT20M',
      url: 'https://example.com/challenges/build-a-localized-section-url',
    })
  })

  it('keeps breadcrumb schema shape compatible with the new page entities', () => {
    const schema = createBreadcrumbSchema({
      items: [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Tracks', url: 'https://example.com/tracks' },
        { name: 'Routing track', url: 'https://example.com/tracks/routing-track' },
      ],
    })

    expect(schema).toMatchObject({
      '@type': 'BreadcrumbList',
    })
    expect(schema.itemListElement).toHaveLength(3)
    expect(schema.itemListElement[2]).toMatchObject({
      item: 'https://example.com/tracks/routing-track',
      name: 'Routing track',
      position: 3,
    })
  })
})
