import Colors, { type AppColorScheme, type ColorTokens } from './colors';

export interface FloatingButtonPalette {
  base: string[];
  wave1: string[];
  wave2: string[];
}

/** Contextual actions follow the selected brand; icons convey their intent. */
export function getFloatingButtonPalette(
  scheme: AppColorScheme,
  colors: ColorTokens = Colors[scheme],
): FloatingButtonPalette {
  return {
    base: [colors.secondaryContainer, colors.background],
    wave1: [colors.primaryPressed, colors.primary],
    wave2: [colors.primary, colors.actionGradientEnd],
  };
}
