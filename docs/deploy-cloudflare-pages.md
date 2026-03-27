# Deploy on Cloudflare Pages

Cloudflare Pages is a good fit when you want static hosting close to the edge and a simple publish target.

Node `22` is the canonical runtime for this template.

## Starter deployment

Use this when you want the bundled starter content only.

Build command:

```bash
SITE_BUILD_TARGET=production pnpm verify:starter
```

Build output directory:

```text
apps/site/dist
```

`apps/site/dist/_headers` is generated automatically during build, so Cloudflare Pages can apply the baseline CSP, security headers, and cache policy directly from the published artifact.

## External content repo deployment

Cloudflare Pages Git builds are easiest when everything is in one repository.

If your editorial content lives in a second repository, the safer path is:

1. build the static output in CI where both repositories are available
2. publish the generated `apps/site/dist` directory to Pages

If your Pages project was created with Git integration first, disable automatic production and preview deployments in Cloudflare before moving to this flow. Keep the project, stop the dashboard build, and let CI publish with `wrangler pages deploy`.

Example shell-side build command:

```bash
SITE_BUILD_TARGET=production SITE_CONTENT_DIR=../your-content-repo pnpm verify:external
```

Example workspace:

```text
workspace/
  astro-knowledge-site-template/
  your-content-repo/
```

This keeps the template provider-neutral while still giving Cloudflare users a concrete path.

If you add third-party origins such as analytics or custom APIs, extend the generated CSP with the `PUBLIC_CSP_*` env vars documented in [Deploy the template](./deploy.md).
