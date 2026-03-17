import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import { resetPwaStatus } from '@/lib/pwa-status'

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]

  disconnect() {}

  observe() {}

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  unobserve() {}
}

window.IntersectionObserver = MockIntersectionObserver
globalThis.IntersectionObserver = MockIntersectionObserver

afterEach(() => {
  cleanup()
  resetPwaStatus()
  window.localStorage.clear()
})
