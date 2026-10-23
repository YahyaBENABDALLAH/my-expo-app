import { useEffect, type PropsWithChildren } from 'react';
import { Appearance, View } from 'react-native';
import { useIsFocused } from 'expo-router';

import type { ThemeId } from '@/constants/themes/index';
import {
  ThemePreferencesProvider,
  useThemePreferences,
  useThemeSettings,
  type ColorSchemePreference,
} from '@/context/theme.context';
import { useThemeColors } from '@/hooks/use-theme';

export type StoryThemeProps = {
  themeId?: ThemeId;
  colorScheme?: ColorSchemePreference;
};

/** One isolated set of app preferences for every native story. */
export function StoryTheme({
  children,
  themeId = 'ux',
  colorScheme = 'light',
}: PropsWithChildren<StoryThemeProps>) {
  const appColorScheme = useThemePreferences()?.colorScheme ?? 'system';
  return (
    <ThemePreferencesProvider
      key={`${themeId}-${colorScheme}`}
      initialTheme={themeId}
      initialColorScheme={colorScheme}
      allowThemeSelection
    >
      <StoryCanvas restoreColorScheme={appColorScheme}>{children}</StoryCanvas>
    </ThemePreferencesProvider>
  );
}

function StoryCanvas({
  children,
  restoreColorScheme,
}: PropsWithChildren<{ restoreColorScheme: ColorSchemePreference }>) {
  const { colorScheme } = useThemeSettings();
  const colors = useThemeColors();
  const focused = useIsFocused();
  // Native presentations also need the selected appearance outside a Host.
  useEffect(() => {
    if (!focused) return;
    Appearance.setColorScheme(colorScheme === 'system' ? 'unspecified' : colorScheme);
    return () =>
      Appearance.setColorScheme(
        restoreColorScheme === 'system' ? 'unspecified' : restoreColorScheme,
      );
  }, [colorScheme, restoreColorScheme, focused]);
  return <View style={{ flex: 1, backgroundColor: colors.background }}>{children}</View>;
}
