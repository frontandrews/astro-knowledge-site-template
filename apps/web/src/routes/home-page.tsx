import type { DeckManifestEntry } from '@prepdeck/schemas'
import { getDecksByTopic } from '@prepdeck/content/manifest'
import { m } from 'motion/react'
import { useMemo, useState } from 'react'

import { AdSlot } from '@/components/ad-slot'
import { DeckCard } from '@/components/deck-card'
import { FirstRunPanel } from '@/components/first-run-panel'
import { InstallAppPanel } from '@/components/install-app-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { ProgressMeter } from '@/components/ui/progress-meter'
import {
  filterDeckLibraryRecords,
  type DeckLibraryFilters,
  type DeckLibraryRecord,
} from '@/lib/deck-library'
import { cardRevealVariants, hoverLiftMotionProps } from '@/lib/motion'
import { getMasterySnapshot } from '@/lib/mastery'
import {
  combineDeckCounts,
  getDeckCountsFromSummary,
  getMostRecentlyStudiedDeckId,
  type DeckCounts,
} from '@/lib/progress'
import { getSessionHistorySnapshot } from '@/lib/session-history'
import { getSessionPresets, type SessionPreset } from '@/lib/session-presets'
import { getStudyGoalsSnapshot } from '@/lib/study-goals'
import { getTopicLabel } from '@/lib/topic-labels'
import { usePreferences } from '@/state/preferences-context'
import { useProgress } from '@/state/progress-context'

