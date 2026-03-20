export type PathLocale = 'en' | 'pt-br'

export type PathRouteSegment = Record<PathLocale, string>

export type PathBranch = {
  guideId: string
  id: string
  routeSegment: PathRouteSegment
  summary: string
  title: string
}

export type PathPillar = {
  branches: PathBranch[]
  id: string
  order: number
  routeSegment: PathRouteSegment
  summary: string
  title: string
}

function createRouteSegment(en: string, ptBr: string): PathRouteSegment {
  return {
    en,
    'pt-br': ptBr,
  }
}

function normalizePathLocale(locale?: string): PathLocale {
  return locale === 'pt-br' ? 'pt-br' : 'en'
}

export const PATH_TO_SENIOR_PILLARS: PathPillar[] = [
  {
    id: 'thinking-like-a-senior',
    order: 1,
    routeSegment: createRouteSegment('thinking-like-a-senior', 'pensar-como-senior'),
    title: 'Thinking Like a Senior',
    summary:
      'The mental foundation: trade-offs, constraints, clarity, and the habit of writing code for humans instead of only for compilers.',
    branches: [
      {
        id: 'problem-breakdown',
        guideId: 'breaking-down-problems-without-panic',
        routeSegment: createRouteSegment('problem-breakdown', 'quebrar-o-problema'),
        title: 'Problem Breakdown',
        summary: 'How to decompose messy problems without panicking or jumping too early into code.',
      },
      {
        id: 'trade-offs-and-constraints',
        guideId: 'trade-offs-and-constraints-without-fake-certainty',
        routeSegment: createRouteSegment('trade-offs-and-constraints', 'trade-offs-e-limites'),
        title: 'Trade-offs and Constraints',
        summary: 'How senior engineers make decisions when there is no perfect option.',
      },
      {
        id: 'code-for-humans',
        guideId: 'writing-code-people-can-read',
        routeSegment: createRouteSegment('code-for-humans', 'codigo-para-humanos'),
        title: 'Code for Humans',
        summary: 'Reading, naming, and structuring code so a team can move faster later.',
      },
    ],
  },
  {
    id: 'runtime-and-execution',
    order: 2,
    routeSegment: createRouteSegment('runtime-and-execution', 'como-o-codigo-roda'),
    title: 'Runtime & Execution',
    summary:
      'What the platform is really doing: event loop, scheduling, memory, async behavior, and execution order without hand-waving.',
    branches: [
      {
        id: 'event-loop-and-order',
        guideId: 'javascript-event-loop',
        routeSegment: createRouteSegment('event-loop-and-order', 'event-loop-e-ordem'),
        title: 'Event Loop and Execution Order',
        summary: 'Why async code runs in surprising order and how to reason about it fast.',
      },
      {
        id: 'concurrency-and-parallelism',
        guideId: 'node-single-thread',
        routeSegment: createRouteSegment('concurrency-and-parallelism', 'concorrencia-e-paralelismo'),
        title: 'Concurrency and Parallelism',
        summary: 'What changes when tasks overlap, what does not, and where Node fits.',
      },
      {
        id: 'memory-basics',
        guideId: 'memory-basics-without-theatre',
        routeSegment: createRouteSegment('memory-basics', 'memoria'),
        title: 'Memory Basics',
        summary: 'Stack, heap, references, leaks, and the practical impact of all of that.',
      },
    ],
  },
  {
    id: 'problem-solving-and-interview-thinking',
    order: 3,
    routeSegment: createRouteSegment(
      'problem-solving-and-interview-thinking',
      'pensamento-de-entrevista-e-resolucao-de-problemas',
    ),
    title: 'Problem Solving & Interview Thinking',
    summary:
      'How to approach coding interviews without cargo-culting patterns: think first, explain clearly, then improve the solution.',
    branches: [
      {
        id: 'approach-and-framing',
        guideId: 'thinking-before-you-code-in-interviews',
        routeSegment: createRouteSegment('approach-and-framing', 'abordagem'),
        title: 'Approach and Framing',
        summary: 'How to start a problem, clarify assumptions, and avoid rushing into the wrong solution.',
      },
      {
        id: 'pattern-recognition',
        guideId: 'recognizing-patterns-without-memorizing-tricks',
        routeSegment: createRouteSegment('pattern-recognition', 'reconhecer-padroes'),
        title: 'Pattern Recognition',
        summary: 'Spotting useful shapes without memorizing a giant list of tricks.',
      },
      {
        id: 'communicating-solutions',
        guideId: 'explaining-your-solution-without-losing-the-thread',
        routeSegment: createRouteSegment('communicating-solutions', 'explicar-solucoes'),
        title: 'Communicating Solutions',
        summary: 'Explaining trade-offs and decisions in a way interviewers can trust.',
      },
    ],
  },
  {
    id: 'state-and-ui-thinking',
    order: 4,
    routeSegment: createRouteSegment('state-and-ui-thinking', 'estado-e-interface'),
    title: 'State & UI Thinking',
    summary:
      'Frontend reasoning without mental bugs: state, rendering, effects, boundaries, and data fetching decisions.',
    branches: [
      {
        id: 'state-ownership',
        guideId: 'state-ownership-without-confusion',
        routeSegment: createRouteSegment('state-ownership', 'estado'),
        title: 'State Ownership',
        summary: 'How to decide what should be state, derived data, or just computation.',
      },
      {
        id: 'effects-and-side-effects',
        guideId: 'effects-without-the-mess',
        routeSegment: createRouteSegment('effects-and-side-effects', 'effects'),
        title: 'Effects and Side Effects',
        summary: 'Why effects get messy and how to keep them from turning into bug magnets.',
      },
      {
        id: 'server-and-client-thinking',
        guideId: 'server-and-client-thinking-without-confusion',
        routeSegment: createRouteSegment('server-and-client-thinking', 'cliente-e-servidor'),
        title: 'Server and Client Thinking',
        summary: 'How to choose where work should happen in modern React and Next-style systems.',
      },
    ],
  },
  {
    id: 'data-and-persistence',
    order: 5,
    routeSegment: createRouteSegment('data-and-persistence', 'dados-e-armazenamento'),
    title: 'Data & Persistence',
    summary:
      'How to model data, choose storage, reason about indexing, and balance consistency with practicality.',
    branches: [
      {
        id: 'data-modeling',
        guideId: 'data-modeling-without-overcomplicating',
        routeSegment: createRouteSegment('data-modeling', 'modelagem-de-dados'),
        title: 'Data Modeling',
        summary: 'Turning messy business rules into durable models without overcomplicating them.',
      },
      {
        id: 'sql-vs-nosql',
        guideId: 'sql-vs-nosql-without-slogans',
        routeSegment: createRouteSegment('sql-vs-nosql', 'sql-vs-nosql'),
        title: 'SQL vs NoSQL',
        summary: 'Choosing storage based on access patterns and trade-offs, not slogans.',
      },
      {
        id: 'cache-and-consistency',
        guideId: 'cache-and-consistency-without-self-deception',
        routeSegment: createRouteSegment('cache-and-consistency', 'cache-e-consistencia'),
        title: 'Cache and Consistency',
        summary: 'When caching helps, when it lies, and what that means for real systems.',
      },
    ],
  },
  {
    id: 'system-thinking',
    order: 6,
    routeSegment: createRouteSegment('system-thinking', 'sistemas-na-pratica'),
    title: 'System Thinking',
    summary:
      'Architecture and scale without diagram theater: bottlenecks, failure modes, queues, APIs, and resilient system choices.',
    branches: [
      {
        id: 'scalability-and-bottlenecks',
        guideId: 'scalability-and-bottlenecks-without-theatre',
        routeSegment: createRouteSegment('scalability-and-bottlenecks', 'escala-e-gargalos'),
        title: 'Scalability and Bottlenecks',
        summary: 'What actually breaks first when traffic or complexity goes up.',
      },
      {
        id: 'api-and-service-design',
        guideId: 'api-and-service-design-with-clear-boundaries',
        routeSegment: createRouteSegment('api-and-service-design', 'api-e-servicos'),
        title: 'API and Service Design',
        summary: 'Designing boundaries that stay understandable and survive growth.',
      },
      {
        id: 'ai-systems-and-retrieval',
        guideId: 'rag-vs-fine-tuning',
        routeSegment: createRouteSegment('ai-systems-and-retrieval', 'ia-e-retrieval'),
        title: 'AI Systems and Retrieval',
        summary: 'RAG, evaluation, context, and LLM product trade-offs framed as system decisions.',
      },
    ],
  },
  {
    id: 'debugging-and-production-thinking',
    order: 7,
    routeSegment: createRouteSegment('debugging-and-production-thinking', 'debug-e-producao'),
    title: 'Debugging & Production Thinking',
    summary:
      'The layer where senior engineers stand out: reproducing issues, reading signals, and handling failure in real environments.',
    branches: [
      {
        id: 'production-failures',
        guideId: 'production-failures-without-guessing',
        routeSegment: createRouteSegment('production-failures', 'falhas-em-producao'),
        title: 'Production Failures',
        summary: 'Why things break only after deploy and how to approach that without guessing.',
      },
      {
        id: 'logs-and-observability',
        guideId: 'logs-and-observability-without-noise',
        routeSegment: createRouteSegment('logs-and-observability', 'logs-e-observabilidade'),
        title: 'Logs and Observability',
        summary: 'Which signals help, which ones create noise, and how to instrument for clarity.',
      },
      {
        id: 'async-and-race-bugs',
        guideId: 'async-and-race-bugs-without-drama',
        routeSegment: createRouteSegment('async-and-race-bugs', 'bugs-assincronos'),
        title: 'Async and Race Bugs',
        summary: 'The weird failures that happen when timing becomes part of the problem.',
      },
    ],
  },
  {
    id: 'patterns-that-actually-matter',
    order: 8,
    routeSegment: createRouteSegment('patterns-that-actually-matter', 'padroes-que-ajudam-de-verdade'),
    title: 'Patterns That Actually Matter',
    summary:
      'Patterns as tools, not trophies: composition, abstraction, reuse, and the discipline to avoid overengineering.',
    branches: [
      {
        id: 'composition-vs-abstraction',
        guideId: 'composition-vs-abstraction-without-theatre',
        routeSegment: createRouteSegment('composition-vs-abstraction', 'composicao-vs-abstracao'),
        title: 'Composition vs Abstraction',
        summary: 'How to keep systems flexible without turning them into generic mush.',
      },
      {
        id: 'reuse-vs-complexity',
        guideId: 'reuse-without-extra-complexity',
        routeSegment: createRouteSegment('reuse-vs-complexity', 'reuso-vs-complexidade'),
        title: 'Reuse vs Complexity',
        summary: 'When sharing logic saves time and when it makes everything harder.',
      },
      {
        id: 'avoiding-overengineering',
        guideId: 'avoiding-overengineering-without-regret',
        routeSegment: createRouteSegment('avoiding-overengineering', 'evitar-overengineering'),
        title: 'Avoiding Overengineering',
        summary: 'Knowing what not to build yet is part of senior judgment.',
      },
    ],
  },
  {
    id: 'performance-that-makes-sense',
    order: 9,
    routeSegment: createRouteSegment('performance-that-makes-sense', 'performance-sem-achismo'),
    title: 'Performance That Makes Sense',
    summary:
      'Performance decisions grounded in measurement and user impact instead of folklore and premature optimization.',
    branches: [
      {
        id: 'bottleneck-detection',
        guideId: 'bottleneck-detection-without-guessing',
        routeSegment: createRouteSegment('bottleneck-detection', 'gargalos'),
        title: 'Bottleneck Detection',
        summary: 'Finding the actual reason an experience feels slow before touching code.',
      },
      {
        id: 'rendering-network-and-cpu',
        guideId: 'rendering-network-and-cpu-without-mixing-them-up',
        routeSegment: createRouteSegment('rendering-network-and-cpu', 'renderizacao-rede-e-cpu'),
        title: 'Rendering, Network, and CPU',
        summary: 'How to separate different performance problems instead of calling all of them "slow".',
      },
      {
        id: 'measurement-before-optimization',
        guideId: 'measure-before-you-optimize',
        routeSegment: createRouteSegment('measurement-before-optimization', 'medicao-e-otimizacao'),
        title: 'Measurement Before Optimization',
        summary: 'Why guesses are expensive and lightweight measurement changes the conversation.',
      },
    ],
  },
  {
    id: 'security-thinking',
    order: 10,
    routeSegment: createRouteSegment('security-thinking', 'seguranca-na-pratica'),
    title: 'Security Thinking',
    summary:
      'Practical security for product engineers: trust boundaries, input handling, auth mistakes, and safer defaults.',
    branches: [
      {
        id: 'trust-boundaries',
        guideId: 'trust-boundaries-without-hand-waving',
        routeSegment: createRouteSegment('trust-boundaries', 'fronteiras-de-confianca'),
        title: 'Trust Boundaries',
        summary: 'Where assumptions stop being safe and security bugs usually begin.',
      },
      {
        id: 'auth-and-authorization',
        guideId: 'auth-and-authorization-without-mixing-them-up',
        routeSegment: createRouteSegment('auth-and-authorization', 'autenticacao-e-autorizacao'),
        title: 'Auth and Authorization',
        summary: 'Identity, permissions, sessions, and the mistakes teams repeat.',
      },
      {
        id: 'input-and-api-safety',
        guideId: 'safer-input-and-api-design',
        routeSegment: createRouteSegment('input-and-api-safety', 'seguranca-de-entradas-e-apis'),
        title: 'Input and API Safety',
        summary: 'Handling user input and external calls without inviting avoidable problems.',
      },
    ],
  },
  {
    id: 'accessibility-that-actually-matters',
    order: 11,
    routeSegment: createRouteSegment('accessibility-that-actually-matters', 'acessibilidade-que-importa'),
    title: 'Accessibility That Actually Matters',
    summary:
      'Accessibility as a product quality layer: keyboard use, semantics, assistive tech, and inclusive interaction patterns.',
    branches: [
      {
        id: 'semantics-and-structure',
        guideId: 'semantics-and-structure-that-actually-help',
        routeSegment: createRouteSegment('semantics-and-structure', 'estrutura-e-semantica'),
        title: 'Semantics and Structure',
        summary: 'Using HTML and UI primitives in a way assistive tools can actually understand.',
      },
      {
        id: 'keyboard-and-focus',
        guideId: 'keyboard-and-focus-without-frustration',
        routeSegment: createRouteSegment('keyboard-and-focus', 'teclado-e-foco'),
        title: 'Keyboard and Focus',
        summary: 'How navigation, focus, and interaction fall apart when you only test with a mouse.',
      },
      {
        id: 'accessible-react-components',
        guideId: 'accessible-react-components-without-hacks',
        routeSegment: createRouteSegment('accessible-react-components', 'componentes-react-acessiveis'),
        title: 'Accessible React Components',
        summary: 'Making interactive components usable without turning accessibility into a checklist ritual.',
      },
    ],
  },
  {
    id: 'execution-and-communication',
    order: 12,
    routeSegment: createRouteSegment('execution-and-communication', 'execucao-e-comunicacao'),
    title: 'Execution & Communication',
    summary:
      'How senior engineers work in real teams: scoping, ticket handling, estimation, performance triage, and clear communication.',
    branches: [
      {
        id: 'ticket-and-task-thinking',
        guideId: 'ticket-and-task-thinking-with-clarity',
        routeSegment: createRouteSegment('ticket-and-task-thinking', 'tickets-e-tarefas'),
        title: 'Ticket and Task Thinking',
        summary: 'How to approach work, ask the right questions, and avoid coding the wrong thing.',
      },
      {
        id: 'estimation-and-risk',
        guideId: 'estimation-and-risk-without-fake-certainty',
        routeSegment: createRouteSegment('estimation-and-risk', 'estimativa-e-risco'),
        title: 'Estimation and Risk',
        summary: 'Estimating with uncertainty, surfacing risk, and keeping plans honest.',
      },
      {
        id: 'communication-in-work-and-interviews',
        guideId: 'communication-in-work-and-interviews-with-clarity',
        routeSegment: createRouteSegment('communication-in-work-and-interviews', 'comunicacao'),
        title: 'Communication in Work and Interviews',
        summary: 'Status updates, thinking out loud, disagreement, and what senior clarity sounds like.',
      },
    ],
  },
  {
    id: 'real-world-scenarios',
    order: 13,
    routeSegment: createRouteSegment('real-world-scenarios', 'cenarios-reais'),
    title: 'Real-World Scenarios',
    summary:
      'Applied scenarios that connect the whole system: scale, failure, AI features, slow apps, and messy production decisions.',
    branches: [
      {
        id: 'scalable-api-scenarios',
        guideId: 'scalable-api-scenarios-without-diagram-theatre',
        routeSegment: createRouteSegment('scalable-api-scenarios', 'apis-em-escala'),
        title: 'Scalable API Scenarios',
        summary: 'Designing and evolving APIs under real load and real product constraints.',
      },
      {
        id: 'failure-and-recovery-scenarios',
        guideId: 'failure-and-recovery-scenarios-with-clarity',
        routeSegment: createRouteSegment('failure-and-recovery-scenarios', 'falha-e-recuperacao'),
        title: 'Failure and Recovery Scenarios',
        summary: 'How to handle partial outages, degraded states, and practical resilience.',
      },
      {
        id: 'ai-feature-scenarios',
        guideId: 'ai-feature-scenarios-with-product-judgment',
        routeSegment: createRouteSegment('ai-feature-scenarios', 'cenarios-com-ia'),
        title: 'AI Feature Scenarios',
        summary: 'Shipping AI-backed features with better judgment around evaluation, retrieval, and failure.',
      },
    ],
  },
]

