import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';

export function useAuthTheme(colorScheme?: 'light' | 'dark') {
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  return {
    scheme,
    colors,
  };
}
