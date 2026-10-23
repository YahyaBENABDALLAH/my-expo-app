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
import { themes, type ThemeId } from '@/constants/themes/index';
import type { AppColorScheme } from '@/constants/themes/tokens';
import {
  DEFAULT_HEADER_SHAPE,
  isHeaderStyle,
  type PageHeaderStyle,
} from '@/constants/header-motion';

const HEADER_STORAGE_KEY = 'appHeaderMotion';
const REDUCED_MOTION_STORAGE_KEY = 'appReducedMotion';
const APPEARANCE_STORAGE_KEY = 'appColorScheme';
let preferencePersistence = Promise.resolve();

export type ColorSchemePreference = AppColorScheme | 'system';

function isColorSchemePreference(value: unknown): value is ColorSchemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

interface ThemeSettings {
  themeId: ThemeId;
  colorScheme: ColorSchemePreference;
  setThemeId: (theme: ThemeId) => void;
  setColorScheme: (scheme: ColorSchemePreference) => void;
  appearanceReady: boolean;
  headerShape: PageHeaderStyle;
  setHeaderShape: (shape: PageHeaderStyle) => void;
  headerMotionReady: boolean;
  reducedMotion: boolean | null;
  setReducedMotion: (reduced: boolean) => void;
}

const ThemeContext = createContext<ThemeSettings | undefined>(undefined);

/** Preferences belong to the app; each page only renders its own controls. */
export function ThemePreferencesProvider({
  children,
  initialTheme = 'ux',
  initialColorScheme = 'system',
  initialHeaderShape = DEFAULT_HEADER_SHAPE,
  initialReducedMotion = null,
  persistHeaderMotion = false,
  persistAppearance = false,
  allowThemeSelection = false,
}: PropsWithChildren<{
  initialTheme?: ThemeId;
  initialColorScheme?: ColorSchemePreference;
  initialHeaderShape?: PageHeaderStyle;
  initialReducedMotion?: boolean | null;
  persistHeaderMotion?: boolean;
  /** Only the app root persists appearance; isolated previews stay in memory. */
  persistAppearance?: boolean;
  /** Explicit opt-in for local component previews, never the app root. */
  allowThemeSelection?: boolean;
}>) {
  const [themeId, updateThemeId] = useState(initialTheme);
  const [colorScheme, updateColorScheme] = useState(initialColorScheme);
  const [appearanceReady, setAppearanceReady] = useState(!persistAppearance);
  const [headerShape, updateHeaderShape] = useState(initialHeaderShape);
  const [reducedMotion, updateReducedMotion] = useState(initialReducedMotion);
  const [headerMotionReady, setHeaderMotionReady] = useState(!persistHeaderMotion);
  useEffect(() => {
    if (!persistAppearance) return;
    let active = true;
    // A remounted root must read after any previous selection has finished saving.
    void preferencePersistence
      .then(() => AsyncStorage.getItem(APPEARANCE_STORAGE_KEY))
      .then((stored) => {
        if (active && isColorSchemePreference(stored)) updateColorScheme(stored);
      })
      .catch(() => {
        /* Retain the initial appearance when local storage is unavailable. */
      })
      .finally(() => {
        if (active) setAppearanceReady(true);
      });
    return () => {
      active = false;
    };
  }, [persistAppearance]);
  useEffect(() => {
    if (!persistHeaderMotion) return;
    let active = true;
    void preferencePersistence
      .then(() =>
        Promise.all([
          AsyncStorage.getItem(HEADER_STORAGE_KEY),
          AsyncStorage.getItem(REDUCED_MOTION_STORAGE_KEY),
        ]),
      )
      .then(([stored, reduced]) => {
        if (!active) return;
        if (isHeaderStyle(stored)) updateHeaderShape(stored);
        if (reduced === 'true' || reduced === 'false') updateReducedMotion(reduced === 'true');
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
  const setThemeId = useCallback(
    (theme: ThemeId) => {
      if (allowThemeSelection && Object.hasOwn(themes, theme)) updateThemeId(theme);
    },
    [allowThemeSelection],
  );
  const setColorScheme = useCallback(
    (scheme: ColorSchemePreference) => {
      if (!appearanceReady || !isColorSchemePreference(scheme)) return;
      updateColorScheme(scheme);
      if (persistAppearance) {
        preferencePersistence = preferencePersistence
          .then(() => AsyncStorage.setItem(APPEARANCE_STORAGE_KEY, scheme))
          .catch(() => {
            /* The selected appearance remains usable for this session. */
          });
      }
    },
    [appearanceReady, persistAppearance],
  );
  const setHeaderShape = useCallback(
    (shape: PageHeaderStyle) => {
      if (!headerMotionReady || !isHeaderStyle(shape)) return;
      updateHeaderShape(shape);
      if (persistHeaderMotion) {
        preferencePersistence = preferencePersistence
          .then(() => AsyncStorage.setItem(HEADER_STORAGE_KEY, shape))
          .catch(() => {
            /* The selected effect remains usable for this session. */
          });
      }
    },
    [headerMotionReady, persistHeaderMotion],
  );
  const setReducedMotion = useCallback(
    (reduced: boolean) => {
      if (!headerMotionReady) return;
      updateReducedMotion(reduced);
      if (persistHeaderMotion) {
        preferencePersistence = preferencePersistence
          .then(() => AsyncStorage.setItem(REDUCED_MOTION_STORAGE_KEY, String(reduced)))
          .catch(() => {
            /* Retain the preference for this session when storage is unavailable. */
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
      appearanceReady,
      headerShape,
      setHeaderShape,
      headerMotionReady,
      reducedMotion,
      setReducedMotion,
    }),
    [
      themeId,
      colorScheme,
      setThemeId,
      setColorScheme,
      appearanceReady,
      headerShape,
      setHeaderShape,
      headerMotionReady,
      reducedMotion,
      setReducedMotion,
    ],
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
