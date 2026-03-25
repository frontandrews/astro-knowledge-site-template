<script lang="ts">
  import { onMount } from 'svelte'

  import { completedArticlesSetStore } from '@/lib/completed-articles-store'
  import {
    articleCompletionPanelDomHooks,
    articleCompletionSummaryDomHooks,
    articleReadingDomHooks,
    articleStickyMetaDomHooks,
    queryAllByHook,
    queryByHook,
    queryScopedByHook,
    readDataHookValue,
    sharedDomHooks,
  } from '@/lib/dom-hooks'
  import { markArticleCompleted, markArticleUnread } from '@/lib/article-progress'
  import { siteEvents } from '@/lib/site-config'
  import { clearHash } from '@/lib/url-state'

  type Props = {
    controllerId: string
  }

  let { controllerId }: Props = $props()

  onMount(() => {
    const root = queryScopedByHook<HTMLElement>(
      document,
      articleStickyMetaDomHooks.root,
      sharedDomHooks.controllerId,
      controllerId,
    )

    if (!(root instanceof HTMLElement)) {
      return
    }

    const readingResetEvent = siteEvents.articleReadingReset
    const shouldShowCompletionInPlace = readDataHookValue(articleStickyMetaDomHooks.showCompletionInPlace, root) === 'true'
    const links = queryAllByHook<HTMLAnchorElement>(root, articleStickyMetaDomHooks.tocLink)
    const progressBar = queryByHook<HTMLElement>(root, articleStickyMetaDomHooks.readingProgressBar)
    const progressValue = queryByHook<HTMLElement>(root, articleStickyMetaDomHooks.readingProgressValue)
    const progressSection = queryByHook<HTMLElement>(root, articleStickyMetaDomHooks.readingProgress)
    const markUnreadButton = queryByHook<HTMLButtonElement>(root, articleCompletionSummaryDomHooks.markUnread)
    const stickyDirection = queryByHook<HTMLElement>(root, articleStickyMetaDomHooks.stickyDirection)
    const tocSection = queryByHook<HTMLElement>(root, articleStickyMetaDomHooks.tocSection)
    const readingContent = queryByHook<HTMLElement>(document, articleReadingDomHooks.content)
    const readingEnd = queryByHook<HTMLElement>(document, articleReadingDomHooks.end)
    const completionId = readDataHookValue(articleCompletionPanelDomHooks.completionId, root)

    const headingElements = links.map((link) => {
      const slug = readDataHookValue(articleStickyMetaDomHooks.tocSlug, link)
      return slug ? document.getElementById(slug) : null
    })

    let ticking = false
    let hasCompletedReading = false
    let isResettingToUnread = false
    let resetUntil = 0
    let resetTimeout = 0

    const showStickyDirection = () => {
      if (!shouldShowCompletionInPlace) {
        return
      }

      if (tocSection instanceof HTMLElement) {
        tocSection.classList.add('hidden')
      }

      if (progressSection instanceof HTMLElement) {
        progressSection.style.borderTopColor = 'transparent'
        progressSection.style.paddingTop = '0.25rem'
      }

      if (stickyDirection instanceof HTMLElement) {
        stickyDirection.style.maxHeight = '100rem'
        stickyDirection.style.opacity = '1'
        stickyDirection.style.transform = 'translateY(0)'
        stickyDirection.style.paddingTop = '0.25rem'
        stickyDirection.style.borderTopColor = 'transparent'
        stickyDirection.style.pointerEvents = 'auto'
      }
    }

    const hideStickyDirection = () => {
      if (!shouldShowCompletionInPlace) {
        if (tocSection instanceof HTMLElement) {
          tocSection.classList.remove('hidden')
        }

        return
      }

      if (tocSection instanceof HTMLElement) {
        tocSection.classList.remove('hidden')
      }

      if (progressSection instanceof HTMLElement) {
        progressSection.style.borderTopColor = 'var(--site-line)'
        progressSection.style.paddingTop = '1rem'
      }

      if (!(stickyDirection instanceof HTMLElement)) {
        return
      }

      stickyDirection.style.maxHeight = '0'
      stickyDirection.style.opacity = '0'
      stickyDirection.style.transform = 'translateY(0.5rem)'
      stickyDirection.style.paddingTop = '0'
      stickyDirection.style.borderTopColor = 'transparent'
      stickyDirection.style.pointerEvents = 'none'
    }

    const markComplete = () => {
      hasCompletedReading = true

      if (completionId) {
        markArticleCompleted(completionId)
      }

      if (progressBar instanceof HTMLElement) {
        progressBar.style.width = '100%'
      }

      if (progressValue instanceof HTMLElement) {
        progressValue.textContent = '100%'
      }

      progressSection?.classList.add('is-complete')
      showStickyDirection()

      window.requestAnimationFrame(() => {
        if (shouldShowCompletionInPlace && root.scrollHeight > root.clientHeight) {
          root.scrollTo({ top: root.scrollHeight, behavior: 'smooth' })
        }
      })
    }

    const resetCompletionState = (shouldScrollToTop = false) => {
      isResettingToUnread = true
      resetUntil = window.performance.now() + 700
      hasCompletedReading = false
      progressSection?.classList.remove('is-complete')

      if (progressBar instanceof HTMLElement) {
        progressBar.style.width = '0%'
      }

      if (progressValue instanceof HTMLElement) {
        progressValue.textContent = '0%'
      }

      hideStickyDirection()

      if (shouldScrollToTop) {
        root.scrollTo({ top: 0, behavior: 'smooth' })

        if (readingContent instanceof HTMLElement) {
          const targetTop = Math.max(readingContent.offsetTop - 120, 0)
          window.scrollTo({ top: targetTop, behavior: 'auto' })
        }

        if (window.location.hash) {
          clearHash()
        }
      }

      window.clearTimeout(resetTimeout)
      resetTimeout = window.setTimeout(() => {
        isResettingToUnread = false
        schedule()
      }, 720)
    }

    const applyState = () => {
      ticking = false
      const resetActive = isResettingToUnread || window.performance.now() < resetUntil
      const threshold = Math.max(132, Math.min(window.innerHeight * 0.22, 180))
      let activeIndex = -1

      headingElements.forEach((heading, index) => {
        if (!heading) {
          return
        }

        if (heading.getBoundingClientRect().top <= threshold) {
          activeIndex = index
        }
      })

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        activeIndex = headingElements.length - 1
      }

      if (resetActive) {
        activeIndex = -1
      }

      links.forEach((link, index) => {
        const isActive = index === activeIndex
        const isRead = activeIndex > -1 && index < activeIndex

        link.classList.toggle('is-active', isActive)
        link.classList.toggle('is-read', isRead)
        link.setAttribute('aria-current', isActive ? 'true' : 'false')
      })

      if (
        !(readingContent instanceof HTMLElement) ||
        !(progressBar instanceof HTMLElement) ||
        !(progressValue instanceof HTMLElement)
      ) {
        return
      }

      if (hasCompletedReading) {
        markComplete()
        return
      }

      const start = readingContent.offsetTop
      const end = readingEnd instanceof HTMLElement
        ? readingEnd.offsetTop
        : readingContent.offsetTop + readingContent.offsetHeight
      const current = window.scrollY + threshold
      const rawProgress = ((current - start) / Math.max(end - start, 1)) * 100
      const progress = Math.max(0, Math.min(100, rawProgress))
      const rounded = Math.round(progress)
      const lastHeadingIndex = headingElements.length - 1
      const lastHeadingSlug = links.at(-1) ? readDataHookValue(articleStickyMetaDomHooks.tocSlug, links.at(-1)!) : ''
      const currentHash = window.location.hash.replace(/^#/, '')

      if (resetActive) {
        hideStickyDirection()
        progressSection?.classList.remove('is-complete')
        progressBar.style.width = '0%'
        progressValue.textContent = '0%'
        return
      }

      const readingEndReached =
        readingEnd instanceof HTMLElement &&
        (
          readingEnd.getBoundingClientRect().top <= threshold ||
          readingEnd.getBoundingClientRect().top <= window.innerHeight * 0.8
        )

      if (readingEndReached) {
        markComplete()
        return
      }

      if (
        (activeIndex === lastHeadingIndex && lastHeadingIndex >= 0) ||
        currentHash === lastHeadingSlug ||
        rounded >= 100
      ) {
        markComplete()
        return
      }

      progressSection?.classList.remove('is-complete')
      hideStickyDirection()
      progressBar.style.width = `${progress}%`
      progressValue.textContent = `${rounded}%`
    }

    const schedule = () => {
      if (ticking) {
        return
      }

      ticking = true
      window.requestAnimationFrame(applyState)
    }

    const handleMarkUnread = () => {
      if (completionId) {
        markArticleUnread(completionId)
      }

      resetCompletionState(true)
      window.dispatchEvent(new CustomEvent(readingResetEvent, { detail: completionId }))
    }

    const handleReadingReset = (event: Event) => {
      if (!(event instanceof CustomEvent)) {
        return
      }

      if ((event.detail ?? '') !== completionId) {
        return
      }

      resetCompletionState(false)
    }

    if (markUnreadButton instanceof HTMLButtonElement) {
      markUnreadButton.addEventListener('click', handleMarkUnread)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('hashchange', schedule)
    window.addEventListener(readingResetEvent, handleReadingReset)

    const unsubscribeCompletedArticles = completedArticlesSetStore.subscribe((completedSet) => {
      if (completionId) {
        hasCompletedReading = completedSet.has(completionId)
      }

      schedule()
    })

    schedule()

    return () => {
      window.clearTimeout(resetTimeout)

      if (markUnreadButton instanceof HTMLButtonElement) {
        markUnreadButton.removeEventListener('click', handleMarkUnread)
      }

      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('hashchange', schedule)
      window.removeEventListener(readingResetEvent, handleReadingReset)
      unsubscribeCompletedArticles()
    }
  })
</script>
