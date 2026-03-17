import type { CollectionEntry } from 'astro:content'

export type GuideTreeNode = {
  children: GuideTreeNode[]
  depth: number
  guideCount: number
  key: string
  label: string
  postIds: string[]
  posts: CollectionEntry<'guides'>[]
}

type MutableGuideTreeNode = GuideTreeNode & {
  childrenMap: Map<string, MutableGuideTreeNode>
}

export function buildGuideTree(posts: CollectionEntry<'guides'>[]): GuideTreeNode[] {
  const root = new Map<string, MutableGuideTreeNode>()

  for (const post of sortGuides(posts)) {
    let currentMap = root

    for (const [index, segment] of post.data.path.entries()) {
      const key = post.data.path.slice(0, index + 1).join('>')
      let node = currentMap.get(key)

      if (!node) {
        node = {
          children: [],
          childrenMap: new Map<string, MutableGuideTreeNode>(),
          depth: index,
          guideCount: 0,
          key,
          label: segment,
          postIds: [],
          posts: [],
        }
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

function materialize(nodes: Map<string, MutableGuideTreeNode>): GuideTreeNode[] {
  return [...nodes.values()]
    .sort((left, right) => left.label.localeCompare(right.label))
    .map((node) => {
      const children = materialize(node.childrenMap)
      const posts = sortGuides(node.posts)

      return {
        children,
        depth: node.depth,
        guideCount:
          posts.length + children.reduce((total, child) => total + child.guideCount, 0),
        key: node.key,
        label: node.label,
        postIds: [
          ...posts.map((post) => post.data.guideId),
          ...children.flatMap((child) => child.postIds),
        ],
        posts,
      }
    })
}

export function sortGuides(posts: CollectionEntry<'guides'>[]) {
  return [...posts].sort((left, right) => {
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
