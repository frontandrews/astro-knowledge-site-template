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
import { setPwaStatus } from '@/lib/pwa-status'
import {
  createEmptySessionHistoryStore,
  recordCompletedSession,
} from '@/lib/session-history'
import { testIds } from '@/lib/test-ids'
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

    expect(screen.getByTestId(testIds.firstRun.page)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.firstRun.startDeckLink('coding-arrays-hashmaps-basics'))).toHaveAttribute(
      'href',
      '/study/coding-arrays-hashmaps-basics?mode=start',
    )
    expect(screen.getByTestId(testIds.firstRun.startDeckLink('ai-engineering-rag-evals-core'))).toHaveAttribute(
      'href',
      '/study/ai-engineering-rag-evals-core?mode=start',
    )
    expect(screen.getByTestId(testIds.firstRun.startDeckLink('delivery-scope-risk-core'))).toHaveAttribute(
      'href',
      '/study/delivery-scope-risk-core?mode=start',
    )
  })

  it('renders the deck list with learned progress summaries', () => {
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    seedProgress(store)

    renderApp(['/'])

    expect(screen.getByTestId(testIds.home.page)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.home.deckLibrary)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.deckCard(deck.id))).toBeInTheDocument()
    expect(screen.getByText('1 / 2 learned')).toBeInTheDocument()
    expect(screen.getByTestId(testIds.home.presetCard('continue'))).toBeInTheDocument()
    expect(screen.getByTestId(testIds.home.progressSection)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.appShell.homeProgressLink)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.home.presetLink('continue'))).toBeInTheDocument()
    expect(screen.getByTestId(testIds.home.presetLink('daily'))).toBeInTheDocument()
    expect(screen.getByTestId(testIds.home.presetLink('mock'))).toBeInTheDocument()
    expect(screen.getByTestId(testIds.home.presetLink('interview'))).toBeInTheDocument()
    expect(screen.getByTestId(testIds.home.presetLink('warmup'))).toBeInTheDocument()
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

    expect(await screen.findByTestId(testIds.install.panel)).toBeInTheDocument()

    await user.click(screen.getByTestId(testIds.install.installButton))

    expect(prompt).toHaveBeenCalledTimes(1)
  })

  it('shows an update banner when a newer app version is ready', () => {
    setPwaStatus({
      needRefresh: true,
      offlineReady: false,
      updateServiceWorker: vi.fn(),
    })

    renderApp(['/'])

    expect(screen.getByTestId(testIds.pwa.panel)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.pwa.reloadButton)).toBeInTheDocument()
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

    expect(screen.getByTestId(testIds.home.progressSection)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.appShell.homeProgressLink)).toBeInTheDocument()
  })

  it('filters the home deck list by selected track chip', async () => {
    const user = userEvent.setup()

    renderApp(['/'])

    await user.click(screen.getByTestId(testIds.home.trackFilter('ai-engineering')))

    const deckLibrary = screen.getByTestId(testIds.home.deckLibrary)

    expect(within(deckLibrary).getAllByText('AI Engineering Core').length).toBeGreaterThan(0)
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

    const searchField = screen.getByTestId(testIds.home.deckSearch)
    await user.type(searchField, 'node')

    const deckLibrary = screen.getByTestId(testIds.home.deckLibrary)
    expect(within(deckLibrary).getByText('Node Runtime Core')).toBeInTheDocument()
    expect(within(deckLibrary).queryByText('React Rendering Core')).not.toBeInTheDocument()

    await user.clear(searchField)
    await user.click(screen.getByTestId(testIds.home.statusFilter('has_notes')))

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

    expect(screen.getByTestId(testIds.deckDetail.page)).toBeInTheDocument()
    expect(screen.getByText('1 mastered')).toBeInTheDocument()
    expect(screen.getByText('1 need review')).toBeInTheDocument()
    expect(screen.getByTestId(testIds.deckDetail.startButton)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.deckDetail.interviewButton)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.deckDetail.continueButton)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.deckDetail.weakCardsButton)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.deckDetail.reviewLink)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.deckDetail.resetButton)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.deckDetail.learnMoreSection)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.deckDetail.learnMoreLink('en/guides/state-and-ui-thinking/react-derived-state-without-extra-bugs'))).toHaveAttribute(
      'href',
      '/en/guides/state-and-ui-thinking/react-derived-state-without-extra-bugs',
    )
  })

  it('uses the compact shell outside the home route', () => {
    renderApp(['/decks/react-rendering-core'])

    expect(screen.getByTestId(testIds.appShell.compactBackLink)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.appShell.primaryNav)).toBeInTheDocument()
    expect(screen.getAllByTestId(testIds.appShell.homeProgressLink).length).toBeGreaterThan(0)
    expect(screen.getAllByTestId(testIds.appShell.homeSettingsLink).length).toBeGreaterThan(0)
    expect(screen.getAllByTestId(testIds.appShell.homePremiumLink).length).toBeGreaterThan(0)
    expect(screen.queryByTestId(testIds.home.page)).not.toBeInTheDocument()
  })

  it('lets the user tune local goals and timer pace from settings', async () => {
    const user = userEvent.setup()

    const settingsRender = renderApp(['/settings'])

    expect(screen.getByTestId(testIds.settings.page)).toBeInTheDocument()

    await user.click(screen.getByTestId(testIds.settings.dailyTarget(2)))
    await user.click(screen.getByTestId(testIds.settings.weeklyTarget(7)))
    await user.click(screen.getByTestId(testIds.settings.timerPreset('deep')))
    await user.click(screen.getByTestId(testIds.settings.hapticsOff))
    await user.click(screen.getByTestId(testIds.settings.letSleep))

    settingsRender.unmount()
    renderApp(['/progress'])

    const progressPage = await screen.findByTestId(testIds.progress.page)
    expect(progressPage).toBeInTheDocument()
    expect(within(screen.getByTestId(testIds.progress.goalTracker)).getByText('0 / 2')).toBeInTheDocument()
    expect(within(screen.getByTestId(testIds.progress.goalTracker)).getByText('0 / 7')).toBeInTheDocument()
  })

  it('shows X of Y and reaches the strong success state after rating every card as learned', async () => {
    const user = userEvent.setup()

    renderApp(['/study/react-rendering-core?mode=start'])

    expect(screen.getByTestId(testIds.study.currentStep)).toHaveTextContent('1 of 2')

    await user.click(screen.getByTestId(testIds.study.revealButton))
    await user.click(screen.getByTestId(testIds.study.rateButton('learned')))

    expect(await screen.findByTestId(testIds.study.currentStep)).toHaveTextContent('2 of 2')

    await user.click(screen.getByTestId(testIds.study.revealButton))
    await user.click(screen.getByTestId(testIds.study.rateButton('learned')))

    const successPage = await screen.findByTestId(testIds.study.successPage)
    expect(successPage).toHaveAttribute('data-success-state', 'deck_mastered')
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

    await user.click(screen.getByTestId(testIds.study.revealButton))

    const gestureStrip = screen.getByTestId('gesture-strip')

    fireEvent.pointerDown(gestureStrip, { clientX: 80, clientY: 120 })
    fireEvent.pointerMove(gestureStrip, { clientX: 176, clientY: 118 })
    fireEvent.pointerUp(gestureStrip, { clientX: 176, clientY: 118 })

    expect(await screen.findByTestId(testIds.study.currentStep)).toHaveTextContent('2 of 2')
  })

  it('keeps the bottom navigation hidden during focused study routes', () => {
    renderApp(['/study/react-rendering-core?mode=start'])

    expect(screen.queryByTestId(testIds.appShell.primaryNav)).not.toBeInTheDocument()
  })

  it('records a completed session and surfaces it on the home page after the run', async () => {
    const user = userEvent.setup()
    const studyRender = renderApp(['/study/react-rendering-core?mode=start'])

    await user.click(screen.getByTestId(testIds.study.revealButton))
    await user.click(screen.getByTestId(testIds.study.rateButton('learned')))
    await user.click(screen.getByTestId(testIds.study.revealButton))
    await user.click(screen.getByTestId(testIds.study.rateButton('learned')))

    const successPage = await screen.findByTestId(testIds.study.successPage)
    expect(successPage).toHaveAttribute('data-success-state', 'deck_mastered')

    studyRender.unmount()

    renderApp(['/'])

    expect(screen.getByTestId(testIds.home.progressSection)).toBeInTheDocument()
    expect(screen.getAllByTestId(testIds.appShell.homeProgressLink).length).toBeGreaterThan(0)
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

    expect(screen.getByTestId(testIds.progress.momentum)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.progress.goalTracker)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.progress.masterySnapshot)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.progress.localTools)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.progress.shareCardPanel)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.progress.shareCardDownloadButton)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.dataControls.exportButton)).toBeInTheDocument()
    expect(screen.getAllByText('React Rendering Core').length).toBeGreaterThan(0)
  })

  it('keeps learn-more content collapsed until the user opens it', async () => {
    const user = userEvent.setup()

    renderApp(['/study/react-rendering-core?mode=start'])

    await user.click(screen.getByTestId(testIds.study.revealButton))

    expect(
      screen.queryByText(/Derived state usually shows up when someone copies props into state/i),
    ).not.toBeInTheDocument()

    await user.click(screen.getByTestId(testIds.study.learnMoreToggle))

    expect(
      screen.getByText(/Derived state usually shows up when someone copies props into state/i),
    ).toBeInTheDocument()
    expect(screen.getByText('Code example')).toBeInTheDocument()
    expect(screen.getByText(/const visibleUsers = users\.filter/i)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.study.learnMoreLink)).toHaveAttribute(
      'href',
      '/en/guides/state-and-ui-thinking/react-derived-state-without-extra-bugs',
    )
  })

  it('runs interview mode with a timer gate and interview-specific rating labels', async () => {
    const user = userEvent.setup()

    renderApp(['/study/react-rendering-core?mode=start&format=interview'])

    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(1)
    expect(screen.getByTestId(testIds.study.revealButton)).toBeDisabled()
    expect(screen.getByTestId(testIds.study.endEarlyButton)).toBeInTheDocument()

    await user.click(screen.getByTestId(testIds.study.endEarlyButton))
    expect(screen.getByTestId(testIds.study.revealButton)).toBeEnabled()

    await user.click(screen.getByTestId(testIds.study.revealButton))

    expect(screen.getByTestId(testIds.study.followUpToggle)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.study.rateButton('learned'))).toBeInTheDocument()
    expect(screen.getByTestId(testIds.study.rateButton('partial'))).toBeInTheDocument()
    expect(screen.getByTestId(testIds.study.rateButton('not_learned'))).toBeInTheDocument()
  })

  it('runs a mixed mock interview across multiple decks', async () => {
    const user = userEvent.setup()
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'partial')
    seedProgress(store)

    renderApp(['/mock-interview'])

    expect(screen.getByText('React Rendering Core')).toBeInTheDocument()

    await user.click(screen.getByTestId(testIds.study.endEarlyButton))
    await user.click(screen.getByTestId(testIds.study.revealButton))

    expect(screen.getByTestId(testIds.study.followUpToggle)).toBeInTheDocument()
  })

  it('runs a daily smart queue with mixed flashcards', async () => {
    const user = userEvent.setup()
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'partial')
    store = setCardNote(store, deck.id, deck.cards[1].id, 'Lead with rerender blast radius')
    seedProgress(store)

    renderApp(['/daily-queue'])

    expect(screen.getByTestId(testIds.study.currentStep)).toHaveTextContent('1 of 7')
    expect(screen.getAllByText('Daily smart queue').length).toBeGreaterThan(0)
    expect(screen.getByText('React Rendering Core')).toBeInTheDocument()
    expect(screen.getByTestId(testIds.study.revealButton)).toBeInTheDocument()

    await user.click(screen.getByTestId(testIds.study.revealButton))

    expect(screen.getByText('Because broad context updates can rerender large subtrees.')).toBeInTheDocument()
    expect(screen.getByTestId(`${testIds.study.noteToggle}`)).toBeInTheDocument()
  })

  it('walks interview follow-ups one prompt at a time', async () => {
    const user = userEvent.setup()

    renderApp(['/study/react-rendering-core?mode=start&format=interview'])

    await user.click(screen.getByTestId(testIds.study.endEarlyButton))
    await user.click(screen.getByTestId(testIds.study.revealButton))
    await user.click(screen.getByTestId(testIds.study.followUpToggle))

    expect(screen.getByText('Prompt 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('When is memoization enough instead of extra state?')).toBeInTheDocument()

    await user.click(screen.getByTestId(testIds.study.followUpNext))

    expect(screen.getByText('Prompt 2 of 2')).toBeInTheDocument()
    expect(screen.getByText('What is an example of bad derived state?')).toBeInTheDocument()

    await user.click(screen.getByTestId(testIds.study.followUpFinish))

    expect(screen.getByText('Follow-ups complete')).toBeInTheDocument()
    expect(screen.getByTestId(testIds.study.followUpRunAgain)).toBeInTheDocument()
  })

  it('keeps personal notes collapsed until the user opens them in study mode', async () => {
    const user = userEvent.setup()

    renderApp(['/study/react-rendering-core?mode=start'])

    await user.click(screen.getByTestId(testIds.study.revealButton))

    expect(screen.getByTestId(`${testIds.study.noteToggle}`)).toBeInTheDocument()
    expect(
      screen.queryByPlaceholderText(/Capture your version of the answer/i),
    ).not.toBeInTheDocument()

    await user.click(screen.getByTestId(`${testIds.study.noteToggle}`))

    expect(
      screen.getByTestId(`${testIds.study.noteTextarea}`),
    ).toBeInTheDocument()
  })

  it('saves a study note and restores it after reload', async () => {
    const user = userEvent.setup()

    const firstRender = renderApp(['/study/react-rendering-core?mode=start'])

    await user.click(screen.getByTestId(testIds.study.revealButton))
    await user.click(screen.getByTestId(`${testIds.study.noteToggle}`))

    const noteField = screen.getByTestId(`${testIds.study.noteTextarea}`)
    await user.type(noteField, 'Mention duplicated source of truth')
    await user.tab()

    firstRender.unmount()

    renderApp(['/study/react-rendering-core?mode=start'])

    await user.click(screen.getByTestId(testIds.study.revealButton))
    await user.click(screen.getByTestId(`${testIds.study.noteToggle}`))

    expect(screen.getByDisplayValue('Mention duplicated source of truth')).toBeInTheDocument()
  })

  it('sends continue mode to success when every card has already been seen', async () => {
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'partial')
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'not_learned')
    seedProgress(store)

    renderApp(['/study/react-rendering-core?mode=continue'])

    const successPage = await screen.findByTestId(testIds.study.successPage)
    expect(successPage).toHaveAttribute('data-success-state', 'deck_seen')
  })

  it('runs a weak-card session and clears the weak queue when cards are marked learned', async () => {
    const user = userEvent.setup()
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'partial')
    seedProgress(store)

    renderApp([`/study/${deck.id}?mode=start&scope=weak`])

    expect(screen.getByTestId(testIds.study.currentStep)).toHaveTextContent('1 of 1')
    expect(screen.getByText(deck.cards[1].question)).toBeInTheDocument()

    await user.click(screen.getByTestId(testIds.study.revealButton))
    await user.click(screen.getByTestId(testIds.study.rateButton('learned')))

    const successPage = await screen.findByTestId(testIds.study.successPage)
    expect(successPage).toHaveAttribute('data-success-state', 'weak_cleared')
  })

  it('sends an empty weak-card session straight to the weak success state', async () => {
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    store = setCardStatus(store, deck.id, deck.cards[1].id, 'learned')
    seedProgress(store)

    renderApp([`/study/${deck.id}?mode=start&scope=weak`])

    const successPage = await screen.findByTestId(testIds.study.successPage)
    expect(successPage).toHaveAttribute('data-success-state', 'weak_cleared')
  })

  it('lets review mode unmark a learned card back to unseen', async () => {
    const user = userEvent.setup()
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    seedProgress(store)

    renderApp(['/decks/react-rendering-core/review'])

    expect(screen.getByText(deck.cards[0].question)).toBeInTheDocument()

    await user.click(screen.getByTestId(testIds.review.unmarkButton(deck.cards[0].id)))

    expect(await screen.findByTestId(testIds.review.emptyState)).toBeInTheDocument()
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

    await user.click(screen.getByTestId(testIds.review.noteToggle(deck.cards[0].id)))
    const noteField = screen.getByTestId(testIds.review.noteTextarea(deck.cards[0].id))
    await user.clear(noteField)
    await user.type(noteField, 'Start with duplicated state and synchronization risk')
    await user.tab()

    firstRender.unmount()

    renderApp(['/decks/react-rendering-core/review'])

    expect(screen.getByText('Start with duplicated state and synchronization risk')).toBeInTheDocument()
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

    const searchField = screen.getByTestId(testIds.review.searchInput)
    await user.type(searchField, 'sync bugs')

    expect(screen.getByText(deck.cards[0].question)).toBeInTheDocument()
    expect(screen.queryByText(deck.cards[1].question)).not.toBeInTheDocument()

    await user.clear(searchField)
    await user.click(screen.getByTestId(testIds.review.quickFilter('notes')))

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

    expect(screen.queryByTestId(testIds.firstRun.page)).not.toBeInTheDocument()
    expect(screen.getByTestId(testIds.home.presetCard('continue'))).toBeInTheDocument()
  })

  it('renders the premium page with the monetization promise', () => {
    renderApp(['/premium'])

    expect(screen.getByTestId(testIds.premium.page)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.premium.statusPanel)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.premium.previewButton)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.premium.freePlanLink)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.appShell.primaryNav)).toBeInTheDocument()
  })

  it('applies saved goal targets to the progress page summaries', () => {
    seedPreferences({
      dailyGoalTarget: 2,
      hapticsEnabled: true,
      interviewTimerPreset: 'standard',
      keepScreenAwake: true,
      version: 1,
      weeklyGoalTarget: 7,
    })

    renderApp(['/progress'])

    expect(screen.getByTestId(testIds.progress.goalTracker)).toBeInTheDocument()
    expect(within(screen.getByTestId(testIds.progress.goalTracker)).getByText('0 / 2')).toBeInTheDocument()
    expect(within(screen.getByTestId(testIds.progress.goalTracker)).getByText('0 / 7')).toBeInTheDocument()
  })

  it('hides ad slots when premium is active on the device', () => {
    seedMembership('premium')

    renderApp(['/'])

    expect(screen.queryByTestId(testIds.adSlot('home-primary'))).not.toBeInTheDocument()
    expect(screen.getAllByTestId(testIds.appShell.homePremiumLink).length).toBeGreaterThan(0)
  })

  it('shows local backup controls on the progress page', () => {
    renderApp(['/progress'])

    expect(screen.getByTestId(testIds.dataControls.root)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.dataControls.exportButton)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.dataControls.importButton)).toBeInTheDocument()
    expect(screen.getByTestId(testIds.dataControls.resetAllButton)).toBeInTheDocument()
  })
})
