import { deckSchema, type Deck } from '@prepdeck/schemas'

import { getDeckSummaries } from './manifest'
import codingArraysHashmapsBasicsRaw from './data/decks/coding-interview/coding-arrays-hashmaps-basics.json'
import codingStacksQueuesBinarySearchRaw from './data/decks/coding-interview/coding-stacks-queues-binary-search.json'
import codingTwoPointersSlidingWindowRaw from './data/decks/coding-interview/coding-two-pointers-sliding-window.json'
import aiEngineeringRagEvalsCoreRaw from './data/decks/ai-engineering/ai-engineering-rag-evals-core.json'
import deliveryScopeRiskCoreRaw from './data/decks/delivery/delivery-scope-risk-core.json'
import englishTechCommunicationCoreRaw from './data/decks/english/english-tech-communication-core.json'
import javascriptRuntimeCoreRaw from './data/decks/javascript/javascript-runtime-core.json'
import leadershipOwnershipCoreRaw from './data/decks/leadership/leadership-ownership-core.json'
import nodeRuntimeCoreRaw from './data/decks/node/node-runtime-core.json'
import reactRenderingCoreRaw from './data/decks/react/react-rendering-core.json'
import systemDesignCoreTradeoffsRaw from './data/decks/system-design/system-design-core-tradeoffs.json'

const rawDecks = {
  'ai-engineering-rag-evals-core': aiEngineeringRagEvalsCoreRaw,
  'coding-arrays-hashmaps-basics': codingArraysHashmapsBasicsRaw,
  'coding-stacks-queues-binary-search': codingStacksQueuesBinarySearchRaw,
  'coding-two-pointers-sliding-window': codingTwoPointersSlidingWindowRaw,
  'delivery-scope-risk-core': deliveryScopeRiskCoreRaw,
  'english-tech-communication-core': englishTechCommunicationCoreRaw,
  'javascript-runtime-core': javascriptRuntimeCoreRaw,
  'leadership-ownership-core': leadershipOwnershipCoreRaw,
  'node-runtime-core': nodeRuntimeCoreRaw,
  'react-rendering-core': reactRenderingCoreRaw,
  'system-design-core-tradeoffs': systemDesignCoreTradeoffsRaw,
} as const

const parsedDeckEntries = Object.entries(rawDecks).map(([deckId, rawDeck]) => {
  const deck = deckSchema.parse(rawDeck)

  if (deck.id !== deckId) {
    throw new Error(`Deck id mismatch for ${deckId}`)
  }

  return [deckId, deck] as const
})

const decksById = Object.fromEntries(parsedDeckEntries) as Record<string, Deck>
const summariesById = Object.fromEntries(
  getDeckSummaries().map((summary) => [summary.id, summary]),
) as Record<string, ReturnType<typeof getDeckSummaries>[number]>

for (const [deckId, deck] of Object.entries(decksById)) {
  const summary = summariesById[deckId]

  if (!summary) {
    throw new Error(`Deck ${deckId} exists in registry but is missing from manifest`)
  }

  if (
    summary.cardCount !== deck.cards.length ||
    summary.title !== deck.title ||
    summary.track !== deck.track ||
    summary.topic !== deck.topic ||
    summary.estimatedMinutes !== deck.estimatedMinutes
  ) {
    throw new Error(`Deck ${deckId} is out of sync with the manifest summary`)
  }
}

for (const summary of getDeckSummaries()) {
  if (!decksById[summary.id]) {
    throw new Error(`Deck ${summary.id} is listed in manifest but missing from registry`)
  }
}

export function getDeckById(deckId: string): Deck | undefined {
  return decksById[deckId]
}

export function getAllDecks(): Deck[] {
  return getDeckSummaries()
    .map((summary) => decksById[summary.id])
    .filter((deck): deck is Deck => Boolean(deck))
}
