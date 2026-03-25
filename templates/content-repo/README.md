Minimal editorial content repository scaffold for `astro-knowledge-site-template`.

Use this when you want the shell repo and the published content to live in separate repositories from day one.

This template keeps the same content contract used by the shell:

- `collections.manifest.json`
- `collections/articles`
- `collections/roadmaps`
- `collections/concepts`
- `collections/glossary`
- `collections/challenges`

After generating a content repo from the shell, connect it with one of these commands:

```bash
pnpm init:template --content-root ../your-content-repo
```

or

```bash
SITE_CONTENT_DIR=../your-content-repo pnpm verify:external
```

Replace the sample entries once the shell is reading your real content correctly.
