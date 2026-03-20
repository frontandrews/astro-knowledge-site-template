import { cva } from 'class-variance-authority'

import { cn } from '@/lib/cn'
import { ui } from '@/lib/ui'

export const navLinkVariants = cva(
  'inline-flex min-h-9 items-center justify-center rounded-full px-3 py-2 text-[0.92rem] font-medium text-site-ink transition-colors duration-150 hover:bg-site-hover hover:text-site-link-hover lg:min-h-10 lg:px-3.5 lg:text-[1rem] max-[56rem]:min-h-8 max-[56rem]:px-[0.45rem] max-[56rem]:py-[0.3rem] max-[56rem]:text-[0.8rem]',
  {
    variants: {
      active: {
        false: '',
        true: 'underline decoration-2 underline-offset-[0.28em]',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
)

export const filterChipVariants = cva(
  'inline-flex min-h-[2.05rem] cursor-pointer items-center justify-center rounded-full border border-site-line bg-[color:color-mix(in_srgb,var(--chip-accent-dark,var(--site-surface-strong))_34%,transparent)] px-3 py-1.5 text-[0.72rem] font-semibold tracking-[0.01em] text-site-ink transition-colors duration-150 lg:min-h-[2.3rem] lg:px-3.5 lg:text-[0.8rem]',
  {
    variants: {
      active: {
        false: '',
        true: 'border-site-line-strong bg-site-accent/20 text-site-link-hover',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
)

export const directoryListVariants = cva('', {
  variants: {
    kind: {
      'guide-rows': ui.linearList,
      'title-cards': ui.titleCardList,
    },
  },
  defaultVariants: {
    kind: 'title-cards',
  },
})

export const directoryLinkVariants = cva('', {
  variants: {
    kind: {
      'guide-rows': ui.linearCardInteractive,
      'title-cards': ui.titleCardLink,
    },
  },
  defaultVariants: {
    kind: 'title-cards',
  },
})

export const linkCardVariants = cva('', {
  variants: {
    variant: {
      compact:
        'group grid gap-2 rounded-[var(--radius-xs)] px-3 py-2 text-inherit transition-colors duration-150 hover:bg-site-hover hover:text-site-link-hover focus-visible:bg-site-hover focus-visible:text-site-link-hover focus-visible:outline-none',
      ghost:
        'group block rounded-[var(--radius-xs)] p-3 text-inherit transition-colors duration-150 hover:bg-site-hover hover:text-site-link-hover focus-visible:bg-site-hover focus-visible:text-site-link-hover focus-visible:outline-none',
      panel: ui.titleCardLink,
    },
  },
  defaultVariants: {
    variant: 'panel',
  },
})

export const linkCardHeaderVariants = cva('', {
  variants: {
    showArrow: {
      false: 'grid gap-1',
      true: 'flex items-center justify-between gap-4',
    },
  },
  defaultVariants: {
    showArrow: true,
  },
})

export const articleCardArticleVariants = cva('group relative h-full bg-transparent', {
  variants: {
    variant: {
      linear: 'border-t border-site-line',
      minimal: '',
      rich: '',
    },
  },
  defaultVariants: {
    variant: 'minimal',
  },
})

export const articleCardLinkVariants = cva(
  'text-inherit transition-colors duration-150 hover:bg-site-hover hover:text-site-link-hover focus-visible:bg-site-hover focus-visible:text-site-link-hover focus-visible:outline-none',
  {
    variants: {
      variant: {
        linear: ui.linearCardInteractive,
        minimal: 'block rounded-[var(--radius-xs)] p-3',
        rich: 'grid min-h-[8.8rem] gap-1.5 rounded-[var(--radius)] bg-site-card p-4',
      },
    },
    defaultVariants: {
      variant: 'minimal',
    },
  },
)

export const articleCardTitleVariants = cva(cn(ui.linearItemTitle, 'transition-colors duration-150'), {
  variants: {
    variant: {
      linear: 'text-base',
      minimal: '',
      rich: '',
    },
  },
  defaultVariants: {
    variant: 'minimal',
  },
})

export const eyebrowVariants = cva('', {
  variants: {
    tone: {
      caps: ui.cardEyebrow,
      sentence: ui.metaQuiet,
    },
  },
  defaultVariants: {
    tone: 'caps',
  },
})

export const guideTreeItemVariants = cva('grid', {
  variants: {
    depth: {
      0: '',
      1: 'pl-4',
      2: 'pl-5',
    },
  },
  defaultVariants: {
    depth: 0,
  },
})

export const guideTreeLabelVariants = cva('m-0', {
  variants: {
    depth: {
      0: 'font-head text-[1.2rem] font-black tracking-[-0.02em] text-site-ink lg:text-[1.35rem]',
      1: 'text-base font-bold tracking-[0.01em] text-site-ink lg:text-[1.08rem]',
      2: 'text-[0.82rem] font-bold uppercase tracking-[0.18em] text-site-line-strong lg:text-[0.9rem]',
    },
    interactive: {
      false: '',
      true: 'transition-colors duration-150 hover:text-site-link-hover',
    },
  },
  defaultVariants: {
    depth: 0,
    interactive: false,
  },
})
