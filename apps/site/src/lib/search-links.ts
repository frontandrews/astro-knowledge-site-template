export function getSearchHref(locale = 'en') {
  return locale === 'pt-br' ? '/pt-br/busca' : '/search'
}
