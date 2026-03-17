import type { Deck, DeckManifestEntry } from '@prepdeck/schemas'
import { getDeckById, getDecksByTopic } from '@prepdeck/content'
import { useMemo, useState } from 'react'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { AdSlot } from '@/components/ad-slot'
import { DataControlsPanel } from '@/components/data-controls-panel'
import { DeckCard } from '@/components/deck-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { ProgressMeter } from '@/components/ui/progress-meter'
import {
  combineDeckCounts,
  getDeckCounts,
  getMostRecentlyStudiedDeckId,
  type DeckCounts,
} from '@/lib/progress'
import { getSessionPresets, type SessionPreset } from '@/lib/session-presets'
import { getTopicLabel } from '@/lib/topic-labels'
import { useProgress } from '@/state/progress-context'

type DeckRecord = {
  counts: DeckCounts
  deck: Deck
  summary: DeckManifestEntry
}

export function HomePage() {
  const { progressStore, resetAllProgress } = useProgress()
  const [isResetAllOpen, setIsResetAllOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<'all' | string>('all')
  const decksByTopic = getDecksByTopic()
  const topicEntries = Object.entries(decksByTopic)

  const deckRecords = useMemo(
    () =>
      topicEntries
        .flatMap(([, summaries]) =>
          summaries.map((summary) => {
            const deck = getDeckById(summary.id)

            if (!deck) {
              return null
            }

            return {
              counts: getDeckCounts(progressStore, deck),
              deck,
              summary,
            }
          }),
        )
        .filter((record): record is DeckRecord => Boolean(record)),
    [progressStore, topicEntries],
  )

  const overallCounts = combineDeckCounts(deckRecords.map((record) => record.counts))
  const totalDecks = deckRecords.length
  const lastStudiedDeckId = getMostRecentlyStudiedDeckId(progressStore)
  const latestRecord =
    deckRecords.find((record) => record.deck.id === lastStudiedDeckId) ?? null
  const weakestRecord = getWeakestDeckRecord(deckRecords)
  const starterRecord = getStarterDeckRecord(deckRecords)
  const alternateStarterRecord = getStarterDeckRecord(
    deckRecords,
    starterRecord?.deck.id ?? null,
  )
  const visibleDeckRecords = getVisibleDeckRecords(deckRecords, selectedTopic)
  const sessionPresets = getSessionPresets(deckRecords)
  const topicCards = topicEntries.map(([topic, summaries]) => {
    const topicDecks = deckRecords.filter((record) => record.summary.topic === topic)

    return {
      counts: combineDeckCounts(topicDecks.map((record) => record.counts)),
      deckCount: summaries.length,
      topic,
    }
  })

  const primaryAction = getPrimaryAction(latestRecord, starterRecord)
  const secondaryAction = getSecondaryAction(weakestRecord, alternateStarterRecord)

  return (
    <>
      <section aria-labelledby="home-hero-heading" className="mb-6">
        <Panel className="overflow-hidden bg-[linear-gradient(145deg,rgba(32,52,87,0.98),rgba(14,24,40,0.96))] p-5 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="accent">Focus next</Badge>
                <Badge>Local-first</Badge>
                <Badge tone="success">Notes stay on this device</Badge>
              </div>
              <h1
                className="mt-4 text-3xl font-black tracking-tight text-[var(--retro-ink)] sm:text-4xl"
                id="home-hero-heading"
              >
                Study the next right deck.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Prepdeck keeps your interview practice short, local, and easy to
                resume. Pick up where you left off, tighten weak spots, and keep your
                own notes attached to the cards that matter.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <LinkButton to={primaryAction.href} variant="primary">
                  {primaryAction.label}
                </LinkButton>
                <LinkButton to={secondaryAction.href} variant="secondary">
                  {secondaryAction.label}
                </LinkButton>
                <Button
                  onClick={() => setSelectedTopic('all')}
                  type="button"
                  variant="ghost"
                >
                  Browse all decks
                </Button>
              </div>
            </div>

            <Panel className="bg-[color:rgba(6,12,23,0.42)] p-4">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
                Today&apos;s snapshot
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <SummaryStat label="Decks" value={`${totalDecks}`} />
                <SummaryStat label="Cards learned" value={`${overallCounts.learned}`} />
                <SummaryStat
                  label="Need review"
                  value={`${overallCounts.partial + overallCounts.notLearned}`}
                />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--retro-ink-soft)]">
                  <span>Cards seen</span>
                  <span>
                    {overallCounts.seen} of {overallCounts.total}
                  </span>
                </div>
                <ProgressMeter current={overallCounts.seen} total={overallCounts.total} />
              </div>
            </Panel>
          </div>
        </Panel>
      </section>

      <section className="mb-6">
        <AdSlot placement="home-primary" />
      </section>

      <section
        aria-labelledby="focus-next-heading"
        className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
      >
        <FocusCard
          actionHref={primaryAction.href}
          actionLabel={primaryAction.label}
          detail={primaryAction.detail}
          eyebrow={primaryAction.eyebrow}
          title={primaryAction.title}
        />
        <FocusCard
          actionHref={secondaryAction.href}
          actionLabel={secondaryAction.label}
          detail={secondaryAction.detail}
          eyebrow={secondaryAction.eyebrow}
          title={secondaryAction.title}
        />
      </section>

      <section aria-labelledby="session-presets-heading" className="mb-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[var(--retro-ink)]" id="session-presets-heading">
              Session presets
            </h2>
            <p className="mt-1 text-sm leading-6 text-white/75">
              Quick entry points for the next useful session instead of deciding from scratch.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sessionPresets.map((preset) => (
            <SessionPresetCard key={preset.id} preset={preset} />
          ))}
        </div>
      </section>

      <section aria-labelledby="topic-paths-heading" className="mb-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[var(--retro-ink)]" id="topic-paths-heading">
              Topic paths
            </h2>
            <p className="mt-1 text-sm leading-6 text-white/75">
              Jump into a lane fast and keep the deck library filtered around that
              topic.
            </p>
          </div>
          <Button onClick={() => setSelectedTopic('all')} size="sm" type="button" variant="ghost">
            Show all
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topicCards.map((topicCard) => (
            <TopicPathCard
              counts={topicCard.counts}
              deckCount={topicCard.deckCount}
              isActive={selectedTopic === topicCard.topic}
              key={topicCard.topic}
              onSelect={() => setSelectedTopic(topicCard.topic)}
              topic={topicCard.topic}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="deck-library-heading">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-[var(--retro-ink)]" id="deck-library-heading">
              Deck library
            </h2>
            <p className="mt-1 text-sm leading-6 text-white/75">
              {selectedTopic === 'all'
                ? `Showing all ${visibleDeckRecords.length} decks.`
                : `Showing ${visibleDeckRecords.length} deck${visibleDeckRecords.length === 1 ? '' : 's'} in ${getTopicLabel(selectedTopic)}.`}
            </p>
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
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
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleDeckRecords.map((record) => (
            <DeckCard
              detailHref={`/decks/${record.summary.id}`}
              key={record.summary.id}
              learnedCount={record.counts.learned}
              summary={record.summary}
              totalCards={record.counts.total}
            />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <DataControlsPanel onResetAll={() => setIsResetAllOpen(true)} />
      </section>

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

function FocusCard({
  actionHref,
  actionLabel,
  detail,
  eyebrow,
  title,
}: {
  actionHref: string
  actionLabel: string
  detail: string
  eyebrow: string
  title: string
}) {
  return (
    <Panel className="p-5">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-black text-[var(--retro-ink)]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/80">{detail}</p>
      <div className="mt-5">
        <LinkButton to={actionHref} variant="primary">
          {actionLabel}
        </LinkButton>
      </div>
    </Panel>
  )
}

function SessionPresetCard({ preset }: { preset: SessionPreset }) {
  return (
    <Panel className="flex h-full flex-col justify-between gap-5 p-5">
      <div>
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
          Session preset
        </p>
        <h3 className="mt-3 text-2xl font-black text-[var(--retro-ink)]">{preset.title}</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {preset.meta.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-white/80">{preset.detail}</p>
      </div>
      <div className="mt-auto">
        <LinkButton to={preset.href} variant="secondary">
          {preset.label}
        </LinkButton>
      </div>
    </Panel>
  )
}

function TopicPathCard({
  counts,
  deckCount,
  isActive,
  onSelect,
  topic,
}: {
  counts: DeckCounts
  deckCount: number
  isActive: boolean
  onSelect: () => void
  topic: string
}) {
  return (
    <Panel
      className={
        isActive
          ? 'border-[var(--retro-line-strong)] bg-[var(--retro-surface-strong)] p-5'
          : 'p-5'
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
            Topic
          </p>
          <h3 className="mt-2 text-xl font-black text-[var(--retro-ink)]">
            {getTopicLabel(topic)}
          </h3>
        </div>
        <Badge>{deckCount} decks</Badge>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/80">
        {counts.learned} learned · {counts.partial + counts.notLearned} need review
      </p>
      <div className="mt-4">
        <ProgressMeter current={counts.learned} total={counts.total} />
      </div>
      <div className="mt-4">
        <Button onClick={onSelect} size="sm" type="button" variant={isActive ? 'primary' : 'ghost'}>
          {isActive ? 'Showing topic' : 'Show topic decks'}
        </Button>
      </div>
    </Panel>
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

function getVisibleDeckRecords(records: DeckRecord[], selectedTopic: string) {
  const nextRecords =
    selectedTopic === 'all'
      ? records
      : records.filter((record) => record.summary.topic === selectedTopic)

  return [...nextRecords].sort((a, b) => {
    const aUrgency = a.counts.notLearned * 3 + a.counts.partial * 2 + (a.counts.unseen > 0 ? 1 : 0)
    const bUrgency = b.counts.notLearned * 3 + b.counts.partial * 2 + (b.counts.unseen > 0 ? 1 : 0)

    if (aUrgency !== bUrgency) {
      return bUrgency - aUrgency
    }

    if (a.summary.estimatedMinutes !== b.summary.estimatedMinutes) {
      return a.summary.estimatedMinutes - b.summary.estimatedMinutes
    }

    return a.summary.title.localeCompare(b.summary.title)
  })
}

function getWeakestDeckRecord(records: DeckRecord[]) {
  return [...records]
    .filter((record) => record.counts.partial + record.counts.notLearned > 0)
    .sort((a, b) => {
      const aWeak = a.counts.partial + a.counts.notLearned
      const bWeak = b.counts.partial + b.counts.notLearned

      if (aWeak !== bWeak) {
        return bWeak - aWeak
      }

      return b.counts.seen - a.counts.seen
    })[0] ?? null
}

function getStarterDeckRecord(records: DeckRecord[], excludeDeckId?: string | null) {
  return [...records]
    .filter((record) => record.counts.seen === 0 && record.deck.id !== excludeDeckId)
    .sort((a, b) => {
      const difficultyRank = getDifficultyRank(a.summary.difficulty) - getDifficultyRank(b.summary.difficulty)

      if (difficultyRank !== 0) {
        return difficultyRank
      }

      if (a.summary.estimatedMinutes !== b.summary.estimatedMinutes) {
        return a.summary.estimatedMinutes - b.summary.estimatedMinutes
      }

      return a.summary.title.localeCompare(b.summary.title)
    })[0] ?? null
}

function getPrimaryAction(latestRecord: DeckRecord | null, starterRecord: DeckRecord | null) {
  if (latestRecord && !latestRecord.counts.allSeen) {
    return {
      detail: `Resume ${latestRecord.deck.title} without losing your last position or note.`,
      eyebrow: 'Continue',
      href: `/study/${latestRecord.deck.id}?mode=continue`,
      label: 'Continue latest session',
      title: latestRecord.deck.title,
    }
  }

  if (starterRecord) {
    return {
      detail: `Start with a shorter deck and build confidence before you branch out.`,
      eyebrow: 'Start here',
      href: `/study/${starterRecord.deck.id}?mode=start`,
      label: 'Start a focused deck',
      title: starterRecord.deck.title,
    }
  }

  if (latestRecord) {
    return {
      detail: `You have already seen every card here. Review it again and tighten the phrasing.`,
      eyebrow: 'Latest deck',
      href: `/decks/${latestRecord.deck.id}/review`,
      label: 'Review latest deck',
      title: latestRecord.deck.title,
    }
  }

  return {
    detail: 'Jump into the library and pick the topic that matters for the next interview.',
    eyebrow: 'Get started',
    href: '/decks/react-rendering-core',
    label: 'Open a deck',
    title: 'Start with a focused deck',
  }
}

function getSecondaryAction(weakestRecord: DeckRecord | null, starterRecord: DeckRecord | null) {
  if (weakestRecord) {
    return {
      detail: `${weakestRecord.counts.partial + weakestRecord.counts.notLearned} cards still need work in ${weakestRecord.deck.title}.`,
      eyebrow: 'Weak spots',
      href: `/study/${weakestRecord.deck.id}?mode=start&scope=weak`,
      label: 'Fix weak cards',
      title: weakestRecord.deck.title,
    }
  }

  if (starterRecord) {
    return {
      detail: `No weak cards yet. Open another lane and build breadth before the review queue starts growing.`,
      eyebrow: 'Explore',
      href: `/decks/${starterRecord.deck.id}`,
      label: 'Explore another lane',
      title: starterRecord.deck.title,
    }
  }

  return {
    detail: 'Everything is currently clean. Open any deck and keep the habit going.',
    eyebrow: 'Keep momentum',
    href: '/decks/coding-arrays-hashmaps-basics',
    label: 'Open another deck',
    title: 'Everything looks stable',
  }
}

function getDifficultyRank(difficulty: DeckManifestEntry['difficulty']) {
  if (difficulty === 'easy') return 0
  if (difficulty === 'medium') return 1
  return 2
}
