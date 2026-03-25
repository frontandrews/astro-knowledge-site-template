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
  date,
  description,
  fileSlug,
  locale,
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
order: 100
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
branchId: first-clone
pubDate: ${date}
---
## ${title}

This article is generated only for local e2e pagination coverage.
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
