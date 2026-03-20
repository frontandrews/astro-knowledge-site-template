import type { CollectionEntry } from 'astro:content'

import { getGuideHrefFromEntry } from '@/lib/guide-links'
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

type EditorialRoadmapNodeBase = {
  id: string
  position: RoadmapPosition
}

export type RoadmapArticleNode = EditorialRoadmapNodeBase & {
  guideId: string
  kind: 'article'
}

export type RoadmapConceptNode = EditorialRoadmapNodeBase & {
  kind: 'concept'
  panelBody: LocalizedText
  relatedGuideIds: string[]
  summary: LocalizedText
  title: LocalizedText
}

export type RoadmapNode = RoadmapArticleNode | RoadmapConceptNode

export type EditorialRoadmap = {
  id: string
  intro: LocalizedText
  label: LocalizedText
  nodes: RoadmapNode[]
  slug: LocalizedText
  summary: LocalizedText
  tags: EditorialRoadmapTag[]
  title: LocalizedText
}

export type ResolvedRoadmapArticleNode = {
  guideId: string
  href: string
  id: string
  kind: 'article'
  position: RoadmapPosition
  post: CollectionEntry<'guides'>
}

export type ResolvedRoadmapConceptNode = {
  id: string
  kind: 'concept'
  panelBody: string
  position: RoadmapPosition
  relatedGuides: CollectionEntry<'guides'>[]
  summary: string
  title: string
}

export type ResolvedRoadmapNode = ResolvedRoadmapArticleNode | ResolvedRoadmapConceptNode

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

export type EditorialGuideContext = {
  currentArticle: ResolvedRoadmapArticleNode
  nextArticle: ResolvedRoadmapArticleNode | null
  previousArticle: ResolvedRoadmapArticleNode | null
  roadmap: ResolvedEditorialRoadmap
  stepIndex: number
  totalSteps: number
}

