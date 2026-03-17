import type { DeckManifestEntry } from '@prepdeck/schemas'
import { m } from 'motion/react'

import { Badge } from '@/components/ui/badge'
import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { ProgressMeter } from '@/components/ui/progress-meter'
import { cardRevealVariants, hoverLiftMotionProps } from '@/lib/motion'
import { getTrackLabel } from '@/lib/track-labels'
import { getTopicLabel } from '@/lib/topic-labels'

type DeckCardProps = {
  detailHref: string
  learnedCount: number
  noteCount?: number
  reviewDebt?: number
  summary: DeckManifestEntry
  totalCards: number
}

export function DeckCard({
  detailHref,
  learnedCount,
  noteCount = 0,
  reviewDebt = 0,
  summary,
  totalCards,
}: DeckCardProps) {
  return (
    <m.div
      className="h-full [transform-style:preserve-3d]"
      initial="initial"
      layout
      variants={cardRevealVariants}
      viewport={{ amount: 0.2, once: true }}
      whileInView="animate"
      {...hoverLiftMotionProps}
    >
      <Panel className="flex h-full flex-col justify-between gap-5 p-5">
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">{getTrackLabel(summary.track)}</Badge>
          <Badge>{getTopicLabel(summary.topic)}</Badge>
        </div>
        <h2 className="text-xl font-black text-[var(--retro-ink)]">{summary.title}</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge>{summary.estimatedMinutes} min</Badge>
          <Badge>{summary.difficulty}</Badge>
          <Badge tone="success">
            {learnedCount} / {totalCards} learned
          </Badge>
          {reviewDebt > 0 ? (
            <Badge tone="warning">
              {reviewDebt} {reviewDebt === 1 ? 'needs' : 'need'} review
            </Badge>
          ) : null}
          {noteCount > 0 ? (
            <Badge tone="accent">
              {noteCount} note{noteCount === 1 ? '' : 's'}
            </Badge>
          ) : null}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--retro-ink-soft)]">
            <span>Deck progress</span>
            <span>{learnedCount} of {totalCards}</span>
          </div>
          <ProgressMeter current={learnedCount} total={totalCards} />
        </div>
        <div className="mt-auto">
          <LinkButton to={detailHref} variant="primary">
            Open deck
          </LinkButton>
        </div>
      </Panel>
    </m.div>
  )
}
