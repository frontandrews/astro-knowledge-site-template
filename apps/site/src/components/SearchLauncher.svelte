<script lang="ts">
  import { install as installHotkey } from '@github/hotkey'
  import { Command, Dialog } from 'bits-ui'
  import { onMount } from 'svelte'

  import {
    getSearchResultGroupLabel,
    runSiteSearch,
    shouldOpenSearchWithShortcut,
    type SiteSearchResult,
    type SiteSearchSection,
  } from '@/lib/site-search'

  type SearchLauncherCopy = {
    close: string
    error: string
    hint: string
    loading: string
    noResults: string
    placeholder: string
    shortcut: string
    title: string
    unavailable: string
  }

  type Props = {
    copy: SearchLauncherCopy
    desktopTriggerClass?: string
    dialogClass?: string
    dialogHintClass?: string
    emptyState?: string
    fallbackGroupLabel?: string
    isDev?: boolean
    mobileTriggerClass?: string
    searchableSections?: SiteSearchSection[]
    searchResultLinkClass?: string
  }

  let {
    copy,
    desktopTriggerClass = '',
    dialogClass = '',
    dialogHintClass = '',
    emptyState = '',
    fallbackGroupLabel = '',
    isDev = false,
    mobileTriggerClass = '',
    searchableSections = [],
    searchResultLinkClass = '',
  }: Props = $props()

  let desktopTriggerEl = $state<HTMLButtonElement | null>(null)
  let inputEl = $state<HTMLInputElement | null>(null)
  let isOpen = $state(false)
  let isSearching = $state(false)
  let results = $state<SiteSearchResult[]>([])
  let searchRunId = $state(0)
  let searchStatus = $state('')
  let searchTerm = $state('')
  let lastFocusedElement = $state<HTMLElement | null>(null)

  function getInitialSearchStatus() {
    return isDev ? copy.unavailable : emptyState
  }

  function getOpen() {
    return isOpen
  }

  function invalidateSearch() {
    searchRunId += 1
    isSearching = false
  }

  function resetSearchState() {
    invalidateSearch()
    searchTerm = ''
    results = []
    searchStatus = getInitialSearchStatus()
  }

  function setOpen(nextOpen: boolean) {
    if (nextOpen && !isOpen && document.activeElement instanceof HTMLElement) {
      lastFocusedElement = document.activeElement
    }

    isOpen = nextOpen

    if (!nextOpen) {
      resetSearchState()
    }
  }

  function getGroupLabel(url: string) {
    return getSearchResultGroupLabel(url, searchableSections, fallbackGroupLabel)
  }

  async function runSearch(term: string, currentRunId: number) {
    if (isDev) {
      results = []
      searchStatus = copy.unavailable
      invalidateSearch()
      return
    }

    const query = term.trim()

    if (!query) {
      results = []
      searchStatus = emptyState
      invalidateSearch()
      return
    }

    isSearching = true
    searchStatus = copy.loading

    try {
      const searchResults = await runSiteSearch(query, 8)

      if (currentRunId !== searchRunId) {
        return
      }

      results = searchResults
      isSearching = false
      searchStatus = results.length > 0 ? '' : copy.noResults
    } catch {
      if (currentRunId !== searchRunId) {
        return
      }

      results = []
      isSearching = false
      searchStatus = copy.error
    }
  }

  function handleDocumentKeydown(event: KeyboardEvent) {
    if (shouldOpenSearchWithShortcut(event)) {
      event.preventDefault()
      setOpen(true)
    }
  }

  function handleCloseAutoFocus(event: Event) {
    event.preventDefault()
    lastFocusedElement?.focus()
  }

  function handleOpenAutoFocus(event: Event) {
    event.preventDefault()
    inputEl?.focus()
  }

  onMount(() => {
    searchStatus = getInitialSearchStatus()

    if (desktopTriggerEl) {
      installHotkey(desktopTriggerEl)
    }

    document.addEventListener('keydown', handleDocumentKeydown)

    return () => {
      document.removeEventListener('keydown', handleDocumentKeydown)
    }
  })

  $effect(() => {
    if (!isOpen) {
      return
    }

    const term = searchTerm
    const timer = window.setTimeout(() => {
      const currentRunId = searchRunId + 1
      searchRunId = currentRunId
      void runSearch(term, currentRunId)
    }, 120)

    return () => {
      window.clearTimeout(timer)
    }
  })
