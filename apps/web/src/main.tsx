import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { registerSW } from 'virtual:pwa-register'

import { initPwaStatus } from '@/lib/pwa-status'
import { applyTheme, readThemeMode } from '@/lib/theme'
import App from './App'
import './index.css'

applyTheme(readThemeMode())
initPwaStatus(registerSW)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