export function getPathPillarById(pillarId: string) {
  return PATH_TO_SENIOR_PILLARS.find((pillar) => pillar.id === pillarId)
}

export function getPathBranchById(pillarId: string, branchId: string) {
  return getPathPillarById(pillarId)?.branches.find((branch) => branch.id === branchId)
}

export function getPathPillarByRouteSegment(routeSegment: string, locale = 'en') {
  const normalizedLocale = normalizePathLocale(locale)

  return PATH_TO_SENIOR_PILLARS.find((pillar) => pillar.routeSegment[normalizedLocale] === routeSegment)
}

export function getPathBranchByRouteSegment(pillarId: string, routeSegment: string, locale = 'en') {
  const pillar = getPathPillarById(pillarId)

  if (!pillar) {
    return undefined
  }

  const normalizedLocale = normalizePathLocale(locale)

  return pillar.branches.find((branch) => branch.routeSegment[normalizedLocale] === routeSegment)
}

export function getPathPillarRouteSegment(pillarId: string, locale = 'en') {
  const normalizedLocale = normalizePathLocale(locale)

  return getPathPillarById(pillarId)?.routeSegment[normalizedLocale]
}

export function getPathBranchRouteSegment(pillarId: string, branchId: string, locale = 'en') {
  const normalizedLocale = normalizePathLocale(locale)

  return getPathBranchById(pillarId, branchId)?.routeSegment[normalizedLocale]
}

export function getPathLocationByGuideId(guideId: string) {
  for (const pillar of PATH_TO_SENIOR_PILLARS) {
    for (const branch of pillar.branches) {
      if (branch.guideId === guideId) {
        return { branch, pillar }
      }
    }
  }

  return undefined
}

export function getPathPillarLabel(pillarId: string) {
  return getPathPillarById(pillarId)?.title ?? pillarId
}
