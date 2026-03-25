import { readable } from 'svelte/store'

import { subscribeToCompletedArticles } from '@/lib/article-progress'

export const completedArticlesSetStore = readable<Set<string>>(new Set(), (set) => {
  if (typeof window === 'undefined') {
    return () => {}
  }

  return subscribeToCompletedArticles((_, completedSet) => {
    set(new Set(completedSet))
  })
})
