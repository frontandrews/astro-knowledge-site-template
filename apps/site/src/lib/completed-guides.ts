import { readLocalStorageJson, writeLocalStorageString } from '@/lib/local-storage'
import { siteStorageKeys } from '@/lib/storage-keys'

export const completedGuidesChangedEvent = 'seniorpath:completed-guides-changed'

function dispatchCompletedGuidesChanged(ids: string[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(completedGuidesChangedEvent, { detail: ids }))
}

export function readCompletedGuides() {
  return readLocalStorageJson<string[]>(siteStorageKeys.completedGuides, [])
}

export function writeCompletedGuides(ids: string[]) {
  const nextIds = [...new Set(ids.filter(Boolean))]
  const didWrite = writeLocalStorageString(siteStorageKeys.completedGuides, JSON.stringify(nextIds))

  if (didWrite) {
    dispatchCompletedGuidesChanged(nextIds)
  }

  return didWrite
}

export function markGuideCompleted(guideId: string) {
  if (!guideId) {
    return false
  }

  const ids = readCompletedGuides()

  if (ids.includes(guideId)) {
    return true
  }

  return writeCompletedGuides([...ids, guideId])
}

export function markGuideUnread(guideId: string) {
  if (!guideId) {
    return false
  }

  return writeCompletedGuides(readCompletedGuides().filter((id) => id !== guideId))
}
