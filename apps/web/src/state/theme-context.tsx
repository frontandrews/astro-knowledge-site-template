import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { applyTheme, readThemeMode, type ThemeMode, writeThemeMode } from '@/lib/theme'

type ThemeContextValue = {
  isDark: boolean
  mode: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>(() => readThemeMode())

  useEffect(() => {
    applyTheme(mode)
    writeThemeMode(mode)
  }, [mode])

  const value = useMemo(
    () => ({
      isDark: mode === 'dark',
      mode,
      toggleTheme: () => {
        setMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'))
      },
    }),
    [mode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
