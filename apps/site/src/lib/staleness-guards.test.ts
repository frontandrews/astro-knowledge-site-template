import { access, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { buildSearchIndex } from '../../scripts/build-search-index.mjs'
import { syncCollections } from '../../scripts/sync-content.mjs'

async function pathExists(targetPath: string) {
  try {
    await access(targetPath)
    return true
  } catch {
    return false
  }
}

const tempDirs: string[] = []

async function createTempDir(prefix: string) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), prefix))
  tempDirs.push(tempDir)
  return tempDir
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((tempDir) => rm(tempDir, { force: true, recursive: true })))
})

describe('staleness guards', () => {
  it('replaces synced content instead of keeping files removed from the source', async () => {
    const tempDir = await createTempDir('seniorpath-sync-')
    const sourceDir = path.join(tempDir, 'source', 'articles')
    const syncedContentRoot = path.join(tempDir, '.content')
    const staleFile = path.join(syncedContentRoot, 'articles', 'en', 'stale-article.md')

    await mkdir(path.join(sourceDir, 'en'), { recursive: true })
    await writeFile(path.join(sourceDir, 'en', 'fresh-article.md'), '# Fresh article\n', 'utf8')

    const manifest = {
      sections: [
        {
          id: 'articles',
          labels: { en: 'Articles', 'pt-br': 'Artigos' },
          pageType: 'articles',
          routes: { en: 'articles', 'pt-br': 'artigos' },
          sourceDir: 'collections/articles',
        },
      ],
    }
    const entries = [
      {
        collection: 'articles',
        sectionId: 'articles',
        sourceDir,
      },
    ]

    await syncCollections({
      entries,
      manifest,
      syncedContentRoot,
      syncTargets: ['articles'],
    })

    expect(await pathExists(path.join(syncedContentRoot, 'articles', 'en', 'fresh-article.md'))).toBe(true)

    await rm(path.join(sourceDir, 'en', 'fresh-article.md'), { force: true })
    await writeFile(path.join(sourceDir, 'en', 'replacement-article.md'), '# Replacement article\n', 'utf8')
    await writeFile(staleFile, '# This file should be replaced on the next sync\n', 'utf8')

    await syncCollections({
      entries,
      manifest,
      syncedContentRoot,
      syncTargets: ['articles'],
    })

    expect(await pathExists(staleFile)).toBe(false)
    expect(await pathExists(path.join(syncedContentRoot, 'articles', 'en', 'replacement-article.md'))).toBe(true)
  })

  it('rebuilds pagefind from scratch instead of preserving stale runtime files', async () => {
    const tempDir = await createTempDir('seniorpath-pagefind-')
    const distRoot = path.join(tempDir, 'dist')
    const stalePagefindFile = path.join(distRoot, 'pagefind', 'stale-artifact.txt')

    await mkdir(path.join(distRoot, 'articles', 'fresh'), { recursive: true })
    await writeFile(
      path.join(distRoot, 'index.html'),
      '<!doctype html><html><body><main data-pagefind-body><h1>Home</h1></main></body></html>',
      'utf8',
    )
    await writeFile(
      path.join(distRoot, 'articles', 'fresh', 'index.html'),
      '<!doctype html><html><body><main data-pagefind-body><h1>Fresh article</h1></main></body></html>',
      'utf8',
    )

    const firstBuild = await buildSearchIndex({ distRoot })
    expect(firstBuild.indexedPages).toBe(2)

    await writeFile(stalePagefindFile, 'remove me on the next search build', 'utf8')

    const secondBuild = await buildSearchIndex({ distRoot })

    expect(secondBuild.indexedPages).toBe(2)
    expect(await pathExists(stalePagefindFile)).toBe(false)
  })
})
