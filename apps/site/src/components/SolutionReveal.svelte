<script lang="ts">
  import { onMount } from 'svelte'

  export let challengeId: string
  export let locale: string = 'pt-br'

  const isPtBr = locale === 'pt-br'

  const copy = {
    buttonLabel: isPtBr ? 'Ver solução' : 'View solution',
    solvedTitle: isPtBr ? 'Desafio resolvido!' : 'Challenge solved!',
    solvedMessage: isPtBr
      ? 'Você já resolveu este desafio. Quer ver a solução de referência?'
      : 'You already solved this challenge. Want to see the reference solution?',
    unsolvedTitle: isPtBr ? 'Ainda não resolveu?' : 'Haven\'t solved it yet?',
    unsolvedMessage: isPtBr
      ? 'Ver a solução agora pode reduzir o aprendizado. Vale a pena tentar mais um pouco.'
      : 'Viewing the solution now may reduce learning. It\'s worth trying a bit more.',
    confirmSolved: isPtBr ? 'Ver mesmo assim' : 'View anyway',
    confirmUnsolved: isPtBr ? 'Ver mesmo assim' : 'View anyway',
    cancel: isPtBr ? 'Vou tentar mais' : 'I\'ll keep trying',
    solutionLabel: isPtBr ? 'Solução' : 'Solution',
  }

  let solved = false
  let revealed = false
  let showDialog = false

  const storageKey = `challenge-solved-${challengeId}`

  onMount(() => {
    solved = localStorage.getItem(storageKey) === '1'

    window.addEventListener('challenge-solved', onChallengeSolved)
    return () => window.removeEventListener('challenge-solved', onChallengeSolved)
  })

  function onChallengeSolved(e: Event) {
    const detail = (e as CustomEvent<{ challengeId: string }>).detail
    if (detail.challengeId === challengeId) solved = true
  }

  function openDialog() {
    showDialog = true
  }

  function confirm() {
    showDialog = false
    revealed = true
  }

  function cancel() {
    showDialog = false
  }

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) cancel()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') cancel()
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="mx-auto mt-10 max-w-4xl">
  {#if !revealed}
    <div class="flex flex-col items-center gap-4 rounded-xl border border-site-line bg-site-panel px-6 py-8 text-center">
      <div class="flex size-10 items-center justify-center rounded-full bg-site-surface-strong">
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
      <button
        on:click={openDialog}
        class="inline-flex items-center gap-2 rounded-md border border-site-line bg-site-surface px-4 py-2 text-sm font-medium text-site-ink-soft transition-colors duration-150 hover:border-site-link-hover hover:text-site-link-hover"
      >
        <svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {copy.buttonLabel}
      </button>
    </div>
  {:else}
    <div class="border-t border-site-line pt-10">
      <p class="mb-6 text-xs font-semibold uppercase tracking-widest text-site-ink-muted">
        {copy.solutionLabel}
      </p>
      <slot />
    </div>
  {/if}
</div>

<!-- Confirmation dialog -->
{#if showDialog}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    style="background: var(--site-overlay-backdrop)"
    on:click={handleBackdrop}
  >
    <div class="w-full max-w-sm rounded-xl border border-site-line bg-site-surface p-6 shadow-(--site-shadow-overlay)">
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

      <h2 class="mb-2 text-[1rem] font-semibold leading-snug text-site-ink">
        {solved ? copy.solvedTitle : copy.unsolvedTitle}
      </h2>
      <p class="mb-6 text-sm leading-6 text-site-ink-soft">
        {solved ? copy.solvedMessage : copy.unsolvedMessage}
      </p>

      <div class="flex flex-col gap-2">
        {#if !solved}
          <button
            on:click={cancel}
            class="solution-reveal-primary inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          >
            {copy.cancel}
          </button>
        {/if}
        <button
          on:click={confirm}
          class="inline-flex items-center justify-center rounded-md border border-site-line px-4 py-2.5 text-sm font-medium text-site-ink-soft transition-colors duration-150 hover:border-site-link-hover hover:text-site-ink"
        >
          {solved ? copy.confirmSolved : copy.confirmUnsolved}
        </button>
      </div>
    </div>
  </div>
{/if}

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
