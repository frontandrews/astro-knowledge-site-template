import { useEffect, useId, useState } from 'react'

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
    <div className="rounded-[1rem] border border-[var(--retro-line)] bg-[var(--retro-bg-strong)]">
      <button
        aria-controls={textareaId}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-black text-[var(--retro-ink)]"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span>Your note</span>
        <span className="text-[var(--retro-line)]">{isOpen ? 'Hide' : 'Open'}</span>
      </button>

      {!isOpen && showCollapsedPreview && note ? (
        <div className="border-t border-[var(--retro-line)] px-4 py-3">
          <p className="line-clamp-3 whitespace-pre-line text-sm leading-6 text-white/75">
            {note}
          </p>
        </div>
      ) : null}

      {isOpen ? (
        <div className="border-t border-[var(--retro-line)] px-4 py-4">
          <label className="sr-only" htmlFor={textareaId}>
            Your note
          </label>
          <textarea
            className="min-h-28 w-full rounded-[1rem] border border-[var(--retro-line)] bg-[color:rgba(255,255,255,0.03)] px-4 py-3 text-sm leading-6 text-[var(--retro-ink)] outline-none placeholder:text-white/35 focus:border-[var(--retro-line-strong)]"
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
        </div>
      ) : null}
    </div>
  )
}
