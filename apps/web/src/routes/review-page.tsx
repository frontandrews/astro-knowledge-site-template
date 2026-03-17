import type { ProgressStatus } from '@prepdeck/schemas'
import { getDeckById } from '@prepdeck/content'
import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { ReviewCard } from '@/components/review-card'
import { StatusTabs } from '@/components/status-tabs'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { getCardStatus, getDeckCounts } from '@/lib/progress'
import { useProgress } from '@/state/progress-context'

const EMPTY_COUNTS = {
  allLearned: false,
  allSeen: false,
  learned: 0,
  notLearned: 0,
  partial: 0,
  seen: 0,
  total: 0,
  unseen: 0,
}

function getInitialStatus(counts: typeof EMPTY_COUNTS): ProgressStatus {
  if (counts.notLearned > 0) return 'not_learned'
  if (counts.partial > 0) return 'partial'
  if (counts.learned > 0) return 'learned'
  return 'unseen'
}

export function ReviewPage() {
  const { deckId } = useParams()
  const {
    clearCardNote,
    getCardNote,
    progressStore,
    resetDeckProgress,
    setCardNote,
    setCardStatus,
    setLearnedToUnseen,
  } = useProgress()
  const [isResetOpen, setIsResetOpen] = useState(false)
  const deck = deckId ? getDeckById(deckId) : undefined
  const counts = deck ? getDeckCounts(progressStore, deck) : EMPTY_COUNTS
  const [activeStatus, setActiveStatus] = useState<ProgressStatus>(() =>
    getInitialStatus(counts),
  )

  const cardsForActiveStatus = useMemo(
    () =>
      deck
        ? deck.cards.filter(
            (card) => getCardStatus(progressStore, deck.id, card.id) === activeStatus,
          )
        : [],
    [activeStatus, deck, progressStore],
  )

  if (!deckId || !deck) {
    return <Navigate replace to="/" />
  }

  return (
    <>
      <Panel className="bg-[var(--retro-surface)] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--retro-line)]">
              Review mode
            </p>
            <h2 className="mt-3 text-3xl font-black text-[var(--retro-ink)]">{deck.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/80">
              Inspect what is learned, what still feels partial, and what needs a full
              revisit.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {counts.partial + counts.notLearned > 0 ? (
              <LinkButton to={`/study/${deck.id}?mode=start&scope=weak`} variant="secondary">
                Study weak cards
              </LinkButton>
            ) : null}
            <LinkButton to={`/decks/${deck.id}`} variant="ghost">
              Back to deck
            </LinkButton>
            <Button onClick={() => setIsResetOpen(true)} type="button" variant="danger">
              Reset deck
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <StatusTabs
            activeStatus={activeStatus}
            counts={{
              learned: counts.learned,
              not_learned: counts.notLearned,
              partial: counts.partial,
              unseen: counts.unseen,
            }}
            onSelect={setActiveStatus}
          />
        </div>
      </Panel>

      <section className="mt-5 space-y-3">
        {cardsForActiveStatus.length ? (
          cardsForActiveStatus.map((card) => (
            <ReviewCard
              card={card}
              key={card.id}
              note={getCardNote(deck.id, card.id)}
              onClearNote={() => clearCardNote(deck.id, card.id)}
              onSaveNote={(note) => setCardNote(deck.id, card.id, note)}
              onSetStatus={(status) => setCardStatus(deck.id, card.id, status)}
              onUnmarkLearned={() => setLearnedToUnseen(deck.id, card.id)}
              status={getCardStatus(progressStore, deck.id, card.id)}
            />
          ))
        ) : (
          <Panel className="border-dashed bg-[var(--retro-surface-muted)] p-6 text-sm text-white/80">
            There are no cards in this bucket yet.
          </Panel>
        )}
      </section>

      <ConfirmDialog
        confirmLabel="Reset deck"
        description={`This clears every saved card status and note for ${deck.title}.`}
        isOpen={isResetOpen}
        onCancel={() => setIsResetOpen(false)}
        onConfirm={() => {
          resetDeckProgress(deck.id)
          setIsResetOpen(false)
          setActiveStatus('unseen')
        }}
        title="Reset this deck?"
      />
    </>
  )
}
