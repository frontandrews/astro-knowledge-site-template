const metaQuiet = 'm-0 text-[0.82rem] leading-6 tracking-[0.03em] text-site-ink-muted lg:text-[0.9rem]'
const dialogHint = 'm-0 text-[0.76rem] uppercase tracking-[0.12em] text-site-ink-muted lg:text-[0.84rem]'
const filterLabel = 'm-0 mb-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-site-ink-subtle lg:text-[0.8rem]'
const progressMeta = 'm-0 text-[0.82rem] font-medium tracking-[0.03em] text-site-ink-soft lg:text-[0.9rem]'
const progressStatus = 'm-0 text-[0.88rem] font-semibold leading-6 text-site-ink lg:text-[0.96rem]'
const shareLabel = 'm-0 text-[0.8rem] font-medium uppercase tracking-[0.22em] text-site-ink-soft lg:text-[0.88rem]'

export const uiTypography = {
  articleBylineName: 'm-0 font-sans font-bold text-article-heading',
  articleExcerpt: 'm-0 mb-2.5 text-base leading-6 text-article-copy lg:text-[1.08rem] lg:leading-7',
  articleKicker: metaQuiet,
  articleMeta: 'm-0 text-sm leading-6 text-article-body lg:text-[0.96rem]',
  articleMetaSubtle: metaQuiet,
  articleTitle:
    'mt-4 mb-1.5 font-sans text-[clamp(2rem,4vw,2.75rem)] font-semibold tracking-[-0.025em] text-article-heading lg:text-[clamp(2.15rem,3.4vw,3rem)]',
  bodyCopy: 'm-0 leading-[1.55] text-site-ink-soft lg:text-[1.04rem] lg:leading-7',
  cardDescription: 'm-0 text-[0.84rem] leading-6 text-site-ink-soft lg:text-[0.93rem] lg:leading-7',
  cardEyebrow: 'm-0 mb-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-site-line-strong lg:text-[0.76rem]',
  cardMeta: 'm-0 text-[0.76rem] font-medium tracking-[0.04em] text-site-ink-muted lg:text-[0.84rem]',
  cardMetaCaps: 'mt-auto text-[0.72rem] uppercase tracking-[0.08em] text-site-ink-muted lg:text-[0.8rem]',
  dialogHint,
  eyebrow: 'm-0 mb-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-site-line-strong lg:text-[0.8rem]',
  eyebrowSentence: 'm-0 text-[0.72rem] font-light tracking-[0.08em] text-site-ink-muted lg:text-[0.8rem]',
  filterLabel,
  footerLink: 'w-fit font-medium leading-6 text-site-ink transition-colors duration-150 hover:text-site-line-strong',
  heading: 'm-0 font-head text-[clamp(1.7rem,5vw,2.4rem)] font-black tracking-[-0.03em] text-site-ink lg:text-[clamp(1.9rem,3vw,2.7rem)]',
  headingCompact:
    'm-0 font-head text-[clamp(1.35rem,4vw,1.9rem)] font-black tracking-[-0.03em] text-site-ink lg:text-[clamp(1.5rem,2.5vw,2.1rem)]',
  linearItemTitle: 'm-0 text-base font-semibold leading-[1.3] lg:text-[1.1rem]',
  linkCardTitle: 'm-0 text-lg font-semibold leading-tight lg:text-[1.25rem]',
  metaQuiet,
  nextReadTitle: 'm-0 text-[0.98rem] leading-[1.2] lg:text-[1.08rem]',
  progressMeta,
  progressStatus,
  shareLabel,
} as const
