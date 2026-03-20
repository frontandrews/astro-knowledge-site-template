<script lang="ts">
  import { tick } from 'svelte'

  import { cn } from '@/lib/cn'
  import type { GiscusConfig } from '@/lib/giscus'
  import { ui } from '@/lib/ui'

  export let config: GiscusConfig
  export let openLabel = 'View comments'
  export let title = 'Comments'

  let host: HTMLDivElement | null = null
  let isOpen = false
  let hasLoaded = false

  async function openComments() {
    if (isOpen) {
      return
    }

    isOpen = true
    await tick()

    if (!host || hasLoaded) {
      return
    }

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', config.repo)
    script.setAttribute('data-repo-id', config.repoId)
    script.setAttribute('data-category', config.category)
    script.setAttribute('data-category-id', config.categoryId)
    script.setAttribute('data-mapping', config.mapping)
    script.setAttribute('data-strict', config.strict)
    script.setAttribute('data-reactions-enabled', config.reactionsEnabled)
    script.setAttribute('data-emit-metadata', config.emitMetadata)
    script.setAttribute('data-input-position', config.inputPosition)
    script.setAttribute('data-theme', config.theme)
    script.setAttribute('data-lang', config.lang)

    host.appendChild(script)
    hasLoaded = true
  }
</script>

{#if isOpen}
  <section class={ui.articleSection} data-article-reading-end>
    <div class={ui.sectionHeader}>
      <div class="grid gap-1">
        <h2 class={ui.headingCompact}>{title}</h2>
      </div>
    </div>

    <div bind:this={host} class="giscus-comments pt-1.5"></div>
  </section>
{:else}
  <section class={cn(ui.articleSection, 'flex justify-center')} data-article-reading-end>
    <button
      class={cn(ui.controlButton, 'px-4 py-3 text-[0.88rem] font-medium lg:px-4.5 lg:py-3.5 lg:text-[0.96rem]')}
      on:click={openComments}
      type="button"
    >
      {openLabel}
    </button>
  </section>
{/if}