</script>

<Dialog.Root bind:open={getOpen, setOpen}>
  <button
    bind:this={desktopTriggerEl}
    aria-expanded={isOpen}
    class={desktopTriggerClass}
    data-hotkey="Mod+k"
    onclick={() => setOpen(true)}
    type="button"
  >
    <span class="inline-flex items-center gap-2">
      <svg aria-hidden="true" class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <span>{copy.placeholder}</span>
    </span>
    <span class="rounded-xs border border-site-line bg-site-surface px-1.5 py-0.5 text-[0.68rem] uppercase tracking-[0.08em] text-site-ink-muted lg:px-2 lg:py-[0.35rem] lg:text-[0.76rem]">
      {copy.shortcut}
    </span>
  </button>

  <button
    aria-expanded={isOpen}
    class={mobileTriggerClass}
    onclick={() => setOpen(true)}
    type="button"
  >
    <svg aria-hidden="true" class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
    <span class="sr-only">{copy.title}</span>
  </button>

  <Dialog.Portal>
    <Dialog.Overlay class="search-launcher-backdrop fixed inset-0 z-40 bg-site-overlay/70 backdrop-blur-[2px]" />
    <Dialog.Content
      class={`${dialogClass} fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden p-0 md:w-[calc(100%-3rem)]`}
      onCloseAutoFocus={handleCloseAutoFocus}
      onOpenAutoFocus={handleOpenAutoFocus}
    >
      <Dialog.Title class="sr-only">{copy.title}</Dialog.Title>
      <Dialog.Description class="sr-only">{copy.hint}</Dialog.Description>

      <Command.Root
        class="flex min-h-0 flex-1 flex-col"
        label={copy.title}
        shouldFilter={false}
      >
        <div class="flex items-center gap-3 border-b border-site-line px-4 py-3 lg:gap-3.5 lg:px-5 lg:py-3.5">
          <svg aria-hidden="true" class="size-4 shrink-0 text-site-ink-muted" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <Command.Input
            bind:ref={inputEl}
            bind:value={searchTerm}
            class="min-w-0 flex-1 bg-transparent text-[1rem] text-site-ink outline-none placeholder:text-site-ink-muted lg:text-[1.08rem]"
            placeholder={copy.placeholder}
          />
          <Dialog.Close
            class={`${mobileTriggerClass} nav:inline-flex`}
            type="button"
          >
            <svg aria-hidden="true" class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="m18 6-12 12" />
              <path d="m6 6 12 12" />
            </svg>
            <span class="sr-only">{copy.close}</span>
          </Dialog.Close>
        </div>

        <div class="flex min-h-0 flex-1 flex-col gap-3 px-4 py-4 lg:gap-3.5 lg:px-5 lg:py-5">
          <p class={dialogHintClass}>{copy.hint}</p>
          <Command.List class="min-h-0 flex-1 overflow-hidden">
            <Command.Viewport class="grid min-h-0 flex-1 gap-2 overflow-y-auto pr-1">
              {#if isSearching}
                <Command.Loading forceMount class="m-0 text-sm text-site-ink-muted lg:text-[0.96rem]">
                  {copy.loading}
                </Command.Loading>
              {:else if results.length > 0}
                {#each results as result (result.url)}
                  <Command.LinkItem
                    class={`${searchResultLinkClass} data-[selected]:border-site-accent/60 data-[selected]:bg-site-surface-raised`}
                    href={result.url}
                    onSelect={() => setOpen(false)}
                    value={result.url}
                  >
                    <span class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-site-ink-muted lg:text-[0.76rem]">{getGroupLabel(result.url)}</span>
                    <span class="text-base font-semibold leading-[1.3] text-site-ink lg:text-[1.08rem]">{result.meta?.title ?? result.url}</span>
                    {#if result.excerpt}
                      <span class="text-sm leading-6 text-site-ink-soft lg:text-[0.98rem]">{result.excerpt}</span>
                    {/if}
                  </Command.LinkItem>
                {/each}
              {:else}
                <Command.Empty forceMount class="m-0 text-sm text-site-ink-muted lg:text-[0.96rem]">
                  {searchStatus}
                </Command.Empty>
              {/if}
            </Command.Viewport>
          </Command.List>
        </div>
      </Command.Root>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
