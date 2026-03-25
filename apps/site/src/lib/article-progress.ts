import { readLocalStorageJson, writeLocalStorageString } from '@/lib/local-storage'
import { siteEvents } from '@/lib/site-config'
import { siteStorageKeys } from '@/lib/storage-keys'

export const completedArticlesChangedEvent = siteEvents.completedArticlesChanged

function dispatchCompletedArticlesChanged(ids: string[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(completedArticlesChangedEvent, { detail: ids }))
}

export function readCompletedArticles() {
  return readLocalStorageJson<string[]>(siteStorageKeys.completedArticles, [])
}

export function writeCompletedArticles(ids: string[]) {
  const nextIds = [...new Set(ids.filter(Boolean))]
  const didWrite = writeLocalStorageString(
    siteStorageKeys.completedArticles,
    JSON.stringify(nextIds),
  )

  if (didWrite) {
    dispatchCompletedArticlesChanged(nextIds)
  }

  return didWrite
}

export function markArticleCompleted(articleId: string) {
  if (!articleId) {
    return false
  }

  const ids = readCompletedArticles()

  if (ids.includes(articleId)) {
    return true
  }

  return writeCompletedArticles([...ids, articleId])
}

export function markArticleUnread(articleId: string) {
  if (!articleId) {
    return false
  }

  return writeCompletedArticles(readCompletedArticles().filter((id) => id !== articleId))
}
