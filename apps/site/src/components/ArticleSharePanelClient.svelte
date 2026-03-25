<script lang="ts">
  import { onMount } from 'svelte'

  import {
    articleShareDomHooks,
    queryByHook,
    queryScopedByHook,
    readDataHookValue,
    sharedDomHooks,
  } from '@/lib/dom-hooks'

  type Props = {
    controllerId: string
  }

  let { controllerId }: Props = $props()

  onMount(() => {
    const root = queryScopedByHook<HTMLElement>(
      document,
      articleShareDomHooks.root,
      sharedDomHooks.controllerId,
      controllerId,
    )

    if (!(root instanceof HTMLElement)) {
      return
    }

    const nativeButton = queryByHook<HTMLButtonElement>(root, articleShareDomHooks.nativeButton)
    const copyButton = queryByHook<HTMLButtonElement>(root, articleShareDomHooks.copyButton)
    const feedback = queryByHook<HTMLElement>(root, articleShareDomHooks.feedback)

    if (
      !(nativeButton instanceof HTMLButtonElement) ||
      !(copyButton instanceof HTMLButtonElement) ||
      !(feedback instanceof HTMLElement)
    ) {
      return
    }

    const shareTitle = readDataHookValue(articleShareDomHooks.title, root) || document.title
    const shareDescription = readDataHookValue(articleShareDomHooks.description, root)
    const shareUrl = readDataHookValue(articleShareDomHooks.url, root) || window.location.href
    const shareFallback = readDataHookValue(articleShareDomHooks.fallback, root) || 'Share is unavailable.'
    const copyLinkSuccess = readDataHookValue(articleShareDomHooks.copyLinkSuccess, root) || 'Link copied.'
    const copyLinkError = readDataHookValue(articleShareDomHooks.copyLinkError, root) || 'Unable to copy the link.'

    const setFeedback = (message: string) => {
      feedback.textContent = message
      feedback.classList.remove('hidden')
    }

    const copyLink = async () => {
      if (typeof navigator.clipboard?.writeText !== 'function') {
        setFeedback(copyLinkError)
        return false
      }

      try {
        await navigator.clipboard.writeText(shareUrl)
        setFeedback(copyLinkSuccess)
        return true
      } catch {
        setFeedback(copyLinkError)
        return false
      }
    }

    const handleNativeShare = async () => {
      if (typeof navigator.share !== 'function') {
        setFeedback(shareFallback)
        return
      }

      try {
        await navigator.share({
          text: shareDescription,
          title: shareTitle,
          url: shareUrl,
        })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setFeedback(shareFallback)
      }
    }

    const handleCopyClick = () => {
      void copyLink()
    }

    nativeButton.addEventListener('click', handleNativeShare)
    copyButton.addEventListener('click', handleCopyClick)

    return () => {
      nativeButton.removeEventListener('click', handleNativeShare)
      copyButton.removeEventListener('click', handleCopyClick)
    }
  })
</script>
