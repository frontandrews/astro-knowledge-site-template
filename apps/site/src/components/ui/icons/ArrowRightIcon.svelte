<script lang="ts">
  // Keep the Svelte-side arrow local for now.
  // `@lucide/svelte` currently breaks `astro build` on Astro 6 in this project,
  // while `@lucide/astro` works correctly for Astro components.
  type Props = {
    className?: string
  }

  let { className = 'size-4 shrink-0' }: Props = $props()
</script>

<svg
  aria-hidden="true"
  class={className}
  fill="none"
  stroke="currentColor"
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke-width="2"
  viewBox="0 0 24 24"
>
  <path d="M5 12h14"></path>
  <path d="m12 5 7 7-7 7"></path>
</svg>
