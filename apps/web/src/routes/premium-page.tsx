import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Panel } from '@/components/ui/panel'
import { useMonetization } from '@/state/monetization-context'

export function PremiumPage() {
  const { isPremium, membership, setMembershipTier } = useMonetization()

  return (
    <div className="space-y-6">
      <section>
        <Panel className="overflow-hidden bg-[linear-gradient(145deg,rgba(43,67,108,0.98),rgba(18,29,50,0.96))] p-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">Premium</Badge>
            <Badge>Ad-free</Badge>
            <Badge tone="success">No account required</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--retro-ink)] sm:text-4xl">
            Premium removes ads and funds deeper practice features.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
            The free plan stays fully usable. Premium keeps the interface cleaner,
            removes sponsor placements, and helps fund backup, sync, and deeper
            practice modes later on.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              onClick={() => setMembershipTier(isPremium ? 'free' : 'premium')}
              type="button"
              variant="primary"
            >
              {isPremium ? 'Switch to free preview' : 'Preview premium locally'}
            </Button>
            <LinkButton to="/" variant="secondary">
              Keep using the free plan
            </LinkButton>
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PlanCard
          items={[
            'Full deck library',
            'Study and review loops',
            'Local notes per card',
            'Weak-card sessions',
            'Sponsor-supported surfaces',
          ]}
          title="Free"
          tone="default"
        />
        <PlanCard
          items={[
            'Everything in free',
            'No ad slots',
            'Cleaner product flow',
            'Priority access to backup and sync later',
            'Supports long-term development',
          ]}
          title="Premium"
          tone="accent"
        />
      </section>

      <Panel className="p-5">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--retro-line)]">
          Current status
        </p>
        <h2 className="mt-3 text-2xl font-black text-[var(--retro-ink)]">
          {membership.tier === 'premium'
            ? 'Premium preview is active on this device.'
            : 'Premium checkout is not live yet.'}
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/80">
          {membership.tier === 'premium'
            ? 'Ad slots are hidden while this device stays in premium preview mode.'
            : 'Checkout is not connected in this open build yet. For now, you can preview the premium state locally on this device.'}
        </p>
      </Panel>
    </div>
  )
}

function PlanCard({
  items,
  title,
  tone,
}: {
  items: string[]
  title: string
  tone: 'accent' | 'default'
}) {
  return (
    <Panel
      className={
        tone === 'accent'
          ? 'border-[var(--retro-line-strong)] bg-[var(--retro-surface-strong)] p-5'
          : 'p-5'
      }
    >
      <div className="flex items-center gap-3">
        <Badge tone={tone}>{title}</Badge>
      </div>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-white/80">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </Panel>
  )
}
