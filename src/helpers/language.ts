import {LanguageValue, LanguageKey} from '../interface/language'

export const getCurrentLanguageValue = () => {
  const key = localStorage.getItem(
    'i18nextLng'
  ) as LanguageKey
    switch (key) {
      case LanguageKey.english:
        return LanguageValue.english
      case LanguageKey.french:
        return LanguageValue.french
      default:
        return LanguageValue.english
    }
}