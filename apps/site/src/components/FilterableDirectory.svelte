<script lang="ts">
  import { onMount, tick } from 'svelte'
  import ArrowRightIcon from '@/components/ui/icons/ArrowRightIcon.svelte'
  import { cn } from '@/lib/cn'
  import { readCompletedArticles, completedArticlesChangedEvent } from '@/lib/article-progress'
  import { ui } from '@/lib/ui'
  import { directoryLinkVariants, directoryListVariants, filterChipVariants } from '@/lib/ui-variants'

  type DirectoryTag = {
    id: string
    label: string
  }

  type DirectoryItem = {
    badgeLabel?: string
    completedCtaLabel?: string
    completionId?: string
    contentKind?: 'article' | 'note'
    ctaLabel?: string
    description?: string
    eyebrow?: string
    href: string
    meta?: string
    tags: DirectoryTag[]
    title: string
  }

  export let items: DirectoryItem[] = []
  export let filterLabel = ''
  export let sectionLabel = ''
  export let completionStorageKey: string | null = null
  export let layout: 'rows' | 'cards' = 'cards'
  export let allItemsLabel = 'All'
  export let articleItemsLabel = 'Articles'
  export let noteItemsLabel = 'Notes'
  export let moreFiltersLabel = 'more'
  export let fewerFiltersLabel = 'Show less'
  export let moreFiltersHref: string | null = null
  export let availableFilters: DirectoryTag[] = []
  export let filterQueryKey: string | null = null

  const filterTones = [
    { dark: 'var(--site-filter-tone-1-dark)', light: 'var(--site-filter-tone-1-light)' },
    { dark: 'var(--site-filter-tone-2-dark)', light: 'var(--site-filter-tone-2-light)' },
    { dark: 'var(--site-filter-tone-3-dark)', light: 'var(--site-filter-tone-3-light)' },
    { dark: 'var(--site-filter-tone-4-dark)', light: 'var(--site-filter-tone-4-light)' },
    { dark: 'var(--site-filter-tone-5-dark)', light: 'var(--site-filter-tone-5-light)' },
    { dark: 'var(--site-filter-tone-6-dark)', light: 'var(--site-filter-tone-6-light)' },
  ]
  const filterLabelClass = ui.filterLabel
  const itemEyebrowClass = ui.metaQuiet
  const listClass = directoryListVariants({ layout })
  const rowItemClass = ui.linearRow
  const itemLinkClass = directoryLinkVariants({ layout })
  let activeFilter: string | null = null
  let activeType: 'all' | 'article' | 'note' = 'all'
  let showAllFilters = false
  let visibleCategoryCount = 0
  let completedItemIds = new Set<string>(typeof window === 'undefined' ? [] : readCompletedArticles())
  let filterMeasureContainer: HTMLDivElement | null = null
  let resizeObserver: ResizeObserver | null = null
  let measureRun = 0
  let hasInitializedQueryFilter = false
  let hasMeasuredCollapsedFilters = false
  let previousCollapsedSignature = ''

  $: typeScopedItems = items.filter((item) =>
    activeType === 'all' ? true : (item.contentKind ?? 'article') === activeType,
  )
  $: typeScopedFilterIds = new Set(typeScopedItems.flatMap((item) => item.tags.map((tag) => tag.id)))
  $: filters =
    availableFilters.length > 0
      ? availableFilters.filter((filter) => typeScopedFilterIds.has(filter.id))
      : Array.from(
          new Map(typeScopedItems.flatMap((item) => item.tags.map((tag) => [tag.id, tag.label]))).entries(),
        ).map(([id, label]) => ({ id, label }))
  $: hasTypeFilters =
    items.some((item) => item.contentKind === 'note') &&
    items.some((item) => (item.contentKind ?? 'article') !== 'note')
  $: if (activeFilter && !filters.some((filter) => filter.id === activeFilter)) {
    activeFilter = null
  }
  $: if (showAllFilters) {
    visibleCategoryCount = filters.length
  }
  $: shouldCollapseCategoryFilters = hasTypeFilters
  $: if (!shouldCollapseCategoryFilters) {
    visibleCategoryCount = filters.length
    hasMeasuredCollapsedFilters = true
  }
  $: visibleFilters = showAllFilters || !shouldCollapseCategoryFilters ? filters : filters.slice(0, visibleCategoryCount)
  $: shouldRenderCategoryFilters = !shouldCollapseCategoryFilters || showAllFilters || hasMeasuredCollapsedFilters
  $: hiddenFiltersCount = shouldCollapseCategoryFilters ? Math.max(filters.length - visibleFilters.length, 0) : 0
  $: visibleItems = typeScopedItems.filter((item) => {
    const matchesTag = activeFilter ? item.tags.some((tag) => tag.id === activeFilter) : true

    return matchesTag
  })
  $: collapsedSignature = showAllFilters ? 'expanded' : `${activeType}|${filters.map((filter) => filter.id).join(',')}`

  function toggleFilter(id: string) {
    activeFilter = activeFilter === id ? null : id
  }

  function setActiveType(type: 'all' | 'article' | 'note') {
    activeType = type
  }

  function toggleFilterVisibility() {
    showAllFilters = !showAllFilters
  }

  function setMeasuredCategoryCount(count: number) {
    if (!filterMeasureContainer) {
      return
    }

    const categoryChips = Array.from(filterMeasureContainer.querySelectorAll<HTMLElement>('[data-measure-chip="category"]'))
    const moreChip = filterMeasureContainer.querySelector<HTMLElement>('[data-measure-chip="more"]')

    categoryChips.forEach((chip, index) => {
      chip.style.display = index < count ? '' : 'none'
    })

    if (moreChip) {
      moreChip.style.display = count < categoryChips.length ? '' : 'none'
    }
  }

  function measureCollapsedCategoryCount() {
    if (!filterMeasureContainer || !shouldCollapseCategoryFilters || showAllFilters || filters.length === 0) {
      visibleCategoryCount = filters.length
      hasMeasuredCollapsedFilters = true
      return
    }

    const categoryChips = Array.from(filterMeasureContainer.querySelectorAll<HTMLElement>('[data-measure-chip="category"]'))

    if (categoryChips.length === 0) {
      visibleCategoryCount = 0
      return
    }

    let best = categoryChips.length

    for (let count = categoryChips.length; count >= 0; count -= 1) {
      setMeasuredCategoryCount(count)

      const visibleChips = Array.from(filterMeasureContainer.querySelectorAll<HTMLElement>('[data-measure-chip]')).filter(
        (chip) => chip.style.display !== 'none',
      )
      const visibleRows = new Set(visibleChips.map((chip) => chip.offsetTop)).size

      if (visibleRows <= 2) {
        best = count
        break
      }
    }

    visibleCategoryCount = best
    setMeasuredCategoryCount(best)
    hasMeasuredCollapsedFilters = true
  }

  async function scheduleCollapsedCategoryMeasurement() {
    if (typeof window === 'undefined') {
      return
    }

    const currentRun = ++measureRun
    await tick()

    if (currentRun !== measureRun) {
      return
    }

    measureCollapsedCategoryCount()
  }

  function isComplete(item: DirectoryItem) {
    return Boolean(item.completionId && completedItemIds.has(item.completionId))
  }

  function getCompletedCtaLabel(item: DirectoryItem) {
    if (item.completedCtaLabel) {
      return item.completedCtaLabel
    }

    if (item.ctaLabel === 'Ler mais') {
      return 'Ler novamente'
    }

    if (item.ctaLabel === 'Read more') {
      return 'Read again'
    }

    return 'Read again'
  }

  function syncFilterFromQuery() {
    if (typeof window === 'undefined' || !filterQueryKey) {
      return
    }

    const queryValue = new URL(window.location.href).searchParams.get(filterQueryKey)

    if (queryValue && filters.some((filter) => filter.id === queryValue)) {
      activeFilter = queryValue
    }
  }

  onMount(() => {
    const cleanup: Array<() => void> = []
    const syncCompletedItems = () => {
      completedItemIds = new Set(readCompletedArticles())
    }

    if (completionStorageKey) {
      syncCompletedItems()

      const handleCompletedItemsChanged = () => {
        syncCompletedItems()
      }

      const handleStorage = (event: StorageEvent) => {
        if (event.key === completionStorageKey) {
          syncCompletedItems()
        }
      }

      window.addEventListener(completedArticlesChangedEvent, handleCompletedItemsChanged)
      window.addEventListener('storage', handleStorage)
      cleanup.push(() => {
        window.removeEventListener(completedArticlesChangedEvent, handleCompletedItemsChanged)
        window.removeEventListener('storage', handleStorage)
      })
    }

    syncFilterFromQuery()
    hasInitializedQueryFilter = true
    resizeObserver = new ResizeObserver(() => {
      void scheduleCollapsedCategoryMeasurement()
    })

    if (filterMeasureContainer?.parentElement) {
      resizeObserver.observe(filterMeasureContainer.parentElement)
    }

    void scheduleCollapsedCategoryMeasurement()

    return () => {
      cleanup.forEach((callback) => callback())
      resizeObserver?.disconnect()
    }
  })

  $: void filters, hasTypeFilters, showAllFilters, scheduleCollapsedCategoryMeasurement()
  $: if (hasInitializedQueryFilter && typeof window !== 'undefined' && filterQueryKey) {
    const nextUrl = new URL(window.location.href)

    if (activeFilter) {
      nextUrl.searchParams.set(filterQueryKey, activeFilter)
    } else {
      nextUrl.searchParams.delete(filterQueryKey)
    }

    window.history.replaceState({}, '', `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`)
  }
  $: if (collapsedSignature !== previousCollapsedSignature) {
    previousCollapsedSignature = collapsedSignature
    hasMeasuredCollapsedFilters = false
  }
