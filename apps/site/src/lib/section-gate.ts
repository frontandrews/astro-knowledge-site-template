import { isSectionEnabled } from '@/lib/site-config'

export function getSectionStaticPaths<T>(section: string, paths: T[]) {
  return isSectionEnabled(section) ? paths : []
}

export function getSectionDisabledResponse(section: string) {
  if (isSectionEnabled(section)) {
    return null
  }

  return new Response(null, {
    status: 404,
    statusText: 'Not Found',
  })
}
