import { createIndex, close } from 'pagefind'
import { readFile, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const siteRoot = fileURLToPath(new URL('..', import.meta.url))
const distRoot = path.join(siteRoot, 'dist')
const outputPath = path.join(distRoot, 'pagefind')

async function* walkHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      yield* walkHtmlFiles(fullPath)
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      yield fullPath
    }
  }
}

function getPageUrl(filePath) {
  const relativePath = path.relative(distRoot, filePath).replace(/\\/g, '/')

  if (relativePath === 'index.html') {
    return '/'
  }

  return `/${relativePath.replace(/index\.html$/, '')}`
}

await rm(outputPath, { force: true, recursive: true })

const { index, errors } = await createIndex({
  rootSelector: '[data-pagefind-body]',
})

if (!index) {
  throw new Error(errors.join('\n') || 'Failed to create Pagefind index.')
}

let indexedPages = 0

for await (const filePath of walkHtmlFiles(distRoot)) {
  const content = await readFile(filePath, 'utf8')

  if (!content.includes('data-pagefind-body')) {
    continue
  }

  const response = await index.addHTMLFile({
    content,
    url: getPageUrl(filePath),
  })

  if (response.errors.length > 0) {
    throw new Error(response.errors.join('\n'))
  }

  indexedPages += 1
}

const writeResponse = await index.writeFiles({ outputPath })

if (writeResponse.errors.length > 0) {
  throw new Error(writeResponse.errors.join('\n'))
}

await close()

console.log(`[pagefind] Indexed ${indexedPages} pages from data-pagefind-body roots.`)
