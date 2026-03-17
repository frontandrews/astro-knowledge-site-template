import { getDeckById } from '@prepdeck/content'
import type { PropsWithChildren } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { getTopicLabel } from '@/lib/topic-labels'
import { useMonetization } from '@/state/monetization-context'

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation()
  const shell = getShellConfig(location.pathname)
  const { isPremium } = useMonetization()
  const showHomeShortcut = shell.mode === 'compact' && shell.backTo !== '/'
  const showPremiumShortcut =
    shell.mode === 'compact' && !location.pathname.startsWith('/premium')

  return (
    <div className="min-h-screen bg-transparent text-[var(--retro-ink)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-5 sm:px-6">
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
                  Local-first interview prep with phone-sized study flows, saved notes,
                  and no signup wall.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="accent">Local notes</Badge>
                <Badge>PWA</Badge>
                <Badge tone={isPremium ? 'success' : 'warning'}>
                  {isPremium ? 'Premium active' : 'Ad-supported'}
                </Badge>
                <LinkButton size="sm" to="/premium" variant="ghost">
                  Premium
                </LinkButton>
              </div>
            </div>
          </Panel>
        ) : (
          <Panel className="sticky top-3 z-20 mb-4 bg-[var(--retro-surface)] px-4 py-3">
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
      title: 'Technical interview prep that feels manageable.',
    }
  }

  if (segments[0] === 'study' && segments[1]) {
    const deck = getDeckById(segments[1])

    return {
      backLabel: 'Back to deck',
      backTo: `/decks/${segments[1]}`,
      eyebrow: 'Study session',
      mode: 'compact',
      title: deck?.title ?? 'Deck study',
    }
  }

  if (segments[0] === 'decks' && segments[1] && segments[2] === 'review') {
    const deck = getDeckById(segments[1])

    return {
      backLabel: 'Back to deck',
      backTo: `/decks/${segments[1]}`,
      eyebrow: 'Review progress',
      mode: 'compact',
      title: deck?.title ?? 'Deck review',
    }
  }

  if (segments[0] === 'decks' && segments[1]) {
    const deck = getDeckById(segments[1])

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

  return {
    backLabel: 'Back home',
    backTo: '/',
    eyebrow: 'Prepdeck',
    mode: 'compact',
    title: 'Deck library',
  }
}
