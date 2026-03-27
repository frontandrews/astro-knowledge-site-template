import { getBuildEnv } from './build-env.mjs'

const env = getBuildEnv()

function readEnv(name) {
  const value = env[name]?.trim()
  return value && value.length > 0 ? value : null
}

function isTruthyEnv(name) {
  const value = readEnv(name)?.toLowerCase()
  return value === '1' || value === 'true' || value === 'yes' || value === 'on'
}

function hasCommentsConfigured() {
  return Boolean(
    readEnv('PUBLIC_GISCUS_REPO')
    && readEnv('PUBLIC_GISCUS_REPO_ID')
    && readEnv('PUBLIC_GISCUS_CATEGORY')
    && readEnv('PUBLIC_GISCUS_CATEGORY_ID'),
  )
}

function getEnabledIntegrations() {
  const integrations = []

  if (hasCommentsConfigured()) {
    integrations.push('comments')
  }

  if (readEnv('PUBLIC_NEWSLETTER_URL')) {
    integrations.push('newsletter')
  }

  if (readEnv('PUBLIC_OBSERVABILITY_SCRIPT_SRC')) {
    integrations.push('observability')
  }

  return integrations
}

if (!isTruthyEnv('SITE_ENFORCE_PUBLISH_READINESS')) {
  process.exit(0)
}

const enabledIntegrations = getEnabledIntegrations()
const warnings = []
const ownerName = readEnv('PUBLIC_LEGAL_OWNER_NAME')
const ownerLocation = readEnv('PUBLIC_LEGAL_OWNER_LOCATION')
const legalEmail = readEnv('PUBLIC_LEGAL_EMAIL')
const supportEmail = readEnv('PUBLIC_SUPPORT_EMAIL')

if (!ownerName || !ownerLocation) {
  warnings.push(
    'Operator identity is incomplete. Set PUBLIC_LEGAL_OWNER_NAME and PUBLIC_LEGAL_OWNER_LOCATION before a strict production publish.',
  )
}

if (enabledIntegrations.length > 0 && !legalEmail && !supportEmail) {
  warnings.push(
    `Third-party or optional integrations are configured (${enabledIntegrations.join(', ')}), but PUBLIC_LEGAL_EMAIL or PUBLIC_SUPPORT_EMAIL is still missing.`,
  )
}

if (warnings.length > 0) {
  throw new Error(
    [
      '[publish-readiness] Strict publish readiness failed.',
      ...warnings.map((warning) => `- ${warning}`),
      'Disable SITE_ENFORCE_PUBLISH_READINESS=1 if you only want warnings during non-production verification.',
    ].join('\n'),
  )
}
