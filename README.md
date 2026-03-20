# SeniorPath

SeniorPath is the editorial site for guides, concepts, glossary pages, tracks, and topic navigation around senior-level engineering judgment.

## Repo Structure

- `apps/site`: Astro site for guides, glossary pages, topic hubs, and static learning paths
- `packages/content`: guide metadata, roadmap taxonomy, and content helpers
- `docs/path-to-senior/`: editorial roadmap and taxonomy notes

## Stack

- TypeScript
- Astro
- pnpm workspaces
- Zod
- Tailwind CSS

## Product Principles

- Local-first before sync
- Mobile-friendly before feature-heavy
- Clear study loops before surface-area growth
- Small composable changes over giant rewrites
- Keep content and product structure aligned
- Remove parallel systems when they stop paying rent

## Run It

```bash
pnpm install
pnpm dev:all
pnpm dev
pnpm dev:site
```

If you need local environment settings for the site, copy
`apps/site/.env.example` to `apps/site/.env.local`.

## Verify Changes

```bash
pnpm verify
```

If you only need a narrower check:

```bash
pnpm typecheck
pnpm build
```

## Contributing

Contributions are welcome, especially if they improve clarity, usability, or content quality.

Before opening a change:

- keep edits scoped and easy to review
- preserve existing behavior unless the change intentionally improves it
- update docs or content when changing user-facing flows
- run `pnpm verify` before sending a PR

Good contribution areas:

- guide/site navigation
- accessibility fixes
- content tooling and editorial workflow improvements
