import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { __unstable__loadDesignSystem } from 'tailwindcss'

const scriptPath = fileURLToPath(import.meta.url)
const scriptsDir = path.dirname(scriptPath)
const siteDir = path.resolve(scriptsDir, '..')
const srcDir = path.join(siteDir, 'src')
const themeEntry = path.join(srcDir, 'styles', 'global.css')
const write = process.argv.includes('--write')
const check = process.argv.includes('--check')
const only = readListArg('--only')
const exclude = readListArg('--exclude')
const validExtensions = new Set(['.astro', '.css', '.js', '.jsx', '.mjs', '.svelte', '.ts', '.tsx'])
const candidatePattern = /[^\s"'`;{}<>]+/g

function readListArg(name) {
  let match = process.argv.find((arg) => arg.startsWith(`${name}=`))
  if (!match) {
    return null
  }

  let value = match.slice(name.length + 1).trim()
  if (value === '') {
    return null
  }

  return new Set(
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  )
}

function toFileUrl(filePath) {
  return pathToFileURL(filePath).href
}

async function loadStylesheet(id, base) {
  let resolvedUrl

  if (id.startsWith('.') || id.startsWith('/')) {
    resolvedUrl = new URL(id, base ?? toFileUrl(themeEntry)).href
  } else if (id === 'tailwindcss') {
    resolvedUrl = import.meta.resolve('tailwindcss/index.css')
  } else {
    resolvedUrl = import.meta.resolve(id)
  }

  let filePath = fileURLToPath(resolvedUrl)
  let content = await fs.readFile(filePath, 'utf8')

  return {
    base: toFileUrl(path.dirname(filePath) + path.sep),
    content,
  }
}

async function loadDesignSystem() {
  let source = await fs.readFile(themeEntry, 'utf8')

  return __unstable__loadDesignSystem(source, {
    from: toFileUrl(themeEntry),
    loadStylesheet,
  })
}

async function walk(dir) {
  let entries = await fs.readdir(dir, { withFileTypes: true })
  let files = []

  for (let entry of entries) {
    let fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)))
      continue
    }

    if (validExtensions.has(path.extname(entry.name))) {
      files.push(fullPath)
    }
  }

  return files
}

function getLineStarts(content) {
  let starts = [0]

  for (let index = 0; index < content.length; index += 1) {
    if (content[index] === '\n') {
      starts.push(index + 1)
    }
  }

  return starts
}

function getLocation(index, lineStarts) {
  let low = 0
  let high = lineStarts.length - 1

  while (low <= high) {
    let mid = Math.floor((low + high) / 2)

    if (lineStarts[mid] <= index) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  let line = high

  return {
    line: line + 1,
    column: index - lineStarts[line] + 1,
  }
}

function getCanonicalCandidate(designSystem, candidate) {
  if (!candidate.includes('[')) {
    return null
  }

  let canonical = designSystem.canonicalizeCandidates([candidate])

  if (canonical.length !== 1) {
    return null
  }

  return canonical[0] === candidate ? null : canonical[0]
}

function getCategory(candidate, canonical) {
  if (candidate.includes('[color:')) {
    return 'color'
  }

  if (/rounded-\[var\(--radius/.test(candidate)) {
    return 'radius'
  }

  if (/\[(?:-?\d*\.?\d+)(?:rem|px)\]/.test(candidate) && /-\d/.test(canonical)) {
    return 'scale'
  }

  return 'other'
}

function shouldInclude(category) {
  if (only && !only.has(category)) {
    return false
  }

  if (exclude && exclude.has(category)) {
    return false
  }

  return true
}

async function collectSuggestions(designSystem) {
  let files = await walk(srcDir)
  let suggestions = []

  for (let filePath of files) {
    let content = await fs.readFile(filePath, 'utf8')
    let lineStarts = getLineStarts(content)
    let seen = new Map()

    for (let match of content.matchAll(candidatePattern)) {
      let candidate = match[0]
      let canonical = seen.get(candidate)

      if (canonical === undefined) {
        canonical = getCanonicalCandidate(designSystem, candidate)
        seen.set(candidate, canonical)
      }

      if (!canonical) {
        continue
      }

      let category = getCategory(candidate, canonical)
      if (!shouldInclude(category)) {
        continue
      }

      let location = getLocation(match.index, lineStarts)

      suggestions.push({
        category,
        filePath,
        index: match.index,
        line: location.line,
        column: location.column,
        candidate,
        canonical,
      })
    }
  }

  return suggestions
}

async function applySuggestions(suggestions) {
  let grouped = new Map()

  for (let suggestion of suggestions) {
    let list = grouped.get(suggestion.filePath) ?? []
    list.push(suggestion)
    grouped.set(suggestion.filePath, list)
  }

  for (let [filePath, fileSuggestions] of grouped) {
    let content = await fs.readFile(filePath, 'utf8')
    let updated = content

    for (let suggestion of [...fileSuggestions].sort((left, right) => right.index - left.index)) {
      updated =
        updated.slice(0, suggestion.index) +
        suggestion.canonical +
        updated.slice(suggestion.index + suggestion.candidate.length)
    }

    if (updated !== content) {
      await fs.writeFile(filePath, updated, 'utf8')
    }
  }
}

function printSuggestions(suggestions) {
  for (let suggestion of suggestions) {
    let relativePath = path.relative(siteDir, suggestion.filePath)
    console.log(
      `${relativePath}:${suggestion.line}:${suggestion.column} [${suggestion.category}] ${suggestion.candidate} -> ${suggestion.canonical}`,
    )
  }
}

function printSummary(suggestions) {
  let counts = new Map()

  for (let suggestion of suggestions) {
    counts.set(suggestion.category, (counts.get(suggestion.category) ?? 0) + 1)
  }

  let summary = [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([category, count]) => `${category}=${count}`)
    .join(', ')

  console.log(`Summary: ${summary}`)
}

let designSystem = await loadDesignSystem()
let suggestions = await collectSuggestions(designSystem)

if (suggestions.length === 0) {
  console.log('No canonical Tailwind suggestions found.')
  process.exit(0)
}

printSuggestions(suggestions)
printSummary(suggestions)
console.log(`Found ${suggestions.length} canonical Tailwind suggestion(s).`)

if (write) {
  await applySuggestions(suggestions)
  console.log(`Updated ${new Set(suggestions.map((item) => item.filePath)).size} file(s).`)
}

if (check && !write) {
  process.exit(1)
}
