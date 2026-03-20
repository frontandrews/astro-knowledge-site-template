export function formatEditorialDate(
  value: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = {},
) {
  const resolvedOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
    ...options,
  }
  const formatter = new Intl.DateTimeFormat(locale, {
    ...resolvedOptions,
  })

  return formatter
    .formatToParts(value)
    .map((part) => {
      if (part.type === 'literal') {
        return part.value.replace(/,/g, '')
      }

      if (part.type === 'month' && resolvedOptions.month === 'short') {
        const normalizedMonth = part.value.replace(/\.$/, '')
        return normalizedMonth.charAt(0).toUpperCase() + normalizedMonth.slice(1)
      }

      return part.value
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}
