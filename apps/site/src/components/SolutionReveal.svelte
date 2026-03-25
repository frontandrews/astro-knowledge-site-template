<script lang="ts">
  import { Dialog } from 'bits-ui'
  import type { Snippet } from 'svelte'
  import { onMount, tick } from 'svelte'
  import { readChallengeSolvedState } from '@/lib/challenge-progress'
  import { siteEvents } from '@/lib/site-config'

  type SolutionRevealCopy = {
    buttonLabel: string
    cancel: string
    confirmSolved: string
    confirmUnsolved: string
    solutionLabel: string
    solvedMessage: string
    solvedTitle: string
    unsolvedMessage: string
    unsolvedTitle: string
  }

  type Props = {
    challengeId: string
    children?: Snippet
    copy: SolutionRevealCopy
  }

  let { challengeId, children, copy }: Props = $props()
  let solved = $state(false)
  let revealed = $state(false)
  let showDialog = $state(false)
  let solutionHeadingEl = $state<HTMLParagraphElement | null>(null)

  function getOpen() {
    return showDialog
  }

  async function setOpen(nextOpen: boolean) {
    showDialog = nextOpen
  }

  onMount(() => {
    solved = readChallengeSolvedState(challengeId)

    window.addEventListener(siteEvents.challengeSolved, onChallengeSolved)
    return () => {
      window.removeEventListener(siteEvents.challengeSolved, onChallengeSolved)
    }
  })

  function onChallengeSolved(e: Event) {
    if (!(e instanceof CustomEvent)) {
      return
    }

    const detail = e.detail as { challengeId?: string } | null

    if (detail?.challengeId === challengeId) {
      solved = true
    }
  }

  async function confirm() {
    revealed = true
    await setOpen(false)
    await tick()
    solutionHeadingEl?.focus()
  }

  function handleCloseAutoFocus(event: Event) {
    if (!revealed) {
      return
    }

    event.preventDefault()
  }
</script>

<Dialog.Root bind:open={getOpen, setOpen}>
  <div class="mx-auto mt-10 max-w-4xl">
    {#if !revealed}
      <div class="flex flex-col items-center gap-4 rounded-xl border border-site-line bg-site-panel px-6 py-8 text-center">
        <div
          class="solution-reveal-state flex size-10 items-center justify-center rounded-full {solved
            ? 'solution-reveal-state--solved'
            : 'solution-reveal-state--warning'}"
        >
          <svg class="size-5 text-site-ink-muted" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div class="grid gap-1">
          <p class="text-[0.96rem] font-semibold text-site-ink">
            {solved ? copy.solvedTitle : copy.unsolvedTitle}
          </p>
          <p class="text-sm leading-6 text-site-ink-soft">
            {solved ? copy.solvedMessage : copy.unsolvedMessage}
          </p>
        </div>
        <Dialog.Trigger
          aria-haspopup="dialog"
          class="inline-flex items-center gap-2 rounded-md border border-site-line bg-site-surface px-4 py-2 text-sm font-medium text-site-ink-soft transition-colors duration-150 hover:border-site-link-hover hover:text-site-link-hover"
        >
          <svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {copy.buttonLabel}
        </Dialog.Trigger>
      </div>
    {:else}
      <div class="border-t border-site-line pt-10">
        <p bind:this={solutionHeadingEl} class="mb-6 text-xs font-semibold uppercase tracking-widest text-site-ink-muted" tabindex="-1">
          {copy.solutionLabel}
        </p>
        {@render children?.()}
      </div>
    {/if}
  </div>

  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-site-overlay/70 backdrop-blur-[2px]" />
    <Dialog.Content
      class="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-site-line bg-site-surface p-6 shadow-(--site-shadow-overlay)"
      onCloseAutoFocus={handleCloseAutoFocus}
    >
      <div
        class="solution-reveal-state mb-4 flex size-10 items-center justify-center rounded-full {solved
          ? 'solution-reveal-state--solved'
          : 'solution-reveal-state--warning'}"
      >
        {#if solved}
          <svg
            class="solution-reveal-state-icon solution-reveal-state-icon--solved size-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        {:else}
          <svg
            class="solution-reveal-state-icon solution-reveal-state-icon--warning size-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        {/if}
      </div>
      <Dialog.Title class="mb-2 text-[1rem] font-semibold leading-snug text-site-ink">
        {solved ? copy.solvedTitle : copy.unsolvedTitle}
      </Dialog.Title>
      <Dialog.Description class="mb-6 text-sm leading-6 text-site-ink-soft">
        {solved ? copy.solvedMessage : copy.unsolvedMessage}
      </Dialog.Description>

      <div class="flex flex-col gap-2">
        {#if !solved}
          <button
            class="solution-reveal-primary inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            onclick={() => setOpen(false)}
            type="button"
          >
            {copy.cancel}
          </button>
        {/if}
        <button
          class="inline-flex items-center justify-center rounded-md border border-site-line px-4 py-2.5 text-sm font-medium text-site-ink-soft transition-colors duration-150 hover:border-site-link-hover hover:text-site-ink"
          onclick={() => void confirm()}
          type="button"
        >
          {solved ? copy.confirmSolved : copy.confirmUnsolved}
        </button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  .solution-reveal-state--solved {
    background: color-mix(in srgb, var(--site-success) 12%, transparent);
  }

  .solution-reveal-state--warning {
    background: color-mix(in srgb, var(--site-highlight-badge-ink) 8%, transparent);
  }

  .solution-reveal-state-icon--solved {
    color: var(--site-success);
  }

  .solution-reveal-state-icon--warning {
    color: color-mix(
      in srgb,
      var(--site-highlight-badge-ink) 76%,
      var(--site-base-ink-bright) 24%
    );
  }

  .solution-reveal-primary {
    background: var(--site-accent);
    color: var(--site-base-ink-bright);
  }
</style>
