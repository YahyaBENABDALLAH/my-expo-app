import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeId } from '@/constants/themes/index';
import type { AppColorScheme } from '@/constants/themes/tokens';
import {
  DEFAULT_HEADER_SHAPE,
  isHeaderShape,
  type PageHeaderShape,
} from '@/constants/header-motion';

const HEADER_STORAGE_KEY = 'appHeaderMotion';
let headerPersistence = Promise.resolve();

export type ColorSchemePreference = AppColorScheme | 'system';

interface ThemeSettings {
  themeId: ThemeId;
  colorScheme: ColorSchemePreference;
  setThemeId: (theme: ThemeId) => void;
  setColorScheme: (scheme: ColorSchemePreference) => void;
  headerShape: PageHeaderShape;
  setHeaderShape: (shape: PageHeaderShape) => void;
  headerMotionReady: boolean;
}

const ThemeContext = createContext<ThemeSettings | undefined>(undefined);

/** Preferences belong to the app; each page only renders its own controls. */
export function ThemePreferencesProvider({
  children,
  initialTheme = 'whatsapp',
  initialColorScheme = 'system',
  initialHeaderShape = DEFAULT_HEADER_SHAPE,
  persistHeaderMotion = false,
}: PropsWithChildren<{
  initialTheme?: ThemeId;
  initialColorScheme?: ColorSchemePreference;
  initialHeaderShape?: PageHeaderShape;
  persistHeaderMotion?: boolean;
}>) {
  const [themeId, setThemeId] = useState(initialTheme);
  const [colorScheme, setColorScheme] = useState(initialColorScheme);
  const [headerShape, updateHeaderShape] = useState(initialHeaderShape);
  const [headerMotionReady, setHeaderMotionReady] = useState(!persistHeaderMotion);
  useEffect(() => {
    if (!persistHeaderMotion) return;
    let active = true;
    void AsyncStorage.getItem(HEADER_STORAGE_KEY)
      .then((stored) => {
        if (active && isHeaderShape(stored)) updateHeaderShape(stored);
      })
      .catch(() => {
        /* Retain the default when local storage is unavailable. */
      })
      .finally(() => {
        if (active) setHeaderMotionReady(true);
      });
    return () => {
      active = false;
    };
  }, [persistHeaderMotion]);
  const setHeaderShape = useCallback(
    (shape: PageHeaderShape) => {
      if (!headerMotionReady || !isHeaderShape(shape)) return;
      updateHeaderShape(shape);
      if (persistHeaderMotion) {
        headerPersistence = headerPersistence
          .then(() => AsyncStorage.setItem(HEADER_STORAGE_KEY, shape))
          .catch(() => {
            /* The selected effect remains usable for this session. */
          });
      }
    },
    [headerMotionReady, persistHeaderMotion],
  );
  const value = useMemo(
    () => ({
      themeId,
      colorScheme,
      setThemeId,
      setColorScheme,
      headerShape,
      setHeaderShape,
      headerMotionReady,
    }),
    [themeId, colorScheme, headerShape, setHeaderShape, headerMotionReady],
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
