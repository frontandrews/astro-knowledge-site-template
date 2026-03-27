import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('../../..', import.meta.url))
const starterContentRoot = path.join(repoRoot, 'examples', 'starter-content')
const articleFixtureCount = 25

function buildArticleFixture({
  articleId,
  branchId = 'first-clone',
  date,
  description,
  fileSlug,
  locale,
  order = 100,
  pathLabels,
  summary,
  title,
}) {
  return `---
articleId: ${articleId}
title: ${title}
description: ${description}
summary: ${summary}
category: Template
kind: article
level: beginner
locale: ${locale}
order: ${order}
path:
  - ${pathLabels[0]}
  - ${pathLabels[1]}
practiceChecklist:
  - Validate archive pagination in e2e.
relationships: []
relatedDeckIds: []
readiness:
  draft_complete: true
  examples_added: true
  interview_angle: false
  language_simple: true
  practice_items_filled: true
  reasoning_complete: true
  relationships_set: true
  senior_layer: true
  takeaways_filled: true
  voice_human: true
status: active
takeaways:
  - Generated test fixture ${fileSlug}.
tags:
  - test
  - pagination
topicIds:
  - delivery
trackEligible: false
pillarId: foundations
branchId: ${branchId}
pubDate: ${date}
---
## ${title}

This article is generated only for local e2e pagination coverage.
`
}

function buildRecommendationFixture({
  articleId,
  description,
  fileSlug,
  order,
  relationships,
  summary,
  title,
  topicIds,
}) {
  const relationshipLines = relationships.length > 0
    ? relationships.map((relationship) => `  - ${relationship}`).join('\n')
    : '  []'
  const topicLines = topicIds.length > 0
    ? topicIds.map((topicId) => `  - ${topicId}`).join('\n')
    : '  - delivery'

  return `---
articleId: ${articleId}
title: ${title}
description: ${description}
summary: ${summary}
category: Template
kind: article
level: beginner
locale: en
order: ${order}
path:
  - Starter
  - Next steps
practiceChecklist:
  - Validate next-step recommendation ordering in e2e.
relationships:
${relationshipLines}
relatedDeckIds: []
readiness:
  draft_complete: true
  examples_added: true
  interview_angle: false
  language_simple: true
  practice_items_filled: true
  reasoning_complete: true
  relationships_set: true
  senior_layer: true
  takeaways_filled: true
  voice_human: true
status: active
takeaways:
  - Generated next-step recommendation fixture ${fileSlug}.
tags:
  - test
  - next-step
topicIds:
${topicLines}
trackEligible: false
pillarId: foundations
branchId: ${fileSlug}
pubDate: 2026-03-01
updatedDate: 2026-03-02
---
## ${title}

This article is generated only for local e2e recommendation coverage.
`
}

async function populatePaginationFixtures(contentRoot) {
  const enDir = path.join(contentRoot, 'collections', 'articles', 'en', 'foundations')
  const ptDir = path.join(contentRoot, 'collections', 'articles', 'pt-br', 'fundamentos')

  await mkdir(enDir, { recursive: true })
  await mkdir(ptDir, { recursive: true })

  for (let index = 1; index <= articleFixtureCount; index += 1) {
    const padded = String(index).padStart(2, '0')
    const articleId = `pagination-smoke-${padded}`
    const date = `2026-04-${padded}`

    await writeFile(
      path.join(enDir, `pagination-smoke-${padded}.md`),
      buildArticleFixture({
        articleId,
        date,
        description: `Generated e2e article ${padded} for archive pagination coverage.`,
        fileSlug: `pagination-smoke-${padded}`,
        locale: 'en',
        pathLabels: ['Starter', 'Pagination smoke'],
        summary: `Generated archive article ${padded} for e2e smoke coverage.`,
        title: `Pagination smoke article ${padded}`,
      }),
      'utf8',
    )

    await writeFile(
      path.join(ptDir, `artigo-de-paginacao-${padded}.md`),
      buildArticleFixture({
        articleId,
        date,
        description: `Artigo gerado ${padded} para cobrir a paginacao do arquivo em e2e.`,
        fileSlug: `artigo-de-paginacao-${padded}`,
        locale: 'pt-br',
        pathLabels: ['Starter', 'Paginacao'],
        summary: `Artigo gerado ${padded} para smoke test de paginacao.`,
        title: `Artigo de paginacao ${padded}`,
      }),
      'utf8',
    )
  }
}

async function populateRecommendationFixtures(contentRoot) {
  const enDir = path.join(contentRoot, 'collections', 'articles', 'en', 'foundations')

  await mkdir(enDir, { recursive: true })

  const fixtures = [
    {
      articleId: 'next-step-root',
      description: 'Starter e2e fixture that should promote the next unread related article.',
      fileSlug: 'next-step-root',
      order: 70,
      relationships: ['next-step-estimation', 'next-step-communication'],
      summary: 'A root article for testing progress-aware next-step recommendations.',
      title: 'Next Step Root',
      topicIds: ['delivery'],
    },
    {
      articleId: 'next-step-estimation',
      description: 'Starter e2e fixture that should be skipped once it is already completed.',
      fileSlug: 'next-step-estimation',
      order: 71,
      relationships: ['next-step-communication'],
      summary: 'The first related article for next-step recommendation coverage.',
      title: 'Next Step Estimation',
      topicIds: ['delivery'],
    },
    {
      articleId: 'next-step-communication',
      description: 'Starter e2e fixture that becomes the next step after estimation is done.',
      fileSlug: 'next-step-communication',
      order: 72,
      relationships: [],
      summary: 'The fallback related article for next-step recommendation coverage.',
      title: 'Next Step Communication',
      topicIds: ['leadership'],
    },
  ]

  for (const fixture of fixtures) {
    await writeFile(
      path.join(enDir, `${fixture.fileSlug}.md`),
      buildRecommendationFixture(fixture),
      'utf8',
    )
  }
}

const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'seniorpath-e2e-content-'))
const contentRoot = path.join(tempRoot, 'content')
let cleanedUp = false
let child = null

async function cleanup() {
  if (cleanedUp) {
    return
  }

  cleanedUp = true
  await rm(tempRoot, { force: true, recursive: true }).catch(() => {})
}

async function shutdown(signal = 'SIGTERM') {
  if (child && !child.killed) {
    child.kill(signal)
  }

  await cleanup()
  process.exit(0)
}

process.on('SIGINT', () => {
  void shutdown('SIGINT')
})

process.on('SIGTERM', () => {
  void shutdown('SIGTERM')
})

try {
  await cp(starterContentRoot, contentRoot, { recursive: true })
  await populatePaginationFixtures(contentRoot)
  await populateRecommendationFixtures(contentRoot)

  child = spawn('pnpm', ['--filter', '@template/site', 'dev', '--host', '127.0.0.1', '--port', '4173'], {
    cwd: repoRoot,
    env: {
      ...process.env,
      SITE_CONTENT_DIR: contentRoot,
    },
    stdio: 'inherit',
  })

  child.on('close', async (code) => {
    await cleanup()
    process.exit(code ?? 1)
  })

  child.on('error', async (error) => {
    console.error(error)
    await cleanup()
    process.exit(1)
  })
} catch (error) {
  console.error(error)
  await cleanup()
  process.exit(1)
}
