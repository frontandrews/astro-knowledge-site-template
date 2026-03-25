---
challengeId: build-a-localized-section-url
title: Build a localized section URL
description: Generate a public URL for a section slug without duplicating slashes.
summary: A starter-friendly challenge that validates the playground and mirrors a real template concern.
locale: en
pubDate: 2026-03-24
status: active
type: strings
typeLabel: String handling
level: beginner
estimatedMinutes: 10
solutionLanguage: typescript
order: 10
commonMistakes:
  - Forgetting to normalize empty slugs before concatenating strings.
  - Adding the locale prefix for English when the default locale should stay flat.
hints:
  - Build the base path first, then append the slug only when it exists.
  - Trim leading and trailing slashes from the slug before joining.
whatToNotice:
  - Small URL helpers are easy to duplicate and drift over time.
  - A reusable template benefits from one canonical route builder.
relatedArticleIds:
  - customize-the-template-after-clone
relatedChallengeIds: []
testCases:
  - description: English route stays flat
    input:
      - en
      - articles
      - starter
    expected: /articles/starter
  - description: Portuguese route gets the locale prefix
    input:
      - pt-br
      - artigos
      - primeiro-clone
    expected: /pt-br/artigos/primeiro-clone
  - description: Empty slug returns the section index URL
    input:
      - en
      - glossary
      - ''
    expected: /glossary
starterCode: |
  export function buildSectionUrl(locale: string, section: string, slug = ''): string {
    const normalizedSlug = slug.trim().replace(/^\/+|\/+$/g, '')
    const base = locale === 'pt-br' ? `/pt-br/${section}` : `/${section}`

    return normalizedSlug ? `${base}/${normalizedSlug}` : base
  }
---
## Goal

Implement a small helper that returns public section URLs for English and Portuguese routes.

## Why this is here

Even tiny path helpers are worth centralizing in a reusable shell. They shape navigation, canonical URLs, and internal links across the whole project.