const START_HERE_ROADMAP: EditorialRoadmap = {
  id: 'start-here-problem-solving',
  intro: {
    en: 'A mental map for how to understand a problem before you rush into code, patterns, or interview answers.',
    'pt-br': 'Um mapa mental para entender o problema antes de correr para codigo, padroes ou respostas de entrevista.',
  },
  label: {
    en: 'Start Here',
    'pt-br': 'Comece aqui',
  },
  slug: {
    en: 'how-to-think-before-you-solve',
    'pt-br': 'como-pensar-antes-de-resolver',
  },
  summary: {
    en: 'A guided reading route through the articles that help you think clearly before solving.',
    'pt-br': 'Uma rota guiada de leitura pelos artigos que ajudam voce a pensar com clareza antes de resolver.',
  },
  tags: [
    {
      id: 'foundations',
      label: {
        en: 'Foundations',
        'pt-br': 'Fundamentos',
      },
    },
    {
      id: 'problem-solving',
      label: {
        en: 'Problem solving',
        'pt-br': 'Resolucao de problemas',
      },
    },
    {
      id: 'interviews',
      label: {
        en: 'Interviews',
        'pt-br': 'Entrevistas',
      },
    },
    {
      id: 'communication',
      label: {
        en: 'Communication',
        'pt-br': 'Comunicacao',
      },
    },
  ],
  title: {
    en: 'How to think before you solve',
    'pt-br': 'Como pensar antes de resolver',
  },
  nodes: [
    {
      id: 'concept-dont-jump-to-code',
      kind: 'concept',
      position: { x: 0, y: 10 },
      title: {
        en: 'Do not jump to code first',
        'pt-br': 'Nao pule para o codigo primeiro',
      },
      summary: {
        en: 'A fast answer can still be the wrong framing. First define the problem you are actually solving.',
        'pt-br': 'Uma resposta rapida ainda pode partir do enquadramento errado. Primeiro defina o problema real.',
      },
      panelBody: {
        en: 'Before naming a data structure or writing a loop, pause and separate the task into inputs, constraints, and outcomes. This is the difference between solving and reacting.',
        'pt-br': 'Antes de nomear uma estrutura de dados ou escrever um loop, pare e separe a tarefa em entradas, restricoes e resultados. Essa e a diferenca entre resolver e reagir.',
      },
      relatedGuideIds: ['breaking-down-problems-without-panic'],
    },
    {
      id: 'article-problem-breakdown',
      kind: 'article',
      guideId: 'breaking-down-problems-without-panic',
      position: { x: 270, y: 0 },
    },
    {
      id: 'concept-facts-constraints-assumptions',
      kind: 'concept',
      position: { x: 545, y: 10 },
      title: {
        en: 'Separate facts, constraints, and assumptions',
        'pt-br': 'Separe fatos, restricoes e suposicoes',
      },
      summary: {
        en: 'Most bad solutions come from mixing what is known, what is required, and what you merely guessed.',
        'pt-br': 'Grande parte das solucoes ruins nasce de misturar o que e fato, o que e obrigacao e o que foi so chute.',
      },
      panelBody: {
        en: 'When you split the problem into these buckets, trade-offs become easier to explain and wrong paths become easier to discard early.',
        'pt-br': 'Quando voce separa o problema nesses blocos, os trade-offs ficam mais faceis de explicar e os caminhos errados ficam mais faceis de descartar cedo.',
      },
      relatedGuideIds: ['trade-offs-and-constraints-without-fake-certainty'],
    },
    {
      id: 'article-trade-offs',
      kind: 'article',
      guideId: 'trade-offs-and-constraints-without-fake-certainty',
      position: { x: 820, y: 0 },
    },
    {
      id: 'article-thinking-before-code',
      kind: 'article',
      guideId: 'thinking-before-you-code-in-interviews',
      position: { x: 1095, y: 0 },
    },
    {
      id: 'article-pattern-recognition',
      kind: 'article',
      guideId: 'recognizing-patterns-without-memorizing-tricks',
      position: { x: 1095, y: 240 },
    },
    {
      id: 'concept-communicate-the-path',
      kind: 'concept',
      position: { x: 820, y: 250 },
      title: {
        en: 'Communicate the path, not only the answer',
        'pt-br': 'Comunique o caminho, nao so a resposta',
      },
      summary: {
        en: 'People trust your reasoning when they can follow the sequence of decisions, not only the final code.',
        'pt-br': 'As pessoas confiam no seu raciocinio quando conseguem acompanhar a sequencia de decisoes, nao so o codigo final.',
      },
      panelBody: {
        en: 'The clearer your explanation of trade-offs, choices, and dead ends, the more senior your thinking sounds. Explanation is part of the solution.',
        'pt-br': 'Quanto mais clara for sua explicacao de trade-offs, escolhas e becos sem saida, mais senior seu pensamento parece. Explicacao faz parte da solucao.',
      },
      relatedGuideIds: [
        'explaining-your-solution-without-losing-the-thread',
        'ticket-and-task-thinking-with-clarity',
      ],
    },
    {
      id: 'article-explaining-solutions',
      kind: 'article',
      guideId: 'explaining-your-solution-without-losing-the-thread',
      position: { x: 545, y: 240 },
    },
    {
      id: 'article-ticket-thinking',
      kind: 'article',
      guideId: 'ticket-and-task-thinking-with-clarity',
      position: { x: 270, y: 240 },
    },
  ],
}

const EDITORIAL_ROADMAPS: EditorialRoadmap[] = [START_HERE_ROADMAP]

function isEditorialLocale(value?: string | null): value is EditorialLocale {
  return value === 'pt-br' || value === 'en'
}

function getLocalizedText(value: LocalizedText, locale: EditorialLocale) {
  return value[locale]
}

export function getPrimaryEditorialRoadmap() {
  return START_HERE_ROADMAP
}

export function getPrimaryEditorialRoadmapHref(locale: EditorialLocale) {
  return getTracksHref(locale, getLocalizedText(START_HERE_ROADMAP.slug, locale))
}

