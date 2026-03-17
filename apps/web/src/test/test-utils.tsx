import type { ProgressStore } from '@prepdeck/schemas'
import type { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { MEMBERSHIP_STORAGE_KEY, type MembershipTier } from '@/lib/monetization'
import { STORAGE_KEY } from '@/lib/progress'
import { AppRoutes } from '@/routes/app-routes'
import { MonetizationProvider } from '@/state/monetization-context'
import { ProgressProvider } from '@/state/progress-context'

function Providers({
  children,
  initialEntries = ['/'],
}: PropsWithChildren<{ initialEntries?: string[] }>) {
  return (
    <MonetizationProvider>
      <ProgressProvider>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </ProgressProvider>
    </MonetizationProvider>
  )
}

export function seedProgress(store: ProgressStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
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

export function renderApp(initialEntries: string[] = ['/']) {
  return render(<AppRoutes />, {
    wrapper: ({ children }) => (
      <Providers initialEntries={initialEntries}>{children}</Providers>
    ),
  })
}
