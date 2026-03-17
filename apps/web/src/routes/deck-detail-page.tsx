import { getDeckById } from '@prepdeck/content/decks'
import { getDeckSummaryById } from '@prepdeck/content/manifest'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { AdSlot } from '@/components/ad-slot'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { getArticleHref, getDeckArticleLinks } from '@/lib/article-links'
import { ProgressMeter } from '@/components/ui/progress-meter'
import { getDeckCounts } from '@/lib/progress'
import { createStudyHref } from '@/lib/study-session'
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
  const summary = getDeckSummaryById(deckId)

  if (!deck || !summary) {
    return <Navigate replace to="/" />
  }

  const counts = getDeckCounts(progressStore, deck)
  const weakCardCount = counts.partial + counts.notLearned
  const articleLinks = getDeckArticleLinks(deck)

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

        <div className="mt-6">
          <AdSlot placement="deck-detail" />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => navigate(createStudyHref(deck.id, { mode: 'start' }))}
            type="button"
            variant="primary"
          >
            Start deck
          </Button>
          <Button
            onClick={() => navigate(createStudyHref(deck.id, { format: 'interview', mode: 'start' }))}
            type="button"
            variant="secondary"
          >
            Interview mode
          </Button>
          <Button
            onClick={() => navigate(createStudyHref(deck.id, { mode: 'continue' }))}
            type="button"
            variant="ghost"
          >
            Continue
          </Button>
          {weakCardCount > 0 ? (
            <Button
              onClick={() => navigate(createStudyHref(deck.id, { mode: 'start', scope: 'weak' }))}
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

        {articleLinks.length > 0 ? (
          <Panel className="mt-6 bg-[var(--retro-surface-muted)] p-4" inset>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
                  Deep-dive reading
                </p>
                <h3 className="mt-2 text-xl font-black text-[var(--retro-ink)]">
                  Full articles tied to this deck
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                  Use the cards for reps. Open the full article when you want the longer
                  explanation, examples, and tradeoff framing behind a concept.
                </p>
              </div>
              <Badge tone="accent">{articleLinks.length} article{articleLinks.length === 1 ? '' : 's'}</Badge>
            </div>

            <div className="mt-4 space-y-3">
              {articleLinks.map((article) => (
                <Panel className="bg-[var(--retro-surface)] p-4" inset key={article.slug}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black text-[var(--retro-ink)]">
                        {article.question}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/75">
                        Open the paired long-form article from the journal.
                      </p>
                    </div>
                    <a
                      className="inline-flex min-h-10 items-center justify-center rounded-[0.95rem] border-2 border-[var(--retro-line-strong)] bg-[var(--retro-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--retro-ink)] shadow-[4px_4px_0_var(--retro-shadow)] transition hover:bg-[var(--retro-surface-strong)]"
                      href={getArticleHref(article.slug)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Read article
                    </a>
                  </div>
                </Panel>
              ))}
            </div>
          </Panel>
        ) : null}
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
