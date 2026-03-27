import { getArticleCanonicalParams } from '@/lib/article-taxonomy'
import { getArticleSectionSegment, SUPPORTED_ARTICLE_LOCALES } from '@/lib/article-registry'
import { sortArticles } from '@/lib/article-tree'
import {
  getLearningPathBranchRouteSegment,
  getLearningPathPillarRouteSegment,
  LEARNING_PATH_PILLARS,
} from '@/lib/learning-paths'
import { getDefaultLocale, getNonDefaultLocales } from '@/lib/locale-config'
import { getEntryLeafRouteSegment } from '@/lib/route-segments'
import { getActiveArticlesByLocale } from '@/lib/site-content'

function getArticleLocales(includeDefault = false) {
  const supportedArticleLocales = new Set<string>(SUPPORTED_ARTICLE_LOCALES)
  const locales = includeDefault
    ? Array.from(new Set([getDefaultLocale(), ...getNonDefaultLocales()]))
    : getNonDefaultLocales()

  return locales.filter((locale) => supportedArticleLocales.has(locale))
}

function getDefaultArticleLocale() {
  const defaultLocale = getDefaultLocale()

  return getArticleLocales(true).find((locale) => locale === defaultLocale) ?? null
}

export function getLocalizedArticleIndexPaths() {
  return getArticleLocales().map((locale) => ({
    params: {
      locale,
      section: getArticleSectionSegment(locale),
    },
    props: {
      locale,
      pageType: 'articles',
    },
  }))
}

export function getDefaultArticleIndexPaths() {
  const locale = getDefaultArticleLocale()

  if (!locale) {
    return []
  }

  return [
    {
      params: {
        section: getArticleSectionSegment(locale),
      },
      props: {
        locale,
        pageType: 'articles',
      },
    },
  ]
}

export async function getLocalizedArticleNotePaths() {
  return (await Promise.all(getArticleLocales().map(async (locale) =>
    (await getActiveArticlesByLocale(locale))
      .filter((post) => post.data.kind === 'note')
      .map((post) => ({
        params: {
          locale,
          section: getArticleSectionSegment(locale),
          slug: getEntryLeafRouteSegment(post.id),
        },
        props: {
          locale,
          pageType: 'articles',
          post,
        },
      })),
  ))).flat()
}

export async function getDefaultArticleNotePaths() {
  const locale = getDefaultArticleLocale()

  if (!locale) {
    return []
  }

  const posts = await getActiveArticlesByLocale(locale)

  return posts
    .filter((post) => post.data.kind === 'note')
    .map((post) => ({
      params: {
        section: getArticleSectionSegment(locale),
        slug: getEntryLeafRouteSegment(post.id),
      },
      props: {
        locale,
        pageType: 'articles',
        post,
      },
    }))
}

export async function getLocalizedArticlePillarPaths() {
  return (await Promise.all(getArticleLocales().map(async (locale) => {
    const localizedPosts = await getActiveArticlesByLocale(locale)

    return LEARNING_PATH_PILLARS.flatMap((pillar) => {
      const pillarPosts = sortArticles(localizedPosts.filter((post) => post.data.pillarId === pillar.id))

      if (pillarPosts.length === 0) {
        return []
      }

      return [
        {
          params: {
            locale,
            pillar: getLearningPathPillarRouteSegment(pillar.id, locale) ?? pillar.routeSegment.en,
            section: getArticleSectionSegment(locale),
          },
          props: {
            branchSections: pillar.branches
              .map((branch) => ({
                branch,
                posts: pillarPosts.filter((post) => post.data.branchId === branch.id),
              }))
              .filter((section) => section.posts.length > 0),
            locale,
            pillar,
          },
        },
      ]
    })
  }))).flat()
}

export async function getDefaultArticlePillarPaths() {
  const locale = getDefaultArticleLocale()

  if (!locale) {
    return []
  }

  const localizedPosts = await getActiveArticlesByLocale(locale)

  return LEARNING_PATH_PILLARS.flatMap((pillar) => {
    const pillarPosts = sortArticles(localizedPosts.filter((post) => post.data.pillarId === pillar.id))

    if (pillarPosts.length === 0) {
      return []
    }

    return [
      {
        params: {
          pillar: getLearningPathPillarRouteSegment(pillar.id, locale) ?? pillar.routeSegment.en,
          section: getArticleSectionSegment(locale),
        },
        props: {
          branchSections: pillar.branches
            .map((branch) => ({
              branch,
              posts: pillarPosts.filter((post) => post.data.branchId === branch.id),
            }))
            .filter((section) => section.posts.length > 0),
          locale,
          pillar,
        },
      },
    ]
  })
}

export async function getLocalizedArticleCanonicalPaths() {
  return (await Promise.all(getArticleLocales().map(async (locale) =>
    (await getActiveArticlesByLocale(locale))
      .flatMap((post) => {
        const params = getArticleCanonicalParams(post)

        if (!params) {
          return []
        }

        return [
          {
            params: {
              ...params,
              locale,
              section: getArticleSectionSegment(locale),
            },
            props: {
              locale,
              post,
            },
          },
        ]
      }))))
    .flat()
}

export async function getDefaultArticleCanonicalPaths() {
  const locale = getDefaultArticleLocale()

  if (!locale) {
    return []
  }

  const posts = await getActiveArticlesByLocale(locale)

  return posts
    .flatMap((post) => {
      const params = getArticleCanonicalParams(post)

      if (!params) {
        return []
      }

      return [
        {
          params: {
            ...params,
            section: getArticleSectionSegment(locale),
          },
          props: {
            locale,
            post,
          },
        },
      ]
    })
}

export async function getLocalizedArticleBranchPaths() {
  return (await Promise.all(getArticleLocales().map(async (locale) => {
    const localizedPosts = await getActiveArticlesByLocale(locale)

    return LEARNING_PATH_PILLARS.flatMap((pillar) =>
      pillar.branches.flatMap((branch) => {
        const branchPosts = sortArticles(
          localizedPosts.filter((post) => post.data.pillarId === pillar.id && post.data.branchId === branch.id),
        )

        if (branchPosts.length === 0) {
          return []
        }

        return [
          {
            params: {
              branch: getLearningPathBranchRouteSegment(pillar.id, branch.id, locale) ?? branch.routeSegment.en,
              locale,
              pillar: getLearningPathPillarRouteSegment(pillar.id, locale) ?? pillar.routeSegment.en,
              section: getArticleSectionSegment(locale),
            },
            props: {
              branch,
              locale,
              pillar,
              posts: branchPosts,
            },
          },
        ]
      }),
    )
  }))).flat()
}

export async function getDefaultArticleBranchPaths() {
  const locale = getDefaultArticleLocale()

  if (!locale) {
    return []
  }

  const localizedPosts = await getActiveArticlesByLocale(locale)

  return LEARNING_PATH_PILLARS.flatMap((pillar) =>
    pillar.branches.flatMap((branch) => {
      const branchPosts = sortArticles(
        localizedPosts.filter((post) => post.data.pillarId === pillar.id && post.data.branchId === branch.id),
      )

      if (branchPosts.length === 0) {
        return []
      }

      return [
        {
          params: {
            branch: getLearningPathBranchRouteSegment(pillar.id, branch.id, locale) ?? branch.routeSegment.en,
            pillar: getLearningPathPillarRouteSegment(pillar.id, locale) ?? pillar.routeSegment.en,
            section: getArticleSectionSegment(locale),
          },
          props: {
            branch,
            locale,
            pillar,
            posts: branchPosts,
          },
        },
      ]
    }),
  )
}
