<script lang="ts">
  import { onMount } from 'svelte'

  import { completedArticlesSetStore } from '@/lib/completed-articles-store'
  import {
    articleCompletionPanelDomHooks,
    articleCompletionSummaryDomHooks,
    queryScopedByHook,
    queryByHook,
    readDataHookValue,
    sharedDomHooks,
  } from '@/lib/dom-hooks'
  import {
    markArticleUnread,
  } from '@/lib/article-progress'
  import { siteEvents } from '@/lib/site-config'

  type Props = {
    controllerId: string
  }

  let { controllerId }: Props = $props()

  onMount(() => {
    const panel = queryScopedByHook<HTMLElement>(
      document,
      articleCompletionPanelDomHooks.root,
      sharedDomHooks.controllerId,
      controllerId,
    )

    if (!(panel instanceof HTMLElement)) {
      return
    }

    const readingResetEvent = siteEvents.articleReadingReset
    const completionId = readDataHookValue(articleCompletionPanelDomHooks.completionId, panel)
    const markUnreadButton = queryByHook<HTMLButtonElement>(panel, articleCompletionSummaryDomHooks.markUnread)
    let completedArticles = new Set<string>()

    const showPanel = () => {
      panel.style.maxHeight = `${panel.scrollHeight}px`
      panel.style.opacity = '1'
      panel.style.transform = 'translateY(0)'
      panel.style.pointerEvents = 'auto'
    }

    const hidePanel = () => {
      panel.style.maxHeight = '0'
      panel.style.opacity = '0'
      panel.style.transform = 'translateY(0.5rem)'
      panel.style.pointerEvents = 'none'
    }

    const sync = (completedSet: Set<string>) => {
      const isComplete = Boolean(completionId && completedSet.has(completionId))

      if (isComplete) {
        showPanel()
        return
      }

      hidePanel()
    }

    const handleMarkUnread = () => {
      if (!completionId) {
        return
      }

      markArticleUnread(completionId)
      window.dispatchEvent(new CustomEvent(readingResetEvent, { detail: completionId }))
    }

    if (markUnreadButton instanceof HTMLButtonElement) {
      markUnreadButton.addEventListener('click', handleMarkUnread)
    }

    const handleResize = () => {
      sync(completedArticles)
    }

    window.addEventListener('resize', handleResize)
    const unsubscribeCompletedArticles = completedArticlesSetStore.subscribe((completedSet) => {
      completedArticles = completedSet
      sync(completedSet)
    })

    return () => {
      if (markUnreadButton instanceof HTMLButtonElement) {
        markUnreadButton.removeEventListener('click', handleMarkUnread)
      }

      window.removeEventListener('resize', handleResize)
      unsubscribeCompletedArticles()
    }
  })
</script>
