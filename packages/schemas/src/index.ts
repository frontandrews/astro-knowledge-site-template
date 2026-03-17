import { z } from 'zod'

export const flashcardTypeSchema = z.enum([
  'concept',
  'tradeoff',
  'scenario',
  'behavioral',
])

export const difficultySchema = z.enum(['easy', 'medium', 'hard'])

export const flashcardSchema = z.object({
  id: z.string().min(1),
  type: flashcardTypeSchema,
  difficulty: difficultySchema,
  question: z.string().min(1),
  shortAnswer: z.string().min(1),
  expectedAnswer: z.string().min(1),
  keyPoints: z.array(z.string().min(1)).min(1),
  learnMore: z.string().min(1).optional(),
  learnMoreSlug: z.string().min(1).optional(),
  exampleCode: z.string().min(1).optional(),
  exampleLanguage: z.string().min(1).optional(),
  commonTraps: z.array(z.string().min(1)).default([]),
  followUps: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).min(1),
  sourceRefs: z.array(z.string().min(1)).default([]),
})

export const deckSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  topic: z.string().min(1),
  track: z.string().min(1),
  description: z.string().min(1),
  difficulty: difficultySchema,
  estimatedMinutes: z.number().int().positive(),
  tags: z.array(z.string().min(1)).default([]),
  cards: z.array(flashcardSchema).min(1),
})

export const deckManifestEntrySchema = z.object({
  id: z.string().min(1),
  topic: z.string().min(1),
  track: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: difficultySchema,
  path: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
  cardCount: z.number().int().positive(),
  tags: z.array(z.string().min(1)).default([]),
  searchTerms: z.array(z.string().min(1)).default([]),
})

export const deckManifestSchema = z.object({
  version: z.number().int().positive(),
  decks: z.array(deckManifestEntrySchema).min(1),
})

export const progressStatusSchema = z.enum([
  'unseen',
  'learned',
  'partial',
  'not_learned',
])

export const sessionHistoryKindSchema = z.enum([
  'deck',
  'daily_queue',
  'mock_interview',
])

export const sessionHistoryFormatSchema = z.enum([
  'flashcards',
  'interview',
])

export const progressV1DeckSchema = z.object({
  lastCardId: z.string().nullable(),
  lastStudiedAt: z.string().nullable(),
  cards: z.record(z.string(), progressStatusSchema),
})

export const progressV1StoreSchema = z.object({
  version: z.literal(1),
  decks: z.record(z.string(), progressV1DeckSchema),
})

export const deckUserDataSchema = z.object({
  lastCardId: z.string().nullable(),
  lastStudiedAt: z.string().nullable(),
  cards: z.record(z.string(), progressStatusSchema),
  notes: z.record(z.string(), z.string().min(1)).default({}),
})

export const userDataStoreSchema = z.object({
  version: z.literal(1),
  decks: z.record(z.string(), deckUserDataSchema),
})

export const sessionHistoryEntrySchema = z.object({
  id: z.string().min(1),
  completedAt: z.string().min(1),
  kind: sessionHistoryKindSchema,
  format: sessionHistoryFormatSchema,
  sessionLabel: z.string().min(1),
  scopeLabel: z.string().min(1),
  deckId: z.string().nullable(),
  deckTitle: z.string().nullable(),
  cardCount: z.number().int().positive(),
  learnedCount: z.number().int().nonnegative(),
  partialCount: z.number().int().nonnegative(),
  notLearnedCount: z.number().int().nonnegative(),
})

export const sessionHistoryStoreSchema = z.object({
  version: z.literal(1),
  sessions: z.array(sessionHistoryEntrySchema).default([]),
})

export type Flashcard = z.infer<typeof flashcardSchema>
export type Deck = z.infer<typeof deckSchema>
export type DeckManifest = z.infer<typeof deckManifestSchema>
export type DeckManifestEntry = z.infer<typeof deckManifestEntrySchema>
export type ProgressStatus = z.infer<typeof progressStatusSchema>
export type SessionHistoryKind = z.infer<typeof sessionHistoryKindSchema>
export type SessionHistoryFormat = z.infer<typeof sessionHistoryFormatSchema>
export type ProgressV1Deck = z.infer<typeof progressV1DeckSchema>
export type ProgressV1Store = z.infer<typeof progressV1StoreSchema>
export type DeckUserData = z.infer<typeof deckUserDataSchema>
export type UserDataStore = z.infer<typeof userDataStoreSchema>
export type SessionHistoryEntry = z.infer<typeof sessionHistoryEntrySchema>
export type SessionHistoryStore = z.infer<typeof sessionHistoryStoreSchema>
export type DeckProgress = DeckUserData
export type ProgressStore = UserDataStore
