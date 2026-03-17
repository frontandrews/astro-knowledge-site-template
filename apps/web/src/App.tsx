import { LazyMotion, MotionConfig, domMax } from 'motion/react'
import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from '@/routes/app-routes'
import { MonetizationProvider } from '@/state/monetization-context'
import { PreferencesProvider } from '@/state/preferences-context'
import { ProgressProvider } from '@/state/progress-context'

function App() {
  return (
    <MonetizationProvider>
      <PreferencesProvider>
        <ProgressProvider>
          <MotionConfig reducedMotion="user">
            <LazyMotion features={domMax}>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </LazyMotion>
          </MotionConfig>
        </ProgressProvider>
      </PreferencesProvider>
    </MonetizationProvider>
  )
}

export default App