function resolveRoadmap(
  roadmap: EditorialRoadmap,
  locale: EditorialLocale,
  guides: CollectionEntry<'guides'>[],
): ResolvedEditorialRoadmap {
  const localeGuides = guides.filter(
    (entry) =>
      entry.data.status !== 'archived' &&
      entry.data.trackEligible &&
      isEditorialLocale(entry.data.locale) &&
      entry.data.locale === locale,
  )
  const byGuideId = new Map(localeGuides.map((entry) => [entry.data.guideId, entry]))
  const nodes: ResolvedRoadmapNode[] = []

  for (const node of roadmap.nodes) {
    if (node.kind === 'article') {
      const post = byGuideId.get(node.guideId)

      if (!post) {
        continue
      }

      nodes.push({
        guideId: node.guideId,
        href: getGuideHrefFromEntry(post),
        id: node.id,
        kind: 'article',
        position: node.position,
        post,
      })
      continue
    }

    nodes.push({
      id: node.id,
      kind: 'concept',
      panelBody: getLocalizedText(node.panelBody, locale),
      position: node.position,
      relatedGuides: node.relatedGuideIds.flatMap((guideId) => {
        const post = byGuideId.get(guideId)
        return post ? [post] : []
      }),
      summary: getLocalizedText(node.summary, locale),
      title: getLocalizedText(node.title, locale),
    })
  }

  const articleNodes = nodes.filter((node): node is ResolvedRoadmapArticleNode => node.kind === 'article')
  const slug = getLocalizedText(roadmap.slug, locale)

  return {
    articleNodes,
    href: getTracksHref(locale, slug),
    id: roadmap.id,
    intro: getLocalizedText(roadmap.intro, locale),
    label: getLocalizedText(roadmap.label, locale),
    locale,
    nodes,
    slug,
    slugs: roadmap.slug,
    summary: getLocalizedText(roadmap.summary, locale),
    tags: roadmap.tags.map((tag) => ({
      id: tag.id,
      label: getLocalizedText(tag.label, locale),
    })),
    title: getLocalizedText(roadmap.title, locale),
  }
}

export function resolveEditorialRoadmaps(
  locale: EditorialLocale,
  guides: CollectionEntry<'guides'>[],
): ResolvedEditorialRoadmap[] {
  return EDITORIAL_ROADMAPS.map((roadmap) => resolveRoadmap(roadmap, locale, guides))
}

export function resolveEditorialRoadmap(
  locale: EditorialLocale,
  guides: CollectionEntry<'guides'>[],
  roadmapId = START_HERE_ROADMAP.id,
): ResolvedEditorialRoadmap | null {
  return resolveEditorialRoadmaps(locale, guides).find((roadmap) => roadmap.id === roadmapId) ?? null
}

export function resolveEditorialRoadmapBySlug(
  locale: EditorialLocale,
  guides: CollectionEntry<'guides'>[],
  slug: string,
): ResolvedEditorialRoadmap | null {
  return resolveEditorialRoadmaps(locale, guides).find((roadmap) => roadmap.slug === slug) ?? null
}

export function getGuideEditorialContext(
  post: CollectionEntry<'guides'>,
  guides: CollectionEntry<'guides'>[],
): EditorialGuideContext | null {
  const locale = isEditorialLocale(post.data.locale) ? post.data.locale : 'en'
  const roadmap = resolveEditorialRoadmaps(locale, guides).find((entry) =>
    entry.articleNodes.some((node) => node.guideId === post.data.guideId),
  )

  if (!roadmap) {
    return null
  }

  const currentIndex = roadmap.articleNodes.findIndex((node) => node.guideId === post.data.guideId)

  if (currentIndex < 0) {
    return null
  }

  return {
    currentArticle: roadmap.articleNodes[currentIndex],
    nextArticle: roadmap.articleNodes[currentIndex + 1] ?? null,
    previousArticle: roadmap.articleNodes[currentIndex - 1] ?? null,
    roadmap,
    stepIndex: currentIndex + 1,
    totalSteps: roadmap.articleNodes.length,
  }
}
