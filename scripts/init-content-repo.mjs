import { access, cp, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const templateRoot = path.join(repoRoot, 'templates', 'content-repo')

function printHelp() {
  console.log('Usage: pnpm init:content-repo <target-dir>')
  console.log('')
  console.log('Create a minimal editorial content repository scaffold in the given directory.')
}

function getTargetArg(argv) {
  const [firstArg] = argv

  if (!firstArg || firstArg === '--help' || firstArg === '-h') {
    printHelp()
    process.exit(firstArg ? 0 : 1)
  }

  return firstArg
}

async function pathExists(targetPath) {
  try {
    await access(targetPath)
    return true
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return false
    }

    throw error
  }
}

async function directoryIsEmpty(targetPath) {
  try {
    const entries = await readdir(targetPath)
    return entries.length === 0
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return true
    }

    throw error
  }
}

async function copyTemplateContents(targetRoot) {
  const entries = await readdir(templateRoot)

  for (const entry of entries) {
    await cp(path.join(templateRoot, entry), path.join(targetRoot, entry), { recursive: true })
  }
}

const targetArg = getTargetArg(process.argv.slice(2))
const targetRoot = path.resolve(repoRoot, targetArg)

if ((await pathExists(targetRoot)) && !(await directoryIsEmpty(targetRoot))) {
  throw new Error(`Target directory already exists and is not empty: ${targetRoot}`)
}

await mkdir(targetRoot, { recursive: true })
await copyTemplateContents(targetRoot)

const displayTarget = targetArg

console.log('[content-repo] scaffold complete')
console.log(`[content-repo] created: ${displayTarget}`)
console.log(`[content-repo] next step: pnpm init:template --content-root ${displayTarget}`)
console.log(`[content-repo] validate with: SITE_CONTENT_DIR=${displayTarget} pnpm verify:external`)
