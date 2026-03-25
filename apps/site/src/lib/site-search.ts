import { isEditableKeyboardTarget } from '@/lib/keyboard'

export type SiteSearchSection = {
  href: string
  id: string
  label: string
}

export type SiteSearchResult = {
  excerpt?: string
  meta?: {
    title?: string
  }
  url: string
}

type PagefindSearchModule = {
  search: (query: string) => Promise<{ results: Array<{ data: () => Promise<SiteSearchResult> }> }>
}

let pagefindModule: PagefindSearchModule | null = null

const loadPagefind = new Function('return import("/pagefind/pagefind.js")') as () => Promise<PagefindSearchModule>

export function getSearchResultGroupLabel(
  url: string,
  searchableSections: SiteSearchSection[],
  fallbackGroupLabel: string,
) {
  const match = searchableSections.find((section) =>
    url === section.href || url.startsWith(`${section.href}/`) || url.startsWith(`${section.href}?`),
  )

  return match?.label ?? fallbackGroupLabel
}

export function shouldOpenSearchWithShortcut(event: KeyboardEvent) {
  return !isEditableKeyboardTarget(event.target) && event.key === '/'
}

export function shouldCloseSearchWithShortcut(event: KeyboardEvent, isOpen: boolean) {
  return isOpen && event.key === 'Escape'
}

export async function runSiteSearch(query: string, limit = 8) {
  const normalizedQuery = query.trim()

  if (!normalizedQuery) {
    return []
  }

  pagefindModule ??= await loadPagefind()
  const response = await pagefindModule.search(normalizedQuery)

  return Promise.all(
    response.results.slice(0, limit).map(async (result) => result.data()),
  )
}
