import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const distRoot = path.join(repoRoot, 'apps/site/dist')

function countMatches(content, pattern) {
  return content.match(pattern)?.length ?? 0
}

async function pathExists(targetPath) {
  try {
    await stat(targetPath)
    return true
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return false
    }

    throw error
  }
}

async function walkFiles(rootPath, predicate, files = []) {
  let entries

  try {
    entries = await readdir(rootPath, { withFileTypes: true })
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return files
    }

    throw error
  }

  for (const entry of entries) {
    const fullPath = path.join(rootPath, entry.name)

    if (entry.isDirectory()) {
      await walkFiles(fullPath, predicate, files)
      continue
    }

    if (entry.isFile() && predicate(fullPath)) {
      files.push(fullPath)
    }
  }

  return files
}

async function resolveFirstMatch(rootPath, matcher) {
  const matches = await walkFiles(rootPath, matcher)

  return matches
    .map((fullPath) => path.relative(distRoot, fullPath).replace(/\\/g, '/'))
    .sort((left, right) => left.localeCompare(right))[0] ?? null
}

function expectMatch(content, pattern, label, failures) {
  if (!pattern.test(content)) {
    failures.push(label)
  }
}

async function inspectHtmlPage(relativePath, expectedLang, failures) {
  const fullPath = path.join(distRoot, relativePath)
  const content = await readFile(fullPath, 'utf8')

  expectMatch(content, /^<!DOCTYPE html>/i, `${relativePath}: missing doctype`, failures)
  expectMatch(
    content,
    new RegExp(`<html\\b[^>]*\\blang=["']${expectedLang}["']`, 'i'),
    `${relativePath}: missing expected html lang=${expectedLang}`,
    failures,
  )

  if (countMatches(content, /<title\b[^>]*>/gi) !== 1) {
    failures.push(`${relativePath}: expected exactly one <title>`)
  }

  if (countMatches(content, /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi) !== 1) {
    failures.push(`${relativePath}: expected exactly one canonical link`)
  }

  if (countMatches(content, /<h1\b/gi) !== 1) {
    failures.push(`${relativePath}: expected exactly one <h1>`)
  }

  expectMatch(
    content,
    /<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["'][^"']+["'])[^>]*>/i,
    `${relativePath}: missing meta description`,
    failures,
  )
  expectMatch(
    content,
    /<meta\b(?=[^>]*\bproperty=["']og:title["'])(?=[^>]*\bcontent=["'][^"']+["'])[^>]*>/i,
    `${relativePath}: missing og:title`,
    failures,
  )
  expectMatch(
    content,
    /<meta\b(?=[^>]*\bproperty=["']og:description["'])(?=[^>]*\bcontent=["'][^"']+["'])[^>]*>/i,
    `${relativePath}: missing og:description`,
    failures,
  )
  expectMatch(
    content,
    /<meta\b(?=[^>]*\bproperty=["']og:image["'])(?=[^>]*\bcontent=["'][^"']+["'])[^>]*>/i,
    `${relativePath}: missing og:image`,
    failures,
  )
  expectMatch(
    content,
    /<meta\b(?=[^>]*\bname=["']theme-color["'])(?=[^>]*\bcontent=["'][^"']+["'])[^>]*>/i,
    `${relativePath}: missing theme-color meta`,
    failures,
  )
  expectMatch(
    content,
    /<link\b(?=[^>]*\brel=["']manifest["'])(?=[^>]*\bhref=["'][^"']+["'])[^>]*>/i,
    `${relativePath}: missing manifest link`,
    failures,
  )
  expectMatch(
    content,
    /<link\b(?=[^>]*\brel=["']icon["'])(?=[^>]*\bhref=["'][^"']+["'])[^>]*>/i,
    `${relativePath}: missing icon link`,
    failures,
  )
  expectMatch(content, /<main\b/i, `${relativePath}: missing <main>`, failures)
}

const failures = []
const requiredFiles = [
  '_headers',
  'feed.xml',
  'favicon.svg',
  'icon.svg',
  'index.html',
  'manifest.webmanifest',
  'og-image.svg',
  'robots.txt',
  'sitemap-index.xml',
]

for (const relativePath of requiredFiles) {
  if (!(await pathExists(path.join(distRoot, relativePath)))) {
    failures.push(`Missing required build artifact: ${relativePath}`)
  }
}

const robotsText = await readFile(path.join(distRoot, 'robots.txt'), 'utf8')
const headersText = await readFile(path.join(distRoot, '_headers'), 'utf8')
const manifestText = await readFile(path.join(distRoot, 'manifest.webmanifest'), 'utf8')
const manifest = JSON.parse(manifestText)

expectMatch(robotsText, /^User-agent:\s*\*/im, 'robots.txt: missing User-agent stanza', failures)
if (!/^Disallow:\s*\/$/im.test(robotsText)) {
  expectMatch(robotsText, /^Sitemap:\s+/im, 'robots.txt: missing Sitemap line', failures)
}
expectMatch(headersText, /^\/\*/m, '_headers: missing global header block', failures)
expectMatch(headersText, /^\s+Content-Security-Policy:\s+/m, '_headers: missing CSP header', failures)
expectMatch(headersText, /^\/_astro\/\*/m, '_headers: missing /_astro cache block', failures)
expectMatch(headersText, /^\/pagefind\/\*/m, '_headers: missing /pagefind cache block', failures)

if (!manifest.name || !manifest.short_name) {
  failures.push('manifest.webmanifest: missing name or short_name')
}

if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
  failures.push('manifest.webmanifest: missing icons')
}

if (!manifest.theme_color || !manifest.background_color) {
  failures.push('manifest.webmanifest: missing theme_color or background_color')
}

const pageChecks = [
  ['index.html', 'en'],
  ['pt-br/index.html', 'pt-BR'],
  ['articles/index.html', 'en'],
  ['tracks/index.html', 'en'],
  ['challenges/index.html', 'en'],
]

for (const [relativePath, expectedLang] of pageChecks) {
  if (await pathExists(path.join(distRoot, relativePath))) {
    await inspectHtmlPage(relativePath, expectedLang, failures)
  }
}

for (const [rootDir, matcher, expectedLang] of [
  ['articles', (fullPath) => fullPath.endsWith('/index.html') && /articles\/.+\/.+\/index\.html$/.test(fullPath.replace(/\\/g, '/')), 'en'],
  ['tracks', (fullPath) => fullPath.endsWith('/index.html') && /tracks\/.+\/index\.html$/.test(fullPath.replace(/\\/g, '/')), 'en'],
  ['challenges', (fullPath) => fullPath.endsWith('/index.html') && /challenges\/.+\/index\.html$/.test(fullPath.replace(/\\/g, '/')), 'en'],
  ['concepts', (fullPath) => fullPath.endsWith('/index.html') && /concepts\/.+\/index\.html$/.test(fullPath.replace(/\\/g, '/')), 'en'],
  ['glossary', (fullPath) => fullPath.endsWith('/index.html') && /glossary\/.+\/index\.html$/.test(fullPath.replace(/\\/g, '/')), 'en'],
]) {
  const relativePath = await resolveFirstMatch(path.join(distRoot, rootDir), matcher)

  if (relativePath) {
    await inspectHtmlPage(relativePath, expectedLang, failures)
  }
}

for (const paginatedPath of ['articles/page/2/index.html', 'pt-br/artigos/page/2/index.html']) {
  const fullPath = path.join(distRoot, paginatedPath)

  if (!(await pathExists(fullPath))) {
    continue
  }

  const content = await readFile(fullPath, 'utf8')
  expectMatch(
    content,
    /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["']noindex,(?:follow|nofollow)["'])[^>]*>/i,
    `${paginatedPath}: missing noindex robots meta`,
    failures,
  )
}

if (failures.length > 0) {
  throw new Error(`HTML critical smoke failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`)
}

console.log('[html-smoke] critical build artifacts and HTML structure look good')
