import { useEffect, useId, useState } from 'react'

import { Accordion } from '@/components/retroui/Accordion'
import { Button } from '@/components/ui/button'

const AUTOSAVE_DELAY_MS = 600

type CardNoteEditorProps = {
  note: string
  onClearNote: () => void
  onSaveNote: (note: string) => void
  showCollapsedPreview?: boolean
}

export function CardNoteEditor({
  note,
  onClearNote,
  onSaveNote,
  showCollapsedPreview = false,
}: CardNoteEditorProps) {
  const [draft, setDraft] = useState(note)
  const [isOpen, setIsOpen] = useState(false)
  const textareaId = useId()

  useEffect(() => {
    if (draft === note) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      onSaveNote(draft)
    }, AUTOSAVE_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [draft, note, onSaveNote])

  return (
    <Accordion
      collapsible
      onValueChange={(value) => setIsOpen(value === 'note')}
      type="single"
      value={isOpen ? 'note' : undefined}
    >
      <Accordion.Item className="bg-[var(--retro-bg-strong)]" value="note">
        <Accordion.Header className="text-sm text-[var(--retro-ink)]">
          <span>Your note</span>
        </Accordion.Header>
        <Accordion.Content className="border-t border-[var(--retro-line)] bg-transparent px-4 py-4">
          <label className="sr-only" htmlFor={textareaId}>
            Your note
          </label>
          <textarea
            className="min-h-28 w-full rounded-[1rem] border border-[var(--retro-line)] bg-[color:rgba(255,255,255,0.03)] px-4 py-3 text-sm leading-6 text-[var(--retro-ink)] outline-none placeholder:text-[var(--retro-ink-soft)] focus:border-[var(--retro-line-strong)]"
            id={textareaId}
            onBlur={(event) => onSaveNote(event.currentTarget.value)}
            onChange={(event) => setDraft(event.currentTarget.value)}
            placeholder="Capture your version of the answer, a shortcut, or a reminder for later."
            value={draft}
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--retro-ink-soft)]">
              Autosaves locally
            </p>
            {note || draft.trim() ? (
              <Button
                onClick={() => {
                  setDraft('')
                  onClearNote()
                }}
                size="sm"
                type="button"
                variant="ghost"
              >
                Clear note
              </Button>
            ) : null}
          </div>
        </Accordion.Content>
      </Accordion.Item>

      {!isOpen && showCollapsedPreview && note ? (
        <div className="border-t border-[var(--retro-line)] px-4 py-3">
          <p className="line-clamp-3 whitespace-pre-line text-sm leading-6 text-[var(--retro-ink-muted)]">
            {note}
          </p>
        </div>
      ) : null}
    </Accordion>
  )
}
