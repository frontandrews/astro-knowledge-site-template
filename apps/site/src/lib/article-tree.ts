import type { CollectionEntry } from 'astro:content'
import { getArticleBranchRoutePath, getArticlePillarRoutePath } from '@/lib/article-registry'
import { LEARNING_PATH_PILLARS } from '@/lib/learning-paths'

export type ArticleTreeNode = {
  articleIds: string[]
  articleCount: number
  children: ArticleTreeNode[]
  depth: number
  href: string | null
  key: string
  label: string
  order: number
  posts: CollectionEntry<'articles'>[]
}

type MutableArticleTreeNode = ArticleTreeNode & {
  childrenMap: Map<string, MutableArticleTreeNode>
}

export function buildArticleTree(posts: CollectionEntry<'articles'>[], locale = posts[0]?.data.locale ?? 'en'): ArticleTreeNode[] {
  const root = new Map<string, MutableArticleTreeNode>()
  const pillarKeyById = new Map<string, string>()
  const branchKeyById = new Map<string, string>()

  for (const pillar of LEARNING_PATH_PILLARS) {
    const pillarNode = createNode({
      depth: 0,
      href: getArticlePillarRoutePath(pillar.id, locale)
        ? `/${getArticlePillarRoutePath(pillar.id, locale)}`
        : null,
      key: pillar.title,
      label: pillar.title,
      order: pillar.order,
    })

    root.set(pillarNode.key, pillarNode)
    pillarKeyById.set(pillar.id, pillarNode.key)

    pillar.branches.forEach((branch, branchIndex) => {
      const branchKey = `${pillar.title}>${branch.title}`
      branchKeyById.set(`${pillar.id}:${branch.id}`, branchKey)

      pillarNode.childrenMap.set(
        branchKey,
        createNode({
          depth: 1,
          href: getArticleBranchRoutePath(pillar.id, branch.id, locale)
            ? `/${getArticleBranchRoutePath(pillar.id, branch.id, locale)}`
            : null,
          key: branchKey,
          label: branch.title,
          order: branchIndex,
        }),
      )
    })
  }

  for (const post of sortArticles(posts)) {
    if (post.data.pillarId && post.data.branchId) {
      const pillarKey = pillarKeyById.get(post.data.pillarId)
      const branchKey = branchKeyById.get(`${post.data.pillarId}:${post.data.branchId}`)
      const pillarNode = pillarKey ? root.get(pillarKey) : null
      const branchNode = pillarNode && branchKey ? pillarNode.childrenMap.get(branchKey) : null

      if (branchNode) {
        branchNode.posts.push(post)
        continue
      }
    }

    let currentMap = root

    for (const [index, segment] of post.data.path.entries()) {
      const key = post.data.path.slice(0, index + 1).join('>')
      let node = currentMap.get(key)

      if (!node) {
        node = createNode({
          depth: index,
          href: null,
          key,
          label: segment,
          order: 999,
        })
        currentMap.set(key, node)
      }

      if (index === post.data.path.length - 1) {
        node.posts.push(post)
      }

      currentMap = node.childrenMap
    }
  }

  return materialize(root)
}

function materialize(nodes: Map<string, MutableArticleTreeNode>): ArticleTreeNode[] {
  return [...nodes.values()]
    .sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order
      }

      return left.label.localeCompare(right.label)
    })
    .map((node) => {
      const children = materialize(node.childrenMap)
      const posts = sortArticles(node.posts)

      return {
        articleCount:
          posts.length + children.reduce((total, child) => total + child.articleCount, 0),
        articleIds: [
          ...posts.map((post) => post.data.articleId),
          ...children.flatMap((child) => child.articleIds),
        ],
        children,
        depth: node.depth,
        href: node.href,
        key: node.key,
        label: node.label,
        order: node.order,
        posts,
      }
    })
}

function createNode({
  depth,
  href,
  key,
  label,
  order,
}: Pick<ArticleTreeNode, 'depth' | 'href' | 'key' | 'label' | 'order'>): MutableArticleTreeNode {
  return {
    articleCount: 0,
    articleIds: [],
    children: [],
    childrenMap: new Map<string, MutableArticleTreeNode>(),
    depth,
    href,
    key,
    label,
    order,
    posts: [],
  }
}

export function sortArticles(posts: CollectionEntry<'articles'>[]) {
  const pillarOrderById = new Map(LEARNING_PATH_PILLARS.map((pillar) => [pillar.id, pillar.order]))
  const branchOrderById = new Map(
    LEARNING_PATH_PILLARS.flatMap((pillar) =>
      pillar.branches.map((branch, branchIndex) => [`${pillar.id}:${branch.id}`, branchIndex] as const),
    ),
  )

  return [...posts].sort((left, right) => {
    const leftPillarOrder = left.data.pillarId ? (pillarOrderById.get(left.data.pillarId) ?? 999) : 999
    const rightPillarOrder = right.data.pillarId ? (pillarOrderById.get(right.data.pillarId) ?? 999) : 999

    if (leftPillarOrder !== rightPillarOrder) {
      return leftPillarOrder - rightPillarOrder
    }

    const leftBranchOrder =
      left.data.pillarId && left.data.branchId
        ? (branchOrderById.get(`${left.data.pillarId}:${left.data.branchId}`) ?? 999)
        : 999
    const rightBranchOrder =
      right.data.pillarId && right.data.branchId
        ? (branchOrderById.get(`${right.data.pillarId}:${right.data.branchId}`) ?? 999)
        : 999

    if (leftBranchOrder !== rightBranchOrder) {
      return leftBranchOrder - rightBranchOrder
    }

    const leftPath = left.data.path.join('>')
    const rightPath = right.data.path.join('>')

    if (leftPath !== rightPath) {
      return leftPath.localeCompare(rightPath)
    }

    if (left.data.order !== right.data.order) {
      return left.data.order - right.data.order
    }

    return left.data.title.localeCompare(right.data.title)
  })
}

export function getArticleRecencyDate(post: CollectionEntry<'articles'>) {
  return post.data.updatedDate ?? post.data.pubDate
}

export function sortArticlesByRecency(posts: CollectionEntry<'articles'>[]) {
  return [...posts].sort((left, right) => {
    const dateDelta = getArticleRecencyDate(right).getTime() - getArticleRecencyDate(left).getTime()

    if (dateDelta !== 0) {
      return dateDelta
    }

    const pubDateDelta = right.data.pubDate.getTime() - left.data.pubDate.getTime()

    if (pubDateDelta !== 0) {
      return pubDateDelta
    }

    return left.data.title.localeCompare(right.data.title)
  })
}
