import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { registerSW } from 'virtual:pwa-register'

import { initPwaStatus } from '@/lib/pwa-status'
import App from './App'
import './index.css'

initPwaStatus(registerSW)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
