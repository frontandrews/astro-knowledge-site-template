import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const [contentRootArg, command, ...args] = process.argv.slice(2)

if (!contentRootArg || !command) {
  console.error('Usage: node ./scripts/run-with-content-root.mjs <content-root> <command> [...args]')
  process.exit(1)
}

const contentRoot = path.resolve(repoRoot, contentRootArg)

const child = spawn(command, args, {
  cwd: repoRoot,
  env: {
    ...process.env,
    SITE_CONTENT_DIR: contentRoot,
  },
  stdio: 'inherit',
})

child.on('close', (code) => {
  process.exit(code ?? 1)
})

child.on('error', (error) => {
  console.error(error)
  process.exit(1)
})
