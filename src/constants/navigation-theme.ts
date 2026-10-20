import { DarkTheme, DefaultTheme } from 'expo-router';
import Colors, { type AppColorScheme, type ColorTokens } from './colors';

export function navigationTheme(scheme: AppColorScheme, colors: ColorTokens = Colors[scheme]) {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.tint,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.divider,
      notification: colors.error,
    },
  };
}
