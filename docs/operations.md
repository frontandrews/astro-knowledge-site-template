# Operations index

Use this page as the short entrypoint for publishing and maintaining the shell.

## Start here

- [Deploy the template](./deploy.md): hosting model, CSP, cache policy, preview behavior, and provider guides
- [Release checklist](./release-checklist.md): final pre-publish checks for starter mode and external mode
- [Use an external content repo](./external-content.md): how to split shell and editorial content
- [Rebrand the template](./rebrand.md): what to replace first when the shell is right but the identity is still generic
- [How SeniorPath uses this template](./how-seniorpath-uses-this-template.md): what is generic shell behavior versus SeniorPath-specific opinionation

## Practical order

1. Pick starter mode or external mode.
2. Rebrand the shell and set production env values.
3. Run the release checklist.
4. Deploy and verify legal, RSS, robots, sitemap, and search on the real domain.

## Strict publish guard

If you want production builds to fail when operator identity is still missing, or when optional integrations are configured without legal/support contact, set:

```bash
SITE_ENFORCE_PUBLISH_READINESS=1
```

This guard is optional and complements `SITE_BUILD_TARGET=production`, which already enforces a real `PUBLIC_SITE_URL`.
