import type { DeckManifestEntry } from '@prepdeck/schemas'

import { Badge } from '@/components/ui/badge'
import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { getTrackLabel } from '@/lib/track-labels'
import { createStudyHref } from '@/lib/study-session'
import { getTopicLabel } from '@/lib/topic-labels'

type FirstRunPanelProps = {
  starterDecks: DeckManifestEntry[]
}

export function FirstRunPanel({ starterDecks }: FirstRunPanelProps) {
  return (
    <Panel className="mb-6 overflow-hidden bg-[linear-gradient(145deg,rgba(27,43,70,0.98),rgba(12,20,34,0.96))] p-5 sm:p-6">
      <div className="flex flex-wrap gap-2">
        <Badge tone="accent">Quick start</Badge>
        <Badge>No login</Badge>
        <Badge tone="success">Built for short reps</Badge>
      </div>

      <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--retro-ink)] sm:text-4xl">
            Start in under 10 minutes.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            On a first run, the only thing that matters is getting into one short deck,
            rating your answer honestly, and leaving with a clearer next move for your
            technical growth.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <QuickStartStep
              detail="Choose one focus area that matches the skill you want to tighten next."
              step="1"
              title="Pick one area"
            />
            <QuickStartStep
              detail="Flip only after you answer it yourself, then rate the answer without cheating."
              step="2"
              title="Run a clean rep"
            />
            <QuickStartStep
              detail="Capture a note when the concept is shaky so the next session starts stronger."
              step="3"
              title="Save the weak spots"
            />
          </div>
        </div>

        <div className="grid gap-3">
          {starterDecks.map((deck) => (
            <Panel className="bg-[color:rgba(8,14,25,0.42)] p-4" inset key={deck.id}>
              <div className="flex flex-wrap gap-2">
                <Badge tone="accent">{getTrackLabel(deck.track)}</Badge>
                <Badge>{getTopicLabel(deck.topic)}</Badge>
                <Badge>{deck.difficulty}</Badge>
                <Badge>{deck.estimatedMinutes} min</Badge>
              </div>
              <h3 className="mt-3 text-xl font-black text-[var(--retro-ink)]">{deck.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">{deck.description}</p>
              <div className="mt-4">
                <LinkButton to={createStudyHref(deck.id, { mode: 'start' })} variant="primary">
                  Start {getTrackLabel(deck.track)}
                </LinkButton>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </Panel>
  )
}

function QuickStartStep({
  detail,
  step,
  title,
}: {
  detail: string
  step: string
  title: string
}) {
  return (
    <Panel className="bg-[color:rgba(8,14,25,0.42)] p-4" inset>
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
        Step {step}
      </p>
      <h3 className="mt-2 text-lg font-black text-[var(--retro-ink)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/75">{detail}</p>
    </Panel>
  )
}
