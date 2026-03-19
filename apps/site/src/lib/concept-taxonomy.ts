import type { CollectionEntry } from 'astro:content'

import type { SiteLocale } from '@/lib/site-copy'

type ConceptDomainDefinition = {
  id: string
  labels: Record<SiteLocale, string>
  routeSegments: Record<SiteLocale, string>
  summaries: Record<SiteLocale, string>
}

type ConceptGroupDefinition = {
  domainId: string
  id: string
  labels: Record<SiteLocale, string>
  routeSegments: Record<SiteLocale, string>
  summaries: Record<SiteLocale, string>
}

export const CONCEPT_DOMAINS: ConceptDomainDefinition[] = [
  {
    id: 'javascript',
    labels: {
      en: 'JavaScript',
      'pt-br': 'JavaScript',
    },
    routeSegments: {
      en: 'javascript',
      'pt-br': 'javascript',
    },
    summaries: {
      en: 'Execution, scheduling, and platform behavior that explain how JavaScript actually runs.',
      'pt-br': 'Execucao, agendamento e comportamento da plataforma que explicam como JavaScript realmente roda.',
    },
  },
  {
    id: 'react',
    labels: {
      en: 'React',
      'pt-br': 'React',
    },
    routeSegments: {
      en: 'react',
      'pt-br': 'react',
    },
    summaries: {
      en: 'State, rendering, and component reasoning that usually create confusion in React applications.',
      'pt-br': 'Estado, renderizacao e raciocinio de componentes que costumam gerar confusao em aplicacoes React.',
    },
  },
  {
    id: 'backend',
    labels: {
      en: 'Backend',
      'pt-br': 'Backend',
    },
    routeSegments: {
      en: 'backend',
      'pt-br': 'backend',
    },
    summaries: {
      en: 'Requests, guarantees, and service behavior concepts that matter in APIs and distributed systems.',
      'pt-br': 'Conceitos de requests, garantias e comportamento de servicos que importam em APIs e sistemas distribuidos.',
    },
  },
  {
    id: 'security',
    labels: {
      en: 'Security',
      'pt-br': 'Seguranca',
    },
    routeSegments: {
      en: 'security',
      'pt-br': 'seguranca',
    },
    summaries: {
      en: 'Security concepts that help you reason about exposure, permissions, and what to trust.',
      'pt-br': 'Conceitos de seguranca para raciocinar sobre exposicao, permissoes e no que confiar.',
    },
  },
  {
    id: 'data',
    labels: {
      en: 'Data',
      'pt-br': 'Dados',
    },
    routeSegments: {
      en: 'data',
      'pt-br': 'dados',
    },
    summaries: {
      en: 'Storage, freshness, consistency, and caching concepts that change behavior over time.',
      'pt-br': 'Conceitos de armazenamento, frescor, consistencia e cache que mudam o comportamento no tempo.',
    },
  },
]

export const CONCEPT_GROUPS: ConceptGroupDefinition[] = [
  {
    domainId: 'javascript',
    id: 'runtime',
    labels: {
      en: 'Runtime',
      'pt-br': 'Runtime',
    },
    routeSegments: {
      en: 'runtime',
      'pt-br': 'runtime',
    },
    summaries: {
      en: 'Execution order, queues, and async behavior behind what the platform is doing.',
      'pt-br': 'Ordem de execucao, filas e assincronia por tras do que a plataforma esta fazendo.',
    },
  },
  {
    domainId: 'react',
    id: 'state',
    labels: {
      en: 'State',
      'pt-br': 'Estado',
    },
    routeSegments: {
      en: 'state',
      'pt-br': 'estado',
    },
    summaries: {
      en: 'How state is modeled, derived, and synchronized inside React components.',
      'pt-br': 'Como estado e modelado, derivado e sincronizado dentro de componentes React.',
    },
  },
  {
    domainId: 'backend',
    id: 'apis',
    labels: {
      en: 'APIs',
      'pt-br': 'APIs',
    },
    routeSegments: {
      en: 'apis',
      'pt-br': 'apis',
    },
    summaries: {
      en: 'Concepts around requests, guarantees, retries, and service behavior.',
      'pt-br': 'Conceitos sobre requests, garantias, retries e comportamento de servicos.',
    },
  },
  {
    domainId: 'security',
    id: 'trust',
    labels: {
      en: 'Trust',
      'pt-br': 'Confianca',
    },
    routeSegments: {
      en: 'trust',
      'pt-br': 'confianca',
    },
    summaries: {
      en: 'Trust boundaries, permissions, and assumptions that should not leak across systems.',
      'pt-br': 'Limites de confianca, permissoes e suposicoes que nao devem vazar entre sistemas.',
    },
  },
  {
    domainId: 'data',
    id: 'cache',
    labels: {
      en: 'Cache',
      'pt-br': 'Cache',
    },
    routeSegments: {
      en: 'cache',
      'pt-br': 'cache',
    },
    summaries: {
      en: 'Caching concepts tied to freshness, invalidation, and stale behavior.',
      'pt-br': 'Conceitos de cache ligados a frescor, invalidacao e comportamento stale.',
    },
  },
]

