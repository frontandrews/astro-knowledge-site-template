export type TaxonomyLocale = 'en' | 'pt-br'

export type TopicGroupDefinition = {
  id: string
  labels: Record<TaxonomyLocale, string>
  routeSegment: Record<TaxonomyLocale, string>
  summaries: Record<TaxonomyLocale, string>
}

export type TopicDefinition = {
  id: string
  labels: Record<TaxonomyLocale, string>
  parentId: string
  routeSegment: Record<TaxonomyLocale, string>
  summaries: Record<TaxonomyLocale, string>
}

export const TRACK_LABELS: Record<string, string> = {
  'ai-engineering': 'AI Engineering',
  'english-for-tech': 'English for Tech',
  'leadership-and-delivery': 'Leadership and Delivery',
  programming: 'Programming',
  systems: 'Systems and Architecture',
}

export const TOPIC_GROUP_DEFINITIONS: TopicGroupDefinition[] = [
  {
    id: 'thinking',
    routeSegment: {
      en: 'thinking',
      'pt-br': 'pensamento',
    },
    labels: {
      en: 'Thinking & Decisions',
      'pt-br': 'Pensamento e Decisao',
    },
    summaries: {
      en: 'Problem framing, judgment, communication, and decision-making patterns that shape senior execution.',
      'pt-br': 'Como enquadrar problemas, tomar decisoes e se comunicar com mais criterio no trabalho real.',
    },
  },
  {
    id: 'frontend',
    routeSegment: {
      en: 'frontend',
      'pt-br': 'frontend',
    },
    labels: {
      en: 'Frontend & Runtime',
      'pt-br': 'Frontend e Runtime',
    },
    summaries: {
      en: 'Execution, state, rendering, and interface behavior closer to what users actually experience.',
      'pt-br': 'Execucao, estado, renderizacao e comportamento de interface mais perto do que o usuario realmente sente.',
    },
  },
  {
    id: 'systems',
    routeSegment: {
      en: 'systems',
      'pt-br': 'sistemas',
    },
    labels: {
      en: 'Systems & Production',
      'pt-br': 'Sistemas e Producao',
    },
    summaries: {
      en: 'Architecture, scale, reliability, data, and production concerns that shape real systems.',
      'pt-br': 'Arquitetura, escala, confiabilidade, dados e producao como parte do desenho de sistemas reais.',
    },
  },
] as const

