import { siteUrls } from '@/lib/site-config'

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${siteUrls.sitemap}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
