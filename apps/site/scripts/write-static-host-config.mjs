import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getBuildEnv } from './build-env.mjs'

const siteRoot = fileURLToPath(new URL('..', import.meta.url))
const distRoot = path.join(siteRoot, 'dist')
const headersOutputPath = path.join(distRoot, '_headers')
const env = getBuildEnv()

function readPublicEnv(name) {
  const normalized = env[name]?.trim()
  return normalized && normalized.length > 0 ? normalized : null
}

function parsePolicyEntries(value) {
  if (!value) {
    return []
  }

  return value
    .split(/[\s,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function tryGetOrigin(value) {
  if (!value) {
    return null
  }

  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

function addPolicyEntries(target, entries) {
  for (const entry of entries) {
    target.add(entry)
  }
}

function addOriginIfPresent(target, value) {
  const origin = tryGetOrigin(value)

  if (origin) {
    target.add(origin)
  }
}

function buildContentSecurityPolicy() {
  const scriptSrc = new Set(["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'"])
  const styleSrc = new Set(["'self'", "'unsafe-inline'"])
  const fontSrc = new Set(["'self'", 'data:'])
  const imgSrc = new Set(["'self'", 'data:', 'https:', 'blob:'])
  const connectSrc = new Set(["'self'"])
  const frameSrc = new Set(["'self'"])
  const formAction = new Set(["'self'"])
  const workerSrc = new Set(["'self'", 'blob:'])

  // Cloudflare Pages/Web Analytics can inject the RUM beacon at the edge.
  scriptSrc.add('https://static.cloudflareinsights.com')
  connectSrc.add('https://cloudflareinsights.com')

  const hasGiscusConfig = [
    readPublicEnv('PUBLIC_GISCUS_REPO'),
    readPublicEnv('PUBLIC_GISCUS_REPO_ID'),
    readPublicEnv('PUBLIC_GISCUS_CATEGORY'),
    readPublicEnv('PUBLIC_GISCUS_CATEGORY_ID'),
  ].every(Boolean)

  if (hasGiscusConfig) {
    scriptSrc.add('https://giscus.app')
    frameSrc.add('https://giscus.app')
  }

  if (readPublicEnv('PUBLIC_CLARITY_PROJECT_ID')) {
    scriptSrc.add('https://*.clarity.ms')
    connectSrc.add('https://*.clarity.ms')
    connectSrc.add('https://c.bing.com')
  }

  addOriginIfPresent(scriptSrc, readPublicEnv('PUBLIC_OBSERVABILITY_SCRIPT_SRC'))
  addOriginIfPresent(formAction, readPublicEnv('PUBLIC_NEWSLETTER_URL'))

  addPolicyEntries(scriptSrc, parsePolicyEntries(readPublicEnv('PUBLIC_CSP_SCRIPT_SRC')))
  addPolicyEntries(styleSrc, parsePolicyEntries(readPublicEnv('PUBLIC_CSP_STYLE_SRC')))
  addPolicyEntries(fontSrc, parsePolicyEntries(readPublicEnv('PUBLIC_CSP_FONT_SRC')))
  addPolicyEntries(imgSrc, parsePolicyEntries(readPublicEnv('PUBLIC_CSP_IMG_SRC')))
  addPolicyEntries(connectSrc, parsePolicyEntries(readPublicEnv('PUBLIC_CSP_CONNECT_SRC')))
  addPolicyEntries(frameSrc, parsePolicyEntries(readPublicEnv('PUBLIC_CSP_FRAME_SRC')))
  addPolicyEntries(formAction, parsePolicyEntries(readPublicEnv('PUBLIC_CSP_FORM_ACTION')))
  addPolicyEntries(workerSrc, parsePolicyEntries(readPublicEnv('PUBLIC_CSP_WORKER_SRC')))

  const directives = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'self'`,
    `manifest-src 'self'`,
    `img-src ${Array.from(imgSrc).join(' ')}`,
    `script-src ${Array.from(scriptSrc).join(' ')}`,
    `style-src ${Array.from(styleSrc).join(' ')}`,
    `font-src ${Array.from(fontSrc).join(' ')}`,
    `connect-src ${Array.from(connectSrc).join(' ')}`,
    `frame-src ${Array.from(frameSrc).join(' ')}`,
    `form-action ${Array.from(formAction).join(' ')}`,
    `worker-src ${Array.from(workerSrc).join(' ')}`,
  ]

  if (readPublicEnv('SITE_BUILD_TARGET') === 'production') {
    directives.push('upgrade-insecure-requests')
  }

  return directives.join('; ')
}

function buildHeaderBlocks() {
  const commonHeaders = [
    ['Content-Security-Policy', buildContentSecurityPolicy()],
    ['Cross-Origin-Opener-Policy', 'same-origin'],
    ['Permissions-Policy', 'accelerometer=(), browsing-topics=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['X-Content-Type-Options', 'nosniff'],
    ['X-Frame-Options', 'SAMEORIGIN'],
  ]

  const siteUrl = readPublicEnv('PUBLIC_SITE_URL')
  const siteOrigin = tryGetOrigin(siteUrl)

  if (siteOrigin?.startsWith('https://')) {
    commonHeaders.push(['Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload'])
  }

  return [
    {
      path: '/*',
      headers: commonHeaders,
    },
    {
      path: '/_astro/*',
      headers: [['Cache-Control', 'public, max-age=31536000, immutable']],
    },
    {
      path: '/pagefind/*',
      headers: [['Cache-Control', 'public, max-age=0, must-revalidate']],
    },
    {
      path: '/feed.xml',
      headers: [['Cache-Control', 'public, max-age=0, must-revalidate']],
    },
    {
      path: '/*/feed.xml',
      headers: [['Cache-Control', 'public, max-age=0, must-revalidate']],
    },
    {
      path: '/sitemap*.xml',
      headers: [['Cache-Control', 'public, max-age=0, must-revalidate']],
    },
    {
      path: '/robots.txt',
      headers: [['Cache-Control', 'public, max-age=0, must-revalidate']],
    },
    {
      path: '/llms.txt',
      headers: [['Cache-Control', 'public, max-age=0, must-revalidate']],
    },
    {
      path: '/manifest.webmanifest',
      headers: [['Cache-Control', 'public, max-age=0, must-revalidate']],
    },
    {
      path: '/og-image.svg',
      headers: [['Cache-Control', 'public, max-age=3600, must-revalidate']],
    },
    {
      path: '/icon.svg',
      headers: [['Cache-Control', 'public, max-age=3600, must-revalidate']],
    },
    {
      path: '/favicon.svg',
      headers: [['Cache-Control', 'public, max-age=3600, must-revalidate']],
    },
    {
      path: '/giscus-theme.css',
      headers: [['Cache-Control', 'public, max-age=3600, must-revalidate']],
    },
    {
      path: '/fonts/*',
      headers: [['Cache-Control', 'public, max-age=31536000, immutable']],
    },
  ]
}

function formatHeadersFile(blocks) {
  return `${blocks
    .map(({ path: headerPath, headers }) =>
      [
        headerPath,
        ...headers.map(([key, value]) => `  ${key}: ${value}`),
      ].join('\n'),
    )
    .join('\n\n')}\n`
}

await mkdir(distRoot, { recursive: true })
await writeFile(headersOutputPath, formatHeadersFile(buildHeaderBlocks()))

console.log(`[deploy] Wrote ${path.relative(siteRoot, headersOutputPath)}.`)