export const TOPIC_DEFINITIONS: TopicDefinition[] = [
  {
    id: 'ai-engineering',
    parentId: 'systems',
    routeSegment: {
      en: 'ai-engineering',
      'pt-br': 'ai-engineering',
    },
    labels: {
      en: 'AI Systems',
      'pt-br': 'Sistemas com IA',
    },
    summaries: {
      en: 'LLM-backed features, retrieval, evaluation, and product trade-offs around shipping AI systems.',
      'pt-br': 'Features com LLM, retrieval, avaliacao e trade-offs de produto para sistemas com IA.',
    },
  },
  {
    id: 'coding-interview',
    parentId: 'thinking',
    routeSegment: {
      en: 'coding-interview',
      'pt-br': 'resolucao-de-problemas',
    },
    labels: {
      en: 'Problem Solving',
      'pt-br': 'Resolucao de Problemas',
    },
    summaries: {
      en: 'Problem framing, solution shaping, and explanation under pressure.',
      'pt-br': 'Como enquadrar problemas, estruturar solucoes e explicar melhor sob pressao.',
    },
  },
  {
    id: 'delivery',
    parentId: 'thinking',
    routeSegment: {
      en: 'delivery',
      'pt-br': 'pensamento-senior',
    },
    labels: {
      en: 'Senior Thinking',
      'pt-br': 'Pensamento Senior',
    },
    summaries: {
      en: 'Trade-offs, delivery judgment, and clearer execution decisions in real teams.',
      'pt-br': 'Trade-offs, criterio de entrega e decisoes de execucao mais claras em times reais.',
    },
  },
  {
    id: 'javascript',
    parentId: 'frontend',
    routeSegment: {
      en: 'javascript',
      'pt-br': 'javascript',
    },
    labels: {
      en: 'How Code Works',
      'pt-br': 'Como o Codigo Roda',
    },
    summaries: {
      en: 'Execution order, event loop, runtime behavior, and the mechanics behind what your code actually does.',
      'pt-br': 'Ordem de execucao, event loop, comportamento de runtime e a mecanica por tras do que o codigo realmente faz.',
    },
  },
  {
    id: 'leadership',
    parentId: 'thinking',
    routeSegment: {
      en: 'leadership',
      'pt-br': 'lideranca-e-alinhamento',
    },
    labels: {
      en: 'Leadership & Alignment',
      'pt-br': 'Lideranca e Alinhamento',
    },
    summaries: {
      en: 'Ownership, influence, alignment, and decision-making when the work involves other people.',
      'pt-br': 'Ownership, influencia, alinhamento e tomada de decisao quando o trabalho envolve outras pessoas.',
    },
  },
  {
    id: 'node',
    parentId: 'systems',
    routeSegment: {
      en: 'node',
      'pt-br': 'node',
    },
    labels: {
      en: 'Backend Runtime',
      'pt-br': 'Runtime Backend',
    },
    summaries: {
      en: 'Concurrency, scheduling, and mental models for backend systems that run under Node.',
      'pt-br': 'Concorrencia, escalonamento e modelos mentais para sistemas backend rodando em Node.',
    },
  },
  {
    id: 'react',
    parentId: 'javascript',
    routeSegment: {
      en: 'react',
      'pt-br': 'react',
    },
    labels: {
      en: 'State & UI',
      'pt-br': 'Estado e UI',
    },
    summaries: {
      en: 'State, effects, rendering, and UI boundaries in modern frontend applications.',
      'pt-br': 'Estado, effects, renderizacao e limites de interface em aplicacoes frontend modernas.',
    },
  },
  {
    id: 'system-design',
    parentId: 'systems',
    routeSegment: {
      en: 'system-design',
      'pt-br': 'system-design',
    },
    labels: {
      en: 'System Design',
      'pt-br': 'Design de Sistemas',
    },
    summaries: {
      en: 'Scalability, boundaries, APIs, and failure modes without diagram theatre.',
      'pt-br': 'Escala, fronteiras, APIs e falhas sem teatro de diagramas.',
    },
  },
  {
    id: 'tech-english',
    parentId: 'thinking',
    routeSegment: {
      en: 'tech-english',
      'pt-br': 'comunicacao-tecnica',
    },
    labels: {
      en: 'Technical Communication',
      'pt-br': 'Comunicacao Tecnica',
    },
    summaries: {
      en: 'Clear status updates, technical writing, and stronger communication in engineering contexts.',
      'pt-br': 'Updates mais claros, escrita tecnica e melhor comunicacao em contextos de engenharia.',
    },
  },
  {
    id: 'architecture-patterns',
    parentId: 'systems',
    routeSegment: {
      en: 'architecture-patterns',
      'pt-br': 'arquitetura-e-padroes',
    },
    labels: {
      en: 'Architecture & Patterns',
      'pt-br': 'Arquitetura e Padroes',
    },
    summaries: {
      en: 'Composition, abstraction, reuse, and system structure decisions that affect long-term maintainability.',
      'pt-br': 'Composicao, abstracao, reuso e decisoes de estrutura que afetam a manutenibilidade no longo prazo.',
    },
  },
  {
    id: 'performance',
    parentId: 'systems',
    routeSegment: {
      en: 'performance',
      'pt-br': 'performance',
    },
    labels: {
      en: 'Performance',
      'pt-br': 'Performance',
    },
    summaries: {
      en: 'Measurement, bottlenecks, and user-facing speed as a real engineering discipline.',
      'pt-br': 'Medicao, gargalos e velocidade percebida pelo usuario como disciplina real de engenharia.',
    },
  },
  {
    id: 'debugging-production',
    parentId: 'systems',
    routeSegment: {
      en: 'debugging-production',
      'pt-br': 'debug-e-producao',
    },
    labels: {
      en: 'Debugging & Production',
      'pt-br': 'Debug e Producao',
    },
    summaries: {
      en: 'Failures, logs, observability, and investigation patterns for real production systems.',
      'pt-br': 'Falhas, logs, observabilidade e investigacao aplicada a sistemas reais em producao.',
    },
  },
  {
    id: 'data-storage',
    parentId: 'systems',
    routeSegment: {
      en: 'data-storage',
      'pt-br': 'dados-e-armazenamento',
    },
    labels: {
      en: 'Data & Storage',
      'pt-br': 'Dados e Armazenamento',
    },
    summaries: {
      en: 'Modeling, persistence, consistency, and storage trade-offs that shape system behavior.',
      'pt-br': 'Modelagem, persistencia, consistencia e trade-offs de armazenamento que moldam o comportamento do sistema.',
    },
  },
  {
    id: 'security',
    parentId: 'systems',
    routeSegment: {
      en: 'security',
      'pt-br': 'seguranca',
    },
    labels: {
      en: 'Security',
      'pt-br': 'Seguranca',
    },
    summaries: {
      en: 'Trust, exposure, permissions, and safer defaults in application and API design.',
      'pt-br': 'Confianca, exposicao, permissoes e defaults mais seguros em aplicacoes e APIs.',
    },
  },
  {
    id: 'accessibility',
    parentId: 'frontend',
    routeSegment: {
      en: 'accessibility',
      'pt-br': 'acessibilidade',
    },
    labels: {
      en: 'Accessibility',
      'pt-br': 'Acessibilidade',
    },
    summaries: {
      en: 'Keyboard, semantics, focus, and inclusive interaction quality in product interfaces.',
      'pt-br': 'Teclado, semantica, foco e qualidade de interacao inclusiva em interfaces de produto.',
    },
  },
] as const

