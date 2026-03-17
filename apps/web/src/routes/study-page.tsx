import type { ProgressStatus } from '@prepdeck/schemas'
import type { Deck } from '@prepdeck/schemas'
import { getDeckById } from '@prepdeck/content'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { CardNoteEditor } from '@/components/card-note-editor'
import { FollowUpDrill } from '@/components/follow-up-drill'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { ProgressMeter } from '@/components/ui/progress-meter'
import { getDeckCounts } from '@/lib/progress'
import {
  createStudyHref,
  getInterviewDurationSeconds,
  getStudyCards,
  getStudyFormat,
  getStudyFormatLabel,
  getStudyInitialIndex,
  getStudyScope,
  getStudyScopeLabel,
  type StudyFormat,
  type StudyScope,
} from '@/lib/study-session'
import { useProgress } from '@/state/progress-context'

export function StudyPage() {
  const { deckId } = useParams()
  const [searchParams] = useSearchParams()
  const { progressStore } = useProgress()
  const deck = deckId ? getDeckById(deckId) : undefined
  const successState = searchParams.get('state') === 'success'
  const mode = searchParams.get('mode') ?? 'start'
  const format = getStudyFormat(searchParams.get('format'))
  const scope = getStudyScope(searchParams.get('scope'))

  if (!deckId || !deck) {
    return <Navigate replace to="/" />
  }

  const studyCards = getStudyCards(progressStore, deck, scope)

  if (successState) {
    return <StudySuccess deck={deck} format={format} scope={scope} />
  }

  const initialIndex = getStudyInitialIndex(progressStore, deck, scope, mode)

  if (initialIndex === null || studyCards.length === 0) {
    return <Navigate replace to={createStudyHref(deck.id, { format, scope, state: 'success' })} />
  }

  return (
    <StudySession
      cards={studyCards}
      deck={deck}
      format={format}
      initialIndex={initialIndex}
      key={`${deck.id}:${mode}:${scope}:${format}`}
      scope={scope}
    />
  )
}

function StudySuccess({
  deck,
  format,
  scope,
}: {
  deck: Deck
  format: StudyFormat
  scope: StudyScope
}) {
  const { progressStore } = useProgress()
  const counts = getDeckCounts(progressStore, deck)
  const hasRemainingWeakCards = counts.partial + counts.notLearned > 0
  const restartHref = createStudyHref(deck.id, { format, mode: 'start', scope })

  return (
    <Panel className="bg-[var(--retro-surface)] p-6">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--retro-line)]">
        Session complete
      </p>
      <h2 className="mt-3 text-3xl font-black text-[var(--retro-ink)]">
        {format === 'interview'
          ? scope === 'weak'
            ? hasRemainingWeakCards
              ? 'You finished this weak-card interview run.'
              : 'You cleared the weak interview queue for this deck.'
            : 'You completed this interview-style run.'
          : scope === 'weak'
          ? hasRemainingWeakCards
            ? 'You finished this weak-card session.'
            : 'You cleared every weak card in this deck.'
          : counts.allLearned
            ? 'Everything in this deck is marked learned.'
            : 'You have seen every card in this deck.'}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
        {format === 'interview'
          ? scope === 'weak'
            ? hasRemainingWeakCards
              ? 'The weak queue still has open cards. Run another interview-style pass or inspect them in review mode.'
              : 'Nice. There are no weak cards left in this deck right now.'
            : 'Use review to inspect the weaker answers or run the deck again when you want another timed pass.'
          : scope === 'weak'
          ? hasRemainingWeakCards
            ? 'Some cards still need work. Run the weak-card session again or inspect them in review mode.'
            : 'Nice. The weak-card queue for this deck is empty right now.'
          : counts.allLearned
            ? 'Great. Use review to sanity-check what you learned or restart the deck later.'
            : 'Review the cards marked partial or not learned to tighten the weak spots.'}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <LinkButton to={`/decks/${deck.id}/review`} variant="primary">
          Review this deck
        </LinkButton>
        {scope === 'weak' ? (
          <LinkButton to={restartHref} variant="secondary">
            {format === 'interview' ? 'Run weak interview mode again' : 'Run weak cards again'}
          </LinkButton>
        ) : (
          <LinkButton to={restartHref} variant="secondary">
            {format === 'interview' ? 'Run interview mode again' : 'Restart deck'}
          </LinkButton>
        )}
        <LinkButton to={`/decks/${deck.id}`} variant="ghost">
          Back to deck
        </LinkButton>
      </div>
    </Panel>
  )
}

