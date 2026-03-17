import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from '@/routes/app-routes'
import { MonetizationProvider } from '@/state/monetization-context'
import { ProgressProvider } from '@/state/progress-context'

function App() {
  return (
    <MonetizationProvider>
      <ProgressProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ProgressProvider>
    </MonetizationProvider>
  )
}

export default App
