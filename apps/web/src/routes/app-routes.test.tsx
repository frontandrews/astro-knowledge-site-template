import { getDeckById } from '@prepdeck/content'
import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import {
  PREVIOUS_STORAGE_KEY,
  createEmptyProgressStore,
  setCardNote,
  setCardStatus,
} from '@/lib/progress'
import {
  createEmptySessionHistoryStore,
  recordCompletedSession,
} from '@/lib/session-history'
import {
  renderApp,
  seedMembership,
  seedPreferences,
  seedProgress,
  seedSessionHistory,
} from '@/test/test-utils'

function getReactDeck() {
  const deck = getDeckById('react-rendering-core')

  if (!deck) {
    throw new Error('react-rendering-core deck is required for tests')
  }

  return deck
}

describe('app routes', () => {
  it('shows a first-run quick-start panel when there is no local progress yet', () => {
    renderApp(['/'])

    expect(screen.getByRole('heading', { name: 'Start in under 10 minutes.' })).toBeInTheDocument()
    expect(screen.getByText('Step 1')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start Coding Challenges' })).toHaveAttribute(
      'href',
      '/study/coding-arrays-hashmaps-basics?mode=start',
    )
    expect(screen.getByRole('link', { name: 'Start JavaScript' })).toHaveAttribute(
      'href',
      '/study/javascript-runtime-core?mode=start',
    )
    expect(screen.getByRole('link', { name: 'Start Leadership' })).toHaveAttribute(
      'href',
      '/study/leadership-ownership-core?mode=start',
    )
  })

  it('renders the deck list with learned progress summaries', () => {
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    seedProgress(store)

    renderApp(['/'])

    expect(screen.getByRole('heading', { name: 'React' })).toBeInTheDocument()
    expect(screen.getAllByText('React Rendering Core').length).toBeGreaterThan(0)
    expect(screen.getByText('1 / 2 learned')).toBeInTheDocument()
    expect(screen.getByText('Ad-supported free plan')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Session presets' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Progress hub' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Open progress hub' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: 'Continue latest' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Start daily queue' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: 'Start mock interview' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Run interview rep' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Take a quick warm-up' })).toBeInTheDocument()
    expect(screen.getByText('Current streak')).toBeInTheDocument()
    expect(screen.getByText('Review debt')).toBeInTheDocument()
  })

  it('surfaces an install panel when the browser exposes the PWA prompt', async () => {
    const user = userEvent.setup()
    const prompt = vi.fn().mockResolvedValue(undefined)
    const event = new Event('beforeinstallprompt') as Event & {
      prompt: typeof prompt
      userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
    }

    Object.assign(event, {
      prompt,
      userChoice: Promise.resolve({
        outcome: 'accepted' as const,
        platform: 'web',
      }),
    })

    renderApp(['/'])
    window.dispatchEvent(event)

    expect(
      await screen.findByRole('heading', {
        name: 'Put it on the home screen like a real study app.',
      }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Install app' }))

    expect(prompt).toHaveBeenCalledTimes(1)
  })

  it('summarizes local progress on the home page without the full tracking sections', () => {
    let sessionHistory = createEmptySessionHistoryStore()
    sessionHistory = recordCompletedSession(
      sessionHistory,
      {
        cardCount: 7,
        deckId: null,
        deckTitle: null,
        format: 'flashcards',
        kind: 'daily_queue',
        learnedCount: 4,
        notLearnedCount: 1,
        partialCount: 2,
        scopeLabel: 'Daily queue',
        sessionLabel: 'Daily smart queue',
      },
      '2026-03-17T12:00:00.000Z',
    )
    seedSessionHistory(sessionHistory)

    renderApp(['/'])

    expect(screen.getByText('Current streak')).toBeInTheDocument()
    expect(screen.getByText('This week')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Progress hub' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Open progress hub' }).length).toBeGreaterThan(0)
    expect(screen.queryByText('Latest completed reps')).not.toBeInTheDocument()
  })

  it('filters the home deck list by selected topic', async () => {
    const user = userEvent.setup()

    renderApp(['/'])

    await user.click(screen.getByRole('button', { name: 'JavaScript (1)' }))

    const deckLibrary = screen.getByRole('region', { name: 'Deck library' })

    expect(within(deckLibrary).getByText('Showing 1 deck in JavaScript.')).toBeInTheDocument()
    expect(within(deckLibrary).getByText('JavaScript Runtime Core')).toBeInTheDocument()
    expect(within(deckLibrary).queryByText('React Rendering Core')).not.toBeInTheDocument()
  })

  it('filters the deck library by search and advanced status chips', async () => {
    const user = userEvent.setup()
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'partial')
    store = setCardNote(store, deck.id, deck.cards[1].id, 'Talk about broad rerenders')
    seedProgress(store)

    renderApp(['/'])

    const searchField = screen.getByLabelText('Search decks')
    await user.type(searchField, 'node')

    const deckLibrary = screen.getByRole('region', { name: 'Deck library' })
    expect(within(deckLibrary).getByText('Node Runtime Core')).toBeInTheDocument()
    expect(within(deckLibrary).queryByText('React Rendering Core')).not.toBeInTheDocument()

    await user.clear(searchField)
    await user.click(screen.getByRole('button', { name: 'Has notes' }))

    expect(within(deckLibrary).getByText('React Rendering Core')).toBeInTheDocument()
    expect(within(deckLibrary).getByText('1 note')).toBeInTheDocument()
    expect(within(deckLibrary).queryByText('Node Runtime Core')).not.toBeInTheDocument()
  })

  it('renders deck detail counts and actions', () => {
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'partial')
    seedProgress(store)

    renderApp(['/decks/react-rendering-core'])

    expect(screen.getByRole('heading', { name: 'React Rendering Core' })).toBeInTheDocument()
    expect(screen.getByText('Learned')).toBeInTheDocument()
    expect(screen.getByText('Partial')).toBeInTheDocument()
    expect(screen.getByText('Not learned')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start deck' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Interview mode' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Study weak cards' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Review progress' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset deck' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Full articles tied to this deck' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Read article' })).toHaveAttribute(
      'href',
      '/blog/react-derived-state-without-extra-bugs',
    )
  })

  it('uses the compact shell outside the home route', () => {
    renderApp(['/decks/react-rendering-core'])

    expect(screen.getByRole('link', { name: 'Back to library' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Progress' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Settings' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Premium' }).length).toBeGreaterThan(0)
    expect(
      screen.queryByRole('heading', {
        name: 'Technical interview prep that feels manageable.',
      }),
    ).not.toBeInTheDocument()
  })

  it('lets the user tune local goals and timer pace from settings', async () => {
    const user = userEvent.setup()

    renderApp(['/settings'])

    expect(screen.getByRole('heading', { name: 'Tune the app to your study rhythm.' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '2 sessions' }))
    await user.click(screen.getByRole('button', { name: '7 sessions' }))
    await user.click(screen.getByRole('button', { name: 'Use Deep' }))
    await user.click(screen.getByRole('button', { name: 'Let it sleep' }))

    const primaryNav = screen.getByRole('navigation', { name: 'Primary' })
    await user.click(within(primaryNav).getByRole('link', { name: 'Progress' }))

    expect(await screen.findByRole('heading', { name: 'Goal tracker' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '0 / 2' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '0 / 7' })).toBeInTheDocument()
  })

  it('shows X of Y and reaches the strong success state after rating every card as learned', async () => {
    const user = userEvent.setup()

    renderApp(['/study/react-rendering-core?mode=start'])

    expect(screen.getByRole('heading', { name: '1 of 2' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    await user.click(screen.getByRole('button', { name: 'Learned' }))

    expect(await screen.findByRole('heading', { name: '2 of 2' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    await user.click(screen.getByRole('button', { name: 'Learned' }))

    expect(
      await screen.findByRole('heading', {
        name: 'Everything in this deck is marked learned.',
      }),
    ).toBeInTheDocument()
  })

  it('reveals the answer when the gesture strip is swiped up', () => {
    renderApp(['/study/react-rendering-core?mode=start'])

    const gestureStrip = screen.getByTestId('gesture-strip')

    fireEvent.pointerDown(gestureStrip, { clientX: 120, clientY: 160 })
    fireEvent.pointerMove(gestureStrip, { clientX: 120, clientY: 72 })
    fireEvent.pointerUp(gestureStrip, { clientX: 120, clientY: 72 })

    expect(screen.getByText('Answer')).toBeInTheDocument()
    expect(
      screen.getByText('Because it duplicates a source of truth and creates synchronization bugs.'),
    ).toBeInTheDocument()
  })

  it('rates the current card from the gesture strip and advances the session', async () => {
    const user = userEvent.setup()

    renderApp(['/study/react-rendering-core?mode=start'])

    await user.click(screen.getByRole('button', { name: 'Show answer' }))

    const gestureStrip = screen.getByTestId('gesture-strip')

    fireEvent.pointerDown(gestureStrip, { clientX: 80, clientY: 120 })
    fireEvent.pointerMove(gestureStrip, { clientX: 176, clientY: 118 })
    fireEvent.pointerUp(gestureStrip, { clientX: 176, clientY: 118 })

    expect(await screen.findByRole('heading', { name: '2 of 2' })).toBeInTheDocument()
  })

  it('keeps the bottom navigation hidden during focused study routes', () => {
    renderApp(['/study/react-rendering-core?mode=start'])

    expect(screen.queryByRole('navigation', { name: 'Primary' })).not.toBeInTheDocument()
  })

  it('records a completed session and surfaces it on the home page after the run', async () => {
    const user = userEvent.setup()
    const studyRender = renderApp(['/study/react-rendering-core?mode=start'])

    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    await user.click(screen.getByRole('button', { name: 'Learned' }))
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    await user.click(screen.getByRole('button', { name: 'Learned' }))

    expect(
      await screen.findByRole('heading', {
        name: 'Everything in this deck is marked learned.',
      }),
    ).toBeInTheDocument()

    studyRender.unmount()

    renderApp(['/'])

    expect(screen.getByRole('heading', { name: 'Progress hub' })).toBeInTheDocument()
    expect(screen.getByText('Current streak')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Open progress hub' }).length).toBeGreaterThan(0)
  })

  it('renders the dedicated progress page with momentum, mastery, and local tools', () => {
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    store = setCardNote(store, deck.id, deck.cards[0].id, 'Lead with duplicated state risk')
    seedProgress(store)

    let sessionHistory = createEmptySessionHistoryStore()
    sessionHistory = recordCompletedSession(
      sessionHistory,
      {
        cardCount: 2,
        deckId: deck.id,
        deckTitle: deck.title,
        format: 'flashcards',
        kind: 'deck',
        learnedCount: 2,
        notLearnedCount: 0,
        partialCount: 0,
        scopeLabel: 'Full deck',
        sessionLabel: deck.title,
      },
      '2026-03-17T12:00:00.000Z',
    )
    seedSessionHistory(sessionHistory)

    renderApp(['/progress'])

    expect(screen.getByRole('heading', { name: 'Momentum' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Goal tracker' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Mastery snapshot' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Local tools' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Download a portfolio-ready progress card.' })).toBeInTheDocument()
    expect(screen.getByText('Latest completed reps')).toBeInTheDocument()
    expect(screen.getAllByText('React Rendering Core').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Download share card' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Export backup' })).toBeInTheDocument()
  })

  it('keeps learn-more content collapsed until the user opens it', async () => {
    const user = userEvent.setup()

    renderApp(['/study/react-rendering-core?mode=start'])

    await user.click(screen.getByRole('button', { name: 'Show answer' }))

    expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument()
    expect(
      screen.queryByText(/Derived state usually shows up when someone copies props into state/i),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /learn more/i }))

    expect(
      screen.getByText(/Derived state usually shows up when someone copies props into state/i),
    ).toBeInTheDocument()
    expect(screen.getByText('Code example')).toBeInTheDocument()
    expect(screen.getByText(/const visibleUsers = users\.filter/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Read full article' })).toHaveAttribute(
      'href',
      '/blog/react-derived-state-without-extra-bugs',
    )
  })

  it('runs interview mode with a timer gate and interview-specific rating labels', async () => {
    const user = userEvent.setup()

    renderApp(['/study/react-rendering-core?mode=start&format=interview'])

    expect(screen.getByText('Interview mode')).toBeInTheDocument()
    expect(screen.getByText('Time left')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: '0 of 90 complete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reveal answer' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'End early' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'End early' }))
    expect(screen.getByRole('button', { name: 'Reveal answer' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Reveal answer' }))

    expect(screen.getByText('Strong answer')).toBeInTheDocument()
    expect(screen.getByText('Common traps')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /follow-up drill/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Strong' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decent' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Needs work' })).toBeInTheDocument()
  })

  it('runs a mixed mock interview across multiple decks', async () => {
    const user = userEvent.setup()
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'partial')
    seedProgress(store)

    renderApp(['/mock-interview'])

    expect(screen.getByText('Mixed topics')).toBeInTheDocument()
    expect(screen.getByText('Mixed mock interview')).toBeInTheDocument()
    expect(screen.getByText('React Rendering Core')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'End early' }))
    await user.click(screen.getByRole('button', { name: 'Reveal answer' }))

    expect(screen.getByText('Strong answer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /follow-up drill/i })).toBeInTheDocument()
  })

  it('runs a daily smart queue with mixed flashcards', async () => {
    const user = userEvent.setup()
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'partial')
    store = setCardNote(store, deck.id, deck.cards[1].id, 'Lead with rerender blast radius')
    seedProgress(store)

    renderApp(['/daily-queue'])

    expect(screen.getByRole('heading', { name: '1 of 7' })).toBeInTheDocument()
    expect(screen.getAllByText('Daily smart queue').length).toBeGreaterThan(0)
    expect(screen.getByText('React Rendering Core')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show answer' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show answer' }))

    expect(screen.getByText('Because broad context updates can rerender large subtrees.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /your note/i })).toBeInTheDocument()
  })

  it('walks interview follow-ups one prompt at a time', async () => {
    const user = userEvent.setup()

    renderApp(['/study/react-rendering-core?mode=start&format=interview'])

    await user.click(screen.getByRole('button', { name: 'End early' }))
    await user.click(screen.getByRole('button', { name: 'Reveal answer' }))
    await user.click(screen.getByRole('button', { name: /follow-up drill/i }))

    expect(screen.getByText('Prompt 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('When is memoization enough instead of extra state?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next prompt' }))

    expect(screen.getByText('Prompt 2 of 2')).toBeInTheDocument()
    expect(screen.getByText('What is an example of bad derived state?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Finish follow-ups' }))

    expect(screen.getByText('Follow-ups complete')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Run again' })).toBeInTheDocument()
  })

  it('keeps personal notes collapsed until the user opens them in study mode', async () => {
    const user = userEvent.setup()

    renderApp(['/study/react-rendering-core?mode=start'])

    await user.click(screen.getByRole('button', { name: 'Show answer' }))

    expect(screen.getByRole('button', { name: /your note/i })).toBeInTheDocument()
    expect(
      screen.queryByPlaceholderText(/Capture your version of the answer/i),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /your note/i }))

    expect(
      screen.getByPlaceholderText(/Capture your version of the answer/i),
    ).toBeInTheDocument()
  })

  it('saves a study note and restores it after reload', async () => {
    const user = userEvent.setup()

    const firstRender = renderApp(['/study/react-rendering-core?mode=start'])

    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    await user.click(screen.getByRole('button', { name: /your note/i }))

    const noteField = screen.getByPlaceholderText(/Capture your version of the answer/i)
    await user.type(noteField, 'Mention duplicated source of truth')
    await user.tab()

    firstRender.unmount()

    renderApp(['/study/react-rendering-core?mode=start'])

    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    await user.click(screen.getByRole('button', { name: /your note/i }))

    expect(screen.getByDisplayValue('Mention duplicated source of truth')).toBeInTheDocument()
  })

  it('sends continue mode to success when every card has already been seen', async () => {
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'partial')
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'not_learned')
    seedProgress(store)

    renderApp(['/study/react-rendering-core?mode=continue'])

    expect(
      await screen.findByRole('heading', {
        name: 'You have seen every card in this deck.',
      }),
    ).toBeInTheDocument()
  })

  it('runs a weak-card session and clears the weak queue when cards are marked learned', async () => {
    const user = userEvent.setup()
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'partial')
    seedProgress(store)

    renderApp([`/study/${deck.id}?mode=start&scope=weak`])

    expect(screen.getByText('Weak cards only')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '1 of 1' })).toBeInTheDocument()
    expect(screen.getByText(deck.cards[1].question)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    await user.click(screen.getByRole('button', { name: 'Learned' }))

    expect(
      await screen.findByRole('heading', {
        name: 'You cleared every weak card in this deck.',
      }),
    ).toBeInTheDocument()
  })

  it('sends an empty weak-card session straight to the weak success state', async () => {
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'learned')
    seedProgress(store)

    renderApp([`/study/${deck.id}?mode=start&scope=weak`])

    expect(
      await screen.findByRole('heading', {
        name: 'You cleared every weak card in this deck.',
      }),
    ).toBeInTheDocument()
  })

  it('lets review mode unmark a learned card back to unseen', async () => {
    const user = userEvent.setup()
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    seedProgress(store)

    renderApp(['/decks/react-rendering-core/review'])

    expect(screen.getByText(deck.cards[0].question)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Unmark' }))

    expect(await screen.findByText('There are no cards in this bucket yet.')).toBeInTheDocument()
  })

  it('shows and edits saved note previews in review mode', async () => {
    const user = userEvent.setup()
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    store = setCardNote(store, deck.id, deck.cards[0].id, 'Lead with sync bugs and source of truth')
    seedProgress(store)

    const firstRender = renderApp(['/decks/react-rendering-core/review'])

    expect(screen.getByText('Lead with sync bugs and source of truth')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /your note/i }))
    const noteField = screen.getByDisplayValue('Lead with sync bugs and source of truth')
    await user.clear(noteField)
    await user.type(noteField, 'Start with duplicated state and synchronization risk')
    await user.tab()

    firstRender.unmount()

    renderApp(['/decks/react-rendering-core/review'])

    expect(
      screen.getByText('Start with duplicated state and synchronization risk'),
    ).toBeInTheDocument()
  })

  it('filters review cards by search and note-only mode', async () => {
    const user = userEvent.setup()
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'learned')
    store = setCardNote(store, deck.id, deck.cards[0].id, 'Lead with sync bugs and source of truth')
    seedProgress(store)

    renderApp(['/decks/react-rendering-core/review'])

    const searchField = screen.getByLabelText('Search current bucket')
    await user.type(searchField, 'sync bugs')

    expect(screen.getByText(deck.cards[0].question)).toBeInTheDocument()
    expect(screen.queryByText(deck.cards[1].question)).not.toBeInTheDocument()

    await user.clear(searchField)
    await user.click(screen.getByRole('button', { name: 'Has notes' }))

    expect(screen.getByText('Showing 1 of 2 cards in this bucket.')).toBeInTheDocument()
    expect(screen.getByText(deck.cards[0].question)).toBeInTheDocument()
    expect(screen.queryByText(deck.cards[1].question)).not.toBeInTheDocument()
  })

  it('migrates previously saved progress data into the current store on app load', () => {
    const deck = getReactDeck()

    window.localStorage.setItem(
      PREVIOUS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        decks: {
          [deck.id]: {
            lastCardId: deck.cards[0].id,
            lastStudiedAt: '2026-03-17T10:00:00.000Z',
            cards: {
              [deck.cards[0].id]: 'learned',
            },
          },
        },
      }),
    )

    renderApp(['/'])

    expect(screen.getByText('1 / 2 learned')).toBeInTheDocument()
  })

  it('renders the premium page with the monetization promise', () => {
    renderApp(['/premium'])

    expect(
      screen.getByRole('heading', {
        name: 'Premium removes ads and funds deeper practice features.',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Premium checkout is not live yet.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back home' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Preview premium locally' })).toBeInTheDocument()
  })

  it('applies saved goal targets to the home and progress summaries', () => {
    seedPreferences({
      dailyGoalTarget: 2,
      interviewTimerPreset: 'standard',
      keepScreenAwake: true,
      version: 1,
      weeklyGoalTarget: 7,
    })

    renderApp(['/'])

    expect(screen.getByText('0/2 today')).toBeInTheDocument()
  })

  it('hides ad slots when premium is active on the device', () => {
    seedMembership('premium')

    renderApp(['/'])

    expect(screen.queryByText('Ad-supported free plan')).not.toBeInTheDocument()
    expect(screen.getByText('Premium active')).toBeInTheDocument()
  })

  it('shows local backup controls on the progress page', () => {
    renderApp(['/progress'])

    expect(screen.getByRole('heading', { name: 'Own your progress on this device.' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Export backup' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Import backup' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset all progress' })).toBeInTheDocument()
  })
})
