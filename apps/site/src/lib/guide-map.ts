import type { CollectionEntry } from 'astro:content'

import { sortGuides } from './guide-tree'

export type GuideMapConnection = {
  category: string
  id: string
  routePath: string
  relation: 'connects_to' | 'referenced_by'
  title: string
}

export type GuideMapItem = {
  category: string
  connections: GuideMapConnection[]
  id: string
  path: string[]
  relatedDeckIds: string[]
  routePath: string
  summary: string
  tags: string[]
  title: string
  topic?: string
}

export type GuideMapSection = {
  items: GuideMapItem[]
  label: string
}

export function buildGuideMap(posts: CollectionEntry<'guides'>[]): GuideMapSection[] {
  const sortedPosts = sortGuides(posts)
  const byGuideId = new Map(sortedPosts.map((post) => [post.data.guideId, post]))
  const incoming = new Map<string, string[]>()

  for (const post of sortedPosts) {
    for (const relatedId of post.data.relationships) {
      const nextIncoming = incoming.get(relatedId) ?? []
      nextIncoming.push(post.data.guideId)
      incoming.set(relatedId, nextIncoming)
    }
  }

  const sections = new Map<string, GuideMapItem[]>()

  for (const post of sortedPosts) {
    const category = post.data.path[0] ?? post.data.category
    const explicitConnections = post.data.relationships.flatMap((relatedId) => {
      const relatedPost = byGuideId.get(relatedId)

      if (!relatedPost) {
        return []
      }

      return [
        {
          category: relatedPost.data.path[0] ?? relatedPost.data.category,
          id: relatedPost.data.guideId,
          routePath: relatedPost.id,
          relation: 'connects_to' as const,
          title: relatedPost.data.title,
        },
      ]
    })
    const incomingConnections = (incoming.get(post.data.guideId) ?? []).flatMap((relatedId) => {
      const relatedPost = byGuideId.get(relatedId)

      if (!relatedPost) {
        return []
      }

      return [
        {
          category: relatedPost.data.path[0] ?? relatedPost.data.category,
          id: relatedPost.data.guideId,
          routePath: relatedPost.id,
          relation: 'referenced_by' as const,
          title: relatedPost.data.title,
        },
      ]
    })

    const item: GuideMapItem = {
      category,
      connections: [...explicitConnections, ...incomingConnections].sort((left, right) =>
        left.title.localeCompare(right.title),
      ),
      id: post.data.guideId,
      path: post.data.path,
      relatedDeckIds: post.data.relatedDeckIds,
      routePath: post.id,
      summary: post.data.summary,
      tags: post.data.tags,
      title: post.data.title,
      topic: post.data.topic,
    }

    const nextItems = sections.get(category) ?? []
    nextItems.push(item)
    sections.set(category, nextItems)
  }

  return [...sections.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([label, items]) => ({
      items,
      label,
    }))
}
