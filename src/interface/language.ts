export enum LanguageKey {
  english = 'en',
  french = 'fr'
}

export enum LanguageValue {
  english = 'English',
  french = 'Français',
}

export interface ILanguageSample {
  id: number
  value: LanguageValue | string,
  key: LanguageKey
}