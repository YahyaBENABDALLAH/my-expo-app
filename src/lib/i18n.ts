import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from '@/shared/locales/ar.json';
import en from '@/shared/locales/en.json';
import fr from '@/shared/locales/fr.json';

export const SUPPORTED_LANGUAGES = ['fr', 'en', 'ar'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const LANGUAGE_FALLBACK: Language = 'fr';

export function normalizeLanguage(value?: string | null): Language | null {
  const language = value?.trim().toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(language as Language) ? (language as Language) : null;
}

const i18n = createInstance();
void i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, en: { translation: en }, ar: { translation: ar } },
  lng: LANGUAGE_FALLBACK,
  fallbackLng: LANGUAGE_FALLBACK,
  supportedLngs: [...SUPPORTED_LANGUAGES],
  initAsync: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export function getCurrentLanguage(): Language {
  return normalizeLanguage(i18n.resolvedLanguage ?? i18n.language) ?? LANGUAGE_FALLBACK;
}

/** Schemas store keys so existing validation feedback can follow language changes. */
export function translateValidationMessage(message?: string) {
  return message
    ?.split('\n')
    .map((line) => (i18n.exists(line) ? i18n.t(line) : line))
    .join('\n');
}

export default i18n;
