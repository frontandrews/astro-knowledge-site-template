import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))

const CONTENT_SOURCE_EXAMPLE = path.join(repoRoot, '.local', 'content-source.example.json')
const CONTENT_SOURCE_TARGET = path.join(repoRoot, '.local', 'content-source.json')
const DEFAULT_CONTENT_ROOT = './examples/starter-content'
const ENV_FILE = {
  source: path.join(repoRoot, 'apps', 'site', '.env.example'),
  target: path.join(repoRoot, 'apps', 'site', '.env'),
  label: 'apps/site/.env',
}

function printHelp() {
  console.log('Usage: pnpm init:template [--content-root <path>]')
  console.log('')
  console.log('Creates ignored local setup files for the shell repo without overwriting existing files.')
}

function parseArgs(argv) {
  let contentRoot = null

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]

    if (argument === '--help' || argument === '-h') {
      printHelp()
      process.exit(0)
    }

    if (argument === '--content-root') {
      contentRoot = argv[index + 1]
      index += 1

      if (!contentRoot) {
        throw new Error('Missing value for --content-root')
      }

      continue
    }

    if (argument.startsWith('--content-root=')) {
      contentRoot = argument.slice('--content-root='.length)
      continue
    }

    throw new Error(`Unknown argument: ${argument}`)
  }

  return { contentRoot }
}

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

function formatContentSourceConfig(contentRoot) {
  return `${JSON.stringify({ contentRoot }, null, 2)}\n`
}

async function readJsonIfPresent(targetPath) {
  try {
    const content = await readFile(targetPath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return null
    }

    throw error
  }
}

async function writeContentSourceConfigIfMissing(contentRoot) {
  if (await exists(CONTENT_SOURCE_TARGET)) {
    if (!contentRoot) {
      return '.local/content-source.json: kept existing file'
    }

    const currentConfig = await readJsonIfPresent(CONTENT_SOURCE_TARGET)

    if (currentConfig?.contentRoot === contentRoot) {
      return `.local/content-source.json: kept existing contentRoot=${contentRoot}`
    }

    if (currentConfig?.contentRoot === DEFAULT_CONTENT_ROOT) {
      await writeFile(CONTENT_SOURCE_TARGET, formatContentSourceConfig(contentRoot), 'utf8')
      return `.local/content-source.json: updated contentRoot=${contentRoot}`
    }

    return '.local/content-source.json: kept existing file'
  }

  await mkdir(path.dirname(CONTENT_SOURCE_TARGET), { recursive: true })

  if (contentRoot) {
    await writeFile(CONTENT_SOURCE_TARGET, formatContentSourceConfig(contentRoot), 'utf8')

    return `.local/content-source.json: created with contentRoot=${contentRoot}`
  }

  const content = await readFile(CONTENT_SOURCE_EXAMPLE, 'utf8')
  await writeFile(CONTENT_SOURCE_TARGET, content, 'utf8')

  return '.local/content-source.json: created from example'
}

const { contentRoot } = parseArgs(process.argv.slice(2))
const results = await Promise.all([writeContentSourceConfigIfMissing(contentRoot), copyIfMissing(ENV_FILE)])

console.log('[template] bootstrap complete')
results.forEach((line) => {
  console.log(`[template] ${line}`)
})
console.log('[template] next steps: run `pnpm dev`, then edit `apps/site/.env` or `.local/content-source.json` if needed')
