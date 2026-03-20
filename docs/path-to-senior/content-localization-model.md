# Content and Localization Model

This is the target model for Astro content once SeniorPath starts shipping localized guides.

## Non-negotiable rule

`slug` is not content identity.

Use:

- `guideId` for identity
- `locale` for language
- `slug` for the localized URL only

That keeps translations stable and avoids breaking app-to-site links later.

## Recommended folder structure

```txt
apps/site/src/content/guides/
  en/
    thinking-like-a-senior/
      breaking-down-problems.md
    runtime-and-execution/
      event-loop-without-hand-waving.md
  pt-br/
    pensando-como-senior/
      quebrando-problemas-sem-panico.md
    runtime-e-execucao/
      event-loop-sem-enrolacao.md
```

The exact localized folder names can evolve, but the identity must still come from `guideId`.

## Recommended frontmatter

```md
---
guideId: runtime-event-loop
locale: en
slug: event-loop-without-hand-waving
title: Event Loop Without Hand-Waving
description: Why your async code runs in a weird order, and how to reason about it without folklore.
summary: A direct mental model for scheduling, microtasks, and why output order surprises people.
pillarId: runtime-and-execution
path:
  - Runtime & Execution
  - Event Loop and Execution Order
order: 10
relationships:
  - node-single-thread
  - async-vs-sync-real-behavior
relatedDeckIds:
  - javascript-runtime-core
tags:
  - event-loop
  - async
  - javascript
---
```

The `pt-br` version must keep the same `guideId` and `relatedDeckIds`.
Only the localized fields should change.

## Routing model

Recommended shape:

- `/en/guides/runtime-and-execution/event-loop-without-hand-waving`
- `/pt-br/guias/runtime-e-execucao/event-loop-sem-enrolacao`

If the public routes change later, keep the internal content model the same.

## Cross-page linking

Internal references should not store localized slugs.

They should store:

- `guideId`

Then the site resolves:

- `guideId + locale -> localized URL`

This is the key to avoiding link churn during translation.

## Relationships

Relationships must always use `guideId`.

Do not store localized slugs in:

- `relationships`
- `relatedGuides`
- `relatedArticles`

Use translated labels at render time, not as stored identity.

## UI copy vs content

Keep these separate:

- interface copy
- guide content

### Interface copy

Examples:

- button labels
- filter labels
- empty states
- navigation labels

These should live in locale dictionaries, for example:

```txt
apps/site/src/i18n/en.ts
apps/site/src/i18n/pt-br.ts
```

### Guide content

The guide body itself belongs in localized content files under the Astro collection.

## Migration order

When we start this migration, the safest order is:

1. Add `guideId` to every existing guide.
2. Replace `learnMoreSlug` with `learnMoreGuideId` in app content.
3. Introduce locale-aware URL resolution helpers.
4. Move content into locale-specific collections or folders.
5. Translate interface copy dictionaries.
6. Translate content files gradually.

## Product rule

Translations should preserve the mental model, not just the sentence.

SeniorPath content should remain:

- direct
- simple on first read
- practical
- interview-relevant

Localized content should still sound like the same product.
