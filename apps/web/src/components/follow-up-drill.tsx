import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/ui/panel'

type FollowUpDrillProps = {
  prompts: string[]
}

export function FollowUpDrill({ prompts }: FollowUpDrillProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  if (prompts.length === 0) {
    return null
  }

  const isComplete = currentIndex >= prompts.length
  const currentPrompt = prompts[currentIndex]

  return (
    <div className="rounded-[1rem] border border-[var(--retro-line)] bg-[var(--retro-bg-strong)]">
      <button
        aria-label={isOpen ? 'Hide follow-up drill' : 'Open follow-up drill'}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-black text-[var(--retro-ink)]"
        onClick={() => {
          if (isOpen) {
            setCurrentIndex(0)
          }

          setIsOpen((open) => !open)
        }}
        type="button"
      >
        <span>Follow-up drill</span>
        <span className="text-[var(--retro-line)]">{isOpen ? 'Hide' : 'Open'}</span>
      </button>

      {isOpen ? (
        <div className="border-t border-[var(--retro-line)] px-4 py-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">{prompts.length} prompts</Badge>
            <Badge>{isComplete ? 'Complete' : `Prompt ${currentIndex + 1} of ${prompts.length}`}</Badge>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/80">
            Treat these like interviewer pushback. Answer out loud, then move to the next prompt when you are ready.
          </p>

          <Panel className="mt-4 bg-[color:rgba(255,255,255,0.03)] p-4" inset>
            {isComplete ? (
              <>
                <p className="text-sm font-black text-[var(--retro-ink)]">Follow-ups complete</p>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  You worked through every interviewer prompt for this card. Rate the card when you are ready or run the drill again.
                </p>
              </>
            ) : (
              <>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--retro-ink-soft)]">
                  Follow-up {currentIndex + 1}
                </p>
                <p className="mt-2 text-base leading-7 text-[var(--retro-ink)]">
                  {currentPrompt}
                </p>
              </>
            )}
          </Panel>

          <div className="mt-4 flex flex-wrap gap-3">
            {isComplete ? (
              <Button
                onClick={() => setCurrentIndex(0)}
                type="button"
                variant="secondary"
              >
                Run again
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentIndex((index) => index + 1)}
                type="button"
                variant="secondary"
              >
                {currentIndex === prompts.length - 1 ? 'Finish follow-ups' : 'Next prompt'}
              </Button>
            )}
            <Button
              onClick={() => {
                setCurrentIndex(0)
                setIsOpen(false)
              }}
              type="button"
              variant="ghost"
            >
              {isComplete ? 'Close drill' : 'Skip drill'}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
