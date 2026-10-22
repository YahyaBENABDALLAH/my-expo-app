import { uxTheme } from './themes/ux';

export const brandColors = { ink: '#111111', white: '#FFFFFF', black: '#000000' } as const;

// Compatibility default for deterministic fixtures. Runtime UI uses useThemeColors.
export default uxTheme;
export type { AppColorScheme, ColorTokens } from './themes/tokens';

export const navigationActionColors = {
  content: brandColors.ink,
  depthHighlight: [brandColors.white, `${brandColors.white}00`],
  depthShade: [`${brandColors.black}00`, brandColors.black],
  depthRim: [brandColors.white, `${brandColors.white}00`, brandColors.black],
} as const;
