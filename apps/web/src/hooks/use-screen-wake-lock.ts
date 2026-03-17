import { useEffect, useState } from 'react'

type WakeLockStatus = 'active' | 'idle' | 'unsupported'

type WakeLockSentinelLike = {
  addEventListener?: (type: 'release', listener: () => void) => void
  release: () => Promise<void>
  released?: boolean
}

type WakeLockNavigator = Navigator & {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>
  }
}

export function useScreenWakeLock(enabled: boolean): WakeLockStatus {
  const [isActive, setIsActive] = useState(false)
  const wakeLock = typeof navigator === 'undefined' ? undefined : (navigator as WakeLockNavigator).wakeLock
  const status: WakeLockStatus = !enabled ? 'idle' : !wakeLock ? 'unsupported' : isActive ? 'active' : 'idle'

  useEffect(() => {
    if (!enabled || !wakeLock) {
      return
    }

    let sentinel: WakeLockSentinelLike | null = null
    let cancelled = false

    const requestWakeLock = async () => {
      try {
        sentinel = await wakeLock.request('screen')

        if (cancelled) {
          await sentinel.release()
          return
        }

        setIsActive(true)
        sentinel.addEventListener?.('release', () => {
          if (!cancelled) {
            setIsActive(false)
          }
        })
      } catch {
        if (!cancelled) {
          setIsActive(false)
        }
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && (!sentinel || sentinel.released)) {
        void requestWakeLock()
      }
    }

    void requestWakeLock()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      setIsActive(false)

      if (sentinel && !sentinel.released) {
        void sentinel.release()
      }
    }
  }, [enabled, wakeLock])

  return status
}
