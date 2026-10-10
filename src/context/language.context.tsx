import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { z } from 'zod';

import i18n, {
  getCurrentLanguage,
  LANGUAGE_FALLBACK,
  normalizeLanguage,
  type Language,
} from '@/lib/i18n';
import { useLayoutDirectionSettings } from './layout-direction.context';

const STORAGE_KEY = 'appLanguage';
let persistence = Promise.resolve();
const LanguageContext = createContext<{
  ready: boolean;
  setLanguage: (language: Language) => void;
} | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const { setDirection } = useLayoutDirectionSettings();

  useEffect(() => {
    let active = true;
    function applyLanguage() {
      const language = getCurrentLanguage();
      setDirection(language === 'ar' ? 'rtl' : 'ltr');
      z.config(z.locales[language]());
    }
    i18n.on('languageChanged', applyLanguage);
    void AsyncStorage.getItem(STORAGE_KEY)
      .then(async (stored) => {
        if (!active) return;
        await i18n.changeLanguage(normalizeLanguage(stored) ?? LANGUAGE_FALLBACK);
      })
      .catch(async () => {
        // Storage failure still leaves the app usable in the fallback language.
        if (active) await i18n.changeLanguage(LANGUAGE_FALLBACK);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
      i18n.off('languageChanged', applyLanguage);
    };
  }, [setDirection]);

  function setLanguage(language: Language) {
    if (!ready || !normalizeLanguage(language)) return;
    void i18n.changeLanguage(language);
    persistence = persistence
      .then(() => AsyncStorage.setItem(STORAGE_KEY, language))
      .catch(() => {
        // The current session can still use the selected language.
      });
  }

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContext.Provider value={{ ready, setLanguage }}>{children}</LanguageContext.Provider>
    </I18nextProvider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  const { i18n: instance } = useTranslation();
  return {
    ready: context?.ready ?? true,
    language:
      normalizeLanguage(instance.resolvedLanguage ?? instance.language) ?? getCurrentLanguage(),
    setLanguage: context?.setLanguage,
  };
}