export function HomePage() {
  const { progressStore, sessionHistoryStore } = useProgress()
  const { preferences } = usePreferences()
  const [libraryDifficulty, setLibraryDifficulty] =
    useState<DeckLibraryFilters['difficulty']>('all')
  const [libraryQuery, setLibraryQuery] = useState('')
  const [libraryStatus, setLibraryStatus] = useState<DeckLibraryFilters['status']>('all')
  const [selectedTopic, setSelectedTopic] = useState<'all' | string>('all')
  const decksByTopic = getDecksByTopic()
  const topicEntries = Object.entries(decksByTopic)

  const deckRecords = useMemo(
    () =>
      topicEntries
        .flatMap(([, summaries]) =>
          summaries.map((summary) => {
            const counts = getDeckCountsFromSummary(progressStore, summary)

            return {
              counts,
              noteCount: Object.keys(progressStore.decks[summary.id]?.notes ?? {}).length,
              reviewDebt: counts.partial + counts.notLearned,
              summary,
            }
          }),
        )
        .filter((record): record is DeckLibraryRecord => record !== null),
    [progressStore, topicEntries],
  )

  const overallCounts = combineDeckCounts(deckRecords.map((record) => record.counts))
  const totalDecks = deckRecords.length
  const lastStudiedDeckId = getMostRecentlyStudiedDeckId(progressStore)
  const latestRecord =
    deckRecords.find((record) => record.summary.id === lastStudiedDeckId) ?? null
  const weakestRecord = getWeakestDeckRecord(deckRecords)
  const starterRecord = getStarterDeckRecord(deckRecords)
  const alternateStarterRecord = getStarterDeckRecord(
    deckRecords,
    starterRecord?.summary.id ?? null,
  )
  const visibleDeckRecords = filterDeckLibraryRecords(deckRecords, {
    difficulty: libraryDifficulty,
    query: libraryQuery,
    selectedTopic,
    status: libraryStatus,
  })
  const sessionPresets = getSessionPresets(deckRecords)
  const masterySnapshot = getMasterySnapshot(deckRecords, progressStore)
  const sessionHistorySnapshot = getSessionHistorySnapshot(sessionHistoryStore)
  const goalsSnapshot = getStudyGoalsSnapshot(sessionHistorySnapshot, {
    daily: preferences.dailyGoalTarget,
    weekly: preferences.weeklyGoalTarget,
  })
  const isFirstRun =
    overallCounts.seen === 0 &&
    sessionHistorySnapshot.totalSessions === 0 &&
    masterySnapshot.savedNotes === 0
  const starterDecks = getStarterDeckRecords(deckRecords, 3).map((record) => record.summary)
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
        <InstallAppPanel />
        {isFirstRun ? <FirstRunPanel starterDecks={starterDecks} /> : null}
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

      <section aria-labelledby="progress-hub-heading" className="mb-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[var(--retro-ink)]" id="progress-hub-heading">
              Progress hub
            </h2>
            <p className="mt-1 text-sm leading-6 text-white/75">
              History, goals, local backup, and shareable progress now live in one place so
              the home screen can stay focused on starting the next useful rep.
            </p>
          </div>
          <LinkButton to="/progress" variant="secondary">
            Open progress hub
          </LinkButton>
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="grid gap-4 sm:grid-cols-3">
            <HubSignalCard
              detail={
                sessionHistorySnapshot.currentStreak > 0
                  ? `${sessionHistorySnapshot.currentStreak} consecutive ${pluralize('day', sessionHistorySnapshot.currentStreak)} with at least one completed session.`
                  : 'No live streak yet. One short session starts the chain again.'
              }
              label="Current streak"
              value={
                sessionHistorySnapshot.currentStreak > 0
                  ? `${sessionHistorySnapshot.currentStreak} ${sessionHistorySnapshot.currentStreak === 1 ? 'day' : 'days'}`
                  : 'Start one'
              }
            />
            <HubSignalCard
              detail={`${sessionHistorySnapshot.sessionsThisWeek} ${pluralize('session', sessionHistorySnapshot.sessionsThisWeek)} completed in the last 7 days.`}
              label="This week"
              value={`${sessionHistorySnapshot.sessionsThisWeek}`}
            />
            <HubSignalCard
              detail={`${masterySnapshot.reviewDebt} ${pluralize('card', masterySnapshot.reviewDebt)} currently need another pass.`}
              label="Review debt"
              value={`${masterySnapshot.reviewDebt}`}
            />
          </div>

          <m.div
            className="[transform-style:preserve-3d]"
            initial="initial"
            variants={cardRevealVariants}
            viewport={{ amount: 0.2, once: true }}
            whileInView="animate"
            {...hoverLiftMotionProps}
          >
            <Panel className="h-full p-5">
              <div className="flex flex-wrap gap-2">
                <Badge tone="accent">Goals</Badge>
                <Badge>{goalsSnapshot.daily.current}/{goalsSnapshot.daily.target} today</Badge>
                <Badge>{masterySnapshot.savedNotes} notes</Badge>
              </div>
              <h3 className="mt-3 text-2xl font-black text-[var(--retro-ink)]">
                Keep the tracking layer out of the way.
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Open the progress hub for recent reps, goal tracking, mastery signals, shareable
                snapshots, and backup controls. The home screen stays lighter and faster.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <LinkButton to="/progress" variant="primary">
                  Open progress hub
                </LinkButton>
                <LinkButton to={goalsSnapshot.nextAction.href} variant="ghost">
                  {goalsSnapshot.nextAction.label}
                </LinkButton>
              </div>
            </Panel>
          </m.div>
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

        <Panel className="mb-4 p-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <label
                className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]"
                htmlFor="deck-library-search"
              >
                Search decks
              </label>
              <input
                className="mt-3 min-h-12 w-full rounded-[0.95rem] border-2 border-[var(--retro-line)] bg-[color:rgba(255,255,255,0.04)] px-4 text-sm text-[var(--retro-ink)] outline-none transition placeholder:text-white/40 focus:border-[var(--retro-line-strong)]"
                id="deck-library-search"
                onChange={(event) => setLibraryQuery(event.target.value)}
                placeholder="React, queues, ownership, context..."
                type="text"
                value={libraryQuery}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
                  Difficulty
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(['all', 'easy', 'medium', 'hard'] as const).map((difficulty) => (
                    <Button
                      key={difficulty}
                      onClick={() => setLibraryDifficulty(difficulty)}
                      size="sm"
                      type="button"
                      variant={libraryDifficulty === difficulty ? 'primary' : 'ghost'}
                    >
                      {difficulty === 'all' ? 'All' : difficulty}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
                  Status
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    ['all', 'All'],
                    ['needs_review', 'Needs review'],
                    ['has_notes', 'Has notes'],
                    ['started', 'Started'],
                  ].map(([status, label]) => (
                    <Button
                      key={status}
                      onClick={() => setLibraryStatus(status as DeckLibraryFilters['status'])}
                      size="sm"
                      type="button"
                      variant={libraryStatus === status ? 'primary' : 'ghost'}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {visibleDeckRecords.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleDeckRecords.map((record) => (
              <DeckCard
                detailHref={`/decks/${record.summary.id}`}
                key={record.summary.id}
                learnedCount={record.counts.learned}
                noteCount={record.noteCount}
                reviewDebt={record.reviewDebt}
                summary={record.summary}
                totalCards={record.counts.total}
              />
            ))}
          </div>
        ) : (
          <Panel className="p-5">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
              No match
            </p>
            <h3 className="mt-3 text-2xl font-black text-[var(--retro-ink)]">
              No decks match the current library filters.
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/80">
              Clear the search or filter chips to reopen the full deck library.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  setLibraryDifficulty('all')
                  setLibraryQuery('')
                  setLibraryStatus('all')
                  setSelectedTopic('all')
                }}
                type="button"
                variant="secondary"
              >
                Clear library filters
              </Button>
            </div>
          </Panel>
        )}
      </section>

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
    <m.div
      className="[transform-style:preserve-3d]"
      initial="initial"
      variants={cardRevealVariants}
      viewport={{ amount: 0.25, once: true }}
      whileInView="animate"
      {...hoverLiftMotionProps}
    >
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
    </m.div>
  )
}

