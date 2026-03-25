export type LearningPathLocale = 'en' | 'pt-br'

export type LearningPathRouteSegment = Record<LearningPathLocale, string>

export type LearningPathBranch = {
  articleId: string
  id: string
  routeSegment: LearningPathRouteSegment
  summary: string
  title: string
}

export type LearningPathPillar = {
  branches: LearningPathBranch[]
  id: string
  order: number
  routeSegment: LearningPathRouteSegment
  summary: string
  title: string
}

function createRouteSegment(en: string, ptBr: string): LearningPathRouteSegment {
  return {
    en,
    'pt-br': ptBr,
  }
}

function normalizeLearningPathLocale(locale?: string): LearningPathLocale {
  return locale === 'pt-br' ? 'pt-br' : 'en'
}

export const LEARNING_PATH_PILLARS: LearningPathPillar[] = [
  {
    id: 'foundations',
    order: 1,
    routeSegment: createRouteSegment('foundations', 'fundamentos'),
    title: 'Foundations',
    summary: 'A tiny starter path that helps you validate the shell before replacing the bundled content.',
    branches: [
      {
        id: 'first-clone',
        articleId: 'customize-the-template-after-clone',
        routeSegment: createRouteSegment('first-clone', 'primeiro-clone'),
        title: 'First clone',
        summary: 'The minimum path for booting, testing, and then rebranding the template safely.',
      },
    ],
  },
]

export function getLearningPathPillarById(pillarId: string) {
  return LEARNING_PATH_PILLARS.find((pillar) => pillar.id === pillarId) ?? null
}

export function getLearningPathBranchById(pillarId: string, branchId: string) {
  return getLearningPathPillarById(pillarId)?.branches.find((branch) => branch.id === branchId) ?? null
}

export function getLearningPathPillarByRouteSegment(routeSegment: string, locale = 'en') {
  const normalizedLocale = normalizeLearningPathLocale(locale)

  return LEARNING_PATH_PILLARS.find((pillar) => pillar.routeSegment[normalizedLocale] === routeSegment) ?? null
}

export function getLearningPathBranchByRouteSegment(pillarId: string, routeSegment: string, locale = 'en') {
  const normalizedLocale = normalizeLearningPathLocale(locale)
  const pillar = getLearningPathPillarById(pillarId)

  return pillar?.branches.find((branch) => branch.routeSegment[normalizedLocale] === routeSegment) ?? null
}

export function getLearningPathPillarRouteSegment(pillarId: string, locale = 'en') {
  const normalizedLocale = normalizeLearningPathLocale(locale)

  return getLearningPathPillarById(pillarId)?.routeSegment[normalizedLocale] ?? null
}

export function getLearningPathBranchRouteSegment(pillarId: string, branchId: string, locale = 'en') {
  const normalizedLocale = normalizeLearningPathLocale(locale)

  return getLearningPathBranchById(pillarId, branchId)?.routeSegment[normalizedLocale] ?? null
}

export function getLearningPathLocationByArticleId(articleId: string) {
  for (const pillar of LEARNING_PATH_PILLARS) {
    for (const branch of pillar.branches) {
      if (branch.articleId === articleId) {
        return {
          branchId: branch.id,
          pillarId: pillar.id,
        }
      }
    }
  }

  return null
}

export function getLearningPathPillarLabel(pillarId: string) {
  return getLearningPathPillarById(pillarId)?.title ?? pillarId
}
