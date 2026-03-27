# Deploy the template

This project builds to a static Astro output.

The deployment decision is less about the host and more about where the content root comes from during build.

Node `22` is the canonical runtime for this template.

## Start with the right build mode

### Starter content

Use this when the deployment should rely on `examples/starter-content`.

```bash
pnpm verify:starter
```

### External content repo

Use this when the shell must read a second repository during build.

```bash
SITE_CONTENT_DIR=../your-content-repo pnpm verify:external
```

## Generic multi-repo CI layout

```text
workspace/
  astro-knowledge-site-template/
  your-content-repo/
```

Publish `apps/site/dist`.

## Provider guides

- [Operations index](./operations.md)
- [Deploy on Vercel](./deploy-vercel.md)
- [Deploy on Cloudflare Pages](./deploy-cloudflare-pages.md)
- [Release checklist](./release-checklist.md)

## Generated hosting config

The site build now writes `apps/site/dist/_headers` automatically.

This file carries the baseline static-host policy for:

- security headers: `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, and `Strict-Transport-Security` when `PUBLIC_SITE_URL` is `https://...`
- cache policy for `/_astro/*`, `/pagefind/*`, `feed.xml`, localized feeds, `sitemap*.xml`, `robots.txt`, `llms.txt`, `og-image.svg`, and long-lived public assets

If you enable extra third-party origins beyond the built-in defaults, extend the generated CSP with:

- `PUBLIC_CSP_SCRIPT_SRC`
- `PUBLIC_CSP_STYLE_SRC`
- `PUBLIC_CSP_FONT_SRC`
- `PUBLIC_CSP_IMG_SRC`
- `PUBLIC_CSP_CONNECT_SRC`
- `PUBLIC_CSP_FRAME_SRC`
- `PUBLIC_CSP_FORM_ACTION`
- `PUBLIC_CSP_WORKER_SRC`

Use space-separated values, for example:

```bash
PUBLIC_CSP_SCRIPT_SRC="https://analytics.example.com"
PUBLIC_CSP_CONNECT_SRC="https://analytics.example.com https://api.example.com"
```

## Cache policy

- `/_astro/*`: `public, max-age=31536000, immutable`
- `/pagefind/*`: `public, max-age=0, must-revalidate`
- `/feed.xml`, `/*/feed.xml`, `/sitemap*.xml`, `/robots.txt`, `/llms.txt`: `public, max-age=0, must-revalidate`
- `/og-image.svg`, `/icon.svg`, `/favicon.svg`, `/giscus-theme.css`: `public, max-age=3600, must-revalidate`
- `/fonts/*`: `public, max-age=31536000, immutable`

## Production checklist

- `PUBLIC_SITE_URL` points to the final domain
- use `SITE_BUILD_TARGET=production` when you want the build to fail if `PUBLIC_SITE_URL` is missing, invalid, or still `https://example.com`
- set `SITE_ENFORCE_PUBLISH_READINESS=1` if you also want production builds to fail when operator identity is still missing, or when optional integrations are configured without legal/support contact
- review CSP extension vars if you add analytics, comments, newsletter endpoints, or other third-party services
- review the operational privacy block on `/privacy` and `/terms-and-services` after enabling comments, newsletter, or observability
- legal and support vars are set if you expose those pages publicly
- `SITE_CONTENT_DIR` resolves correctly in CI when using an external repo
- the same build environment uses Node `22`
- `pnpm verify:starter` or `pnpm verify:external` passes before publish

Use [operations.md](./operations.md) for the short operations map and [release-checklist.md](./release-checklist.md) for the full starter-mode versus external-mode checklist.

## Preview behavior

- non-production builds now resolve `site` to the preview domain when the provider exposes one, or to `http://127.0.0.1:4321` locally
- preview and ephemeral builds emit `noindex,nofollow`, `robots.txt` switches to `Disallow: /`, and RSS is no longer advertised in the shell
- local development keeps the RSS link visible so the feed stays easy to inspect while you work
- production keeps the normal canonical, sitemap pointer, and RSS discovery behavior
