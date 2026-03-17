import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/ui/panel'
import {
  getUserDataBackupFilename,
  type LocalDataSnapshot,
  parseUserDataBackup,
  serializeUserDataBackup,
} from '@/lib/user-data-backup'
import { usePreferences } from '@/state/preferences-context'
import { useProgress } from '@/state/progress-context'

type DataControlsPanelProps = {
  onResetAll: () => void
}

type FeedbackState = {
  tone: 'danger' | 'success'
  text: string
}

export function DataControlsPanel({ onResetAll }: DataControlsPanelProps) {
  const { progressStore, replaceLocalData, sessionHistoryStore } = useProgress()
  const { preferences, replacePreferences } = usePreferences()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [pendingImport, setPendingImport] = useState<{
    fileName: string
    snapshot: LocalDataSnapshot
  } | null>(null)

  const handleExport = () => {
    const blob = new Blob([
      serializeUserDataBackup({
        preferencesState: preferences,
        progressStore,
        sessionHistoryStore,
      }),
    ], {
      type: 'application/json',
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = getUserDataBackupFilename()
    link.click()
    window.URL.revokeObjectURL(url)

    setFeedback({
      text: 'Backup downloaded for this device.',
      tone: 'success',
    })
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    event.target.value = ''

    if (!file) {
      return
    }

    try {
      const snapshot = parseUserDataBackup(await file.text())
      setPendingImport({
        fileName: file.name,
        snapshot,
      })
      setFeedback(null)
    } catch {
      setPendingImport(null)
      setFeedback({
        text: 'Could not read that backup file. Use a Prepdeck backup JSON exported from the app.',
        tone: 'danger',
      })
    }
  }

  const handleConfirmImport = () => {
    if (!pendingImport) {
      return
    }

    replaceLocalData(pendingImport.snapshot)
    replacePreferences(pendingImport.snapshot.preferencesState)
    setPendingImport(null)
    setFeedback({
      text: 'Backup restored on this device.',
      tone: 'success',
    })
  }

  return (
    <>
      <Panel className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent">Local data</Badge>
              <Badge>Export</Badge>
              <Badge>Import</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-black text-[var(--retro-ink)]">
              Own your progress on this device.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/80">
              Download a backup of your statuses and notes before switching browsers,
              clearing storage, or moving to another machine. Imports replace the local
              data on this device.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[13rem]">
            <Button onClick={handleExport} type="button" variant="secondary">
              Export backup
            </Button>
            <Button onClick={handleImportClick} type="button" variant="ghost">
              Import backup
            </Button>
            <Button onClick={onResetAll} type="button" variant="danger">
              Reset all progress
            </Button>
          </div>
        </div>

        <input
          accept="application/json,.json"
          aria-label="Upload backup file"
          className="sr-only"
          onChange={handleFileChange}
          ref={fileInputRef}
          type="file"
        />

        <Panel className="mt-5 bg-[var(--retro-surface-muted)] p-4" inset>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
            What gets saved
          </p>
          <p className="mt-3 text-sm leading-6 text-white/80">
            Card status, weak-card progress, last studied position, personal notes, and
            session momentum. Goal and timer preferences move with the backup too. Premium
            preview state stays local and is not included in the backup.
          </p>
        </Panel>

        {feedback ? (
          <Panel
            className={
              feedback.tone === 'success'
                ? 'mt-4 border-[var(--retro-line-strong)] bg-[var(--retro-surface-strong)] p-4'
                : 'mt-4 border-[var(--retro-danger)] bg-[color:rgba(164,75,78,0.18)] p-4'
            }
            inset
          >
            <p className="text-sm leading-6 text-[var(--retro-ink)]">{feedback.text}</p>
          </Panel>
        ) : null}
      </Panel>

      <ConfirmDialog
        confirmLabel="Restore backup"
        description={
          pendingImport
            ? `${pendingImport.fileName} will replace the current local progress, notes, session history, and preferences on this device.`
            : ''
        }
        isOpen={Boolean(pendingImport)}
        onCancel={() => setPendingImport(null)}
        onConfirm={handleConfirmImport}
        title="Import this backup?"
      />
    </>
  )
}
