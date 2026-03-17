import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.md',
  }),
  schema: z.object({
    category: z.string().min(1).default('Programming'),
    description: z.string().min(1),
    order: z.number().int().nonnegative().default(100),
    path: z.array(z.string().min(1)).min(1),
    practiceChecklist: z.array(z.string()).default([]),
    pubDate: z.coerce.date(),
    relationships: z.array(z.string().min(1)).default([]),
    relatedDeckIds: z.array(z.string()).default([]),
    summary: z.string().min(1),
    takeaways: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    title: z.string().min(1),
    topic: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
  }),
})

export const collections = {
  blog,
}
