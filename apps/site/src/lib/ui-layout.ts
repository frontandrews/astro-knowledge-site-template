export const uiLayout = {
  articleHeader: 'mx-auto mb-7 max-w-208 border-b border-article-rule pb-5 lg:max-w-4xl',
  articleGuideRail: 'w-full xl:grid xl:grid-cols-[minmax(0,1fr)_55rem_minmax(0,1fr)]',
  articleGuideRailAside:
    'hidden xl:col-start-3 xl:block xl:h-fit xl:w-72 xl:justify-self-end xl:translate-x-38 xl:sticky xl:top-28',
  articleGuideRailMain: 'min-w-0 xl:col-start-2 xl:self-start',
  articleRail: 'relative mx-auto w-full max-w-4xl',
  articleSection: 'mx-auto mt-8 max-w-208 border-t border-article-rule pt-8 lg:max-w-4xl',
  articleShell: 'mx-auto mt-5 w-full max-w-208 pb-11 lg:max-w-4xl',
  articleTagList: 'mx-auto mt-4 flex max-w-208 flex-wrap gap-2.5 border-t border-article-rule pt-4 lg:max-w-4xl',
  blogFrame:
    'mx-auto w-[min(52rem,calc(100vw-2rem))] md:w-[min(52rem,calc(100vw-3rem))] lg:w-[min(56rem,calc(100vw-3rem))]',
  cardsGrid: 'grid gap-4 md:grid-cols-2',
  compactSection: 'mx-auto mt-4 w-full max-w-208 lg:max-w-4xl',
  frame:
    'mx-auto w-[min(72rem,calc(100vw-2rem))] md:w-[min(72rem,calc(100vw-3rem))] lg:w-[min(78rem,calc(100vw-3rem))]',
  linearList: 'grid gap-0',
  metaList: 'flex flex-wrap gap-2.5',
  nextReadsGrid: 'grid gap-4 md:grid-cols-3',
  pageShell: 'mx-auto min-h-screen max-w-232 px-4 pb-16 md:px-6 lg:max-w-248',
  pageShellWide: 'mx-auto min-h-screen max-w-6xl px-4 pb-16 md:px-6 lg:max-w-7xl',
  section: 'mt-6',
  sectionHeader: 'mb-3 flex items-center justify-between gap-4',
  stackGrid: 'grid gap-4',
  titleCardList: 'grid gap-4',
  toolbarIntro: 'flex flex-col items-start gap-1 text-left',
} as const
