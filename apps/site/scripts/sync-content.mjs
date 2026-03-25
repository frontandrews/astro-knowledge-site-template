import { cp, mkdir, mkdtemp, open, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import {
  getSyncedCollectionDir,
  getSyncedContentRoot,
  getSyncedSectionManifestPath,
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
        throw new Error(`Timeout aguardando lock de sincronizacao: ${lockPath}`)
      }

      await sleep(retryMs)
    }
  }
}

async function main() {
  const { entries, manifest } = await resolveCollectionSources({ requireConfigured: true })

  if (!manifest) {
    throw new Error(
      [
        'Nenhuma fonte de conteudo foi encontrada.',
        'Use o starter em `examples/starter-content` ou configure `SITE_CONTENT_DIR` ou `.local/content-source.json`.',
      ].join(' '),
    )
  }

  for (const entry of entries) {
    if (!(await pathExists(entry.sourceDir))) {
      throw new Error(`A fonte configurada para ${entry.sectionId} nao existe: ${entry.sourceDir}`)
    }
  }

  const syncedContentRoot = getSyncedContentRoot()
  await mkdir(syncedContentRoot, { recursive: true })
  const lockPath = path.join(syncedContentRoot, '.content-sync.lock')
  const lockHandle = await acquireLock(lockPath)
  let tempRootDir = null

  try {
    tempRootDir = await mkdtemp(path.join(syncedContentRoot, '.content-sync-'))

    for (const entry of entries) {
      await cp(entry.sourceDir, path.join(tempRootDir, entry.collection), { recursive: true })
    }

    for (const collection of SYNC_TARGETS) {
      await mkdir(path.join(tempRootDir, collection), { recursive: true })
    }

    await writeFile(
      path.join(tempRootDir, 'sections.manifest.mjs'),
      `export const sectionManifest = ${JSON.stringify(manifest, null, 2)}\n`,
      'utf8',
    )

    for (const collection of SYNC_TARGETS) {
      await rm(getSyncedCollectionDir(collection), { force: true, recursive: true })
      await rename(path.join(tempRootDir, collection), getSyncedCollectionDir(collection))
    }

    await rm(getSyncedSectionManifestPath(), { force: true })
    await rename(path.join(tempRootDir, 'sections.manifest.mjs'), getSyncedSectionManifestPath())
    await rm(tempRootDir, { force: true, recursive: true })
  } finally {
    if (tempRootDir) {
      await rm(tempRootDir, { force: true, recursive: true }).catch(() => {})
    }

    await lockHandle.close()
    await rm(lockPath, { force: true }).catch(() => {})
  }

  console.log(
    `[content] Colecoes sincronizadas: ${entries.map(({ collection }) => collection).join(', ')}`,
  )
}

await main()
