import { brandColors, whatsappTheme } from './themes/whatsapp';

// Compatibility default for deterministic fixtures. Runtime UI uses useThemeColors.
export default whatsappTheme;
export { brandColors };
export type { AppColorScheme, ColorTokens } from './themes/tokens';

export const navigationActionColors = {
  content: brandColors.ink,
  depthHighlight: [brandColors.white, `${brandColors.white}00`],
  depthShade: [`${brandColors.black}00`, brandColors.black],
  depthRim: [brandColors.white, `${brandColors.white}00`, brandColors.black],
} as const;
