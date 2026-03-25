import { getCollection, type CollectionEntry } from 'astro:content'

type ArticleEntry = CollectionEntry<'articles'>
type ChallengeEntry = CollectionEntry<'challenges'>
type ConceptEntry = CollectionEntry<'concepts'>
type GlossaryEntry = CollectionEntry<'glossary'>

let articlesPromise: Promise<ArticleEntry[]> | null = null
let challengesPromise: Promise<ChallengeEntry[]> | null = null
let conceptsPromise: Promise<ConceptEntry[]> | null = null
let glossaryPromise: Promise<GlossaryEntry[]> | null = null

const activeArticlesByLocale = new Map<string, Promise<ArticleEntry[]>>()
const activeChallengesByLocale = new Map<string, Promise<ChallengeEntry[]>>()
const activeConceptsByLocale = new Map<string, Promise<ConceptEntry[]>>()
const activeGlossaryByLocale = new Map<string, Promise<GlossaryEntry[]>>()

function isActiveEntry(entry: { data: { locale?: string | null; status?: string | null } }, locale: string) {
  return entry.data.locale === locale && entry.data.status === 'active'
}

export function getArticleCollection() {
  articlesPromise ??= getCollection('articles')
  return articlesPromise
}

export function getChallengeCollection() {
  challengesPromise ??= getCollection('challenges')
  return challengesPromise
}

export function getConceptCollection() {
  conceptsPromise ??= getCollection('concepts')
  return conceptsPromise
}

export function getGlossaryCollection() {
  glossaryPromise ??= getCollection('glossary')
  return glossaryPromise
}

export function getActiveArticlesByLocale(locale: string) {
  let cachedPromise = activeArticlesByLocale.get(locale)

  if (!cachedPromise) {
    cachedPromise = getArticleCollection().then((entries) => entries.filter((entry) => isActiveEntry(entry, locale)))
    activeArticlesByLocale.set(locale, cachedPromise)
  }

  return cachedPromise
}

export function getActiveChallengesByLocale(locale: string) {
  let cachedPromise = activeChallengesByLocale.get(locale)

  if (!cachedPromise) {
    cachedPromise = getChallengeCollection().then((entries) => entries.filter((entry) => isActiveEntry(entry, locale)))
    activeChallengesByLocale.set(locale, cachedPromise)
  }

  return cachedPromise
}

export function getActiveConceptsByLocale(locale: string) {
  let cachedPromise = activeConceptsByLocale.get(locale)

  if (!cachedPromise) {
    cachedPromise = getConceptCollection().then((entries) => entries.filter((entry) => isActiveEntry(entry, locale)))
    activeConceptsByLocale.set(locale, cachedPromise)
  }

  return cachedPromise
}

export function getActiveGlossaryByLocale(locale: string) {
  let cachedPromise = activeGlossaryByLocale.get(locale)

  if (!cachedPromise) {
    cachedPromise = getGlossaryCollection().then((entries) => entries.filter((entry) => isActiveEntry(entry, locale)))
    activeGlossaryByLocale.set(locale, cachedPromise)
  }

  return cachedPromise
}
