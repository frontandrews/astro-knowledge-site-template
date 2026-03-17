import type { ReactNode } from 'react'
import { m } from 'motion/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/ui/panel'
import { cardRevealVariants, hoverLiftMotionProps } from '@/lib/motion'
import { usePreferences } from '@/state/preferences-context'

const DAILY_TARGETS = [1, 2, 3] as const
const WEEKLY_TARGETS = [3, 5, 7] as const
const TIMER_PRESETS = [
  {
    description: 'Tighter reps for fast recall practice.',
    label: 'Short',
    value: 'short',
  },
  {
    description: 'Balanced pacing for most interview reps.',
    label: 'Standard',
    value: 'standard',
  },
  {
    description: 'Longer prompts for deeper system-design or leadership answers.',
    label: 'Deep',
    value: 'deep',
  },
] as const

export function SettingsPage() {
  const {
    preferences,
    resetPreferences,
    setDailyGoalTarget,
    setInterviewTimerPreset,
    setWeeklyGoalTarget,
  } = usePreferences()

  return (
    <section className="space-y-6">
      <Panel className="overflow-hidden bg-[linear-gradient(145deg,rgba(28,45,72,0.98),rgba(10,18,31,0.96))] p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">Settings</Badge>
          <Badge>Local-only</Badge>
          <Badge tone="success">No account needed</Badge>
        </div>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-[var(--retro-ink)] sm:text-4xl">
          Tune the app to your study rhythm.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
          Prepdeck now lets you control the local goal pace and the interview timer style.
          Everything stays on this device and applies instantly across the app.
        </p>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SettingCard
          description="This changes the target used across the home screen and progress hub."
          title="Daily goal target"
        >
          <div className="flex flex-wrap gap-3">
            {DAILY_TARGETS.map((target) => (
              <Button
                key={target}
                onClick={() => setDailyGoalTarget(target)}
                type="button"
                variant={preferences.dailyGoalTarget === target ? 'primary' : 'ghost'}
              >
                {target} session{target === 1 ? '' : 's'}
              </Button>
            ))}
          </div>
        </SettingCard>

        <SettingCard
          description="This drives the weekly pace shown in progress and goal tracking."
          title="Weekly goal target"
        >
          <div className="flex flex-wrap gap-3">
            {WEEKLY_TARGETS.map((target) => (
              <Button
                key={target}
                onClick={() => setWeeklyGoalTarget(target)}
                type="button"
                variant={preferences.weeklyGoalTarget === target ? 'primary' : 'ghost'}
              >
                {target} sessions
              </Button>
            ))}
          </div>
        </SettingCard>
      </div>

      <SettingCard
        description="Interview mode uses this preset for every timed prompt."
        title="Interview timer pace"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {TIMER_PRESETS.map((preset) => (
            <Panel
              className={
                preferences.interviewTimerPreset === preset.value
                  ? 'border-[var(--retro-line-strong)] bg-[var(--retro-surface-strong)] p-4'
                  : 'p-4'
              }
              inset
              key={preset.value}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-black text-[var(--retro-ink)]">{preset.label}</p>
                  <p className="mt-2 text-sm leading-6 text-white/75">{preset.description}</p>
                </div>
                {preferences.interviewTimerPreset === preset.value ? (
                  <Badge tone="accent">Active</Badge>
                ) : null}
              </div>
              <div className="mt-4">
                <Button
                  onClick={() => setInterviewTimerPreset(preset.value)}
                  type="button"
                  variant={preferences.interviewTimerPreset === preset.value ? 'primary' : 'ghost'}
                >
                  Use {preset.label}
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      </SettingCard>

      <m.div
        className="[transform-style:preserve-3d]"
        initial="initial"
        variants={cardRevealVariants}
        viewport={{ amount: 0.2, once: true }}
        whileInView="animate"
        {...hoverLiftMotionProps}
      >
        <Panel className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
              Reset preferences
            </p>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Go back to the default goal pace and timer behavior without touching progress,
              notes, or session history.
            </p>
          </div>
          <Button onClick={resetPreferences} type="button" variant="secondary">
            Restore defaults
          </Button>
        </Panel>
      </m.div>
    </section>
  )
}

function SettingCard({
  children,
  description,
  title,
}: {
  children: ReactNode
  description: string
  title: string
}) {
  return (
    <m.div
      className="[transform-style:preserve-3d]"
      initial="initial"
      variants={cardRevealVariants}
      viewport={{ amount: 0.2, once: true }}
      whileInView="animate"
      {...hoverLiftMotionProps}
    >
      <Panel className="p-5">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
          Preference
        </p>
        <h3 className="mt-3 text-2xl font-black text-[var(--retro-ink)]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/80">{description}</p>
        <div className="mt-5">{children}</div>
      </Panel>
    </m.div>
  )
}
