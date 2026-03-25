import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { TOPIC_DEFINITIONS } from '@template/content'

const topicIdSchema = z.enum(TOPIC_DEFINITIONS.map((topic) => topic.id) as [string, ...string[]])

const articles = defineCollection({
  loader: glob({
    base: './.content/articles',
    pattern: '**/*.md',
  }),
  schema: z.object({
    category: z.string().min(1).default('Programming'),
    branchId: z.string().min(1).optional(),
    description: z.string().min(1),
    articleId: z.string().min(1),
    kind: z.enum(['article', 'note']).default('article'),
    level: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    locale: z.string().min(1).default('en'),
    order: z.number().int().nonnegative().default(100),
    path: z.array(z.string().min(1)).min(1),
    pillarId: z.string().min(1).optional(),
    practiceChecklist: z.array(z.string()).default([]),
    pubDate: z.coerce.date(),
    relationships: z.array(z.string().min(1)).default([]),
    relatedDeckIds: z.array(z.string()).default([]),
    readiness: z.object({
      draft_complete: z.boolean().default(false),
      examples_added: z.boolean().default(false),
      interview_angle: z.boolean().default(false),
      language_simple: z.boolean().default(false),
      practice_items_filled: z.boolean().default(false),
      reasoning_complete: z.boolean().default(false),
      relationships_set: z.boolean().default(false),
      senior_layer: z.boolean().default(false),
      takeaways_filled: z.boolean().default(false),
      voice_human: z.boolean().default(false),
    }),
    summary: z.string().min(1),
    status: z.enum(['active', 'archived', 'draft']).default('draft'),
    takeaways: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    title: z.string().min(1),
    topic: z.string().optional(),
    topicIds: z.array(topicIdSchema).min(1),
    trackEligible: z.boolean().default(true),
    updatedDate: z.coerce.date().optional(),
  }),
})

const glossary = defineCollection({
  loader: glob({
    base: './.content/glossary',
    pattern: '**/*.md',
  }),
  schema: z.object({
    aliases: z.array(z.string().min(1)).default([]),
    description: z.string().min(1),
    locale: z.string().min(1).default('en'),
    pubDate: z.coerce.date(),
    status: z.enum(['active', 'archived', 'draft']).default('active'),
    summary: z.string().min(1),
    tags: z.array(z.string()).default([]),
    termId: z.string().min(1),
    title: z.string().min(1),
    updatedDate: z.coerce.date().optional(),
  }),
})

const concepts = defineCollection({
  loader: glob({
    base: './.content/concepts',
    pattern: '**/*.md',
  }),
  schema: z.object({
    conceptId: z.string().min(1),
    description: z.string().min(1),
    domainId: z.string().min(1),
    groupId: z.string().min(1),
    locale: z.string().min(1).default('en'),
    pubDate: z.coerce.date(),
    relatedArticleIds: z.array(z.string().min(1)).default([]),
    status: z.enum(['active', 'archived', 'draft']).default('active'),
    summary: z.string().min(1),
    tags: z.array(z.string()).default([]),
    title: z.string().min(1),
    updatedDate: z.coerce.date().optional(),
  }),
})

const challenges = defineCollection({
  loader: glob({
    base: './.content/challenges',
    pattern: '**/*.md',
  }),
  schema: z.object({
    branchId: z.string().min(1).optional(),
    commonMistakes: z.array(z.string()).default([]),
    challengeId: z.string().min(1),
    complexity: z
      .object({
        space: z.string().min(1),
        time: z.string().min(1),
      })
      .optional(),
    description: z.string().min(1),
    estimatedMinutes: z.number().int().positive().default(20),
    hints: z.array(z.string()).default([]),
    level: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    locale: z.string().min(1).default('en'),
    order: z.number().int().nonnegative().default(100),
    pillarId: z.string().min(1).optional(),
    problemStatement: z.string().optional(),
    walkthrough: z.string().optional(),
    pubDate: z.coerce.date(),
    relatedChallengeIds: z.array(z.string().min(1)).default([]),
    relatedArticleIds: z.array(z.string()).default([]),
    solutionLanguage: z.enum(['javascript', 'typescript', 'python']).default('typescript'),
    starterCode: z.string().optional(),
    status: z.enum(['active', 'archived', 'draft']).default('active'),
    summary: z.string().min(1),
    tags: z.array(z.string()).default([]),
    testCases: z
      .array(
        z.object({
          description: z.string(),
          expected: z.unknown(),
          input: z.array(z.unknown()),
        }),
      )
      .default([]),
    title: z.string().min(1),
    type: z.string().min(1),
    typeLabel: z.string().min(1),
    updatedDate: z.coerce.date().optional(),
    whatToNotice: z.array(z.string()).default([]),
  }),
})

export const collections = {
  articles,
  challenges,
  concepts,
  glossary,
}
