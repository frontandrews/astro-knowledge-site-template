import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))

const contractPairs = [
  [
    'examples/starter-content/collections/roadmaps/roadmaps.ts',
    'templates/content-repo/collections/roadmaps/roadmaps.ts',
  ],
  [
    'examples/starter-content/collections/roadmaps/learning-paths.ts',
    'templates/content-repo/collections/roadmaps/learning-paths.ts',
  ],
  [
    'examples/starter-content/collections/roadmaps/article-registry.ts',
    'templates/content-repo/collections/roadmaps/article-registry.ts',
  ],
]

function normalizeSource(source) {
  return source.replace(/\r\n/g, '\n')
}

async function comparePair([leftPath, rightPath]) {
  const [leftSource, rightSource] = await Promise.all([
    readFile(path.join(repoRoot, leftPath), 'utf8'),
    readFile(path.join(repoRoot, rightPath), 'utf8'),
  ])

  return normalizeSource(leftSource) === normalizeSource(rightSource)
}

const mismatches = []

for (const pair of contractPairs) {
  if (!(await comparePair(pair))) {
    mismatches.push(pair)
  }
}

if (mismatches.length > 0) {
  throw new Error(
    [
      'Starter content and content-repo template drifted in editorial contract files.',
      ...mismatches.map(([leftPath, rightPath]) => `- ${leftPath} <> ${rightPath}`),
      'Keep these pairs identical so starter and external mode evolve under the same contract.',
    ].join('\n'),
  )
}

console.log('[content-drift] starter and template editorial contracts are in sync.')