function SessionPresetCard({ preset }: { preset: SessionPreset }) {
  return (
    <m.div
      className="h-full [transform-style:preserve-3d]"
      initial="initial"
      variants={cardRevealVariants}
      viewport={{ amount: 0.2, once: true }}
      whileInView="animate"
      {...hoverLiftMotionProps}
    >
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
    </m.div>
  )
}

function HubSignalCard({
  detail,
  label,
  value,
}: {
  detail: string
  label: string
  value: string
}) {
  return (
    <m.div
      className="[transform-style:preserve-3d]"
      initial="initial"
      variants={cardRevealVariants}
      viewport={{ amount: 0.2, once: true }}
      whileInView="animate"
      {...hoverLiftMotionProps}
    >
      <Panel className="h-full p-5">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
          {label}
        </p>
        <p className="mt-3 text-2xl font-black text-[var(--retro-ink)]">{value}</p>
        <p className="mt-3 text-sm leading-6 text-white/80">{detail}</p>
      </Panel>
    </m.div>
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
    <m.div
      className="[transform-style:preserve-3d]"
      initial="initial"
      layout
      variants={cardRevealVariants}
      viewport={{ amount: 0.2, once: true }}
      whileInView="animate"
      {...hoverLiftMotionProps}
    >
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
    </m.div>
  )
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <m.div
      initial="initial"
      variants={cardRevealVariants}
      viewport={{ amount: 0.3, once: true }}
      whileInView="animate"
    >
      <Panel className="bg-[var(--retro-surface-muted)] p-3" inset>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--retro-ink-soft)]">
          {label}
        </p>
        <p className="mt-1 text-lg font-black text-[var(--retro-ink)]">{value}</p>
      </Panel>
    </m.div>
  )
}

function getWeakestDeckRecord(records: DeckLibraryRecord[]) {
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

function getStarterDeckRecord(records: DeckLibraryRecord[], excludeDeckId?: string | null) {
  return getStarterDeckRecords(records, 1, excludeDeckId)[0] ?? null
}

function getStarterDeckRecords(
  records: DeckLibraryRecord[],
  limit: number,
  excludeDeckId?: string | null,
) {
  return [...records]
    .filter((record) => record.counts.seen === 0 && record.summary.id !== excludeDeckId)
    .sort((a, b) => {
      const difficultyRank = getDifficultyRank(a.summary.difficulty) - getDifficultyRank(b.summary.difficulty)

      if (difficultyRank !== 0) {
        return difficultyRank
      }

      if (a.summary.estimatedMinutes !== b.summary.estimatedMinutes) {
        return a.summary.estimatedMinutes - b.summary.estimatedMinutes
      }

      return a.summary.title.localeCompare(b.summary.title)
    })
    .slice(0, limit)
}

function getPrimaryAction(
  latestRecord: DeckLibraryRecord | null,
  starterRecord: DeckLibraryRecord | null,
) {
  if (latestRecord && !latestRecord.counts.allSeen) {
    return {
      detail: `Resume ${latestRecord.summary.title} without losing your last position or note.`,
      eyebrow: 'Continue',
      href: `/study/${latestRecord.summary.id}?mode=continue`,
      label: 'Continue latest session',
      title: latestRecord.summary.title,
    }
  }

  if (starterRecord) {
    return {
      detail: `Start with a shorter deck and build confidence before you branch out.`,
      eyebrow: 'Start here',
      href: `/study/${starterRecord.summary.id}?mode=start`,
      label: 'Start a focused deck',
      title: starterRecord.summary.title,
    }
  }

  if (latestRecord) {
    return {
      detail: `You have already seen every card here. Review it again and tighten the phrasing.`,
      eyebrow: 'Latest deck',
      href: `/decks/${latestRecord.summary.id}/review`,
      label: 'Review latest deck',
      title: latestRecord.summary.title,
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

function getSecondaryAction(
  weakestRecord: DeckLibraryRecord | null,
  starterRecord: DeckLibraryRecord | null,
) {
  if (weakestRecord) {
    return {
      detail: `${weakestRecord.counts.partial + weakestRecord.counts.notLearned} cards still need work in ${weakestRecord.summary.title}.`,
      eyebrow: 'Weak spots',
      href: `/study/${weakestRecord.summary.id}?mode=start&scope=weak`,
      label: 'Fix weak cards',
      title: weakestRecord.summary.title,
    }
  }

  if (starterRecord) {
    return {
      detail: `No weak cards yet. Open another lane and build breadth before the review queue starts growing.`,
      eyebrow: 'Explore',
      href: `/decks/${starterRecord.summary.id}`,
      label: 'Explore another lane',
      title: starterRecord.summary.title,
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

function pluralize(word: string, count: number) {
  return count === 1 ? word : `${word}s`
}
