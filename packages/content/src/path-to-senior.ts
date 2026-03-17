export type PathBranch = {
  id: string
  summary: string
  title: string
}

export type PathPillar = {
  branches: PathBranch[]
  id: string
  legacyTopics: string[]
  legacyTracks: string[]
  order: number
  summary: string
  title: string
}

export const PATH_TO_SENIOR_PILLARS: PathPillar[] = [
  {
    id: 'thinking-like-a-senior',
    order: 1,
    title: 'Thinking Like a Senior',
    summary:
      'The mental foundation: trade-offs, constraints, clarity, and the habit of writing code for humans instead of only for compilers.',
    legacyTopics: [],
    legacyTracks: [],
    branches: [
      {
        id: 'problem-breakdown',
        title: 'Problem Breakdown',
        summary: 'How to decompose messy problems without panicking or jumping too early into code.',
      },
      {
        id: 'trade-offs-and-constraints',
        title: 'Trade-offs and Constraints',
        summary: 'How senior engineers make decisions when there is no perfect option.',
      },
      {
        id: 'code-for-humans',
        title: 'Code for Humans',
        summary: 'Reading, naming, and structuring code so a team can move faster later.',
      },
    ],
  },
  {
    id: 'runtime-and-execution',
    order: 2,
    title: 'Runtime & Execution',
    summary:
      'What the platform is really doing: event loop, scheduling, memory, async behavior, and execution order without hand-waving.',
    legacyTopics: ['javascript', 'node'],
    legacyTracks: [],
    branches: [
      {
        id: 'event-loop-and-order',
        title: 'Event Loop and Execution Order',
        summary: 'Why async code runs in surprising order and how to reason about it fast.',
      },
      {
        id: 'concurrency-and-parallelism',
        title: 'Concurrency and Parallelism',
        summary: 'What changes when tasks overlap, what does not, and where Node fits.',
      },
      {
        id: 'memory-basics',
        title: 'Memory Basics',
        summary: 'Stack, heap, references, leaks, and the practical impact of all of that.',
      },
    ],
  },
  {
    id: 'problem-solving-and-interview-thinking',
    order: 3,
    title: 'Problem Solving & Interview Thinking',
    summary:
      'How to approach coding interviews without cargo-culting patterns: think first, explain clearly, then improve the solution.',
    legacyTopics: ['coding-interview'],
    legacyTracks: [],
    branches: [
      {
        id: 'approach-and-framing',
        title: 'Approach and Framing',
        summary: 'How to start a problem, clarify assumptions, and avoid rushing into the wrong solution.',
      },
      {
        id: 'pattern-recognition',
        title: 'Pattern Recognition',
        summary: 'Spotting useful shapes without memorizing a giant list of tricks.',
      },
      {
        id: 'communicating-solutions',
        title: 'Communicating Solutions',
        summary: 'Explaining trade-offs and decisions in a way interviewers can trust.',
      },
    ],
  },
  {
    id: 'state-and-ui-thinking',
    order: 4,
    title: 'State & UI Thinking',
    summary:
      'Frontend reasoning without mental bugs: state, rendering, effects, boundaries, and data fetching decisions.',
    legacyTopics: ['react'],
    legacyTracks: [],
    branches: [
      {
        id: 'state-ownership',
        title: 'State Ownership',
        summary: 'How to decide what should be state, derived data, or just computation.',
      },
      {
        id: 'effects-and-side-effects',
        title: 'Effects and Side Effects',
        summary: 'Why effects get messy and how to keep them from turning into bug magnets.',
      },
      {
        id: 'server-and-client-thinking',
        title: 'Server and Client Thinking',
        summary: 'How to choose where work should happen in modern React and Next-style systems.',
      },
    ],
  },
  {
    id: 'data-and-persistence',
    order: 5,
    title: 'Data & Persistence',
    summary:
      'How to model data, choose storage, reason about indexing, and balance consistency with practicality.',
    legacyTopics: [],
    legacyTracks: [],
    branches: [
      {
        id: 'data-modeling',
        title: 'Data Modeling',
        summary: 'Turning messy business rules into durable models without overcomplicating them.',
      },
      {
        id: 'sql-vs-nosql',
        title: 'SQL vs NoSQL',
        summary: 'Choosing storage based on access patterns and trade-offs, not slogans.',
      },
      {
        id: 'cache-and-consistency',
        title: 'Cache and Consistency',
        summary: 'When caching helps, when it lies, and what that means for real systems.',
      },
    ],
  },
  {
    id: 'system-thinking',
    order: 6,
    title: 'System Thinking',
    summary:
      'Architecture and scale without diagram theater: bottlenecks, failure modes, queues, APIs, and resilient system choices.',
    legacyTopics: ['system-design', 'ai-engineering'],
    legacyTracks: ['systems', 'ai-engineering'],
    branches: [
      {
        id: 'scalability-and-bottlenecks',
        title: 'Scalability and Bottlenecks',
        summary: 'What actually breaks first when traffic or complexity goes up.',
      },
      {
        id: 'api-and-service-design',
        title: 'API and Service Design',
        summary: 'Designing boundaries that stay understandable and survive growth.',
      },
      {
        id: 'ai-systems-and-retrieval',
        title: 'AI Systems and Retrieval',
        summary: 'RAG, evaluation, context, and LLM product trade-offs framed as system decisions.',
      },
    ],
  },
  {
    id: 'debugging-and-production-thinking',
    order: 7,
    title: 'Debugging & Production Thinking',
    summary:
      'The layer where senior engineers stand out: reproducing issues, reading signals, and handling failure in real environments.',
    legacyTopics: [],
    legacyTracks: [],
    branches: [
      {
        id: 'production-failures',
        title: 'Production Failures',
        summary: 'Why things break only after deploy and how to approach that without guessing.',
      },
      {
        id: 'logs-and-observability',
        title: 'Logs and Observability',
        summary: 'Which signals help, which ones create noise, and how to instrument for clarity.',
      },
      {
        id: 'async-and-race-bugs',
        title: 'Async and Race Bugs',
        summary: 'The weird failures that happen when timing becomes part of the problem.',
      },
    ],
  },
  {
    id: 'patterns-that-actually-matter',
    order: 8,
    title: 'Patterns That Actually Matter',
    summary:
      'Patterns as tools, not trophies: composition, abstraction, reuse, and the discipline to avoid overengineering.',
    legacyTopics: [],
    legacyTracks: [],
    branches: [
      {
        id: 'composition-vs-abstraction',
        title: 'Composition vs Abstraction',
        summary: 'How to keep systems flexible without turning them into generic mush.',
      },
      {
        id: 'reuse-vs-complexity',
        title: 'Reuse vs Complexity',
        summary: 'When sharing logic saves time and when it makes everything harder.',
      },
      {
        id: 'avoiding-overengineering',
        title: 'Avoiding Overengineering',
        summary: 'Knowing what not to build yet is part of senior judgment.',
      },
    ],
  },
  {
    id: 'performance-that-makes-sense',
    order: 9,
    title: 'Performance That Makes Sense',
    summary:
      'Performance decisions grounded in measurement and user impact instead of folklore and premature optimization.',
    legacyTopics: [],
    legacyTracks: [],
    branches: [
      {
        id: 'bottleneck-detection',
        title: 'Bottleneck Detection',
        summary: 'Finding the actual reason an experience feels slow before touching code.',
      },
      {
        id: 'rendering-network-and-cpu',
        title: 'Rendering, Network, and CPU',
        summary: 'How to separate different performance problems instead of calling all of them "slow".',
      },
      {
        id: 'measurement-before-optimization',
        title: 'Measurement Before Optimization',
        summary: 'Why guesses are expensive and lightweight measurement changes the conversation.',
      },
    ],
  },
  {
    id: 'security-thinking',
    order: 10,
    title: 'Security Thinking',
    summary:
      'Practical security for product engineers: trust boundaries, input handling, auth mistakes, and safer defaults.',
    legacyTopics: [],
    legacyTracks: [],
    branches: [
      {
        id: 'trust-boundaries',
        title: 'Trust Boundaries',
        summary: 'Where assumptions stop being safe and security bugs usually begin.',
      },
      {
        id: 'auth-and-authorization',
        title: 'Auth and Authorization',
        summary: 'Identity, permissions, sessions, and the mistakes teams repeat.',
      },
      {
        id: 'input-and-api-safety',
        title: 'Input and API Safety',
        summary: 'Handling user input and external calls without inviting avoidable problems.',
      },
    ],
  },
  {
    id: 'accessibility-that-actually-matters',
    order: 11,
    title: 'Accessibility That Actually Matters',
    summary:
      'Accessibility as a product quality layer: keyboard use, semantics, assistive tech, and inclusive interaction patterns.',
    legacyTopics: [],
    legacyTracks: [],
    branches: [
      {
        id: 'semantics-and-structure',
        title: 'Semantics and Structure',
        summary: 'Using HTML and UI primitives in a way assistive tools can actually understand.',
      },
      {
        id: 'keyboard-and-focus',
        title: 'Keyboard and Focus',
        summary: 'How navigation, focus, and interaction fall apart when you only test with a mouse.',
      },
      {
        id: 'accessible-react-components',
        title: 'Accessible React Components',
        summary: 'Making interactive components usable without turning accessibility into a checklist ritual.',
      },
    ],
  },
  {
    id: 'execution-and-communication',
    order: 12,
    title: 'Execution & Communication',
    summary:
      'How senior engineers work in real teams: scoping, ticket handling, estimation, performance triage, and clear communication.',
    legacyTopics: ['delivery', 'leadership', 'tech-english'],
    legacyTracks: ['english-for-tech', 'leadership-and-delivery'],
    branches: [
      {
        id: 'ticket-and-task-thinking',
        title: 'Ticket and Task Thinking',
        summary: 'How to approach work, ask the right questions, and avoid coding the wrong thing.',
      },
      {
        id: 'estimation-and-risk',
        title: 'Estimation and Risk',
        summary: 'Estimating with uncertainty, surfacing risk, and keeping plans honest.',
      },
      {
        id: 'communication-in-work-and-interviews',
        title: 'Communication in Work and Interviews',
        summary: 'Status updates, thinking out loud, disagreement, and what senior clarity sounds like.',
      },
    ],
  },
  {
    id: 'real-world-scenarios',
    order: 13,
    title: 'Real-World Scenarios',
    summary:
      'Applied scenarios that connect the whole system: scale, failure, AI features, slow apps, and messy production decisions.',
    legacyTopics: [],
    legacyTracks: [],
    branches: [
      {
        id: 'scalable-api-scenarios',
        title: 'Scalable API Scenarios',
        summary: 'Designing and evolving APIs under real load and real product constraints.',
      },
      {
        id: 'failure-and-recovery-scenarios',
        title: 'Failure and Recovery Scenarios',
        summary: 'How to handle partial outages, degraded states, and practical resilience.',
      },
      {
        id: 'ai-feature-scenarios',
        title: 'AI Feature Scenarios',
        summary: 'Shipping AI-backed features with better judgment around evaluation, retrieval, and failure.',
      },
    ],
  },
]

export const LEGACY_TRACK_TO_PATH_PILLAR: Record<string, string> = {
  'ai-engineering': 'system-thinking',
  'english-for-tech': 'execution-and-communication',
  'leadership-and-delivery': 'execution-and-communication',
  programming: 'problem-solving-and-interview-thinking',
  systems: 'system-thinking',
}

export const LEGACY_TOPIC_TO_PATH_PILLAR: Record<string, string> = {
  'ai-engineering': 'system-thinking',
  'coding-interview': 'problem-solving-and-interview-thinking',
  delivery: 'execution-and-communication',
  javascript: 'runtime-and-execution',
  leadership: 'execution-and-communication',
  node: 'runtime-and-execution',
  react: 'state-and-ui-thinking',
  'system-design': 'system-thinking',
  'tech-english': 'execution-and-communication',
}

export function getPathPillarById(pillarId: string) {
  return PATH_TO_SENIOR_PILLARS.find((pillar) => pillar.id === pillarId)
}

export function getPathPillarLabel(pillarId: string) {
  return getPathPillarById(pillarId)?.title ?? pillarId
}
