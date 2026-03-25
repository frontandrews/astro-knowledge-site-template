import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { readSectionManifest } from '../apps/site/scripts/content-source.mjs'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))

const resolvedManifest = await readSectionManifest({ requireExternal: true })

if (!resolvedManifest) {
  throw new Error(
    [
      'verify:external requires a real external content root.',
      'Set SITE_CONTENT_DIR or create .local/content-source.json with a path outside examples/starter-content.',
    ].join(' '),
  )
}

const relativeContentRoot = path.relative(repoRoot, resolvedManifest.contentRoot) || '.'

console.log(`[external] using content root: ${relativeContentRoot}`)
console.log(`[external] manifest: ${path.relative(repoRoot, resolvedManifest.manifestPath)}`)
