import {
  createDefaultMembershipState,
  readMembershipState,
  writeMembershipState,
} from '@/lib/monetization'

describe('monetization storage', () => {
  it('falls back to the default free membership state', () => {
    expect(readMembershipState(window.localStorage)).toEqual(createDefaultMembershipState())
  })

  it('persists and restores the membership tier', () => {
    const state = {
      tier: 'premium' as const,
      version: 1 as const,
    }

    writeMembershipState(state, window.localStorage)

    expect(readMembershipState(window.localStorage)).toEqual(state)
  })
})
