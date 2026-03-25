<script lang="ts">
  import { onMount } from 'svelte'

  import { completedArticlesSetStore } from '@/lib/completed-articles-store'
  import {
    queryAllByHook,
    queryByHook,
    queryScopedByHook,
    readDataHookValue,
    sharedDomHooks,
    trackProgressDomHooks,
  } from '@/lib/dom-hooks'

  type Props = {
    controllerId: string
  }

  let { controllerId }: Props = $props()

  onMount(() => {
    const root = queryScopedByHook<HTMLElement>(
      document,
      trackProgressDomHooks.root,
      sharedDomHooks.controllerId,
      controllerId,
    )

    if (!(root instanceof HTMLElement)) {
      return
    }

    const progressStatus = queryByHook<HTMLElement>(root, trackProgressDomHooks.progressStatus)
    const progressValue = queryByHook<HTMLElement>(root, trackProgressDomHooks.progressValue)
    const progressBar = queryByHook<HTMLElement>(root, trackProgressDomHooks.progressBar)
    const cta = queryByHook<HTMLAnchorElement>(root, trackProgressDomHooks.cta)
    const ctaLabel = queryByHook<HTMLElement>(root, trackProgressDomHooks.ctaLabel)
    const nextLink = queryByHook<HTMLAnchorElement>(root, trackProgressDomHooks.nextLink)
    const nextText = queryByHook<HTMLElement>(root, trackProgressDomHooks.nextText)
    const overallIcon = queryByHook<HTMLElement>(root, trackProgressDomHooks.overallIcon)
    const overallText = queryByHook<HTMLElement>(root, trackProgressDomHooks.overallText)
    const itemLinks = queryAllByHook<HTMLAnchorElement>(root, trackProgressDomHooks.item)
    const totalSteps = itemLinks.length
    const progressLabel = readDataHookValue(trackProgressDomHooks.progressLabel, root) || 'Progress'
    const stepLabel = readDataHookValue(trackProgressDomHooks.stepLabel, root) || 'Step'
    const ofLabel = readDataHookValue(trackProgressDomHooks.ofLabel, root) || 'of'
    const continueLabel = ctaLabel?.textContent ?? 'Continue'
    const reviewLabel = readDataHookValue(trackProgressDomHooks.reviewLabel, root) || 'Review'
    const completedLabel = readDataHookValue(trackProgressDomHooks.completedLabel, root) || 'Completed'
    const continueTrackLabel = readDataHookValue(trackProgressDomHooks.continueLabel, root) || 'Keep going'
    const nextTrackLabel = readDataHookValue(trackProgressDomHooks.nextTrackLabel, root) || 'Next track'

    const syncTrackProgress = (completedArticleIds: Set<string>) => {
      let completedCount = 0
      let firstUnreadHref = ''
      let firstUnreadStep = totalSteps
      let firstUnreadTitle = ''

      itemLinks.forEach((item, index) => {
        if (!(item instanceof HTMLElement)) {
          return
        }

        const articleId = readDataHookValue(trackProgressDomHooks.itemId, item)
        const isComplete = Boolean(articleId && completedArticleIds.has(articleId))

        if (isComplete) {
          completedCount += 1
          return
        }

        if (!firstUnreadHref) {
          firstUnreadHref = readDataHookValue(trackProgressDomHooks.itemHref, item)
          firstUnreadStep = index + 1
          firstUnreadTitle = item.textContent?.trim() ?? ''
        }
      })

      const isComplete = totalSteps > 0 && completedCount >= totalSteps
      const percent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0

      root.classList.toggle('is-complete', isComplete)

      if (progressStatus instanceof HTMLElement) {
        progressStatus.textContent = isComplete
          ? `${progressLabel}: ${completedLabel}`
          : `${progressLabel}: ${stepLabel} ${firstUnreadStep} ${ofLabel} ${totalSteps}`
      }

      if (progressValue instanceof HTMLElement) {
        progressValue.textContent = `${percent}%`
      }

      if (progressBar instanceof HTMLElement) {
        progressBar.style.width = `${percent}%`
      }

      if (cta instanceof HTMLAnchorElement) {
        cta.href = isComplete ? itemLinks[0]?.getAttribute('href') ?? '#' : firstUnreadHref || '#'
      }

      if (ctaLabel instanceof HTMLElement) {
        ctaLabel.textContent = isComplete ? reviewLabel : continueLabel
      }

      if (nextLink instanceof HTMLAnchorElement) {
        nextLink.href = isComplete ? readDataHookValue(trackProgressDomHooks.nextDefaultHref, nextLink) || '#' : firstUnreadHref || '#'
      }

      if (nextText instanceof HTMLElement) {
        nextText.textContent = isComplete ? nextTrackLabel : firstUnreadTitle || continueLabel
      }

      if (overallIcon instanceof HTMLElement) {
        overallIcon.textContent = isComplete ? '✓' : '→'
        overallIcon.classList.toggle('text-site-success', isComplete)
        overallIcon.classList.toggle('text-site-ink-muted', !isComplete)
      }

      if (overallText instanceof HTMLElement) {
        overallText.textContent = isComplete ? completedLabel : continueTrackLabel
      }
    }

    const unsubscribeCompletedArticles = completedArticlesSetStore.subscribe((completedSet) => {
      syncTrackProgress(completedSet)
    })

    return () => {
      unsubscribeCompletedArticles()
    }
  })
</script>
