import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DevSettings, I18nManager } from 'react-native';

import ar from '@/shared/locales/ar.json';
import en from '@/shared/locales/en.json';
import fr from '@/shared/locales/fr.json';

export const LANG = {
  EN: 'en',
  FR: 'fr',
  AR: 'ar',
} as const;
export type Lang = typeof LANG[keyof typeof LANG];
export const SUPPORTED_LANGUAGES = [LANG.EN, LANG.FR, LANG.AR] as const;
export const LANGUAGE_FALLBACK: Lang = LANG.FR;
const i18n = createInstance();

const STORAGE_KEY = 'appLanguage';

export const normalizeLanguage = (lang?: string | null): Lang | null => {
  const cleaned = (lang ?? '').trim().toLowerCase();

  return SUPPORTED_LANGUAGES.includes(cleaned as Lang) ? (cleaned as Lang) : null;
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: LANGUAGE_FALLBACK,
  fallbackLng: LANGUAGE_FALLBACK,
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', async (lng) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, lng);
  } catch (error) {
    console.warn('[i18n] Failed to persist language:', error);
  }
});

let lastDirection: boolean | null = null;

async function hardReloadApp(delayMs = 200) {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (__DEV__) {
    DevSettings.reload();
    return;
  }

  await Updates.reloadAsync();
}

i18n.on('languageChanged', async (lng) => {
  const isRTL = lng === 'ar';

  if (lastDirection === null) {
    lastDirection = I18nManager.isRTL;
  }

  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    lastDirection = isRTL;

    try {
      await hardReloadApp();
    } catch (error) {
      console.error('Failed to reload after RTL change:', error);
    }
  }
});

export async function bootstrapLanguage(prefFromProfile?: string | null) {
  try {
    const stored = normalizeLanguage(await AsyncStorage.getItem(STORAGE_KEY));
    const profile = normalizeLanguage(prefFromProfile);
    const target = (profile ?? stored ?? LANGUAGE_FALLBACK) as Lang;

    if (target !== i18n.language) {
      await i18n.changeLanguage(target);
    }
  } catch (error) {
    console.warn('[i18n] Bootstrap failed:', error);
  }
}

export function getCurrentLanguage(): Lang {
  return (
    normalizeLanguage(i18n.resolvedLanguage) ??
    normalizeLanguage(i18n.language) ??
    LANGUAGE_FALLBACK
  );
}

export default i18n;
