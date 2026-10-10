import { DarkTheme, DefaultTheme } from 'expo-router';
import Colors, { type AppColorScheme, type ColorTokens } from './colors';

export function navigationTheme(scheme: AppColorScheme, colors: ColorTokens = Colors[scheme]) {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.tint,
      // Root Skia artwork supplies the background for all navigation scenes.
      background: 'transparent',
      card: colors.surfaceRaised,
      text: colors.text,
      border: colors.divider,
      notification: colors.error,
    },
  };
}
