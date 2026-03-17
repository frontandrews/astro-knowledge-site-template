import type { ProgressStatus, SessionHistoryKind } from '@prepdeck/schemas'
import { m } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { CardNoteEditor } from '@/components/card-note-editor'
import { FollowUpDrill } from '@/components/follow-up-drill'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-styles'
import { Panel } from '@/components/ui/panel'
import { getArticleHref } from '@/lib/article-links'
import { ProgressMeter } from '@/components/ui/progress-meter'
import { useScreenWakeLock } from '@/hooks/use-screen-wake-lock'
import { cardRevealVariants, springTransition } from '@/lib/motion'
import {
  getInterviewDurationSeconds,
  getStudyFormatLabel,
  type StudyCardEntry,
  type StudyFormat,
} from '@/lib/study-session'
import { getTopicLabel } from '@/lib/topic-labels'
import { cn } from '@/lib/utils'
import { usePreferences } from '@/state/preferences-context'
import { useProgress } from '@/state/progress-context'

type StudySessionPlayerProps = {
  entries: StudyCardEntry[]
  exitHref: string
  format: StudyFormat
  initialIndex: number
  onComplete: () => void
  sessionKind: SessionHistoryKind
  sessionLabel: string
  showEntrySource?: boolean
  scopeLabel: string
}

