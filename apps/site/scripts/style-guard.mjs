import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptPath = fileURLToPath(import.meta.url)
const siteDir = path.resolve(path.dirname(scriptPath), '..')
const srcDir = path.join(siteDir, 'src')
const allowedHexFiles = new Set([path.join(srcDir, 'styles', 'global.css')])
const validExtensions = new Set(['.astro', '.css', '.js', '.jsx', '.mjs', '.svelte', '.ts', '.tsx'])
const rawPalettePattern =
  /\b(?:bg|text|border|decoration|fill|stroke|ring)-(?:black|white|slate-(?:50|100|200|300|400|500|600|700|800|900|950)|gray-(?:50|100|200|300|400|500|600|700|800|900|950)|zinc-(?:50|100|200|300|400|500|600|700|800|900|950)|neutral-(?:50|100|200|300|400|500|600|700|800|900|950)|stone-(?:50|100|200|300|400|500|600|700|800|900|950)|red-(?:50|100|200|300|400|500|600|700|800|900|950)|orange-(?:50|100|200|300|400|500|600|700|800|900|950)|amber-(?:50|100|200|300|400|500|600|700|800|900|950)|yellow-(?:50|100|200|300|400|500|600|700|800|900|950)|lime-(?:50|100|200|300|400|500|600|700|800|900|950)|green-(?:50|100|200|300|400|500|600|700|800|900|950)|emerald-(?:50|100|200|300|400|500|600|700|800|900|950)|teal-(?:50|100|200|300|400|500|600|700|800|900|950)|cyan-(?:50|100|200|300|400|500|600|700|800|900|950)|sky-(?:50|100|200|300|400|500|600|700|800|900|950)|blue-(?:50|100|200|300|400|500|600|700|800|900|950)|indigo-(?:50|100|200|300|400|500|600|700|800|900|950)|violet-(?:50|100|200|300|400|500|600|700|800|900|950)|purple-(?:50|100|200|300|400|500|600|700|800|900|950)|fuchsia-(?:50|100|200|300|400|500|600|700|800|900|950)|pink-(?:50|100|200|300|400|500|600|700|800|900|950)|rose-(?:50|100|200|300|400|500|600|700|800|900|950))\b/g

function getLineStarts(content) {
  const starts = [0]

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
    const mid = Math.floor((low + high) / 2)

    if (lineStarts[mid] <= index) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  const line = high

  return {
    column: index - lineStarts[line] + 1,
    line: line + 1,
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

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

function collectMatches({ content, filePath, label, lineStarts, pattern, validateMatch = null }) {
  const violations = []

  for (const match of content.matchAll(pattern)) {
    if (validateMatch && !validateMatch(match[0])) {
      continue
    }

    const location = getLocation(match.index, lineStarts)
    violations.push({
      column: location.column,
      filePath,
      label,
      line: location.line,
      value: match[0],
    })
  }

  return violations
}

async function collectViolations() {
  const files = await walk(srcDir)
  const violations = []

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf8')
    const lineStarts = getLineStarts(content)
    const allowHex = allowedHexFiles.has(filePath)

    violations.push(
      ...collectMatches({
        content,
        filePath,
        label: 'arbitrary-breakpoint',
        lineStarts,
        pattern: /\b(?:min|max)-\[[^\]]+\]:/g,
      }),
    )

    if (!allowHex) {
      violations.push(
        ...collectMatches({
          content,
          filePath,
          label: 'hex-color',
          lineStarts,
          pattern: /(?<![\w-])#[0-9a-fA-F]{3,8}(?![\w-])/g,
        }),
      )
    }

    violations.push(
      ...collectMatches({
        content,
        filePath,
        label: 'shadow-literal',
        lineStarts,
        pattern: /shadow-\[[^\]]+\]/g,
        validateMatch: (value) => !value.includes('var(--site-shadow'),
      }),
    )

    violations.push(
      ...collectMatches({
        content,
        filePath,
        label: 'raw-palette',
        lineStarts,
        pattern: rawPalettePattern,
      }),
    )
  }

  return violations
}

const violations = await collectViolations()

if (violations.length === 0) {
  console.log('Style guard passed.')
  process.exit(0)
}

for (const violation of violations) {
  const relativePath = path.relative(siteDir, violation.filePath)
  console.log(`${relativePath}:${violation.line}:${violation.column} [${violation.label}] ${violation.value}`)
}

console.error(`Found ${violations.length} style guard violation(s).`)
process.exit(1)
