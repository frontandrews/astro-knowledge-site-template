# Site Template

Astro shell for editorial sites with reusable section renderers, versioned branding, and example-based content bootstrapping.

This repository is designed to work in two modes:

1. clean clone with bundled starter content
2. real project with an external editorial repository

The bundled example is the default path now. That is the main change in the template model.

Live example: `https://seniorpath.pro`

## Core Idea

This repo owns the application shell.

It does not need to own the final published content on day one.

Instead, the shell can start with the example content in `examples/starter-content`, and later switch to a separate content repository without changing the shell contract.

## Project Model

The template is split into three layers:

- `shell`: Astro app, layouts, routes, indexes, reusable UI, search
- `brand`: site identity, locale defaults, legal defaults, feature flags
- `editorial`: starter content or an external content repository consumed through sync

That split is deliberate:

- shell stays versioned here
- brand defaults stay versioned here
- editorial content can move out later without rewriting the shell

## Repository Layout

- `apps/site`: Astro app, pages, layouts, brand config, sync scripts
- `packages/content`: shared taxonomy helpers used by the shell
- `packages/theme`: shared theme assets
- `examples/starter-content`: bundled runnable example content
- `scripts/init-template.mjs`: local bootstrap for ignored files

## Fastest Path

If you only want to clone and test the template:

```bash
pnpm install
pnpm dev
```

That already works.

If you also want local editable config files created for you:

```bash
pnpm init:template
```

That command creates these files only when they do not exist yet:

- `.local/content-source.json`
- `apps/site/.env`

## What The Example Gives You

The bundled example is not a fake placeholder directory. It is a real minimal content root that exercises the shell.

It includes:

- 1 article in English and PT-BR
- 1 track
- 1 concept entry
- 1 glossary entry
- 1 challenge with interactive playground
- roadmap and article registry modules required by the shell

So a clean clone can validate:

- localized routes
- dynamic sections
- legal pages
- RSS and sitemap generation
- challenge playground rendering
- track rendering

## Example Content Root

The bundled example follows the same contract expected from a real external editorial repository:

```text
examples/starter-content/
  collections.manifest.json
  collections/
    articles/
    roadmaps/
    concepts/
    glossary/
    challenges/
```

That means the example is also the reference implementation for the content contract.

## Content Resolution Order

When the shell needs content, it resolves the source in this order:

1. `SITE_CONTENT_DIR`
2. `.local/content-source.json`
3. `examples/starter-content`

So the example is the safe fallback, not a side note.

## Example First, Real Content Later

### Clean clone flow

Use this when you want to test the shell before making any structural decisions:

```bash
pnpm install
pnpm dev
```

### Local bootstrap flow

Use this when you want ignored local files ready for editing:

```bash
pnpm init:template
pnpm dev
```

### External content flow

When you are ready to move to a real editorial repository, point the shell to it with `.local/content-source.json`:

```json
{
  "contentRoot": "../site-content"
}
```

Or set it directly through the environment:

```bash
SITE_CONTENT_DIR=/absolute/path/to/content-root pnpm dev
```

## The Content Contract

The shell expects a content root with this minimum shape:

```text
collections.manifest.json
collections/
  articles/
  roadmaps/
  concepts/
  glossary/
  challenges/
```

`collections.manifest.json` is the main contract between the shell and the content source. It defines:

- which sections exist
- which renderer each section uses
- whether each section is enabled
- where each collection lives
- public route segments
- localized labels and descriptions

Current supported `pageType` values:

- `articles`
- `tracks`
- `topics`
- `concepts`
- `glossary`
- `challenges`

At the moment the shell still supports one section per `pageType`.

## Example Manifest

This is the same pattern used by the bundled starter:

```json
{
  "sections": [
    {
      "id": "articles",
      "pageType": "articles",
      "enabled": true,
      "sourceDir": "collections/articles",
      "routes": {
        "en": "articles",
        "pt-br": "artigos"
      },
      "labels": {
        "en": "Articles",
        "pt-br": "Artigos"
      }
    }
  ]
}
```

The full working example lives in [`examples/starter-content/collections.manifest.json`](examples/starter-content/collections.manifest.json).

