# Deploy on Vercel

Vercel is a good fit when you want a quick static deployment and preview URLs with little setup.

Node `22` is the canonical runtime for this template.

## Starter deployment

Use this when you want the fastest public demo.

Build command:

```bash
SITE_BUILD_TARGET=production pnpm verify:starter
```

Output directory:

```text
apps/site/dist
```

The repo now also includes `apps/site/vercel.json` with baseline security and cache headers for Vercel-hosted builds rooted at `apps/site`.

## External content repo deployment

Use this when the shell and editorial content are in separate repositories.

Vercel needs the shell repo and the content repo available in the same build workspace.

Example CI workspace:

```text
workspace/
  astro-knowledge-site-template/
  your-content-repo/
```

Build command from the shell repo:

```bash
SITE_BUILD_TARGET=production SITE_CONTENT_DIR=../your-content-repo pnpm verify:external
```

Publish:

```text
apps/site/dist
```

If your deployment flow cannot check out both repositories together, build the static output in CI first and upload the generated `apps/site/dist` artifact instead of relying on a direct Git integration.

`apps/site/dist/_headers` is still generated during build. Hosts that honor `_headers` will also receive the CSP policy from the artifact. If you deploy through Vercel Git integration and add third-party origins, update `vercel.json` and the `PUBLIC_CSP_*` env vars together so the provider config and generated artifact stay aligned.
