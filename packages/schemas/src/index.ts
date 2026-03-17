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
  description: z.string().min(1),
  difficulty: difficultySchema,
  estimatedMinutes: z.number().int().positive(),
  tags: z.array(z.string().min(1)).default([]),
  cards: z.array(flashcardSchema).min(1),
})

export const deckManifestEntrySchema = z.object({
  id: z.string().min(1),
  topic: z.string().min(1),
  title: z.string().min(1),
  difficulty: difficultySchema,
  path: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
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

export const deckProgressSchema = z.object({
  lastCardId: z.string().nullable(),
  lastStudiedAt: z.string().nullable(),
  cards: z.record(z.string(), progressStatusSchema),
})

export const progressStoreSchema = z.object({
  version: z.literal(1),
  decks: z.record(z.string(), deckProgressSchema),
})

export type Flashcard = z.infer<typeof flashcardSchema>
export type Deck = z.infer<typeof deckSchema>
export type DeckManifest = z.infer<typeof deckManifestSchema>
export type DeckManifestEntry = z.infer<typeof deckManifestEntrySchema>
export type ProgressStatus = z.infer<typeof progressStatusSchema>
export type DeckProgress = z.infer<typeof deckProgressSchema>
export type ProgressStore = z.infer<typeof progressStoreSchema>
