import type { CollectionEntry } from 'astro:content'

import { getArticleHrefFromEntry } from '@/lib/article-links'
import { getTracksHref } from '@/lib/tracks-links'

export type EditorialLocale = 'en' | 'pt-br'

type LocalizedText = Record<EditorialLocale, string>

type RoadmapPosition = {
  x: number
  y: number
}

type EditorialRoadmapTag = {
  id: string
  label: LocalizedText
}

type RoadmapArticleNode = {
  articleId: string
  id: string
  kind: 'article'
  position: RoadmapPosition
}

type EditorialRoadmap = {
  id: string
  intro: LocalizedText
  label: LocalizedText
  nodes: RoadmapArticleNode[]
  slug: LocalizedText
  summary: LocalizedText
  tags: EditorialRoadmapTag[]
  title: LocalizedText
}

export type ResolvedRoadmapArticleNode = {
  articleId: string
  href: string
  id: string
  kind: 'article'
  position: RoadmapPosition
  post: CollectionEntry<'articles'>
}

export type ResolvedRoadmapNode = ResolvedRoadmapArticleNode

export type ResolvedEditorialRoadmap = {
  articleNodes: ResolvedRoadmapArticleNode[]
  href: string
  id: string
  intro: string
  label: string
  locale: EditorialLocale
  nodes: ResolvedRoadmapNode[]
  slug: string
  slugs: LocalizedText
  summary: string
  tags: Array<{ id: string; label: string }>
  title: string
}

export type EditorialArticleContext = {
  currentArticle: ResolvedRoadmapArticleNode
  nextArticle: ResolvedRoadmapArticleNode | null
  previousArticle: ResolvedRoadmapArticleNode | null
  roadmap: ResolvedEditorialRoadmap
  stepIndex: number
  totalSteps: number
}

const STARTER_ROADMAP: EditorialRoadmap = {
  id: 'first-clone-checklist',
  intro: {
    en: 'A single-step track that helps you validate the shell before replacing the bundled starter content.',
    'pt-br': 'Uma trilha de um passo que ajuda a validar a shell antes de substituir o starter incluido no repo.',
  },
  label: {
    en: 'Start here',
    'pt-br': 'Comece aqui',
  },
  nodes: [
    {
      id: 'starter-article',
      articleId: 'customize-the-template-after-clone',
      kind: 'article',
      position: { x: 0, y: 0 },
    },
  ],
  slug: {
    en: 'first-clone-checklist',
    'pt-br': 'checklist-do-primeiro-clone',
  },
  summary: {
    en: 'Validate the starter shell, then move to brand and editorial customization with confidence.',
    'pt-br': 'Valide a shell inicial e depois siga para marca e conteudo editorial com mais seguranca.',
  },
  tags: [
    {
      id: 'starter',
      label: {
        en: 'Starter',
        'pt-br': 'Starter',
      },
    },
  ],
  title: {
    en: 'First clone checklist',
    'pt-br': 'Checklist do primeiro clone',
  },
}

const ROADMAPS = [STARTER_ROADMAP]

function getLocalizedText(text: LocalizedText, locale: EditorialLocale) {
  return text[locale] ?? text.en
}

export function resolveEditorialRoadmaps(
  locale: EditorialLocale,
  articles: CollectionEntry<'articles'>[],
): ResolvedEditorialRoadmap[] {
  const localizedArticles = articles.filter((entry) => entry.data.locale === locale && entry.data.status === 'active')

  return ROADMAPS.map((roadmap) => {
    const articleNodes = roadmap.nodes.flatMap<ResolvedRoadmapArticleNode>((node) => {
      const post = localizedArticles.find((entry) => entry.data.articleId === node.articleId)

      if (!post) {
        return []
      }

      return [
        {
          articleId: node.articleId,
          href: getArticleHrefFromEntry(post),
          id: node.id,
          kind: 'article',
          position: node.position,
          post,
        },
      ]
    })

    const slug = getLocalizedText(roadmap.slug, locale)

    return {
      articleNodes,
      href: getTracksHref(locale, slug) ?? (locale === 'pt-br' ? `/pt-br/trilhas/${slug}` : `/tracks/${slug}`),
      id: roadmap.id,
      intro: getLocalizedText(roadmap.intro, locale),
      label: getLocalizedText(roadmap.label, locale),
      locale,
      nodes: articleNodes,
      slug,
      slugs: roadmap.slug,
      summary: getLocalizedText(roadmap.summary, locale),
      tags: roadmap.tags.map((tag) => ({
        id: tag.id,
        label: getLocalizedText(tag.label, locale),
      })),
      title: getLocalizedText(roadmap.title, locale),
    }
  }).filter((roadmap) => roadmap.articleNodes.length > 0)
}

export function getEditorialRoadmapById(
  locale: EditorialLocale,
  articles: CollectionEntry<'articles'>[],
  roadmapId: string,
) {
  return resolveEditorialRoadmaps(locale, articles).find((roadmap) => roadmap.id === roadmapId) ?? null
}

export function getEditorialRoadmapBySlug(
  locale: EditorialLocale,
  articles: CollectionEntry<'articles'>[],
  slug: string,
) {
  return resolveEditorialRoadmaps(locale, articles).find((roadmap) => roadmap.slug === slug) ?? null
}

export function getArticleEditorialContext(
  post: CollectionEntry<'articles'>,
  articles: CollectionEntry<'articles'>[],
): EditorialArticleContext | null {
  const locale = post.data.locale === 'pt-br' ? 'pt-br' : 'en'
  const roadmap = resolveEditorialRoadmaps(locale, articles).find((entry) =>
    entry.articleNodes.some((node) => node.articleId === post.data.articleId),
  )

  if (!roadmap) {
    return null
  }

  const articleIndex = roadmap.articleNodes.findIndex((node) => node.articleId === post.data.articleId)

  if (articleIndex < 0) {
    return null
  }

  return {
    currentArticle: roadmap.articleNodes[articleIndex],
    nextArticle: roadmap.articleNodes[articleIndex + 1] ?? null,
    previousArticle: roadmap.articleNodes[articleIndex - 1] ?? null,
    roadmap,
    stepIndex: articleIndex + 1,
    totalSteps: roadmap.articleNodes.length,
  }
}
