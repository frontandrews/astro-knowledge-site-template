import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const docsRoot = path.join(repoRoot, 'docs')
const markdownRoots = [path.join(repoRoot, 'README.md'), path.join(repoRoot, 'CONTRIBUTING.md'), docsRoot]
const MARKDOWN_LINK_PATTERN = /!?\[[^\]]*]\(([^)\s]+(?:\s+"[^"]*")?)\)/g
const HTML_ATTRIBUTE_PATTERN = /<(?:img|a)\b[^>]*(?:src|href)=["']([^"']+)["'][^>]*>/g

function normalizeTarget(rawTarget) {
  return rawTarget.replace(/\s+"[^"]*"$/, '').split('#')[0].split('?')[0].trim()
}

function shouldSkipTarget(target) {
  return (
    !target ||
    target.startsWith('#') ||
    target.startsWith('/') ||
    target.startsWith('http://') ||
    target.startsWith('https://') ||
    target.startsWith('mailto:') ||
    target.startsWith('tel:') ||
    target.startsWith('data:')
  )
}

async function pathExists(targetPath) {
  try {
    await access(targetPath)
    return true
  } catch {
    return false
  }
}

async function collectMarkdownFiles(targetPath) {
  const statEntries = await readdir(targetPath, { withFileTypes: true }).catch((error) => {
    if (error?.code === 'ENOTDIR') {
      return null
    }

    throw error
  })

  if (statEntries === null) {
    return [targetPath]
  }

  const files = []

  for (const entry of statEntries) {
    const entryPath = path.join(targetPath, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(entryPath)))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(entryPath)
    }
  }

  return files
}

async function collectTargets(filePath) {
  const content = await readFile(filePath, 'utf8')
  const targets = []

  for (const match of content.matchAll(MARKDOWN_LINK_PATTERN)) {
    const target = normalizeTarget(match[1] ?? '')

    if (!shouldSkipTarget(target)) {
      targets.push(target)
    }
  }

  for (const match of content.matchAll(HTML_ATTRIBUTE_PATTERN)) {
    const target = normalizeTarget(match[1] ?? '')

    if (!shouldSkipTarget(target)) {
      targets.push(target)
    }
  }

  return targets
}

const markdownFiles = (
  await Promise.all(markdownRoots.map((targetPath) => collectMarkdownFiles(targetPath)))
).flat()

const missingTargets = []

for (const filePath of markdownFiles) {
  const targets = await collectTargets(filePath)

  for (const target of targets) {
    const absoluteTarget = path.resolve(path.dirname(filePath), target)

    if (!(await pathExists(absoluteTarget))) {
      missingTargets.push(`${path.relative(repoRoot, filePath)} -> ${target}`)
    }
  }
}

if (missingTargets.length > 0) {
  throw new Error(
    `Broken local docs links:\n${missingTargets
      .sort((left, right) => left.localeCompare(right))
      .map((entry) => `- ${entry}`)
      .join('\n')}`,
  )
}

console.log(`[docs-smoke] validated ${markdownFiles.length} markdown files`)
