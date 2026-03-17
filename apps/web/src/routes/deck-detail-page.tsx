import { getDeckById, getDeckManifest } from '@prepdeck/content'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { ProgressMeter } from '@/components/ui/progress-meter'
import { getDeckCounts } from '@/lib/progress'
import { getTopicLabel } from '@/lib/topic-labels'
import { useProgress } from '@/state/progress-context'

export function DeckDetailPage() {
  const { deckId } = useParams()
  const navigate = useNavigate()
  const { progressStore, resetDeckProgress } = useProgress()
  const [isResetOpen, setIsResetOpen] = useState(false)

  if (!deckId) {
    return <Navigate replace to="/" />
  }

  const deck = getDeckById(deckId)
  const summary = getDeckManifest().decks.find((entry) => entry.id === deckId)

  if (!deck || !summary) {
    return <Navigate replace to="/" />
  }

  const counts = getDeckCounts(progressStore, deck)
  const weakCardCount = counts.partial + counts.notLearned

  return (
    <>
      <Panel className="bg-[var(--retro-surface)] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--retro-line)]">
          {getTopicLabel(deck.topic)}
        </p>
        <h2 className="mt-3 text-3xl font-black text-[var(--retro-ink)]">{deck.title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
          {deck.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <Badge>{counts.total} cards</Badge>
          <Badge>{summary.estimatedMinutes} minutes</Badge>
          <Badge>{deck.difficulty}</Badge>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatCard label="Learned" value={counts.learned} />
          <StatCard label="Partial" value={counts.partial} />
          <StatCard label="Not learned" value={counts.notLearned} />
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--retro-ink-soft)]">
            <span>Deck completion</span>
            <span>{counts.seen} of {counts.total} seen</span>
          </div>
          <ProgressMeter current={counts.seen} total={counts.total} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate(`/study/${deck.id}?mode=start`)} type="button" variant="primary">
            Start deck
          </Button>
          <Button onClick={() => navigate(`/study/${deck.id}?mode=continue`)} type="button" variant="secondary">
            Continue
          </Button>
          {weakCardCount > 0 ? (
            <Button
              onClick={() => navigate(`/study/${deck.id}?mode=start&scope=weak`)}
              type="button"
              variant="warning"
            >
              Study weak cards
            </Button>
          ) : null}
          <LinkButton to={`/decks/${deck.id}/review`} variant="ghost">
            Review progress
          </LinkButton>
          <Button onClick={() => setIsResetOpen(true)} type="button" variant="danger">
            Reset deck
          </Button>
        </div>
      </Panel>

      <ConfirmDialog
        confirmLabel="Reset deck"
        description={`This clears all saved progress and notes for ${deck.title}.`}
        isOpen={isResetOpen}
        onCancel={() => setIsResetOpen(false)}
        onConfirm={() => {
          resetDeckProgress(deck.id)
          setIsResetOpen(false)
        }}
        title="Reset this deck?"
      />
    </>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Panel className="bg-[var(--retro-surface-muted)] p-4" inset>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--retro-line)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-[var(--retro-ink)]">{value}</p>
    </Panel>
  )
}
