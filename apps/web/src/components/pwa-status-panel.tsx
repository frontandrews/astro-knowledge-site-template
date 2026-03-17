import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/ui/panel'
import { dismissOfflineReady, dismissPwaUpdate, usePwaStatus } from '@/lib/pwa-status'

export function PwaStatusPanel({ hasBottomNavigation }: { hasBottomNavigation: boolean }) {
  const { needRefresh, offlineReady, updateServiceWorker } = usePwaStatus()

  if (!needRefresh && !offlineReady) {
    return null
  }

  return (
    <div
      className={[
        'pointer-events-none fixed inset-x-0 z-40 px-3 sm:left-auto sm:right-6 sm:max-w-sm sm:px-0',
        hasBottomNavigation
          ? 'bottom-[calc(6.5rem+env(safe-area-inset-bottom))] sm:bottom-6'
          : 'bottom-6 sm:bottom-6',
      ].join(' ')}
    >
      <Panel className="pointer-events-auto bg-[linear-gradient(145deg,rgba(22,38,63,0.98),rgba(9,16,29,0.96))] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.32)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent">{needRefresh ? 'Update ready' : 'Offline ready'}</Badge>
              <Badge>PWA</Badge>
            </div>
            <h2 className="mt-3 text-lg font-black text-[var(--retro-ink)]">
              {needRefresh
                ? 'A newer version of Prepdeck is ready.'
                : 'Prepdeck is cached for offline reps.'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/80">
              {needRefresh
                ? 'Reload when you want the latest improvements. Your local progress stays on this device.'
                : 'You can reopen the app faster and keep studying even with flaky connectivity.'}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {needRefresh ? (
            <>
              <Button
                onClick={() => {
                  void updateServiceWorker?.(true)
                }}
                type="button"
                variant="primary"
              >
                Reload app
              </Button>
              <Button
                onClick={dismissPwaUpdate}
                type="button"
                variant="ghost"
              >
                Later
              </Button>
            </>
          ) : (
            <Button onClick={dismissOfflineReady} type="button" variant="secondary">
              Nice
            </Button>
          )}
        </div>
      </Panel>
    </div>
  )
}
