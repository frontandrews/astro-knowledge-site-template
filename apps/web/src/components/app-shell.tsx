import { getDeckSummaryById } from '@prepdeck/content/manifest'
import type { PropsWithChildren } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { PwaStatusPanel } from '@/components/pwa-status-panel'
import { getTopicLabel } from '@/lib/topic-labels'
import { useMonetization } from '@/state/monetization-context'

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation()
  const shell = getShellConfig(location.pathname)
  const { isPremium } = useMonetization()
  const showHomeShortcut = shell.mode === 'compact' && shell.backTo !== '/'
  const showProgressShortcut =
    shell.mode === 'compact' && !location.pathname.startsWith('/progress')
  const showSettingsShortcut =
    shell.mode === 'compact' && !location.pathname.startsWith('/settings')
  const showPremiumShortcut =
    shell.mode === 'compact' && !location.pathname.startsWith('/premium')
  const showBottomNavigation = !isFocusRoute(location.pathname)

  return (
    <div className="min-h-screen bg-transparent text-[var(--retro-ink)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-[calc(1.25rem+env(safe-area-inset-top))] sm:px-6 sm:pb-24 sm:pt-5">
        {shell.mode === 'home' ? (
          <Panel className="mb-6 bg-[var(--retro-surface)] px-4 py-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link
                  to="/"
                  className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--retro-line)]"
                >
                  Prepdeck
                </Link>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
                  Local-first career practice with phone-sized study flows, saved notes,
                  and no signup wall.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="accent">Local notes</Badge>
                <Badge>PWA</Badge>
                <Badge tone={isPremium ? 'success' : 'warning'}>
                  {isPremium ? 'Premium active' : 'Ad-supported'}
                </Badge>
                <LinkButton size="sm" to="/progress" variant="ghost">
                  Progress
                </LinkButton>
                <LinkButton size="sm" to="/settings" variant="ghost">
                  Settings
                </LinkButton>
                <LinkButton size="sm" to="/premium" variant="ghost">
                  Premium
                </LinkButton>
              </div>
            </div>
          </Panel>
        ) : (
          <Panel className="sticky top-[calc(0.75rem+env(safe-area-inset-top))] z-20 mb-4 bg-[var(--retro-surface)] px-4 py-3 sm:top-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  {shell.backTo ? (
                    <LinkButton size="sm" to={shell.backTo} variant="ghost">
                      {shell.backLabel}
                    </LinkButton>
                  ) : null}
                  {showHomeShortcut ? (
                    <LinkButton size="sm" to="/" variant="secondary">
                      Home
                    </LinkButton>
                  ) : null}
                  {showProgressShortcut ? (
                    <LinkButton size="sm" to="/progress" variant="ghost">
                      Progress
                    </LinkButton>
                  ) : null}
                  {showSettingsShortcut ? (
                    <LinkButton size="sm" to="/settings" variant="ghost">
                      Settings
                    </LinkButton>
                  ) : null}
                  {showPremiumShortcut ? (
                    <LinkButton size="sm" to="/premium" variant="ghost">
                      Premium
                    </LinkButton>
                  ) : null}
                </div>
                <p className="mt-3 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
                  {shell.eyebrow}
                </p>
                <p className="mt-1 truncate text-lg font-black text-[var(--retro-ink)]">
                  {shell.title}
                </p>
              </div>
              <Link
                to="/"
                className="shrink-0 pt-0.5 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[var(--retro-line)]"
              >
                Prepdeck
              </Link>
            </div>
          </Panel>
        )}

        <main className="flex-1">{children}</main>
      </div>

      {showBottomNavigation ? <BottomNavigation pathname={location.pathname} /> : null}
      <PwaStatusPanel hasBottomNavigation={showBottomNavigation} />
    </div>
  )
}

type ShellConfig = {
  backLabel: string | null
  backTo: string | null
  eyebrow: string
  mode: 'compact' | 'home'
  title: string
}

