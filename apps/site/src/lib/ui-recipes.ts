const linearCard =
  'relative -mx-[0.45rem] grid gap-[0.35rem] rounded-[var(--radius-xs)] px-[0.45rem] py-[0.8rem] lg:gap-[0.5rem] lg:px-[0.55rem] lg:py-[0.95rem]'

export const uiRecipes = {
  actionLink:
    'inline-flex items-center rounded-[var(--radius-xs)] px-2.5 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-site-ink transition-colors duration-150 hover:bg-site-hover hover:text-site-link-hover focus-visible:bg-site-hover focus-visible:text-site-link-hover focus-visible:outline-none lg:px-3 lg:text-[0.86rem]',
  badge:
    'inline-flex min-h-8 items-center rounded-full border border-site-line bg-site-card px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-site-ink lg:min-h-[2.15rem] lg:px-3.5 lg:text-[0.78rem]',
  badgeLink:
    'transition-colors duration-150 hover:border-site-line-strong hover:bg-site-hover hover:text-site-link-hover',
  cardButton:
    'group inline-flex w-fit items-center gap-2 rounded-[var(--radius-xs)] border border-site-line bg-site-card px-3.5 py-2 text-[0.82rem] font-medium text-site-ink transition-colors duration-150 hover:border-site-line-strong hover:bg-site-hover hover:text-site-link-hover focus-visible:border-site-line-strong focus-visible:bg-site-hover focus-visible:text-site-link-hover focus-visible:outline-none lg:px-4 lg:py-2.5 lg:text-[0.9rem]',
  contentKindBadge:
    'inline-flex w-fit items-center rounded-full border border-site-line bg-site-card px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-site-ink-subtle lg:px-3 lg:text-[0.72rem]',
  controlButton:
    'inline-flex items-center justify-center rounded-[var(--radius-xs)] border border-site-line bg-site-panel text-site-ink transition-colors duration-150 hover:bg-site-hover hover:text-site-link-hover focus-visible:bg-site-hover focus-visible:text-site-link-hover focus-visible:outline-none',
  inlineCta:
    'mt-0.5 inline-flex items-center gap-1.5 text-[0.76rem] font-medium tracking-[0.04em] text-site-ink-muted transition-colors duration-150 group-hover:text-site-link-hover group-focus-within:text-site-link-hover lg:text-[0.84rem]',
  linearCard,
  linearCardInteractive: `${linearCard} text-inherit transition-colors duration-150 hover:bg-site-hover hover:text-site-link-hover focus-visible:bg-site-hover focus-visible:text-site-link-hover focus-visible:outline-none`,
  linearRow: 'group h-full border-t border-site-line bg-transparent first:border-t-0',
  panel: 'rounded-[var(--radius)] border border-site-line bg-site-panel',
  quietAction:
    'w-fit text-[0.78rem] font-medium text-site-ink-muted transition-colors duration-150 hover:text-site-link-hover focus-visible:text-site-link-hover focus-visible:outline-none lg:text-[0.86rem]',
  titleCardLink:
    'group block rounded-[var(--radius)] border border-site-line bg-site-panel px-5 py-6 text-inherit transition-colors duration-150 hover:border-site-line-strong hover:bg-site-hover hover:text-site-link-hover focus-visible:border-site-line-strong focus-visible:bg-site-hover focus-visible:text-site-link-hover focus-visible:outline-none lg:px-6 lg:py-7',
  toolbar: 'grid gap-2 rounded-[var(--radius)] border border-site-line bg-site-panel px-5 py-4 lg:gap-3 lg:px-6 lg:py-5',
} as const
