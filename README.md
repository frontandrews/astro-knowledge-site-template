# Prepdeck

Prepdeck is a small open-source project I’m building to make technical growth less messy.

The goal is simple: open the app, get one clear next step, study on a phone-sized screen, and come back later without losing your place.

## Why This Repo Exists

- Build a focused portfolio project around a real product
- Keep practice content and app code in one place
- Make study sessions simple enough to use every day
- Keep the repo clean, readable, and easy to run

## Stack

- Vite
- React
- TypeScript
- React Router
- pnpm
- Tailwind CSS
- Zod
- Vitest
- Astro
- vite-plugin-pwa
- Motion for interface polish
- localStorage for local-first persistence

## What It Does

- `apps/web`: local-first flashcards PWA
- `apps/site`: Astro guide site for summary-first reading and practice checklists
- `packages/content`: deck manifest, deck JSON, and loaders
- `packages/schemas`: shared Zod schemas and types
- `docs/coding-interview-foundations/`: notes for coding challenge prep
- `docs/system-design-interview/`: notes for system design and tricky technical topics
- `docs/flashcards-app/`: product and implementation notes for the app

## Current Product Surface

1. Browse decks by focus area, topic, difficulty, status, and search
2. Study in flashcard mode or timed interview mode
3. Save local notes on any card
4. Run focused weak-card sessions, daily queues, and mixed mock interviews
5. Track local streaks, recent activity, and study goals
6. Export and import local backups
7. Generate a shareable progress snapshot card
8. Preview monetization surfaces without needing a backend
9. Publish static guides that back selected `learn more` paths

## Principles

- Local-first before sync
- Good mobile navigation before more surface area
- Small, composable features over one giant rewrite
- Keep the free product genuinely usable
- Keep the app and the content layer separate when that separation improves product clarity
- Grow from interview prep into a broader practice app for engineering, communication, and leadership

## Next Up

1. Better history filters and session recap depth
2. Portfolio embed once the standalone app feels fully mature
3. More article coverage across the current card library

## Run It

```bash
pnpm install
pnpm dev:all
pnpm dev
pnpm dev:site
```

If you want the app to open the Astro guide site during local development, copy
`apps/web/.env.example` to `apps/web/.env.local`.

If you want the guide site to open the app correctly during local development, copy
`apps/site/.env.example` to `apps/site/.env.local`.

## Test It

```bash
pnpm test
pnpm lint
pnpm build
pnpm build:site
```
