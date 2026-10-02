import type { ColorTokens } from "@/constants/theme.colors";
import { THEME_MODE, type ThemeMode } from "@/constants/theme.constant";
import {
  THEME_TOKENS,
  type ThemeTokens,
} from "@/constants/theme.tokens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  use,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { Appearance } from "react-native";

const STORAGE_KEY = "app.theme.mode";

export interface ThemeContextValue {
  colorScheme: ThemeMode;
  isDark: boolean;
  tokens: ThemeTokens;
  /** Compatibility alias while existing screens migrate to `tokens`. */
  colors: ColorTokens;
  setColorScheme: (mode: ThemeMode) => void;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemScheme(): ThemeMode {
  return Appearance.getColorScheme() === "dark"
    ? THEME_MODE.DARK
    : THEME_MODE.LIGHT;
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [colorScheme, setSchemeState] = useState<ThemeMode>(getSystemScheme);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (
          active &&
          (stored === THEME_MODE.LIGHT || stored === THEME_MODE.DARK)
        ) {
          setSchemeState(stored);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  function setColorScheme(mode: ThemeMode) {
    setSchemeState(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => {});
  }

  function toggleColorScheme() {
    setColorScheme(
      colorScheme === THEME_MODE.DARK ? THEME_MODE.LIGHT : THEME_MODE.DARK,
    );
  }

  const isDark = colorScheme === THEME_MODE.DARK;
  const tokens = THEME_TOKENS[colorScheme];
  const colors = tokens.colors;

  const value: ThemeContextValue = {
    colorScheme,
    isDark,
    tokens,
    colors,
    setColorScheme,
    toggleColorScheme,
  };

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = use(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return ctx;
}

/** Returns the active theme colors + scheme state. */
export function useTheme(): ThemeContextValue {
  return useThemeContext();
}

/** Returns the complete active design-token tree. */
export function useThemeTokens(): ThemeTokens {
  return useThemeContext().tokens;
}