function StudySession({
  cards,
  deck,
  format,
  initialIndex,
  scope,
}: {
  cards: Deck['cards']
  deck: Deck
  format: StudyFormat
  initialIndex: number
  scope: StudyScope
}) {
  const navigate = useNavigate()
  const {
    clearCardNote,
    getCardNote,
    rememberDeckPosition,
    setCardNote,
    setCardStatus,
  } = useProgress()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isAnswerVisible, setIsAnswerVisible] = useState(false)
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false)
  const currentCard = cards[currentIndex]
  const currentNote = getCardNote(deck.id, currentCard.id)
  const [interviewSecondsLeft, setInterviewSecondsLeft] = useState(() =>
    getInterviewDurationSeconds(currentCard),
  )

  useEffect(() => {
    setInterviewSecondsLeft(getInterviewDurationSeconds(currentCard))
  }, [currentCard])

  useEffect(() => {
    if (!currentCard) {
      return
    }

    rememberDeckPosition(deck.id, currentCard.id)
  }, [currentCard, deck.id, rememberDeckPosition])

  useEffect(() => {
    if (format !== 'interview' || isAnswerVisible || interviewSecondsLeft <= 0) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setInterviewSecondsLeft((currentValue) => Math.max(0, currentValue - 1))
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [format, interviewSecondsLeft, isAnswerVisible])

  if (!currentCard) {
    return <Navigate replace to={`/decks/${deck.id}`} />
  }

  const handleRateCard = (status: ProgressStatus) => {
    setCardStatus(deck.id, currentCard.id, status)

    if (currentIndex >= cards.length - 1) {
      navigate(createStudyHref(deck.id, { format, scope, state: 'success' }))
      return
    }

    const nextCard = cards[currentIndex + 1]
    setCurrentIndex((previousIndex) => previousIndex + 1)
    setIsAnswerVisible(false)
    setIsLearnMoreOpen(false)
    rememberDeckPosition(deck.id, nextCard?.id ?? null)
  }

  const interviewDurationSeconds = getInterviewDurationSeconds(currentCard)
  const elapsedInterviewSeconds = interviewDurationSeconds - interviewSecondsLeft
  const isInterviewMode = format === 'interview'
  const isRevealLocked = isInterviewMode && interviewSecondsLeft > 0 && !isAnswerVisible
  const answerLabel = isInterviewMode ? 'Strong answer' : 'Answer'

  return (
    <section className="space-y-5">
      <Panel className="bg-[var(--retro-surface)] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--retro-line)]">
              {deck.title}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="accent">{getStudyScopeLabel(scope)}</Badge>
              <Badge>{getStudyFormatLabel(format)}</Badge>
              <Badge>{currentCard.difficulty}</Badge>
              {isInterviewMode ? <Badge tone="warning">{formatDuration(interviewDurationSeconds)}</Badge> : null}
            </div>
            <h2 className="mt-2 text-2xl font-black text-[var(--retro-ink)]">
              {currentIndex + 1} of {cards.length}
            </h2>
          </div>
          <Link
            className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--retro-line)] hover:text-[var(--retro-line-strong)]"
            to={`/decks/${deck.id}`}
          >
            Exit session
          </Link>
        </div>
        <div className="mt-4">
          <ProgressMeter current={currentIndex + 1} total={cards.length} />
        </div>
      </Panel>

      <Panel className="bg-[var(--retro-surface)] p-5">
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
                  key={`follow-up-${currentCard.id}`}
                  prompts={currentCard.followUps}
                />
              ) : null}
              {currentCard.learnMore || currentCard.exampleCode ? (
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
                    </div>
                  ) : null}
                </div>
              ) : null}
              <CardNoteEditor
                key={`note-${currentCard.id}`}
                note={currentNote}
                onClearNote={() => clearCardNote(deck.id, currentCard.id)}
                onSaveNote={(note) => setCardNote(deck.id, currentCard.id, note)}
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
                    <ProgressMeter current={elapsedInterviewSeconds} total={interviewDurationSeconds} />
                  </div>
                </Panel>
              ) : null}
            </div>
          )}
        </Panel>
      </Panel>

      <Panel className="sticky bottom-4 bg-[var(--retro-bg-strong)] p-4">
        {isAnswerVisible ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Button onClick={() => handleRateCard('learned')} type="button" variant="success">
              {isInterviewMode ? 'Strong' : 'Learned'}
            </Button>
            <Button onClick={() => handleRateCard('partial')} type="button" variant="warning">
              {isInterviewMode ? 'Decent' : 'Partial'}
            </Button>
            <Button onClick={() => handleRateCard('not_learned')} type="button" variant="danger">
              {isInterviewMode ? 'Needs work' : 'Not learned'}
            </Button>
          </div>
        ) : isInterviewMode ? (
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Button
              className="w-full"
              disabled={isRevealLocked}
              onClick={() => setIsAnswerVisible(true)}
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
          <Button className="w-full" onClick={() => setIsAnswerVisible(true)} type="button" variant="primary">
            Show answer
          </Button>
        )}
      </Panel>
    </section>
  )
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
