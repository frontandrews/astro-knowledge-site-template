import type { DeckManifestEntry, ProgressStore } from '@prepdeck/schemas'

import { combineDeckCounts, getDeckCountsFromSummary } from '@/lib/progress'
import { getMasterySnapshot } from '@/lib/mastery'
import { getTopicLabel } from '@/lib/topic-labels'

export type ProgressShareSnapshot = {
  cardsLearned: number
  cardsSeen: number
  decksCompleted: number
  generatedOn: string
  reviewDebt: number
  savedNotes: number
  startedDecks: number
  strongestTopic: string
  totalCards: number
  totalDecks: number
  weakestTopic: string
}

export function buildProgressShareSnapshot(
  store: ProgressStore,
  summaries: DeckManifestEntry[],
  generatedAt: Date = new Date(),
): ProgressShareSnapshot {
  const records = summaries.map((summary) => ({
    counts: getDeckCountsFromSummary(store, summary),
    summary,
  }))
  const overallCounts = combineDeckCounts(records.map((record) => record.counts))
  const mastery = getMasterySnapshot(records, store)

  return {
    cardsLearned: overallCounts.learned,
    cardsSeen: overallCounts.seen,
    decksCompleted: mastery.decksCompleted,
    generatedOn: generatedAt.toISOString().slice(0, 10),
    reviewDebt: mastery.reviewDebt,
    savedNotes: mastery.savedNotes,
    startedDecks: mastery.startedDecks,
    strongestTopic: mastery.strongestTopic
      ? getTopicLabel(mastery.strongestTopic.topic)
      : 'Not enough reps yet',
    totalCards: overallCounts.total,
    totalDecks: summaries.length,
    weakestTopic: mastery.weakestTopic
      ? getTopicLabel(mastery.weakestTopic.topic)
      : 'No weak topic yet',
  }
}

export function createProgressShareCardSvg(snapshot: ProgressShareSnapshot): string {
  const stats = [
    ['Decks completed', `${snapshot.decksCompleted}/${snapshot.totalDecks}`],
    ['Cards learned', `${snapshot.cardsLearned}`],
    ['Need review', `${snapshot.reviewDebt}`],
    ['Saved notes', `${snapshot.savedNotes}`],
  ] as const

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="Prepdeck progress snapshot">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d1728" />
      <stop offset="60%" stop-color="#172741" />
      <stop offset="100%" stop-color="#0b1220" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6d9bff" />
      <stop offset="100%" stop-color="#9cd2ff" />
    </linearGradient>
    <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    </pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="12" dy="14" stdDeviation="0" flood-color="#050a13" flood-opacity="0.6" />
    </filter>
  </defs>

  <rect x="24" y="24" width="1152" height="582" rx="36" fill="url(#bg)" stroke="#7aa2ff" stroke-width="4" filter="url(#shadow)" />
  <rect x="44" y="44" width="1112" height="542" rx="26" fill="url(#grid)" opacity="0.45" />

  <g transform="translate(80 84)">
    <text fill="#7aa2ff" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18" font-weight="700" letter-spacing="5">PREPDECK</text>
    <text y="54" fill="#f5f8ff" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="44" font-weight="800">Progress snapshot</text>
    <text y="94" fill="rgba(245,248,255,0.75)" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="22">Local-first career practice with short sessions, saved notes, and no signup wall.</text>
  </g>

  <g transform="translate(80 190)">
    ${stats
      .map(
        ([label, value], index) => `
      <g transform="translate(${index * 255} 0)">
        <rect width="228" height="120" rx="24" fill="rgba(8,15,28,0.72)" stroke="rgba(122,162,255,0.45)" stroke-width="2" />
        <text x="22" y="34" fill="rgba(180,201,255,0.78)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" font-weight="700" letter-spacing="2.8">${escapeSvg(label.toUpperCase())}</text>
        <text x="22" y="88" fill="#ffffff" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="42" font-weight="800">${escapeSvg(value)}</text>
      </g>`,
      )
      .join('')}
  </g>

  <g transform="translate(80 362)">
    <rect width="1040" height="176" rx="28" fill="rgba(8,15,28,0.74)" stroke="rgba(122,162,255,0.45)" stroke-width="2" />
    <g transform="translate(28 28)">
      <text fill="rgba(180,201,255,0.78)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" font-weight="700" letter-spacing="2.8">MASTERYSNAPSHOT</text>
      <text y="42" fill="#ffffff" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="26" font-weight="700">Strongest topic</text>
      <text y="78" fill="url(#accent)" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="34" font-weight="800">${escapeSvg(snapshot.strongestTopic)}</text>
      <text y="130" fill="#ffffff" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="26" font-weight="700">Weakest topic</text>
      <text y="166" fill="rgba(245,248,255,0.82)" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="30" font-weight="700">${escapeSvg(snapshot.weakestTopic)}</text>
    </g>
    <g transform="translate(720 34)">
      <text fill="rgba(180,201,255,0.78)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" font-weight="700" letter-spacing="2.8">PACE</text>
      <text y="44" fill="#ffffff" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="64" font-weight="800">${escapeSvg(String(snapshot.cardsSeen))}<tspan fill="rgba(245,248,255,0.62)" font-size="28" font-weight="600"> / ${escapeSvg(String(snapshot.totalCards))}</tspan></text>
      <text y="78" fill="rgba(245,248,255,0.75)" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="20">cards seen so far</text>
      <rect y="104" width="280" height="16" rx="8" fill="rgba(255,255,255,0.08)" />
      <rect y="104" width="${Math.max(20, Math.round((snapshot.cardsSeen / Math.max(1, snapshot.totalCards)) * 280))}" height="16" rx="8" fill="url(#accent)" />
    </g>
  </g>

  <g transform="translate(80 574)">
    <text fill="rgba(245,248,255,0.68)" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="18">Generated on ${escapeSvg(snapshot.generatedOn)} · Started decks ${escapeSvg(String(snapshot.startedDecks))}</text>
  </g>
</svg>`.trim()
}

export function createProgressShareCardDataUrl(snapshot: ProgressShareSnapshot): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createProgressShareCardSvg(snapshot))}`
}

export function getProgressShareCardFilename(date: Date = new Date()): string {
  return `prepdeck-progress-card-${date.toISOString().slice(0, 10)}.svg`
}

function escapeSvg(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
