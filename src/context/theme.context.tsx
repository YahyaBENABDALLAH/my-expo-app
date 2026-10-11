import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import type { ThemeId } from '@/constants/themes/index';
import type { AppColorScheme } from '@/constants/themes/tokens';

export type ColorSchemePreference = AppColorScheme | 'system';

interface ThemeSettings {
  themeId: ThemeId;
  colorScheme: ColorSchemePreference;
  setThemeId: (theme: ThemeId) => void;
  setColorScheme: (scheme: ColorSchemePreference) => void;
}

const ThemeContext = createContext<ThemeSettings | undefined>(undefined);

/** Preferences belong to the app; each page only renders its own controls. */
export function ThemePreferencesProvider({
  children,
  initialTheme = 'whatsapp',
  initialColorScheme = 'system',
}: PropsWithChildren<{
  initialTheme?: ThemeId;
  initialColorScheme?: ColorSchemePreference;
}>) {
  const [themeId, setThemeId] = useState(initialTheme);
  const [colorScheme, setColorScheme] = useState(initialColorScheme);
  const value = useMemo(
    () => ({ themeId, colorScheme, setThemeId, setColorScheme }),
    [themeId, colorScheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePreferences() {
  return useContext(ThemeContext);
}

export function useThemeSettings() {
  const settings = useThemePreferences();
  if (!settings) throw new Error('Theme controls require ThemePreferencesProvider.');
  return settings;
}
