import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.md',
  }),
  schema: z.object({
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    relatedDeckIds: z.array(z.string()).default([]),
    summary: z.string().min(1),
    tags: z.array(z.string()).default([]),
    title: z.string().min(1),
    topic: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
  }),
})

export const collections = {
  blog,
}