type ConceptEntryLike = CollectionEntry<'concepts'>

export function getConceptDomainById(domainId: string) {
  return CONCEPT_DOMAINS.find((domain) => domain.id === domainId) ?? null
}

export function getConceptDomainByRouteSegment(routeSegment: string, locale: SiteLocale) {
  return CONCEPT_DOMAINS.find((domain) => domain.routeSegments[locale] === routeSegment) ?? null
}

export function getConceptDomainRouteSegment(domainId: string, locale: SiteLocale) {
  return getConceptDomainById(domainId)?.routeSegments[locale] ?? domainId
}

export function getLocalizedConceptDomainLabel(domainId: string, locale: SiteLocale) {
  return getConceptDomainById(domainId)?.labels[locale] ?? domainId
}

export function getLocalizedConceptDomainSummary(domainId: string, locale: SiteLocale) {
  return getConceptDomainById(domainId)?.summaries[locale] ?? getLocalizedConceptDomainLabel(domainId, locale)
}

export function getConceptGroupById(domainId: string, groupId: string) {
  return CONCEPT_GROUPS.find((group) => group.domainId === domainId && group.id === groupId) ?? null
}

export function getConceptGroupByRouteSegment(domainId: string, routeSegment: string, locale: SiteLocale) {
  return CONCEPT_GROUPS.find((group) => group.domainId === domainId && group.routeSegments[locale] === routeSegment) ?? null
}

export function getConceptGroupRouteSegment(domainId: string, groupId: string, locale: SiteLocale) {
  return getConceptGroupById(domainId, groupId)?.routeSegments[locale] ?? groupId
}

export function getLocalizedConceptGroupLabel(domainId: string, groupId: string, locale: SiteLocale) {
  return getConceptGroupById(domainId, groupId)?.labels[locale] ?? groupId
}

export function getLocalizedConceptGroupSummary(domainId: string, groupId: string, locale: SiteLocale) {
  return getConceptGroupById(domainId, groupId)?.summaries[locale] ?? getLocalizedConceptGroupLabel(domainId, groupId, locale)
}

export function getAvailableConceptDomains(concepts: ConceptEntryLike[], locale: SiteLocale) {
  const activeDomainIds = new Set(
    concepts
      .filter((concept) => concept.data.locale === locale && concept.data.status !== 'archived')
      .map((concept) => concept.data.domainId),
  )

  return CONCEPT_DOMAINS.filter((domain) => activeDomainIds.has(domain.id))
}

export function getAvailableConceptGroups(concepts: ConceptEntryLike[], domainId: string, locale: SiteLocale) {
  const activeGroupIds = new Set(
    concepts
      .filter(
        (concept) =>
          concept.data.locale === locale &&
          concept.data.status !== 'archived' &&
          concept.data.domainId === domainId,
      )
      .map((concept) => concept.data.groupId),
  )

  return CONCEPT_GROUPS.filter((group) => group.domainId === domainId && activeGroupIds.has(group.id))
}
