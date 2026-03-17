import type { ProgressStore, SessionHistoryStore } from '@prepdeck/schemas'
import { LazyMotion, MotionConfig, domMax } from 'motion/react'
import type { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { MEMBERSHIP_STORAGE_KEY, type MembershipTier } from '@/lib/monetization'
import { PREFERENCES_STORAGE_KEY, type PreferencesState } from '@/lib/preferences'
import { STORAGE_KEY } from '@/lib/progress'
import { SESSION_HISTORY_STORAGE_KEY } from '@/lib/session-history'
import { AppRoutes } from '@/routes/app-routes'
import { MonetizationProvider } from '@/state/monetization-context'
import { PreferencesProvider } from '@/state/preferences-context'
import { ProgressProvider } from '@/state/progress-context'

function Providers({
  children,
  initialEntries = ['/'],
}: PropsWithChildren<{ initialEntries?: string[] }>) {
  return (
    <MonetizationProvider>
      <PreferencesProvider>
        <ProgressProvider>
          <MotionConfig reducedMotion="never">
            <LazyMotion features={domMax}>
              <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
            </LazyMotion>
          </MotionConfig>
        </ProgressProvider>
      </PreferencesProvider>
    </MonetizationProvider>
  )
}

export function seedProgress(store: ProgressStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function seedSessionHistory(store: SessionHistoryStore) {
  window.localStorage.setItem(SESSION_HISTORY_STORAGE_KEY, JSON.stringify(store))
}

export function seedMembership(tier: MembershipTier) {
  window.localStorage.setItem(
    MEMBERSHIP_STORAGE_KEY,
    JSON.stringify({
      tier,
      version: 1,
    }),
  )
}

export function seedPreferences(preferences: PreferencesState) {
  window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences))
}

export function renderApp(initialEntries: string[] = ['/']) {
  return render(<AppRoutes />, {
    wrapper: ({ children }) => (
      <Providers initialEntries={initialEntries}>{children}</Providers>
    ),
  })
}
