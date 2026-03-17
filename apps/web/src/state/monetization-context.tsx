import type { PropsWithChildren } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  readMembershipState,
  writeMembershipState,
  type MembershipState,
  type MembershipTier,
} from '@/lib/monetization'

type MonetizationContextValue = {
  isPremium: boolean
  membership: MembershipState
  setMembershipTier: (tier: MembershipTier) => void
}

const MonetizationContext = createContext<MonetizationContextValue | null>(null)

export function MonetizationProvider({ children }: PropsWithChildren) {
  const [membership, setMembership] = useState<MembershipState>(() => readMembershipState())

  useEffect(() => {
    writeMembershipState(membership)
  }, [membership])

  const setMembershipTier = useCallback((tier: MembershipTier) => {
    setMembership((currentMembership) => {
      if (currentMembership.tier === tier) {
        return currentMembership
      }

      return {
        ...currentMembership,
        tier,
      }
    })
  }, [])

  const value = useMemo(
    () => ({
      isPremium: membership.tier === 'premium',
      membership,
      setMembershipTier,
    }),
    [membership, setMembershipTier],
  )

  return <MonetizationContext.Provider value={value}>{children}</MonetizationContext.Provider>
}

export function useMonetization() {
  const context = useContext(MonetizationContext)

  if (!context) {
    throw new Error('useMonetization must be used within MonetizationProvider')
  }

  return context
}
