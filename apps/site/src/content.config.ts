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
    updatedDate: z.coerce.date().optional(),
  }),
})

export const collections = {
  guides,
}
