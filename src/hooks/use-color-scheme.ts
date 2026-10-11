import { useColorScheme as useColorSchemeCore, type ColorSchemeName } from 'react-native';
import { useThemePreferences } from '@/context/theme.context';

export function useColorScheme(preferredScheme?: ColorSchemeName): 'light' | 'dark' {
  const coreScheme = useColorSchemeCore();
  const preferences = useThemePreferences();
  const resolved = preferredScheme ?? preferences?.colorScheme;
  if (resolved === 'light' || resolved === 'dark') return resolved;
  return coreScheme === 'dark' ? 'dark' : 'light';
}
