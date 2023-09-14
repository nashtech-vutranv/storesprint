export const ERROR_FIELD_INVALID = 'FIELD_INVALID'
export const URL_REGEX = new RegExp(
  '(^https?:\\/\\/)((www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*))',
  'g'
)
export const extractDomainFromUrl = (url: string) => {
  if (url.match(URL_REGEX)) {
    const match = URL_REGEX.exec(url)
    return match ? match[2].toLowerCase() : ''
  }
  return ''
}

export const FORMAT_DATE = 'DD-MM-yyyy HH:mm'

export const FORMATE_DATE_NO_HOURS = 'DD/MM/yyyy'