export const TOPIC_LABELS: Record<string, string> = Object.fromEntries(
  TOPIC_DEFINITIONS.map((topic) => [topic.id, topic.labels.en]),
)

function normalizeTaxonomyLocale(locale?: string): TaxonomyLocale {
  return locale === 'pt-br' ? 'pt-br' : 'en'
}

export function getTrackLabel(track: string): string {
  return TRACK_LABELS[track] ?? track
}

export function getTopicGroupById(groupId: string) {
  return TOPIC_GROUP_DEFINITIONS.find((group) => group.id === groupId)
}

export function getTopicGroupByRouteSegment(routeSegment: string, locale = 'en') {
  const normalizedLocale = normalizeTaxonomyLocale(locale)

  return TOPIC_GROUP_DEFINITIONS.find((group) => group.routeSegment[normalizedLocale] === routeSegment)
}

export function getTopicById(topicId: string) {
  return TOPIC_DEFINITIONS.find((topic) => topic.id === topicId)
}

export function getTopicByRouteSegment(routeSegment: string, locale = 'en') {
  const normalizedLocale = normalizeTaxonomyLocale(locale)

  return TOPIC_DEFINITIONS.find((topic) => topic.routeSegment[normalizedLocale] === routeSegment)
}

export function getTopicParentId(topicId: string) {
  return getTopicById(topicId)?.parentId ?? null
}

export function getTopicChildren(parentId: string) {
  return TOPIC_DEFINITIONS.filter((topic) => topic.parentId === parentId)
}

export function getTopicGroupRouteSegment(groupId: string, locale = 'en') {
  const normalizedLocale = normalizeTaxonomyLocale(locale)

  return getTopicGroupById(groupId)?.routeSegment[normalizedLocale] ?? groupId
}

export function getTopicRootGroupId(topicId: string) {
  let parentId = getTopicParentId(topicId)

  while (parentId) {
    if (getTopicGroupById(parentId)) {
      return parentId
    }

    parentId = getTopicParentId(parentId)
  }

  return null
}

export function getTopicAncestorIds(topicId: string) {
  const ancestors: string[] = []
  let parentId = getTopicParentId(topicId)

  while (parentId) {
    if (getTopicGroupById(parentId)) {
      break
    }

    ancestors.unshift(parentId)
    parentId = getTopicParentId(parentId)
  }

  return ancestors
}

export function getTopicPathSegments(topicId: string, locale = 'en') {
  const normalizedLocale = normalizeTaxonomyLocale(locale)
  const groupId = getTopicRootGroupId(topicId)
  const topic = getTopicById(topicId)

  if (!topic) {
    return []
  }

  return [
    ...(groupId ? [getTopicGroupRouteSegment(groupId, normalizedLocale)] : []),
    ...getTopicAncestorIds(topicId).map((ancestorId) => getTopicRouteSegment(ancestorId, normalizedLocale)),
    getTopicRouteSegment(topic.id, normalizedLocale),
  ]
}

export function resolveTopicPathSegments(segments: string[], locale = 'en') {
  const normalizedLocale = normalizeTaxonomyLocale(locale)

  if (segments.length === 0) {
    return null
  }

  const group = getTopicGroupByRouteSegment(segments[0], normalizedLocale)

  if (!group) {
    return null
  }

  if (segments.length === 1) {
    return {
      groupId: group.id,
      topicId: null,
    }
  }

  let parentId = group.id
  let topicId: string | null = null

  for (const segment of segments.slice(1)) {
    const match = getTopicChildren(parentId).find((topic) => topic.routeSegment[normalizedLocale] === segment)

    if (!match) {
      return null
    }

    topicId = match.id
    parentId = match.id
  }

  return {
    groupId: group.id,
    topicId,
  }
}

export function getTopicGroupLabel(groupId: string, locale = 'en') {
  const normalizedLocale = normalizeTaxonomyLocale(locale)

  return getTopicGroupById(groupId)?.labels[normalizedLocale] ?? groupId
}

export function getTopicGroupSummary(groupId: string, locale = 'en') {
  const normalizedLocale = normalizeTaxonomyLocale(locale)

  return getTopicGroupById(groupId)?.summaries[normalizedLocale] ?? getTopicGroupLabel(groupId, normalizedLocale)
}

export function getTopicLabel(topic: string, locale = 'en'): string {
  const normalizedLocale = normalizeTaxonomyLocale(locale)

  return getTopicById(topic)?.labels[normalizedLocale] ?? TOPIC_LABELS[topic] ?? topic
}

export function getTopicRouteSegment(topic: string, locale = 'en'): string {
  const normalizedLocale = normalizeTaxonomyLocale(locale)

  return getTopicById(topic)?.routeSegment[normalizedLocale] ?? topic
}

export function getTopicSummary(topic: string, locale = 'en'): string {
  const normalizedLocale = normalizeTaxonomyLocale(locale)

  return getTopicById(topic)?.summaries[normalizedLocale] ?? getTopicLabel(topic, normalizedLocale)
}
