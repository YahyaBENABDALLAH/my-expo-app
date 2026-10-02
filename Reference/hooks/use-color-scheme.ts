import { type ThemeMode } from "@/constants/theme.constant";
import { useThemeContext } from "@/context/theme.context";

export function useColorScheme(): ThemeMode {
  return useThemeContext().colorScheme;
}
