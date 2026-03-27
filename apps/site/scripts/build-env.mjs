import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

export function getBuildEnv() {
  const mode = process.env.NODE_ENV ?? 'production'
  const envFiles = ['.env', `.env.${mode}`, '.env.local', `.env.${mode}.local`]
  const loadedEnv = {}

  for (const fileName of envFiles) {
    const filePath = path.join(process.cwd(), fileName)

    if (!existsSync(filePath)) {
      continue
    }

    const fileContent = readFileSync(filePath, 'utf8')

    for (const rawLine of fileContent.split(/\r?\n/u)) {
      const line = rawLine.trim()

      if (!line || line.startsWith('#')) {
        continue
      }

      const separatorIndex = line.indexOf('=')

      if (separatorIndex <= 0) {
        continue
      }

      const key = line.slice(0, separatorIndex).trim()
      const rawValue = line.slice(separatorIndex + 1).trim()
      const value =
        rawValue.startsWith('"') && rawValue.endsWith('"')
          ? rawValue.slice(1, -1)
          : rawValue.startsWith("'") && rawValue.endsWith("'")
            ? rawValue.slice(1, -1)
            : rawValue

      loadedEnv[key] = value
    }
  }

  return {
    ...loadedEnv,
    ...process.env,
  }
}
