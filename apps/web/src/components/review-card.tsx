import type { Flashcard, ProgressStatus } from '@prepdeck/schemas'

import { CardNoteEditor } from '@/components/card-note-editor'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/ui/panel'

type ReviewCardProps = {
  card: Flashcard
  note: string
  onClearNote: () => void
  onSaveNote: (note: string) => void
  onSetStatus: (status: ProgressStatus) => void
  onUnmarkLearned: () => void
  status: ProgressStatus
}

const BUTTONS: ProgressStatus[] = ['learned', 'partial', 'not_learned']

export function ReviewCard({
  card,
  note,
  onClearNote,
  onSaveNote,
  onSetStatus,
  onUnmarkLearned,
  status,
}: ReviewCardProps) {
  return (
    <Panel className="p-4">
      <p className="text-sm font-black text-[var(--retro-ink)]">{card.question}</p>
      <p className="mt-3 text-sm leading-6 text-white/80">
        {card.shortAnswer}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {BUTTONS.map((buttonStatus) => (
          <Button
            className="rounded-full"
            key={buttonStatus}
            onClick={() => onSetStatus(buttonStatus)}
            size="sm"
            type="button"
            variant={status === buttonStatus ? 'primary' : 'ghost'}
          >
            {buttonStatus.replace('_', ' ')}
          </Button>
        ))}
        {status === 'learned' ? (
          <Button className="rounded-full" onClick={onUnmarkLearned} size="sm" type="button" variant="danger">
            Unmark
          </Button>
        ) : null}
      </div>
      <div className="mt-4">
        <CardNoteEditor
          note={note}
          onClearNote={onClearNote}
          onSaveNote={onSaveNote}
          showCollapsedPreview
        />
      </div>
    </Panel>
  )
}
