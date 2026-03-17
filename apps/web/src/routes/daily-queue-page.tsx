import { getAllDecks } from '@prepdeck/content'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { StudySessionPlayer } from '@/components/study-session-player'
import { getDailyQueueEntries } from '@/lib/daily-queue'
import { createDailyQueueHref } from '@/lib/study-session'
import { getTopicLabel } from '@/lib/topic-labels'
import { useProgress } from '@/state/progress-context'

const QUEUE_SIZE = 7

export function DailyQueuePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { progressStore } = useProgress()
  const successState = searchParams.get('state') === 'success'
  const entries = getDailyQueueEntries(progressStore, getAllDecks(), QUEUE_SIZE)

  if (entries.length === 0) {
    return <Navigate replace to="/" />
  }

  if (successState) {
    return <DailyQueueSuccess entries={entries} />
  }

  return (
    <StudySessionPlayer
      entries={entries}
      exitHref="/"
      format="flashcards"
      initialIndex={0}
      onComplete={() => navigate(createDailyQueueHref('success'))}
      scopeLabel="Daily queue"
      sessionLabel="Daily smart queue"
      showEntrySource
    />
  )
}

function DailyQueueSuccess({ entries }: { entries: ReturnType<typeof getDailyQueueEntries> }) {
  const uniqueTopics = new Set(entries.map((entry) => entry.topic))
  const topicLabels = [...uniqueTopics].map((topic) => getTopicLabel(topic))

  return (
    <Panel className="bg-[var(--retro-surface)] p-6">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--retro-line)]">
        Daily queue complete
      </p>
      <h2 className="mt-3 text-3xl font-black text-[var(--retro-ink)]">
        You cleared today&apos;s smart queue.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
        That run mixed cards that were weak, cards you annotated, and a few fresh prompts so
        the daily loop stays useful without feeling repetitive.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {topicLabels.map((label) => (
          <span
            className="inline-flex items-center rounded-full border-2 border-[var(--retro-line)] bg-[color:rgba(255,255,255,0.04)] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--retro-ink)]"
            key={label}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <LinkButton to={createDailyQueueHref()} variant="primary">
          Run daily queue again
        </LinkButton>
        <LinkButton to="/" variant="secondary">
          Back home
        </LinkButton>
      </div>
    </Panel>
  )
}
