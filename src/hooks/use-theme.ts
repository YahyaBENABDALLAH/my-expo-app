import { themes } from '@/constants/themes/index';
import { useThemePreferences } from '@/context/theme.context';
import { useColorScheme } from './use-color-scheme';

export function useAppTheme(preferredScheme?: 'light' | 'dark') {
  const preferences = useThemePreferences();
  const scheme = useColorScheme(preferredScheme);
  const themeId = preferences?.themeId ?? 'whatsapp';
  return { themeId, scheme, colors: themes[themeId].colors[scheme] };
}

export function useThemeColors(preferredScheme?: 'light' | 'dark') {
  return useAppTheme(preferredScheme).colors;
}
