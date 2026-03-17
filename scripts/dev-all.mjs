import net from 'node:net'
import { spawn } from 'node:child_process'

function getFreePort(startPort) {
  return new Promise((resolve, reject) => {
    const tryPort = (port) => {
      const server = net.createServer()

      server.once('error', () => {
        tryPort(port + 1)
      })

      server.once('listening', () => {
        server.close((closeError) => {
          if (closeError) {
            reject(closeError)
            return
          }

          resolve(port)
        })
      })

      server.listen(port, '127.0.0.1')
    }

    tryPort(startPort)
  })
}

function spawnDevProcess(label, command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...options.env,
    },
    shell: false,
    stdio: 'pipe',
  })

  const prefix = `[${label}]`

  child.stdout.on('data', (chunk) => {
    process.stdout.write(`${prefix} ${chunk}`)
  })

  child.stderr.on('data', (chunk) => {
    process.stderr.write(`${prefix} ${chunk}`)
  })

  child.on('exit', (code, signal) => {
    if (signal) {
      process.stdout.write(`${prefix} exited with signal ${signal}\n`)
      return
    }

    if (code && code !== 0) {
      process.stderr.write(`${prefix} exited with code ${code}\n`)
      process.exitCode = code
    }
  })

  return child
}

const webPort = await getFreePort(4510)
const sitePort = await getFreePort(4520)
const siteEnv = {
  PUBLIC_APP_URL: `http://localhost:${webPort}`,
}

process.stdout.write(`Starting Prepdeck dev servers\n`)
process.stdout.write(`- Site: http://localhost:${sitePort}\n`)
process.stdout.write(`- App:  http://localhost:${webPort}\n`)

const children = [
  spawnDevProcess('web', 'pnpm', ['--filter', '@prepdeck/web', 'exec', 'vite', '--port', String(webPort)]),
  spawnDevProcess(
    'site',
    'pnpm',
    ['--filter', '@prepdeck/site', 'exec', 'astro', 'dev', '--port', String(sitePort)],
    { env: siteEnv },
  ),
]

const shutdown = (signal) => {
  for (const child of children) {
    if (!child.killed) {
      child.kill(signal)
    }
  }
}

process.on('SIGINT', () => {
  shutdown('SIGINT')
  process.exit(0)
})

process.on('SIGTERM', () => {
  shutdown('SIGTERM')
  process.exit(0)
})
