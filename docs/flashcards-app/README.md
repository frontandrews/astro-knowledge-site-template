# Flashcards App

Implementation notes for the Prepdeck practice app.

## Product direction

- the app is the `Practice` surface of a larger `Learn -> Practice -> Master` system
- the site teaches the idea first; the app validates understanding
- the content model must stay stable enough for future localization and AI-assisted review

## What matters most

- fast content iteration
- clean separation between content and UI
- enough structure for future AI evaluation
- one shared product language across `apps/site` and `apps/web`

## Core folders

- `packages/content/`: deck content, manifest, and loaders
- `packages/schemas/`: JSON schemas, Zod schemas, and shared types
- `docs/flashcards-app/`: product and architecture notes

## Main planning docs

- `mvp-architecture.md`
- `feature-scope.md`
- `screens-and-flows.md`
- `progress-model.md`
- `implementation-backlog.md`
- `task-breakdown.md`
