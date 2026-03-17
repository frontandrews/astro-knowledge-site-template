export type GuideRegistryEntry = {
  guideId: string
  locale: string
  routePath: string
}

const GUIDE_REGISTRY: GuideRegistryEntry[] = [
  {
    guideId: 'javascript-event-loop',
    locale: 'en',
    routePath: 'en/runtime-and-execution/javascript-event-loop-without-hand-waving',
  },
  {
    guideId: 'node-single-thread',
    locale: 'en',
    routePath: 'en/runtime-and-execution/node-single-threaded-does-not-mean-what-people-think',
  },
  {
    guideId: 'rag-vs-fine-tuning',
    locale: 'en',
    routePath: 'en/system-thinking/rag-vs-fine-tuning-without-false-binaries',
  },
  {
    guideId: 'react-derived-state',
    locale: 'en',
    routePath: 'en/state-and-ui-thinking/react-derived-state-without-extra-bugs',
  },
  {
    guideId: 'scope-risk-and-quality',
    locale: 'en',
    routePath: 'en/execution-and-communication/scope-risk-and-quality-without-fake-certainty',
  },
  {
    guideId: 'status-updates',
    locale: 'en',
    routePath: 'en/execution-and-communication/status-updates-that-sound-clear-in-tech-teams',
  },
]

export function getGuideRegistry() {
  return GUIDE_REGISTRY
}

export function getGuideEntry(guideId: string, locale = 'en') {
  return (
    GUIDE_REGISTRY.find((entry) => entry.guideId === guideId && entry.locale === locale) ??
    GUIDE_REGISTRY.find((entry) => entry.guideId === guideId)
  )
}

export function getGuideRoutePath(guideId: string, locale = 'en') {
  return getGuideEntry(guideId, locale)?.routePath
}
