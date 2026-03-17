export type ThemeMode = 'dark' | 'light'

const STORAGE_KEY = 'prepdeck.theme.v1'

export function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

export function readThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY)

  return storedValue === 'light' ? 'light' : 'dark'
}

export function writeThemeMode(mode: ThemeMode) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, mode)
}
