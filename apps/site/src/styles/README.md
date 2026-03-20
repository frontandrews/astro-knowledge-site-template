# Styling Rules

- Tokens live in `src/styles/global.css`.
- Prefer semantic tokens first, then `src/lib/ui-*` recipes/variants, then local utilities only for one-off layout math.
- Use `nav:` for the shared header/search breakpoint. Do not add `min-[...]` or `max-[...]` variants.
- Do not add raw hex colors or Tailwind palette colors in components. Promote them to tokens first.
- Do not add literal `shadow-[...]` values in components. Use `--site-shadow-*` tokens.
- Run `pnpm style:guard` and `pnpm tailwind:canonical --check` before shipping style changes.
