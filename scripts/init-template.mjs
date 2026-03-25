import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))

const FILES = [
  {
    source: path.join(repoRoot, '.local', 'content-source.example.json'),
    target: path.join(repoRoot, '.local', 'content-source.json'),
    label: '.local/content-source.json',
  },
  {
    source: path.join(repoRoot, 'apps', 'site', '.env.example'),
    target: path.join(repoRoot, 'apps', 'site', '.env'),
    label: 'apps/site/.env',
  },
]

async function exists(targetPath) {
  try {
    await readFile(targetPath, 'utf8')
    return true
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return false
    }

    throw error
  }
}

async function copyIfMissing({ source, target, label }) {
  if (await exists(target)) {
    return `${label}: kept existing file`
  }

  await mkdir(path.dirname(target), { recursive: true })
  const content = await readFile(source, 'utf8')
  await writeFile(target, content, 'utf8')

  return `${label}: created from example`
}

const results = await Promise.all(FILES.map(copyIfMissing))

console.log('[template] bootstrap complete')
results.forEach((line) => {
  console.log(`[template] ${line}`)
})
console.log('[template] next steps: run `pnpm dev`, then edit `apps/site/.env` or `.local/content-source.json` if needed')
