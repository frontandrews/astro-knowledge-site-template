import { useSyncExternalStore } from 'react'

type PwaRegisterHook = (options: {
  immediate?: boolean
  onNeedRefresh?: () => void
  onOfflineReady?: () => void
}) => ((reloadPage?: boolean) => Promise<void>) | undefined

type PwaStatus = {
  needRefresh: boolean
  offlineReady: boolean
  updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | null
}

const DEFAULT_PWA_STATUS: PwaStatus = {
  needRefresh: false,
  offlineReady: false,
  updateServiceWorker: null,
}

let pwaStatus: PwaStatus = DEFAULT_PWA_STATUS
const listeners = new Set<() => void>()

export function initPwaStatus(register: PwaRegisterHook) {
  let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | null = null

  updateServiceWorker =
    register({
      immediate: true,
      onNeedRefresh: () => {
        setPwaStatus({
          needRefresh: true,
          offlineReady: pwaStatus.offlineReady,
        updateServiceWorker: updateServiceWorker ?? null,
      })
    },
      onOfflineReady: () => {
        setPwaStatus({
          needRefresh: pwaStatus.needRefresh,
          offlineReady: true,
          updateServiceWorker: updateServiceWorker ?? null,
        })
      },
    }) ?? null

  setPwaStatus({
    ...pwaStatus,
    updateServiceWorker,
  })
}

export function usePwaStatus() {
  return useSyncExternalStore(subscribeToPwaStatus, getPwaStatusSnapshot, getPwaStatusSnapshot)
}

export function getPwaStatusSnapshotForTests() {
  return pwaStatus
}

export function dismissOfflineReady() {
  setPwaStatus({
    ...pwaStatus,
    offlineReady: false,
  })
}

export function dismissPwaUpdate() {
  setPwaStatus({
    ...pwaStatus,
    needRefresh: false,
  })
}

export function resetPwaStatus() {
  pwaStatus = DEFAULT_PWA_STATUS
  emitPwaStatus()
}

export function setPwaStatus(nextStatus: PwaStatus) {
  pwaStatus = nextStatus
  emitPwaStatus()
}

function subscribeToPwaStatus(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

function getPwaStatusSnapshot() {
  return pwaStatus
}

function emitPwaStatus() {
  listeners.forEach((listener) => listener())
}
