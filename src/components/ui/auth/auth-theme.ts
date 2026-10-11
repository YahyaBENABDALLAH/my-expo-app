import Colors from '@/constants/colors';
import { useMemo } from 'react';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';

// Compatibility exports keep auth consumers on the app's shared semantic tokens.
export const authColors = Colors;

// Override native button colors only. Shape, padding, typography, disabled states,
// and press feedback stay with SwiftUI/Material instead of painted view layers.
export const authButtonTokens = {
  light: { container: Colors.light.primary, content: Colors.light.onPrimary },
  dark: { container: Colors.dark.primary, content: Colors.dark.onPrimary },
} as const;

export const authButtonPalettes = {
  light: { ...authColors.light, onAccent: authButtonTokens.light.content },
  dark: { ...authColors.dark, onAccent: authButtonTokens.dark.content },
} as const;

export function useAuthTheme(colorScheme?: 'light' | 'dark') {
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const buttonPalette = useMemo(() => ({ ...colors, onAccent: colors.onPrimary }), [colors]);
  return {
    scheme,
    colors,
    buttonPalette,
  };
}
