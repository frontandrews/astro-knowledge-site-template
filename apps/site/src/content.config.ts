import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const guides = defineCollection({
  loader: glob({
    base: './src/content/guides',
    pattern: '**/*.md',
  }),
  schema: z.object({
    category: z.string().min(1).default('Programming'),
    branchId: z.string().min(1).optional(),
    description: z.string().min(1),
    guideId: z.string().min(1),
    kind: z.enum(['guide', 'article']).default('guide'),
    locale: z.string().min(1).default('en'),
    order: z.number().int().nonnegative().default(100),
    path: z.array(z.string().min(1)).min(1),
    pillarId: z.string().min(1).optional(),
    practiceChecklist: z.array(z.string()).default([]),
    pubDate: z.coerce.date(),
    relationships: z.array(z.string().min(1)).default([]),
    relatedDeckIds: z.array(z.string()).default([]),
    summary: z.string().min(1),
    status: z.enum(['active', 'archived']).default('active'),
    takeaways: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    title: z.string().min(1),
    topic: z.string().optional(),
    trackEligible: z.boolean().default(true),
    updatedDate: z.coerce.date().optional(),
  }),
})

const glossary = defineCollection({
  loader: glob({
    base: './src/content/glossary',
    pattern: '**/*.md',
  }),
  schema: z.object({
    aliases: z.array(z.string().min(1)).default([]),
    description: z.string().min(1),
    locale: z.string().min(1).default('en'),
    pubDate: z.coerce.date(),
    status: z.enum(['active', 'archived']).default('active'),
    summary: z.string().min(1),
    tags: z.array(z.string()).default([]),
    termId: z.string().min(1),
    title: z.string().min(1),
    updatedDate: z.coerce.date().optional(),
  }),
})

const concepts = defineCollection({
  loader: glob({
    base: './src/content/concepts',
    pattern: '**/*.md',
  }),
  schema: z.object({
    conceptId: z.string().min(1),
    description: z.string().min(1),
    domainId: z.string().min(1),
    groupId: z.string().min(1),
    locale: z.string().min(1).default('en'),
    pubDate: z.coerce.date(),
    relatedGuideIds: z.array(z.string().min(1)).default([]),
    status: z.enum(['active', 'archived']).default('active'),
    summary: z.string().min(1),
    tags: z.array(z.string()).default([]),
    title: z.string().min(1),
    updatedDate: z.coerce.date().optional(),
  }),
})

const challenges = defineCollection({
  loader: glob({
    base: './src/content/challenges',
    pattern: '**/*.md',
  }),
  schema: z.object({
    branchId: z.string().min(1).optional(),
    challengeId: z.string().min(1),
    description: z.string().min(1),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
    locale: z.string().min(1).default('en'),
    pillarId: z.string().min(1).optional(),
    pubDate: z.coerce.date(),
    relatedGuideIds: z.array(z.string()).default([]),
    status: z.enum(['active', 'archived']).default('active'),
    summary: z.string().min(1),
    tags: z.array(z.string()).default([]),
    title: z.string().min(1),
    updatedDate: z.coerce.date().optional(),
  }),
})

export const collections = {
  challenges,
  concepts,
  glossary,
  guides,
}