function getShellConfig(pathname: string): ShellConfig {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return {
      backLabel: null,
      backTo: null,
      eyebrow: 'Deck library',
      mode: 'home',
      title: 'Career practice that stays usable on a phone.',
    }
  }

  if (segments[0] === 'study' && segments[1]) {
    const deck = getDeckSummaryById(segments[1])

    return {
      backLabel: 'Back to deck',
      backTo: `/decks/${segments[1]}`,
      eyebrow: 'Study session',
      mode: 'compact',
      title: deck?.title ?? 'Deck study',
    }
  }

  if (segments[0] === 'decks' && segments[1] && segments[2] === 'review') {
    const deck = getDeckSummaryById(segments[1])

    return {
      backLabel: 'Back to deck',
      backTo: `/decks/${segments[1]}`,
      eyebrow: 'Review progress',
      mode: 'compact',
      title: deck?.title ?? 'Deck review',
    }
  }

  if (segments[0] === 'decks' && segments[1]) {
    const deck = getDeckSummaryById(segments[1])

    return {
      backLabel: 'Back to library',
      backTo: '/',
      eyebrow: deck ? getTopicLabel(deck.topic) : 'Deck',
      mode: 'compact',
      title: deck?.title ?? 'Deck details',
    }
  }

  if (segments[0] === 'premium') {
    return {
      backLabel: 'Back home',
      backTo: '/',
      eyebrow: 'Monetization',
      mode: 'compact',
      title: 'Premium',
    }
  }

  if (segments[0] === 'progress') {
    return {
      backLabel: 'Back home',
      backTo: '/',
      eyebrow: 'Progress',
      mode: 'compact',
      title: 'History, goals, and local data',
    }
  }

  if (segments[0] === 'settings') {
    return {
      backLabel: 'Back home',
      backTo: '/',
      eyebrow: 'Preferences',
      mode: 'compact',
      title: 'Goals, timers, and local defaults',
    }
  }

  if (segments[0] === 'mock-interview') {
    return {
      backLabel: 'Back home',
      backTo: '/',
      eyebrow: 'Mock interview',
      mode: 'compact',
      title: 'Mixed interview run',
    }
  }

  if (segments[0] === 'daily-queue') {
    return {
      backLabel: 'Back home',
      backTo: '/',
      eyebrow: 'Daily queue',
      mode: 'compact',
      title: 'Daily smart queue',
    }
  }

  return {
    backLabel: 'Back home',
    backTo: '/',
    eyebrow: 'Prepdeck',
    mode: 'compact',
    title: 'Deck library',
  }
}

function BottomNavigation({ pathname }: { pathname: string }) {
  const items = [
    { href: '/', label: 'Home', match: (value: string) => value === '/' },
    {
      href: '/progress',
      label: 'Progress',
      match: (value: string) => value.startsWith('/progress'),
    },
    {
      href: '/settings',
      label: 'Settings',
      match: (value: string) => value.startsWith('/settings'),
    },
    {
      href: '/premium',
      label: 'Premium',
      match: (value: string) => value.startsWith('/premium'),
    },
  ] as const

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:hidden">
      <Panel className="pointer-events-auto border-[var(--retro-line-strong)] bg-[color:rgba(8,14,24,0.96)] px-2 py-2 shadow-[0_-8px_32px_rgba(0,0,0,0.28)]">
        <nav aria-label="Primary" className="grid grid-cols-4 gap-2">
          {items.map((item) => {
            const isActive = item.match(pathname)

            return (
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'flex min-h-12 items-center justify-center rounded-[0.95rem] border-2 px-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] transition',
                  isActive
                    ? 'border-[var(--retro-line-strong)] bg-[var(--retro-accent)] text-white shadow-[4px_4px_0_var(--retro-shadow)]'
                    : 'border-[var(--retro-line)] bg-[color:rgba(255,255,255,0.04)] text-[var(--retro-ink)] shadow-[4px_4px_0_var(--retro-line)]',
                ].join(' ')}
                key={item.href}
                to={item.href}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </Panel>
    </div>
  )
}

function isFocusRoute(pathname: string) {
  return (
    pathname.startsWith('/study/') ||
    pathname.startsWith('/mock-interview') ||
    pathname.startsWith('/daily-queue')
  )
}
