import { getDeckById } from '@prepdeck/content'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  PREVIOUS_STORAGE_KEY,
  createEmptyProgressStore,
  setCardNote,
  setCardStatus,
} from '@/lib/progress'
import { renderApp, seedProgress } from '@/test/test-utils'

function getReactDeck() {
  const deck = getDeckById('react-rendering-core')

  if (!deck) {
    throw new Error('react-rendering-core deck is required for tests')
  }

  return deck
}

describe('app routes', () => {
  it('renders the deck list with learned progress summaries', () => {
    const deck = getReactDeck()
    let store = createEmptyProgressStore()
    store = setCardStatus(store, deck.id, deck.cards[0].id, 'learned')
    seedProgress(store)

    renderApp(['/'])

    expect(screen.getByRole('heading', { name: 'React' })).toBeInTheDocument()
    expect(screen.getAllByText('React Rendering Core').length).toBeGreaterThan(0)
    expect(screen.getByText('1 / 2 learned')).toBeInTheDocument()
  })

  it('filters the home deck list by selected topic', async () => {
    const user = userEvent.setup()

    renderApp(['/'])

    await user.click(screen.getByRole('button', { name: 'JavaScript (1)' }))

    expect(screen.getByRole('heading', { name: 'JavaScript' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'React' })).not.toBeInTheDocument()
    expect(screen.getByText('JavaScript Runtime Core')).toBeInTheDocument()
    expect(screen.queryByText('React Rendering Core')).not.toBeInTheDocument()
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
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Review progress' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset deck' })).toBeInTheDocument()
  })

  it('uses the compact shell outside the home route', () => {
    renderApp(['/decks/react-rendering-core'])

    expect(screen.getByRole('link', { name: 'Back to library' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', {
        name: 'Technical interview prep that feels manageable.',
      }),
    ).not.toBeInTheDocument()
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
})
