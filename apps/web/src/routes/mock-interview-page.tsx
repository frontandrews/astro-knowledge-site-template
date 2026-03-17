import { getAllDecks } from '@prepdeck/content'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { StudySessionPlayer } from '@/components/study-session-player'
import { getMockInterviewEntries } from '@/lib/mock-interview'
import { createMockInterviewHref } from '@/lib/study-session'
import { getTopicLabel } from '@/lib/topic-labels'
import { useProgress } from '@/state/progress-context'

const PROMPT_COUNT = 5

export function MockInterviewPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { progressStore } = useProgress()
  const successState = searchParams.get('state') === 'success'
  const entries = getMockInterviewEntries(progressStore, getAllDecks(), PROMPT_COUNT)

  if (entries.length === 0) {
    return <Navigate replace to="/" />
  }

  if (successState) {
    return <MockInterviewSuccess entries={entries} />
  }

  return (
    <StudySessionPlayer
      entries={entries}
      exitHref="/"
      format="interview"
      initialIndex={0}
      onComplete={() => navigate(createMockInterviewHref('success'))}
      scopeLabel="Mixed topics"
      sessionLabel="Mixed mock interview"
      showEntrySource
    />
  )
}

function MockInterviewSuccess({ entries }: { entries: ReturnType<typeof getMockInterviewEntries> }) {
  const uniqueTopics = new Set(entries.map((entry) => entry.topic))
  const uniqueDecks = new Set(entries.map((entry) => entry.deckId))
  const topicLabels = [...uniqueTopics].map((topic) => getTopicLabel(topic))

  return (
    <Panel className="bg-[var(--retro-surface)] p-6">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--retro-line)]">
        Mock interview complete
      </p>
      <h2 className="mt-3 text-3xl font-black text-[var(--retro-ink)]">
        You finished a mixed interview run.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
        That run covered {entries.length} prompts across {uniqueDecks.size} decks and{' '}
        {uniqueTopics.size} topics. Use it when you want interview pressure without
        overfitting to a single lane.
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
        <LinkButton to={createMockInterviewHref()} variant="primary">
          Run another mock interview
        </LinkButton>
        <LinkButton to="/" variant="secondary">
          Back home
        </LinkButton>
      </div>
    </Panel>
  )
}
