import { siteConfig } from '@/lib/site-config'

const WIDTH = 1200
const HEIGHT = 630

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function GET() {
  const siteName = escapeXml(siteConfig.site.name)
  const siteDescription = escapeXml(siteConfig.site.description)
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="rgb(11 18 34)" />
      <stop offset="1" stop-color="rgb(16 34 74)" />
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1020 96) rotate(146.31) scale(585.499 910.265)">
      <stop stop-color="rgb(110 168 255)" stop-opacity="0.38" />
      <stop offset="1" stop-color="rgb(110 168 255)" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" rx="32" fill="url(#bg)" />
  <rect width="${WIDTH}" height="${HEIGHT}" rx="32" fill="url(#glow)" />
  <rect x="64" y="72" width="1072" height="486" rx="28" fill="rgba(13, 25, 49, 0.72)" stroke="rgba(160, 189, 255, 0.25)" />
  <text x="112" y="174" fill="rgb(159 184 255)" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" letter-spacing="0.24em">KNOWLEDGE SITE</text>
  <text x="112" y="298" fill="rgb(243 247 255)" font-family="Arial, Helvetica, sans-serif" font-size="82" font-weight="700">${siteName}</text>
  <text x="112" y="372" fill="rgb(203 216 255)" font-family="Arial, Helvetica, sans-serif" font-size="34">${siteDescription}</text>
  <text x="112" y="486" fill="rgb(136 163 230)" font-family="Arial, Helvetica, sans-serif" font-size="28">Articles, tracks, concepts, glossary, and challenges</text>
</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