## Branding And Shell Config

The main shell config lives in [`apps/site/src/brand/brand.config.ts`](apps/site/src/brand/brand.config.ts).

It owns:

- `site`: name, description, canonical URL, storage namespace
- `locales`: default locale, supported locales, labels, `htmlLang`
- `legal`: owner, support, and legal page defaults
- `features`: shell toggles such as search, comments, newsletter, locale switcher
- `home`: landing or default section
- `integrations`: comments and newsletter defaults

Section enablement does not live there. It stays in `collections.manifest.json`, because section structure is editorial, not branding.

## Local Env Model

Versioned config is the source of truth. Public env vars only override fields the shell already knows about.

For local work, use `apps/site/.env`.

`pnpm init:template` creates it from [`apps/site/.env.example`](apps/site/.env.example) when missing.

Main env groups:

### Branding and metadata

```bash
PUBLIC_SITE_NAME
PUBLIC_SITE_DESCRIPTION
PUBLIC_SITE_URL
PUBLIC_STORAGE_NAMESPACE
PUBLIC_APP_URL
```

### Legal and support

```bash
PUBLIC_LEGAL_OWNER_NAME
PUBLIC_LEGAL_OWNER_LOCATION
PUBLIC_GOVERNING_LAW
PUBLIC_GOVERNING_VENUE
PUBLIC_LEGAL_EMAIL
PUBLIC_SUPPORT_EMAIL
```

### Newsletter

```bash
PUBLIC_NEWSLETTER_URL
```

### Giscus

```bash
PUBLIC_GISCUS_REPO
PUBLIC_GISCUS_REPO_ID
PUBLIC_GISCUS_CATEGORY
PUBLIC_GISCUS_CATEGORY_ID
PUBLIC_GISCUS_THEME
PUBLIC_GISCUS_EMIT_METADATA
PUBLIC_GISCUS_INPUT_POSITION
PUBLIC_GISCUS_MAPPING
PUBLIC_GISCUS_REACTIONS_ENABLED
PUBLIC_GISCUS_STRICT
```

Comments and newsletter only render when both conditions are true:

- the feature is enabled in `brand.config.ts`
- the required env values are present

## Recommended Adoption Sequence

If you want this repository to stay easy to clone and fork, this is the clean order:

1. run the example first with `pnpm dev`
2. create local files with `pnpm init:template`
3. change `apps/site/.env`
4. change `apps/site/src/brand/brand.config.ts`
5. only then point the shell at a real external content source

That sequence isolates failures and keeps the template trustworthy.

## Commands

- `pnpm init:template`: create ignored local template files when missing
- `pnpm dev`: sync content and start the Astro dev server
- `pnpm content:sync`: sync the resolved content source into `apps/site/.content`
- `pnpm typecheck`: run `astro check`
- `pnpm build`: build the site and search index
- `pnpm verify`: run style checks, canonical Tailwind checks, typecheck, and build

## Current Limits

The shell is reusable, but not fully open-ended yet.

- supported renderers are still defined by `pageType` in the shell
- Astro content collections are still declared manually
- the section manifest still assumes localized route data for `en` and `pt-br`
- topic taxonomy still lives in `packages/content`
- roadmap data still assumes the current shared locale model
- a good part of the UI copy still lives in the shell

Those constraints are intentional for now. The goal is a reusable shell with explicit contracts, not a no-rules runtime builder.

## Next Steps

The highest-leverage improvements from here are:

1. remove the `en` and `pt-br` hard requirement from the section manifest
2. move more UI and institutional copy into locale-aware brand config
3. move taxonomy and roadmap locale ownership out of the shell package layer
4. generate Astro collection config from the editorial manifest
5. add a smoke test that validates the bundled starter on a clean clone

## Verification

Full validation:

```bash
pnpm verify
```

Starter validation only:

```bash
SITE_CONTENT_DIR=./examples/starter-content pnpm content:sync
SITE_CONTENT_DIR=./examples/starter-content pnpm typecheck
SITE_CONTENT_DIR=./examples/starter-content pnpm build
```
