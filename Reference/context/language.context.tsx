import {
  LANGUAGE_FALLBACK,
  bootstrapLanguage,
  getCurrentLanguage,
  default as i18n,
  normalizeLanguage,
  type Lang,
} from "@/lib/i18n";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

interface LanguageContextValue {
  isReady: boolean;
  language: Lang;
  setLanguage: (language: Lang) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [language, setLanguageState] = useState<Lang>(getCurrentLanguage());

  useEffect(() => {
    let mounted = true;

    function handleLanguageChanged(nextLanguage: string) {
      if (!mounted) {
        return;
      }

      setLanguageState(normalizeLanguage(nextLanguage) ?? LANGUAGE_FALLBACK);
    }

    i18n.on("languageChanged", handleLanguageChanged);

    bootstrapLanguage()
      .catch((error) => {
        console.warn("[i18n] Failed to initialize language:", error);
      })
      .finally(() => {
        if (mounted) {
          setLanguageState(getCurrentLanguage());
          setIsReady(true);
        }
      });

    return () => {
      mounted = false;
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  async function setLanguage(nextLanguage: Lang) {
    if (nextLanguage === getCurrentLanguage()) {
      return;
    }

    await i18n.changeLanguage(nextLanguage);
  }

  return (
    <LanguageContext.Provider value={{ isReady, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguageContext must be used within a LanguageProvider");
  }

  return context;
}
