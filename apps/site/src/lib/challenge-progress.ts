import { siteEvents } from '@/lib/site-config'

type ChallengeSolvedDetail = {
  challengeId: string
}

export function getChallengeSolvedStorageKey(challengeId: string) {
  return challengeId ? `challenge-solved-${challengeId}` : ''
}

export function readChallengeSolvedState(challengeId: string) {
  const storageKey = getChallengeSolvedStorageKey(challengeId)

  if (!storageKey || typeof localStorage === 'undefined') {
    return false
  }

  try {
    return localStorage.getItem(storageKey) === '1'
  } catch {
    return false
  }
}

export function markChallengeSolved(challengeId: string) {
  const storageKey = getChallengeSolvedStorageKey(challengeId)

  if (!storageKey || typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(storageKey, '1')
  } catch {}

  window.dispatchEvent(
    new CustomEvent<ChallengeSolvedDetail>(siteEvents.challengeSolved, {
      detail: { challengeId },
    }),
  )
}
