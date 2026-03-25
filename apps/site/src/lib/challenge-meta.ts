import { getSiteCopy, type SiteLocale } from '@/lib/site-copy'

type ChallengeLevel = 'beginner' | 'intermediate' | 'advanced'
type ChallengeLanguage = 'javascript' | 'typescript' | 'python'

type ChallengeLike = {
  data: {
    level: ChallengeLevel
    order: number
    pubDate: Date
    solutionLanguage: ChallengeLanguage
    title: string
  }
}

export function getChallengeLevelLabel(level: ChallengeLevel, locale: SiteLocale) {
  return getSiteCopy(locale).challengeMeta.levelLabels[level]
}

export function getChallengeLanguageLabel(language: ChallengeLanguage) {
  return {
    javascript: 'JavaScript',
    python: 'Python',
    typescript: 'TypeScript',
  }[language]
}

export function sortChallenges<T extends ChallengeLike>(challenges: T[]) {
  return [...challenges].sort((left, right) => {
    if (left.data.order !== right.data.order) {
      return left.data.order - right.data.order
    }

    const dateDifference = left.data.pubDate.getTime() - right.data.pubDate.getTime()

    if (dateDifference !== 0) {
      return dateDifference
    }

    return left.data.title.localeCompare(right.data.title)
  })
}
