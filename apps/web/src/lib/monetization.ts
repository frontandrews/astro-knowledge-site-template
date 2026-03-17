import { getBrowserStorageAdapter, type StorageAdapter } from '@/lib/storage-adapter'

export const MEMBERSHIP_STORAGE_KEY = 'prepdeck.membership.v1'

export type MembershipTier = 'free' | 'premium'

export type MembershipState = {
  tier: MembershipTier
  version: 1
}

const DEFAULT_MEMBERSHIP_STATE: MembershipState = {
  tier: 'free',
  version: 1,
}

export function createDefaultMembershipState(): MembershipState {
  return { ...DEFAULT_MEMBERSHIP_STATE }
}

export function readMembershipState(
  storage: StorageAdapter | null = getBrowserStorageAdapter(),
): MembershipState {
  if (!storage) {
    return createDefaultMembershipState()
  }

  const raw = storage.getItem(MEMBERSHIP_STORAGE_KEY)

  if (!raw) {
    return createDefaultMembershipState()
  }

  try {
    const parsed = JSON.parse(raw) as Partial<MembershipState>

    if (parsed.version === 1 && (parsed.tier === 'free' || parsed.tier === 'premium')) {
      return parsed as MembershipState
    }
  } catch {
    return createDefaultMembershipState()
  }

  return createDefaultMembershipState()
}

export function writeMembershipState(
  state: MembershipState,
  storage: StorageAdapter | null = getBrowserStorageAdapter(),
): void {
  if (!storage) {
    return
  }

  storage.setItem(MEMBERSHIP_STORAGE_KEY, JSON.stringify(state))
}
