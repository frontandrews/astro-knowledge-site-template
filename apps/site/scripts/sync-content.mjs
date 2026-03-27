import { cp, mkdir, mkdtemp, open, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import {
  getSyncedContentRoot,
  pathExists,
  resolveCollectionSources,
  SYNC_TARGETS,
} from './content-source.mjs'

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

async function acquireLock(lockPath, { retryMs = 150, timeoutMs = 30000 } = {}) {
  const deadline = Date.now() + timeoutMs

  while (true) {
    try {
      return await open(lockPath, 'wx')
    } catch (error) {
      if (error?.code !== 'EEXIST') {
        throw error
      }

      if (Date.now() >= deadline) {
        throw new Error(`Timed out waiting for content sync lock: ${lockPath}`)
      }

      await sleep(retryMs)
    }
  }
}

export async function syncCollections({
  entries,
  manifest,
  syncedContentRoot = getSyncedContentRoot(),
  syncTargets = SYNC_TARGETS,
}) {
  for (const entry of entries) {
    if (!(await pathExists(entry.sourceDir))) {
      throw new Error(`The configured source for ${entry.sectionId} does not exist: ${entry.sourceDir}`)
    }
  }

  await mkdir(syncedContentRoot, { recursive: true })
  const lockPath = path.join(syncedContentRoot, '.content-sync.lock')
  const lockHandle = await acquireLock(lockPath)
  let tempRootDir = null

  try {
    tempRootDir = await mkdtemp(path.join(syncedContentRoot, '.content-sync-'))

    for (const entry of entries) {
      await cp(entry.sourceDir, path.join(tempRootDir, entry.collection), { recursive: true })
    }

    for (const collection of syncTargets) {
      await mkdir(path.join(tempRootDir, collection), { recursive: true })
    }

    await writeFile(
      path.join(tempRootDir, 'sections.manifest.mjs'),
      `export const sectionManifest = ${JSON.stringify(manifest, null, 2)}\n`,
      'utf8',
    )

    for (const collection of syncTargets) {
      const collectionTargetDir = path.join(syncedContentRoot, collection)
      await rm(collectionTargetDir, { force: true, recursive: true })
      await rename(path.join(tempRootDir, collection), collectionTargetDir)
    }

    const syncedSectionManifestPath = path.join(syncedContentRoot, 'sections.manifest.mjs')
    await rm(syncedSectionManifestPath, { force: true })
    await rename(path.join(tempRootDir, 'sections.manifest.mjs'), syncedSectionManifestPath)
    await rm(tempRootDir, { force: true, recursive: true })
  } finally {
    if (tempRootDir) {
      await rm(tempRootDir, { force: true, recursive: true }).catch(() => {})
    }

    await lockHandle.close()
    await rm(lockPath, { force: true }).catch(() => {})
  }

  return {
    collections: entries.map(({ collection }) => collection),
    syncedContentRoot,
  }
}

export async function syncConfiguredContent() {
  const { entries, manifest } = await resolveCollectionSources({ requireConfigured: true })

  if (!manifest) {
    throw new Error(
      [
        'No content source was found.',
        'Use the starter in `examples/starter-content` or configure `SITE_CONTENT_DIR` or `.local/content-source.json`.',
      ].join(' '),
    )
  }

  return syncCollections({
    entries,
    manifest,
    syncedContentRoot: getSyncedContentRoot(),
    syncTargets: SYNC_TARGETS,
  })
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const { collections } = await syncConfiguredContent()
  console.log(`[content] Synced collections: ${collections.join(', ')}`)
}
