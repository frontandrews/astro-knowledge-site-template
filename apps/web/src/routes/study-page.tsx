import type { ProgressStatus } from '@prepdeck/schemas'
import type { Deck } from '@prepdeck/schemas'
import { getDeckById } from '@prepdeck/content'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { CardNoteEditor } from '@/components/card-note-editor'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { ProgressMeter } from '@/components/ui/progress-meter'
import { getDeckCounts } from '@/lib/progress'
import {
  getStudyCards,
  getStudyInitialIndex,
  getStudyScope,
  getStudyScopeLabel,
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
  const scope = getStudyScope(searchParams.get('scope'))

  if (!deckId || !deck) {
    return <Navigate replace to="/" />
  }

  const studyCards = getStudyCards(progressStore, deck, scope)

  if (successState) {
    return <StudySuccess deck={deck} scope={scope} />
  }

  const initialIndex = getStudyInitialIndex(progressStore, deck, scope, mode)

  if (initialIndex === null || studyCards.length === 0) {
    return <Navigate replace to={`/study/${deck.id}?state=success&scope=${scope}`} />
  }

  return (
    <StudySession
      cards={studyCards}
      deck={deck}
      initialIndex={initialIndex}
      key={`${deck.id}:${mode}:${scope}`}
      scope={scope}
    />
  )
}

function StudySuccess({ deck, scope }: { deck: Deck; scope: StudyScope }) {
  const { progressStore } = useProgress()
  const counts = getDeckCounts(progressStore, deck)
  const hasRemainingWeakCards = counts.partial + counts.notLearned > 0

  return (
    <Panel className="bg-[var(--retro-surface)] p-6">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--retro-line)]">
        Session complete
      </p>
      <h2 className="mt-3 text-3xl font-black text-[var(--retro-ink)]">
        {scope === 'weak'
          ? hasRemainingWeakCards
            ? 'You finished this weak-card session.'
            : 'You cleared every weak card in this deck.'
          : counts.allLearned
            ? 'Everything in this deck is marked learned.'
            : 'You have seen every card in this deck.'}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
        {scope === 'weak'
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
          <LinkButton to={`/study/${deck.id}?mode=start&scope=weak`} variant="secondary">
            Run weak cards again
          </LinkButton>
        ) : (
          <LinkButton to={`/study/${deck.id}?mode=start`} variant="secondary">
            Restart deck
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
  initialIndex,
  scope,
}: {
  cards: Deck['cards']
  deck: Deck
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

  useEffect(() => {
    if (!currentCard) {
      return
    }

    rememberDeckPosition(deck.id, currentCard.id)
  }, [currentCard, deck.id, rememberDeckPosition])

  if (!currentCard) {
    return <Navigate replace to={`/decks/${deck.id}`} />
  }

  const handleRateCard = (status: ProgressStatus) => {
    setCardStatus(deck.id, currentCard.id, status)

    if (currentIndex >= cards.length - 1) {
      navigate(`/study/${deck.id}?state=success&scope=${scope}`)
      return
    }

    const nextCard = cards[currentIndex + 1]
    setCurrentIndex((previousIndex) => previousIndex + 1)
    setIsAnswerVisible(false)
    setIsLearnMoreOpen(false)
    rememberDeckPosition(deck.id, nextCard?.id ?? null)
  }

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
              <Badge>{currentCard.difficulty}</Badge>
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
              <p className="text-base leading-7 text-[var(--retro-ink)]">
                {currentCard.shortAnswer}
              </p>
              <div>
                <p className="text-sm font-black text-[var(--retro-ink)]">Key points</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-white/80">
                  {currentCard.keyPoints.map((point) => (
                    <li key={point}>- {point}</li>
                  ))}
                </ul>
              </div>
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
                key={currentCard.id}
                note={currentNote}
                onClearNote={() => clearCardNote(deck.id, currentCard.id)}
                onSaveNote={(note) => setCardNote(deck.id, currentCard.id, note)}
              />
            </div>
          ) : (
            <p className="text-sm leading-7 text-white/80">
              Flip the card when you have your answer in mind, then rate how solid the
              answer actually felt.
            </p>
          )}
        </Panel>
      </Panel>

      <Panel className="sticky bottom-4 bg-[var(--retro-bg-strong)] p-4">
        {isAnswerVisible ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Button onClick={() => handleRateCard('learned')} type="button" variant="success">
              Learned
            </Button>
            <Button onClick={() => handleRateCard('partial')} type="button" variant="warning">
              Partial
            </Button>
            <Button onClick={() => handleRateCard('not_learned')} type="button" variant="danger">
              Not learned
            </Button>
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