export function StudySessionPlayer({
  entries,
  exitHref,
  format,
  initialIndex,
  onComplete,
  sessionKind,
  sessionLabel,
  showEntrySource = false,
  scopeLabel,
}: StudySessionPlayerProps) {
  const { preferences } = usePreferences()
  const wakeLockStatus = useScreenWakeLock(preferences.keepScreenAwake)
  const {
    clearCardNote,
    getCardNote,
    recordCompletedSession,
    rememberDeckPosition,
    setCardNote,
    setCardStatus,
  } = useProgress()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isAnswerVisible, setIsAnswerVisible] = useState(false)
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false)
  const [gesturePreview, setGesturePreview] = useState<GestureAction | null>(null)
  const [gestureStart, setGestureStart] = useState<GesturePoint | null>(null)
  const [sessionRatings, setSessionRatings] = useState({
    learned: 0,
    not_learned: 0,
    partial: 0,
  })
  const currentEntry = entries[currentIndex]
  const currentCard = currentEntry?.card
  const currentCardId = currentCard?.id ?? null
  const currentDeckId = currentEntry?.deckId ?? null
  const singleDeckEntry = getSingleDeckEntry(entries)
  const currentNote = currentEntry ? getCardNote(currentEntry.deckId, currentCard.id) : ''
  const [interviewSecondsLeft, setInterviewSecondsLeft] = useState(() =>
    currentCard ? getInterviewDurationSeconds(currentCard, preferences.interviewTimerPreset) : 0,
  )

  useEffect(() => {
    if (!currentDeckId || !currentCardId) {
      return
    }

    rememberDeckPosition(currentDeckId, currentCardId)
  }, [currentCardId, currentDeckId, rememberDeckPosition])

  useEffect(() => {
    if (format !== 'interview' || isAnswerVisible || interviewSecondsLeft <= 0) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setInterviewSecondsLeft((currentValue) => Math.max(0, currentValue - 1))
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [format, interviewSecondsLeft, isAnswerVisible])

  if (!currentEntry || !currentCard) {
    return null
  }

  const handleRateCard = (status: Exclude<ProgressStatus, 'unseen'>) => {
    const nextSessionRatings = {
      ...sessionRatings,
      [status]: sessionRatings[status] + 1,
    }

    setSessionRatings(nextSessionRatings)
    setCardStatus(currentEntry.deckId, currentCard.id, status)

    if (currentIndex >= entries.length - 1) {
      recordCompletedSession({
        cardCount: entries.length,
        deckId: singleDeckEntry?.deckId ?? null,
        deckTitle: singleDeckEntry?.deckTitle ?? null,
        format,
        kind: sessionKind,
        learnedCount: nextSessionRatings.learned,
        notLearnedCount: nextSessionRatings.not_learned,
        partialCount: nextSessionRatings.partial,
        scopeLabel,
        sessionLabel,
      })
      onComplete()
      return
    }

    const nextEntry = entries[currentIndex + 1]
    setCurrentIndex((previousIndex) => previousIndex + 1)
    setIsAnswerVisible(false)
    setIsLearnMoreOpen(false)
    setInterviewSecondsLeft(
      nextEntry
        ? getInterviewDurationSeconds(nextEntry.card, preferences.interviewTimerPreset)
        : 0,
    )
    rememberDeckPosition(nextEntry?.deckId ?? currentEntry.deckId, nextEntry?.card.id ?? null)
  }

  const interviewDurationSeconds = getInterviewDurationSeconds(
    currentCard,
    preferences.interviewTimerPreset,
  )
  const elapsedInterviewSeconds = interviewDurationSeconds - interviewSecondsLeft
  const isInterviewMode = format === 'interview'
  const isRevealLocked = isInterviewMode && interviewSecondsLeft > 0 && !isAnswerVisible
  const answerLabel = isInterviewMode ? 'Strong answer' : 'Answer'
  const articleHref = currentCard.learnMoreSlug
    ? getArticleHref(currentCard.learnMoreSlug)
    : null

  const handleRevealAnswer = () => {
    if (isRevealLocked) {
      return
    }

    setIsAnswerVisible(true)
  }

  const handleGesturePreview = (clientX: number, clientY: number) => {
    if (!gestureStart) {
      return
    }

    const nextAction = getGestureAction({
      dx: clientX - gestureStart.x,
      dy: clientY - gestureStart.y,
      isAnswerVisible,
      isRevealLocked,
    })

    setGesturePreview(nextAction)
  }

  const handleGestureCommit = (clientX: number, clientY: number) => {
    if (!gestureStart) {
      return
    }

    const action = getGestureAction({
      dx: clientX - gestureStart.x,
      dy: clientY - gestureStart.y,
      isAnswerVisible,
      isRevealLocked,
    })

    if (action === 'reveal') {
      handleRevealAnswer()
    } else if (action) {
      handleRateCard(action)
    }

    setGesturePreview(null)
    setGestureStart(null)
  }

  return (
    <section className="space-y-5">
      <m.div
        initial="initial"
        variants={cardRevealVariants}
        viewport={{ amount: 0.4, once: true }}
        whileInView="animate"
      >
        <Panel className="bg-[var(--retro-surface)] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--retro-line)]">
                {sessionLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="accent">{scopeLabel}</Badge>
                <Badge>{getStudyFormatLabel(format)}</Badge>
                {showEntrySource ? <Badge>{getTopicLabel(currentEntry.topic)}</Badge> : null}
                {showEntrySource ? <Badge>{currentEntry.deckTitle}</Badge> : null}
                <Badge>{currentCard.difficulty}</Badge>
                {isInterviewMode ? (
                  <Badge tone="warning">{formatDuration(interviewDurationSeconds)}</Badge>
                ) : null}
                {preferences.keepScreenAwake && wakeLockStatus === 'active' ? (
                  <Badge tone="success">Awake</Badge>
                ) : null}
              </div>
              <h2 className="mt-2 text-2xl font-black text-[var(--retro-ink)]">
                {currentIndex + 1} of {entries.length}
              </h2>
            </div>
            <Link
              className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--retro-line)] hover:text-[var(--retro-line-strong)]"
              to={exitHref}
            >
              Exit session
            </Link>
          </div>
          <div className="mt-4">
            <ProgressMeter current={currentIndex + 1} total={entries.length} />
          </div>
        </Panel>
      </m.div>

      <Panel className="bg-[var(--retro-surface)] p-5 [perspective:1200px]">
        <m.div
          animate={{
            opacity: 1,
            rotateX: isAnswerVisible ? 0 : 2,
            scale: isAnswerVisible ? 1 : 0.996,
            y: 0,
          }}
          initial={{ opacity: 0, rotateX: 5, scale: 0.985, y: 10 }}
          key={`${currentEntry.deckId}:${currentCard.id}`}
          transition={springTransition}
        >
          <m.div
            animate={{
              opacity: 1,
              y: 0,
            }}
            initial={false}
            transition={{
              duration: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent">{isAnswerVisible ? 'Answer side' : 'Question side'}</Badge>
            </div>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.25em] text-[var(--retro-line)]">
              {isAnswerVisible ? 'Answer side' : 'Question side'}
            </p>
            <h3 className="mt-4 text-2xl font-black leading-tight text-[var(--retro-ink)]">
              {currentCard.question}
            </h3>
            <Panel className="mt-5 bg-[var(--retro-surface-muted)] p-4" inset>
              {isAnswerVisible ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-black text-[var(--retro-ink)]">{answerLabel}</p>
                    <p className="mt-2 text-base leading-7 text-[var(--retro-ink)]">
                      {isInterviewMode ? currentCard.expectedAnswer : currentCard.shortAnswer}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-black text-[var(--retro-ink)]">Key points</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-white/80">
                      {currentCard.keyPoints.map((point) => (
                        <li key={point}>- {point}</li>
                      ))}
                    </ul>
                  </div>
                  {isInterviewMode && currentCard.commonTraps.length > 0 ? (
                    <div>
                      <p className="text-sm font-black text-[var(--retro-ink)]">Common traps</p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-white/80">
                        {currentCard.commonTraps.map((trap) => (
                          <li key={trap}>- {trap}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {isInterviewMode ? (
                    <FollowUpDrill
                      key={`follow-up-${currentEntry.deckId}-${currentCard.id}`}
                      prompts={currentCard.followUps}
                    />
                  ) : null}
                  {currentCard.learnMore || currentCard.exampleCode || articleHref ? (
                    <div className="rounded-[1rem] border border-[var(--retro-line)] bg-[var(--retro-bg-strong)]">
                      <button
                        aria-expanded={isLearnMoreOpen}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-black text-[var(--retro-ink)]"
                        onClick={() => setIsLearnMoreOpen((open) => !open)}
                        type="button"
                      >
                        <span>Learn more</span>
                        <span className="text-[var(--retro-line)]">
                          {isLearnMoreOpen ? 'Hide' : 'Open'}
                        </span>
                      </button>
                      {isLearnMoreOpen ? (
                        <div className="border-t border-[var(--retro-line)] px-4 py-4">
                          {currentCard.learnMore ? (
                            <div>
                              <p className="whitespace-pre-line text-sm leading-6 text-white/80">
                                {currentCard.learnMore}
                              </p>
                            </div>
                          ) : null}
                          {currentCard.exampleCode ? (
                            <div className={currentCard.learnMore ? 'mt-4' : ''}>
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-black text-[var(--retro-ink)]">
                                  Code example
                                </p>
                                {currentCard.exampleLanguage ? (
                                  <Badge>{currentCard.exampleLanguage}</Badge>
                                ) : null}
                              </div>
                              <pre className="mt-3 overflow-x-auto rounded-[1rem] border border-[var(--retro-line)] bg-[color:rgba(255,255,255,0.03)] p-4 text-xs leading-6 text-white/90">
                                <code>{currentCard.exampleCode}</code>
                              </pre>
                            </div>
                          ) : null}
                          {articleHref ? (
                            <div className={currentCard.learnMore || currentCard.exampleCode ? 'mt-4' : ''}>
                              <a
                                className={cn(
                                  buttonVariants({ size: 'sm', variant: 'secondary' }),
                                  'w-full sm:w-auto',
                                )}
                                href={articleHref}
                                rel="noreferrer"
                                target="_blank"
                              >
                                Read full article
                              </a>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  <CardNoteEditor
                    key={`note-${currentEntry.deckId}-${currentCard.id}`}
                    note={currentNote}
                    onClearNote={() => clearCardNote(currentEntry.deckId, currentCard.id)}
                    onSaveNote={(note) => setCardNote(currentEntry.deckId, currentCard.id, note)}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm leading-7 text-white/80">
                    {isInterviewMode
                      ? 'Answer it out loud or in your head first. The reference answer unlocks when the timer ends or when you end the timer early.'
                      : 'Flip the card when you have your answer in mind, then rate how solid the answer actually felt.'}
                  </p>
                  {isInterviewMode ? (
                    <Panel className="bg-[var(--retro-bg-strong)] p-4" inset>
                      <div className="flex items-center justify-between gap-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--retro-ink-soft)]">
                        <span>Time left</span>
                        <span>{formatDuration(interviewSecondsLeft)}</span>
                      </div>
                      <div className="mt-3">
                        <ProgressMeter
                          current={elapsedInterviewSeconds}
                          total={interviewDurationSeconds}
                        />
                      </div>
                    </Panel>
                  ) : null}
                </div>
              )}
            </Panel>
          </m.div>
        </m.div>
      </Panel>

      <m.div
        initial="initial"
        variants={cardRevealVariants}
        viewport={{ amount: 0.8, once: true }}
        whileInView="animate"
      >
        <Panel className="sticky bottom-4 bg-[var(--retro-bg-strong)] p-4 backdrop-blur-sm">
          <div
            className={cn(
              'mb-3 rounded-[1rem] border border-[var(--retro-line)] bg-[color:rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--retro-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] touch-none select-none',
              gesturePreview === 'learned' &&
                'border-[var(--retro-success)] bg-[color:rgba(83,126,146,0.22)]',
              gesturePreview === 'partial' &&
                'border-[var(--retro-warning)] bg-[color:rgba(96,113,143,0.2)]',
              gesturePreview === 'not_learned' &&
                'border-[var(--retro-danger)] bg-[color:rgba(143,95,115,0.24)]',
              gesturePreview === 'reveal' &&
                'border-[var(--retro-line-strong)] bg-[color:rgba(74,125,216,0.18)]',
            )}
            data-testid="gesture-strip"
            onPointerCancel={() => {
              setGesturePreview(null)
              setGestureStart(null)
            }}
            onPointerDown={(event) => {
              setGestureStart({
                x: event.clientX,
                y: event.clientY,
              })
            }}
            onPointerLeave={() => {
              setGesturePreview(null)
            }}
            onPointerMove={(event) => {
              handleGesturePreview(event.clientX, event.clientY)
            }}
            onPointerUp={(event) => {
              handleGestureCommit(event.clientX, event.clientY)
            }}
            role="presentation"
          >
            {isAnswerVisible ? (
              <div className="grid grid-cols-3 gap-3 text-center">
                <GestureHint
                  action="not_learned"
                  description="Needs work"
                  isActive={gesturePreview === 'not_learned'}
                  label="Left"
                />
                <GestureHint
                  action="partial"
                  description="Partial"
                  isActive={gesturePreview === 'partial'}
                  label="Up"
                />
                <GestureHint
                  action="learned"
                  description={isInterviewMode ? 'Strong' : 'Learned'}
                  isActive={gesturePreview === 'learned'}
                  label="Right"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--retro-line)]">
                    Quick gesture
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/80">
                    {isRevealLocked
                      ? 'Swipe up once the timer ends, or end early to unlock the answer.'
                      : 'Swipe up anywhere in this strip to reveal the answer faster.'}
                  </p>
                </div>
                <Badge tone={gesturePreview === 'reveal' ? 'accent' : 'default'}>
                  Up to reveal
                </Badge>
              </div>
            )}
          </div>

          {isAnswerVisible ? (
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <Button
                className="min-h-14 px-2 text-[0.68rem] sm:px-4 sm:text-sm"
                onClick={() => handleRateCard('learned')}
                size="sm"
                type="button"
                variant="success"
              >
                {isInterviewMode ? 'Strong' : 'Learned'}
              </Button>
              <Button
                className="min-h-14 px-2 text-[0.68rem] sm:px-4 sm:text-sm"
                onClick={() => handleRateCard('partial')}
                size="sm"
                type="button"
                variant="warning"
              >
                {isInterviewMode ? 'Decent' : 'Partial'}
              </Button>
              <Button
                className="min-h-14 px-2 text-[0.68rem] sm:px-4 sm:text-sm"
                onClick={() => handleRateCard('not_learned')}
                size="sm"
                type="button"
                variant="danger"
              >
                {isInterviewMode ? 'Needs work' : 'Not learned'}
              </Button>
            </div>
          ) : isInterviewMode ? (
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <Button
                className="w-full"
                disabled={isRevealLocked}
                onClick={handleRevealAnswer}
                type="button"
                variant="primary"
              >
                Reveal answer
              </Button>
              {isRevealLocked ? (
                <Button
                  onClick={() => setInterviewSecondsLeft(0)}
                  type="button"
                  variant="secondary"
                >
                  End early
                </Button>
              ) : null}
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={handleRevealAnswer}
              type="button"
              variant="primary"
            >
              Show answer
            </Button>
          )}
        </Panel>
      </m.div>
    </section>
  )
}

type GestureAction = Exclude<ProgressStatus, 'unseen'> | 'reveal'

type GesturePoint = {
  x: number
  y: number
}

function GestureHint({
  action,
  description,
  isActive,
  label,
}: {
  action: GestureAction
  description: string
  isActive: boolean
  label: string
}) {
  return (
    <div
      className={cn(
        'rounded-[0.9rem] border border-transparent px-2 py-1.5 transition',
        isActive && getGestureToneClass(action),
      )}
    >
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--retro-line)]">
        {label}
      </p>
      <p className="mt-1 text-[0.78rem] font-black text-[var(--retro-ink)]">{description}</p>
    </div>
  )
}

function getGestureAction({
  dx,
  dy,
  isAnswerVisible,
  isRevealLocked,
}: {
  dx: number
  dy: number
  isAnswerVisible: boolean
  isRevealLocked: boolean
}): GestureAction | null {
  const horizontalThreshold = 64
  const verticalThreshold = 58
  const absX = Math.abs(dx)
  const absY = Math.abs(dy)

  if (!isAnswerVisible) {
    if (!isRevealLocked && dy <= -verticalThreshold && absY > absX) {
      return 'reveal'
    }

    return null
  }

  if (dx >= horizontalThreshold && absX > absY) {
    return 'learned'
  }

  if (dx <= -horizontalThreshold && absX > absY) {
    return 'not_learned'
  }

  if (dy <= -verticalThreshold && absY > absX) {
    return 'partial'
  }

  return null
}

function getGestureToneClass(action: GestureAction) {
  if (action === 'learned') {
    return 'border-[var(--retro-success)] bg-[color:rgba(83,126,146,0.2)]'
  }

  if (action === 'partial') {
    return 'border-[var(--retro-warning)] bg-[color:rgba(96,113,143,0.18)]'
  }

  if (action === 'not_learned') {
    return 'border-[var(--retro-danger)] bg-[color:rgba(143,95,115,0.22)]'
  }

  return 'border-[var(--retro-line-strong)] bg-[color:rgba(74,125,216,0.16)]'
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function getSingleDeckEntry(entries: StudyCardEntry[]) {
  const firstEntry = entries[0]

  if (!firstEntry) {
    return null
  }

  const isSingleDeckSession = entries.every((entry) => entry.deckId === firstEntry.deckId)

  return isSingleDeckSession ? firstEntry : null
}
