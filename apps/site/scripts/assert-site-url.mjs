import { getBuildEnv } from './build-env.mjs'

const DEFAULT_SITE_URL = 'https://example.com'

function normalizeSiteUrl(value) {
  const trimmed = value?.trim()

  if (!trimmed) {
    return null
  }

  try {
    return new URL(trimmed).toString().replace(/\/$/, '')
  } catch {
    return null
  }
}

function isStrictProductionBuild(env) {
  if (env.SITE_BUILD_TARGET === 'production') {
    return true
  }

  if (env.VERCEL === '1' && env.VERCEL_ENV === 'production') {
    return true
  }

  if (env.CONTEXT === 'production') {
    return true
  }

  if (env.CF_PAGES === '1') {
    const branch = env.CF_PAGES_BRANCH?.trim()
    const defaultBranch = env.GITHUB_DEFAULT_BRANCH?.trim() || 'main'

    return Boolean(branch && (branch === defaultBranch || branch === 'master'))
  }

  return false
}

const env = getBuildEnv()
const resolvedSiteUrl = normalizeSiteUrl(env.PUBLIC_SITE_URL)
const isValidConfiguredUrl = Boolean(resolvedSiteUrl && resolvedSiteUrl !== DEFAULT_SITE_URL)
const strictBuild = isStrictProductionBuild(env)

if (!isValidConfiguredUrl) {
  const message = [
    '[site-url] PUBLIC_SITE_URL must point to the real production domain.',
    `Current value: ${env.PUBLIC_SITE_URL?.trim() || '(empty)'}`,
    'Use a valid domain and do not leave it as https://example.com.',
    'If you are preparing a real deployment, export SITE_BUILD_TARGET=production to enforce the guard rail.',
  ].join(' ')

  if (strictBuild) {
    throw new Error(message)
  }

  console.warn(message)
}
