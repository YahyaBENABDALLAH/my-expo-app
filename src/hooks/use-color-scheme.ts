import { useColorScheme as useColorSchemeCore, type ColorSchemeName } from 'react-native';

export function useColorScheme(preferredScheme?: ColorSchemeName): 'light' | 'dark' {
  const coreScheme = useColorSchemeCore();
  return preferredScheme === 'light' || preferredScheme === 'dark'
    ? preferredScheme
    : coreScheme === 'dark'
      ? 'dark'
      : 'light';
}