</script>

{#if sectionLabel || filters.length > 0 || hasTypeFilters}
  <div class="mb-3 mt-4 grid justify-items-start gap-4">
    {#if sectionLabel}
      <p class={filterLabelClass}>{sectionLabel}</p>
    {/if}
    {#if filters.length > 0 || hasTypeFilters}
      <div class="relative grid justify-items-start gap-2">
        {#if filterLabel}
          <p class={filterLabelClass}>{filterLabel}</p>
        {/if}
        <div class="flex flex-wrap justify-start gap-2.5">
          {#if hasTypeFilters}
            <button
              aria-pressed={activeType === 'all'}
              class={filterChipVariants({ active: activeType === 'all' })}
              onclick={() => setActiveType('all')}
              type="button"
            >
              <span>{allItemsLabel}</span>
            </button>
            <button
              aria-pressed={activeType === 'article'}
              class={filterChipVariants({ active: activeType === 'article' })}
              onclick={() => setActiveType('article')}
              type="button"
            >
              <span>{articleItemsLabel}</span>
            </button>
            <button
              aria-pressed={activeType === 'note'}
              class={filterChipVariants({ active: activeType === 'note' })}
              onclick={() => setActiveType('note')}
              type="button"
            >
              <span>{noteItemsLabel}</span>
            </button>
            {#if filters.length > 0}
              <span aria-hidden="true" class="self-center text-sm text-site-ink-muted">|</span>
            {/if}
          {:else if filters.length > 0}
            <button
              aria-pressed={!activeFilter}
              class={filterChipVariants({ active: !activeFilter })}
              onclick={() => (activeFilter = null)}
              type="button"
            >
              <span>{allItemsLabel}</span>
            </button>
          {/if}
          {#if shouldRenderCategoryFilters}
            {#each visibleFilters as filter, index}
              {@const tone = filterTones[index % filterTones.length]}
              <button
                aria-pressed={filter.id === activeFilter}
                class={filterChipVariants({ active: filter.id === activeFilter })}
                onclick={() => toggleFilter(filter.id)}
                style={`--chip-accent: ${tone.light}; --chip-accent-dark: ${tone.dark};`}
                type="button"
              >
                <span>{filter.label}</span>
              </button>
            {/each}
            {#if hiddenFiltersCount > 0}
              {#if moreFiltersHref && !showAllFilters}
                <a
                  class={filterChipVariants({ active: false })}
                  href={moreFiltersHref}
                >
                  <span>+{hiddenFiltersCount} {moreFiltersLabel}</span>
                </a>
              {:else}
                <button
                  aria-expanded={showAllFilters}
                  class={filterChipVariants({ active: showAllFilters })}
                  onclick={toggleFilterVisibility}
                  type="button"
                >
                  <span>{showAllFilters ? fewerFiltersLabel : `+${hiddenFiltersCount} ${moreFiltersLabel}`}</span>
                </button>
              {/if}
            {/if}
          {/if}
        </div>
        <div
          aria-hidden="true"
          bind:this={filterMeasureContainer}
          class="pointer-events-none invisible absolute left-0 top-0 -z-10 flex w-full flex-wrap justify-start gap-2.5 overflow-hidden"
        >
          {#if hasTypeFilters}
            <button class={filterChipVariants({ active: activeType === 'all' })} data-measure-chip="type" type="button">
              <span>{allItemsLabel}</span>
            </button>
            <button class={filterChipVariants({ active: activeType === 'article' })} data-measure-chip="type" type="button">
              <span>{articleItemsLabel}</span>
            </button>
            <button class={filterChipVariants({ active: activeType === 'note' })} data-measure-chip="type" type="button">
              <span>{noteItemsLabel}</span>
            </button>
          {:else if filters.length > 0}
            <button class={filterChipVariants({ active: !activeFilter })} data-measure-chip="all" type="button">
              <span>{allItemsLabel}</span>
            </button>
          {/if}
          {#each filters as filter, index}
            {@const tone = filterTones[index % filterTones.length]}
            <button
              class={filterChipVariants({ active: false })}
              data-measure-chip="category"
              style={`--chip-accent: ${tone.light}; --chip-accent-dark: ${tone.dark};`}
              type="button"
            >
              <span>{filter.label}</span>
            </button>
          {/each}
          <button class={filterChipVariants({ active: false })} data-measure-chip="more" type="button">
            <span>+{filters.length} {moreFiltersLabel}</span>
          </button>
        </div>
      </div>
    {/if}
  </div>
{/if}

<div class={listClass}>
  {#each visibleItems as item}
    {#if layout === 'rows'}
      <article class={cn(rowItemClass, 'relative', isComplete(item) && 'is-complete')} data-article-post={item.completionId}>
        <a class={itemLinkClass} href={item.href}>
          {#if item.completionId}
            <span
              aria-hidden="true"
              class={ui.completionBadgeLinear}
              data-article-post-complete-badge
            >
              ✓
            </span>
          {/if}
          {#if item.eyebrow || item.badgeLabel}
            <div class="flex flex-wrap items-center gap-2">
              {#if item.eyebrow}
                <p class={itemEyebrowClass}>{item.eyebrow}</p>
              {/if}
              {#if item.badgeLabel}
                {#if item.eyebrow}
                  <span aria-hidden="true" class={itemEyebrowClass}>•</span>
                {/if}
                <p class={itemEyebrowClass}>{item.badgeLabel}</p>
              {/if}
            </div>
          {/if}
          <div class="grid gap-2 md:pr-20 lg:pr-24">
            <h3 class={cn(ui.linearItemTitle, 'transition-colors duration-150')} data-card-title>
              {item.title}
            </h3>
          </div>
          {#if item.description}
            <p class={ui.cardDescription}>{item.description}</p>
          {/if}
          {#if item.ctaLabel}
            {#if isComplete(item)}
              <span class={cn(ui.inlineCta, 'md:hidden')}>
                <span>{getCompletedCtaLabel(item)}</span>
                <ArrowRightIcon className="size-[0.88rem]" />
              </span>
              <span class={ui.completionRailLg}>
                <span class={ui.completionDesktopCtaInteractive} data-article-post-complete-text>
                  <span>{getCompletedCtaLabel(item)}</span>
                  <ArrowRightIcon className="size-[0.88rem]" />
                </span>
              </span>
            {:else}
              <span class={cn(ui.inlineCta, 'md:hidden')}>
                <span>{item.ctaLabel}</span>
                <ArrowRightIcon className="size-[0.88rem]" />
              </span>
              <span class={ui.completionRailInlineMd}>
                <span class={ui.completionDesktopCtaInteractive}>
                  <span>{item.ctaLabel}</span>
                  <ArrowRightIcon className="size-[0.88rem]" />
                </span>
              </span>
            {/if}
          {/if}
        </a>
      </article>
    {:else}
      <a class={cn(itemLinkClass, 'relative', isComplete(item) && 'is-complete')} data-article-post={item.completionId} href={item.href}>
        {#if item.completionId}
          <span
            aria-hidden="true"
            class={ui.completionBadgeCard}
            data-article-post-complete-badge
          >
            ✓
          </span>
        {/if}
        <div class="grid gap-2">
          <div class="flex items-center justify-between gap-4">
            <h2 class={ui.linkCardTitle}>{item.title}</h2>
            <ArrowRightIcon className="size-4 shrink-0 text-site-ink-muted transition-colors duration-150 group-hover:text-site-link-hover group-focus-within:text-site-link-hover" />
          </div>
          {#if item.description}
            <p class={ui.cardDescription}>{item.description}</p>
          {/if}
          {#if item.meta}
            <p class={ui.cardMeta}>{item.meta}</p>
          {/if}
        </div>
      </a>
    {/if}
  {/each}
</div>
