import { getDeckById, getDecksByTopic } from '@prepdeck/content'
import { useState } from 'react'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { DeckCard } from '@/components/deck-card'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { ProgressMeter } from '@/components/ui/progress-meter'
import { Panel } from '@/components/ui/panel'
import {
  combineDeckCounts,
  getDeckCounts,
  getMostRecentlyStudiedDeckId,
} from '@/lib/progress'
import { getTopicLabel } from '@/lib/topic-labels'
import { useProgress } from '@/state/progress-context'

export function HomePage() {
  const { progressStore, resetAllProgress } = useProgress()
  const [isResetAllOpen, setIsResetAllOpen] = useState(false)
  const decksByTopic = getDecksByTopic()
  const [selectedTopic, setSelectedTopic] = useState<'all' | string>('all')
  const topicEntries = Object.entries(decksByTopic)
  const allDeckCounts = Object.values(decksByTopic)
    .flat()
    .map((summary) => {
      const deck = getDeckById(summary.id)
      return deck ? getDeckCounts(progressStore, deck) : null
    })
    .filter((counts): counts is NonNullable<typeof counts> => Boolean(counts))
  const overallCounts = combineDeckCounts(allDeckCounts)
  const lastStudiedDeckId = getMostRecentlyStudiedDeckId(progressStore)
  const lastStudiedDeck = lastStudiedDeckId ? getDeckById(lastStudiedDeckId) : undefined
  const lastStudiedCounts = lastStudiedDeck ? getDeckCounts(progressStore, lastStudiedDeck) : null
  const visibleTopics =
    selectedTopic === 'all'
      ? topicEntries
      : topicEntries.filter(([topic]) => topic === selectedTopic)

  return (
    <>
      <Panel className="mb-5 flex flex-col gap-3 bg-[var(--retro-surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm leading-6 text-white/80">
          Track what you truly know, keep momentum on a phone-sized screen, and come
          back later without losing your place.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryStat label="Learned" value={`${overallCounts.learned}`} />
            <SummaryStat label="Seen" value={`${overallCounts.seen}/${overallCounts.total}`} />
            <SummaryStat label="Need review" value={`${overallCounts.partial + overallCounts.notLearned}`} />
          </div>
        </div>
        <Button onClick={() => setIsResetAllOpen(true)} type="button" variant="danger">
          Reset all progress
        </Button>
      </Panel>

      <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel className="bg-[var(--retro-surface)] p-4">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
            Browse by topic
          </p>
          <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
            <Button
              onClick={() => setSelectedTopic('all')}
              size="sm"
              type="button"
              variant={selectedTopic === 'all' ? 'primary' : 'ghost'}
            >
              All topics
            </Button>
            {topicEntries.map(([topic, summaries]) => (
              <Button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                size="sm"
                type="button"
                variant={selectedTopic === topic ? 'primary' : 'ghost'}
              >
                {getTopicLabel(topic)} ({summaries.length})
              </Button>
            ))}
          </div>
        </Panel>

        <Panel className="bg-[var(--retro-surface)] p-4">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
            Jump back in
          </p>
          {lastStudiedDeck && lastStudiedCounts ? (
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--retro-ink-soft)]">
                  {getTopicLabel(lastStudiedDeck.topic)}
                </p>
                <h2 className="mt-1 text-lg font-black text-[var(--retro-ink)]">
                  {lastStudiedDeck.title}
                </h2>
              </div>
              <ProgressMeter current={lastStudiedCounts.seen} total={lastStudiedCounts.total} />
              <div className="flex flex-wrap gap-2">
                <LinkButton
                  size="sm"
                  to={
                    lastStudiedCounts.allSeen
                      ? `/decks/${lastStudiedDeck.id}/review`
                      : `/study/${lastStudiedDeck.id}?mode=continue`
                  }
                  variant="primary"
                >
                  {lastStudiedCounts.allSeen ? 'Review latest deck' : 'Continue latest deck'}
                </LinkButton>
                <LinkButton size="sm" to={`/decks/${lastStudiedDeck.id}`} variant="ghost">
                  Open deck
                </LinkButton>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-white/80">
              Start with one deck, and Prepdeck will keep your latest session easy to reach.
            </p>
          )}
        </Panel>
      </div>

      <div className="space-y-8">
        {visibleTopics.map(([topic, summaries]) => (
          <section key={topic}>
            <TopicSummary
              progressStore={progressStore}
              summaries={summaries}
              title={getTopicLabel(topic)}
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {summaries.map((summary) => {
                const deck = getDeckById(summary.id)

                if (!deck) {
                  return null
                }

                const counts = getDeckCounts(progressStore, deck)

                return (
                  <DeckCard
                    detailHref={`/decks/${summary.id}`}
                    key={summary.id}
                    learnedCount={counts.learned}
                    summary={summary}
                    totalCards={counts.total}
                  />
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <ConfirmDialog
        confirmLabel="Reset all"
        description="This clears every saved status and personal note across all decks."
        isOpen={isResetAllOpen}
        onCancel={() => setIsResetAllOpen(false)}
        onConfirm={() => {
          resetAllProgress()
          setIsResetAllOpen(false)
        }}
        title="Reset all progress?"
      />
    </>
  )
}

function TopicSummary({
  progressStore,
  summaries,
  title,
}: {
  progressStore: ReturnType<typeof useProgress>['progressStore']
  summaries: ReturnType<typeof getDecksByTopic>[string]
  title: string
}) {
  const counts = combineDeckCounts(
    summaries
      .map((summary) => {
        const deck = getDeckById(summary.id)
        return deck ? getDeckCounts(progressStore, deck) : null
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),
  )

  return (
    <div className="mb-4 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[var(--retro-ink)]">{title}</h2>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--retro-ink-soft)]">
            {counts.learned} learned · {counts.partial + counts.notLearned} need review
          </p>
        </div>
        <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--retro-line)]">
          {summaries.length} decks
        </span>
      </div>
      <ProgressMeter current={counts.learned} total={counts.total} />
    </div>
  )
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <Panel className="bg-[var(--retro-surface-muted)] p-3" inset>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--retro-ink-soft)]">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-[var(--retro-ink)]">{value}</p>
    </Panel>
  )
}
