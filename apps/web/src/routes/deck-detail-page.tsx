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
import { testIds } from '@/lib/test-ids'
import { getTrackLabel } from '@/lib/track-labels'
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
      <Panel className="bg-[var(--retro-surface)] p-5" data-testid={testIds.deckDetail.page}>
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">{getTrackLabel(deck.track)}</Badge>
          <Badge>{getTopicLabel(deck.topic)}</Badge>
          <Badge>{summary.estimatedMinutes} min</Badge>
          <Badge>{counts.total} cards</Badge>
        </div>
        <h2 className="mt-3 text-3xl font-black text-[var(--retro-ink)]">{deck.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
          {deck.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <Badge>{deck.difficulty}</Badge>
          <Badge>{counts.learned} mastered</Badge>
          <Badge>{counts.partial + counts.notLearned} need review</Badge>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--retro-ink-soft)]">
            <span>Progress</span>
            <span>{counts.seen} of {counts.total} seen</span>
          </div>
          <ProgressMeter current={counts.seen} total={counts.total} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            data-testid={testIds.deckDetail.startButton}
            onClick={() => navigate(createStudyHref(deck.id, { mode: 'start' }))}
            type="button"
            variant="primary"
          >
            Start deck
          </Button>
          <Button
            data-testid={testIds.deckDetail.interviewButton}
            onClick={() => navigate(createStudyHref(deck.id, { format: 'interview', mode: 'start' }))}
            type="button"
            variant="secondary"
          >
            Interview mode
          </Button>
          <Button
            data-testid={testIds.deckDetail.continueButton}
            onClick={() => navigate(createStudyHref(deck.id, { mode: 'continue' }))}
            type="button"
            variant="ghost"
          >
            Continue
          </Button>
          {weakCardCount > 0 ? (
            <Button
              data-testid={testIds.deckDetail.weakCardsButton}
              onClick={() => navigate(createStudyHref(deck.id, { mode: 'start', scope: 'weak' }))}
              type="button"
              variant="warning"
            >
              Study weak cards
            </Button>
          ) : null}
          <LinkButton data-testid={testIds.deckDetail.reviewLink} to={`/decks/${deck.id}/review`} variant="ghost">
            Review progress
          </LinkButton>
          <Button data-testid={testIds.deckDetail.resetButton} onClick={() => setIsResetOpen(true)} type="button" variant="danger">
            Reset deck
          </Button>
        </div>

        <div className="mt-6">
          <AdSlot placement="deck-detail" />
        </div>

        {articleLinks.length > 0 ? (
          <Panel className="mt-6 bg-[var(--retro-surface-muted)] p-4" data-testid={testIds.deckDetail.learnMoreSection} inset>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-[var(--retro-ink)]">
                Learn more
              </h3>
              <Badge tone="accent">{articleLinks.length} linked</Badge>
            </div>

            <div className="mt-3 space-y-3">
              {articleLinks.map((article) => (
                <div
                  className="flex flex-col gap-3 border-b border-[var(--retro-line)] pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  key={article.routePath}
                >
                  <p className="text-sm font-black text-[var(--retro-ink)]">
                    {article.question}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      className="inline-flex min-h-10 items-center justify-center rounded-[0.95rem] border-2 border-[var(--retro-line-strong)] bg-[var(--retro-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--retro-ink)] shadow-[4px_4px_0_var(--retro-shadow)] transition hover:bg-[var(--retro-surface-strong)]"
                      data-testid={testIds.deckDetail.learnMoreLink(article.routePath)}
                      href={getArticleHref(article.guideId) ?? undefined}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Learn guide
                    </a>
                  </div>
                </div>
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
