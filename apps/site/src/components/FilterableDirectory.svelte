<script lang="ts">
  import { onMount, tick } from 'svelte'
  import ArrowRightIcon from '@/components/ui/icons/ArrowRightIcon.svelte'
  import { cn } from '@/lib/cn'
  import { readLocalStorageJson } from '@/lib/local-storage'
  import { ui } from '@/lib/ui'
  import { directoryLinkVariants, directoryListVariants, filterChipVariants } from '@/lib/ui-variants'

  type DirectoryTag = {
    id: string
    label: string
  }

  type DirectoryItem = {
    badgeLabel?: string
    completionId?: string
    contentKind?: 'article' | 'guide'
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
  export let kind: 'guide-rows' | 'title-cards' = 'title-cards'
  export let allItemsLabel = 'All'
  export let guideItemsLabel = 'Guides'
  export let articleItemsLabel = 'Articles'
  export let moreFiltersLabel = 'more'
  export let fewerFiltersLabel = 'Show less'
  export let moreFiltersHref: string | null = null

  const filterTones = [
    { dark: '#24364f', light: '#dbeafe' },
    { dark: '#2d3358', light: '#dbe4ff' },
    { dark: '#334155', light: '#e2e8f0' },
    { dark: '#1f4556', light: '#e0f2fe' },
    { dark: '#41305a', light: '#ede9fe' },
    { dark: '#274737', light: '#e2f2ea' },
  ]
  const filterLabelClass = ui.eyebrow
  const itemEyebrowClass = ui.eyebrowSentence
  const listClass = directoryListVariants({ kind })
  const guideArticleClass = ui.linearRow
  const itemLinkClass = directoryLinkVariants({ kind })
  let activeFilter: string | null = null
  let activeType: 'all' | 'article' | 'guide' = 'all'
  let showAllFilters = false
  let visibleCategoryCount = 0
  let completedItemIds = new Set<string>()
  let filterMeasureContainer: HTMLDivElement | null = null
  let resizeObserver: ResizeObserver | null = null
  let measureRun = 0

  $: typeScopedItems = items.filter((item) =>
    activeType === 'all' ? true : (item.contentKind ?? 'guide') === activeType,
  )
  $: filters = Array.from(
    new Map(typeScopedItems.flatMap((item) => item.tags.map((tag) => [tag.id, tag.label]))).entries(),
  ).map(([id, label]) => ({ id, label }))
  $: hasTypeFilters =
    items.some((item) => item.contentKind === 'article') && items.some((item) => item.contentKind !== 'article')
  $: if (activeFilter && !filters.some((filter) => filter.id === activeFilter)) {
    activeFilter = null
  }
  $: if (showAllFilters || visibleCategoryCount === 0) {
    visibleCategoryCount = filters.length
  }
  $: visibleFilters = showAllFilters ? filters : filters.slice(0, visibleCategoryCount)
  $: hiddenFiltersCount = Math.max(filters.length - visibleFilters.length, 0)
  $: visibleItems = typeScopedItems.filter((item) => {
    const matchesTag = activeFilter ? item.tags.some((tag) => tag.id === activeFilter) : true

    return matchesTag
  })

  function toggleFilter(id: string) {
    activeFilter = activeFilter === id ? null : id
  }

  function setActiveType(type: 'all' | 'article' | 'guide') {
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
    if (!filterMeasureContainer || showAllFilters || filters.length === 0) {
      visibleCategoryCount = filters.length
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

  onMount(() => {
    if (completionStorageKey) {
      completedItemIds = new Set(readLocalStorageJson<string[]>(completionStorageKey, []))
    }

    resizeObserver = new ResizeObserver(() => {
      void scheduleCollapsedCategoryMeasurement()
    })

    if (filterMeasureContainer?.parentElement) {
      resizeObserver.observe(filterMeasureContainer.parentElement)
    }

    void scheduleCollapsedCategoryMeasurement()

    return () => {
      resizeObserver?.disconnect()
    }
  })

  $: void filters, hasTypeFilters, showAllFilters, scheduleCollapsedCategoryMeasurement()
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
            aria-pressed={activeType === 'guide'}
            class={filterChipVariants({ active: activeType === 'guide' })}
            onclick={() => setActiveType('guide')}
            type="button"
          >
            <span>{guideItemsLabel}</span>
          </button>
          <button
            aria-pressed={activeType === 'article'}
            class={filterChipVariants({ active: activeType === 'article' })}
            onclick={() => setActiveType('article')}
            type="button"
          >
            <span>{articleItemsLabel}</span>
          </button>
          {/if}
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
            <button class={filterChipVariants({ active: activeType === 'guide' })} data-measure-chip="type" type="button">
              <span>{guideItemsLabel}</span>
            </button>
            <button class={filterChipVariants({ active: activeType === 'article' })} data-measure-chip="type" type="button">
              <span>{articleItemsLabel}</span>
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
    {#if kind === 'guide-rows'}
      <article class={cn(guideArticleClass, isComplete(item) && 'is-complete')} data-guide-post={item.completionId}>
        <a class={itemLinkClass} href={item.href}>
          {#if item.eyebrow || item.badgeLabel}
            <div class="flex flex-wrap items-center gap-2">
              {#if item.eyebrow}
                <p class={itemEyebrowClass}>{item.eyebrow}</p>
              {/if}
              {#if item.badgeLabel}
                <span class={ui.contentKindBadge}>
                  {item.badgeLabel}
                </span>
              {/if}
            </div>
          {/if}
          <div class="grid gap-2 md:pr-20">
            <h3 class={cn(ui.linearItemTitle, 'transition-colors duration-150')} data-card-title>
              {item.title}
            </h3>
          </div>
          {#if item.description}
            <p class={ui.cardDescription}>{item.description}</p>
          {/if}
          {#if item.ctaLabel}
            <span class={cn(ui.inlineCta, 'md:hidden')}>
              <span>{item.ctaLabel}</span>
              <ArrowRightIcon className="size-[0.88rem]" />
            </span>
            <span
              class="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-1.5 text-[0.76rem] font-medium tracking-[0.04em] text-site-ink-muted opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-site-link-hover group-focus-within:translate-x-0 group-focus-within:opacity-100 group-focus-within:text-site-link-hover md:inline-flex"
            >
              <span>{item.ctaLabel}</span>
              <ArrowRightIcon className="size-[0.88rem]" />
            </span>
          {/if}
        </a>
      </article>
    {:else}
      <a class={itemLinkClass} href={item.href}>
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
