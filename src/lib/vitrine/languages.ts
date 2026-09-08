import type { LanguageCode } from './types'

export const LANGUAGES: LanguageCode[] = ['vi', 'en', 'ja', 'ko']

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
}

export const LANGUAGE_TAGS: Record<LanguageCode, string> = {
  vi: 'VI',
  en: 'EN',
  ja: 'JA',
  ko: 'KO',
}

export function nextLanguage(current: LanguageCode): LanguageCode {
  const idx = LANGUAGES.indexOf(current)
  return LANGUAGES[(idx + 1) % LANGUAGES.length]
}
