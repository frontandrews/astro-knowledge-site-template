# Release checklist

Use this before publishing the template in either supported mode.

For the short docs map, see [operations.md](./operations.md).

## Shared checks

- Node `22` is the runtime in local, CI, and hosting
- `PUBLIC_SITE_URL` points to the real production domain
- legal owner, legal email, support email, governing law, and venue are set if `/privacy` and `/terms-and-services` are public
- comments, newsletter, observability, and other third parties are either disabled or reflected in CSP, legal pages, and the operational privacy review
- preview builds stay `noindex` and production builds expose the real canonical, RSS, and sitemap behavior
- `pnpm verify:core`
- `pnpm test:e2e:site`

## Starter mode release

Use this when production should ship with `examples/starter-content`.

- `pnpm verify:starter`
- confirm the starter content is intentionally public and branded for the deployment
- smoke the home page, one article, one track, one challenge, `/privacy`, and `/terms-and-services`
- confirm search works on the final host and under the final base URL or subpath

## External mode release

Use this when build-time content comes from another repository.

- `SITE_CONTENT_DIR=../your-content-repo pnpm verify:external`
- CI checks out both repos in a stable relative layout
- the external `collections.manifest.json` matches the sections you intend to expose publicly
- the external repo contains the legal, brand, and locale coverage expected by production
- `pnpm smoke:external`

## After publish

- check `robots.txt`, `feed.xml`, `llms.txt`, `sitemap-index.xml`, and one entity `og:` image on the real domain
- verify the operational privacy block on `/privacy` and `/terms-and-services` matches the live integrations
- confirm preview or ephemeral branches still emit `noindex,nofollow`
