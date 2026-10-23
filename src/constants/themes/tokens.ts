export type AppColorScheme = 'light' | 'dark';

/** Every brand defines the same semantic roles in both appearances. */
export interface SemanticColors {
  /** Filled action surface; foreground text uses tint instead. */
  primary: string;
  primaryPressed: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceVariant: string;
  text: string;
  muted: string;
  border: string;
  divider: string;
  /** Foreground accent for primary text, links and native tint. */
  tint: string;
  selection: string;
  overlay: string;
  shadow: string;
  error: string;
  errorContainer: string;
  onError: string;
  success: string;
  successContainer: string;
  onSuccess: string;
  warning: string;
  warningContainer: string;
  onWarning: string;
  info: string;
  infoContainer: string;
  onInfo: string;
  actionGradientEnd: string;
}

/** Derived roles stay in sync when a brand changes its semantic palette. */
export function createColorTokens(colors: SemanticColors) {
  return {
    ...colors,
    tabIconDefault: colors.muted,
    tabIconSelected: colors.tint,
    tabBarBackground: colors.surfaceRaised,
    tabBarActive: colors.tint,
    tabBarInactive: colors.muted,
    tabBarSelectedBackground: colors.secondaryContainer,
    tabBarBorder: colors.divider,
    tabBarGlassTint: `${colors.surfaceRaised}D9`,
    tabBarGlassBorder: colors.border,
    tabBarGlassBackdrop: colors.surface,
    tabBarGlassHighlight: `${colors.text}14`,
    tabBarGlassMidHighlight: `${colors.text}08`,
    tabBarGlassClear: `${colors.surfaceRaised}00`,
    tabBarShadow: colors.shadow,
    switchTrackOn: colors.tint,
    switchThumbOn: colors.onSuccess,
    switchTrackOff: colors.surfaceVariant,
    switchThumbOff: colors.muted,
    switchBorderOff: colors.muted,
    switchTrackDisabledOn: `${colors.tint}33`,
    switchThumbDisabledOn: `${colors.text}61`,
    switchTrackDisabledOff: `${colors.text}1F`,
    switchThumbDisabledOff: `${colors.text}61`,
    switchBorderDisabledOff: `${colors.text}1F`,
    controlActive: colors.tint,
    controlOnActive: colors.onSuccess,
    controlSelected: colors.selection,
    controlOnSelected: colors.text,
    controlSurface: colors.surfaceRaised,
    controlTrack: colors.surfaceVariant,
    controlBorder: colors.border,
    controlDisabledContent: colors.muted,
    controlDisabledSurface: colors.surface,
    controlDisabledActive: `${colors.tint}33`,
  };
}

export type ColorTokens = ReturnType<typeof createColorTokens>;
export type ThemePalette = Record<AppColorScheme, ColorTokens>;

/** Feedback keeps its meaning across brand palettes. */
export const feedbackColors = {
  light: {
    error: '#B3261E',
    errorContainer: '#FDE8E7',
    onError: '#FFFFFF',
    success: '#187A46',
    successContainer: '#E0F4E7',
    onSuccess: '#FFFFFF',
    warning: '#8A5A00',
    warningContainer: '#FFF3CD',
    onWarning: '#FFFFFF',
    info: '#007B9F',
    infoContainer: '#E5F5FB',
    onInfo: '#FFFFFF',
  },
  dark: {
    error: '#F15C6D',
    errorContainer: '#3F2028',
    onError: '#111318',
    success: '#6BD99A',
    successContainer: '#143524',
    onSuccess: '#111318',
    warning: '#E9B94A',
    warningContainer: '#3D321B',
    onWarning: '#111318',
    info: '#53BDEB',
    infoContainer: '#123743',
    onInfo: '#111318',
  },
};

type BrandColors = Omit<SemanticColors, keyof typeof feedbackColors.light>;

/** Brand configuration shares feedback defaults and the derived token mapping. */
export function createBrandTheme(colors: Record<AppColorScheme, BrandColors>): ThemePalette {
  return {
    light: createColorTokens({ ...feedbackColors.light, ...colors.light }),
    dark: createColorTokens({ ...feedbackColors.dark, ...colors.dark }),
  };
}
