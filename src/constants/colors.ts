import { uxTheme } from './themes/ux';

export const brandColors = { ink: '#111111', white: '#FFFFFF', black: '#000000' } as const;

// Compatibility default for deterministic fixtures. Runtime UI uses useThemeColors.
export default uxTheme;
export type { AppColorScheme, ColorTokens } from './themes/tokens';
