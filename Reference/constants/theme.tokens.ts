/**
 * Foodiya design tokens — single source of truth for JS-side layout values
 * (spacing, radius, typography, shadows, z-index). Colors live in
 * constants/theme.colors.ts.
 */

import { StyleSheet } from "react-native";

import {
  DARK_COLORS,
  LIGHT_COLORS,
  type ColorTokens,
} from "./theme.colors";
import type { ThemeMode } from "./theme.constant";

/* ── Shadow Tokens ── */

interface ShadowStyle {
  readonly shadowColor: string;
  readonly shadowOffset: { readonly width: number; readonly height: number };
  readonly shadowOpacity: number;
  readonly shadowRadius: number;
  readonly elevation: number;
}

export const SHADOWS = {
  none: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  "2xl": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 12,
  },
  floating: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const satisfies Record<string, ShadowStyle>;

export type ShadowLevel = keyof typeof SHADOWS;

/* ── Font Size (px) ── */

export const FONT_SIZE = {
  tiny: 12,
  small: 14,
  medium: 16,
  large: 18,
} as const;

/* ── Line Height (px) ── */

export const LINE_HEIGHT = {
  tiny: 16,
  small: 20,
  medium: 24,
  large: 28,
} as const;

/* ── Font Weight ── */

export const FONT_WEIGHT = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
} as const;

/* ── Font Family ── */

export const FONT_FAMILY = {
  primary: "Manrope",
  secondary:
    process.env.EXPO_OS === "android"
      ? "UnifrakturCook-Bold"
      : "UnifrakturCook",
  mono: "monospace",
  heading:
    process.env.EXPO_OS === "android"
      ? "UnifrakturCook-Bold"
      : "UnifrakturCook",
  body: "Manrope",
} as const;

/* ── Typography Recipes ── */

export const TYPOGRAPHY = {
  text: {
    h1: {
      fontFamily: FONT_FAMILY.secondary,
      fontSize: 32,
      fontWeight: FONT_WEIGHT.extrabold,
      lineHeight: 38,
      letterSpacing: 0,
    },
    h2: {
      fontFamily: FONT_FAMILY.secondary,
      fontSize: 26,
      fontWeight: FONT_WEIGHT.bold,
      lineHeight: 32,
      letterSpacing: 0,
    },
    h3: {
      fontFamily: FONT_FAMILY.secondary,
      fontSize: 22,
      fontWeight: FONT_WEIGHT.semibold,
      lineHeight: 28,
      letterSpacing: 0,
    },
    h4: {
      fontFamily: FONT_FAMILY.secondary,
      fontSize: FONT_SIZE.large,
      fontWeight: FONT_WEIGHT.semibold,
      lineHeight: LINE_HEIGHT.medium,
      letterSpacing: 0,
    },
    blockquote: {
      fontFamily: FONT_FAMILY.primary,
      fontSize: FONT_SIZE.medium,
      fontWeight: FONT_WEIGHT.normal,
      lineHeight: LINE_HEIGHT.medium,
    },
    lead: {
      fontFamily: FONT_FAMILY.primary,
      fontSize: FONT_SIZE.large,
      fontWeight: FONT_WEIGHT.normal,
      lineHeight: LINE_HEIGHT.large,
    },
    large: {
      fontFamily: FONT_FAMILY.primary,
      fontSize: FONT_SIZE.large,
      fontWeight: FONT_WEIGHT.semibold,
      lineHeight: LINE_HEIGHT.large,
    },
    body: {
      fontFamily: FONT_FAMILY.primary,
      fontSize: FONT_SIZE.medium,
      fontWeight: FONT_WEIGHT.normal,
      lineHeight: LINE_HEIGHT.medium,
    },
    small: {
      fontFamily: FONT_FAMILY.primary,
      fontSize: FONT_SIZE.small,
      fontWeight: FONT_WEIGHT.medium,
      lineHeight: LINE_HEIGHT.small,
    },
    caption: {
      fontFamily: FONT_FAMILY.primary,
      fontSize: FONT_SIZE.tiny,
      fontWeight: FONT_WEIGHT.medium,
      lineHeight: LINE_HEIGHT.tiny,
    },
    code: {
      fontFamily: FONT_FAMILY.mono,
      fontSize: FONT_SIZE.small,
      fontWeight: FONT_WEIGHT.semibold,
      lineHeight: LINE_HEIGHT.small,
    },
  },
  control: {
    button: {
      fontFamily: FONT_FAMILY.primary,
      fontWeight: FONT_WEIGHT.semibold,
    },
    collapsibleLabel: {
      fontFamily: FONT_FAMILY.primary,
      fontSize: FONT_SIZE.medium,
      fontWeight: FONT_WEIGHT.semibold,
      lineHeight: LINE_HEIGHT.medium,
    },
    input: {
      fontFamily: FONT_FAMILY.primary,
      fontSize: FONT_SIZE.medium,
      fontWeight: FONT_WEIGHT.normal,
      lineHeight: LINE_HEIGHT.small,
    },
  },
} as const;

/* ── Border Radius (px) ── */

export const RADIUS = {
  none: 0,
  small: 8,
  medium: 12,
  large: 14,
  xlarge: 16,
  full: 9999,
} as const;

/* ── Border Width (px) ── */

export const BORDER_WIDTH = {
  small: 1,
  medium: 2,
  large: 3,
  hairline: StyleSheet.hairlineWidth,
} as const;

/* ── Z-Index ── */

export const Z_INDEX = {
  hide: -1,
  base: 0,
  raised: 1,
  dropdown: 10,
  sticky: 20,
  banner: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
  fab: 90,
  max: 9999,
} as const;

export const STATE_OPACITY = {
  disabled: 0.6,
  pressed: 0.72,
} as const;

/**
 * Spacing scale (Tailwind-compatible): 1 unit = 4px.
 * `space(4)` → 16, `space(1.5)` → 6, `space(0.5)` → 2.
 */
export function space(units: number): number {
  return units * 4;
}

/* ── Shared Component Scales ── */

export const CONTROL_HEIGHT = {
  compact: 32,
  sm: 36,
  md: 44,
  lg: 56,
  multiline: 96,
} as const;

export const ICON_SIZE = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export const TOUCH_TARGET_SIZE = 48;

/** Component recipes may only compose shared scales declared above. */
export const COMPONENT_TOKENS = {
  button: {
    sizes: {
      sm: {
        height: CONTROL_HEIGHT.sm,
        fontSize: FONT_SIZE.small,
        lineHeight: LINE_HEIGHT.small,
        paddingHorizontal: space(3),
        paddingVertical: space(1.5),
        iconSize: ICON_SIZE.sm,
      },
      md: {
        height: CONTROL_HEIGHT.md,
        fontSize: FONT_SIZE.medium,
        lineHeight: LINE_HEIGHT.small,
        paddingHorizontal: space(4),
        paddingVertical: space(2),
        iconSize: ICON_SIZE.md,
      },
      lg: {
        height: CONTROL_HEIGHT.lg,
        fontSize: FONT_SIZE.large,
        lineHeight: LINE_HEIGHT.large,
        paddingHorizontal: space(5.5),
        paddingVertical: space(3),
        iconSize: ICON_SIZE.lg,
      },
    },
    shapes: {
      rounded: {
        sm: RADIUS.small,
        md: RADIUS.medium,
        lg: RADIUS.large,
      },
      pill: RADIUS.full,
      square: RADIUS.none,
    },
    borderWidth: BORDER_WIDTH.small,
  },
  textInput: {
    height: CONTROL_HEIGHT.lg,
    multilineHeight: CONTROL_HEIGHT.multiline,
    radius: RADIUS.xlarge,
    multilineRadius: RADIUS.xlarge,
    borderWidth: BORDER_WIDTH.small,
    contentPaddingHorizontal: space(4),
    contentPaddingVertical: space(3),
    iconTextPadding: TOUCH_TARGET_SIZE,
    iconSlotWidth: TOUCH_TARGET_SIZE,
    iconInset: space(4),
    contentGap: space(1.5),
    messagePadding: space(1),
    errorPadding: space(4),
    disabledOpacity: STATE_OPACITY.disabled,
  },
} as const;

/* ── Resolved Theme Tokens ── */

export interface TextSemanticColorTokens {
  readonly default: string;
  readonly muted: string;
  readonly primary: string;
  readonly secondary: string;
  readonly success: string;
  readonly warning: string;
  readonly destructive: string;
  readonly info: string;
}

export interface TextInputColorTokens {
  readonly background: string;
  readonly foreground: string;
  readonly placeholder: string;
  readonly border: string;
  readonly error: string;
  readonly cursor: string;
  readonly selection: string;
}

interface ButtonColorPair {
  readonly background: string;
  readonly foreground: string;
}

export interface ButtonColorTokens {
  readonly semantic: {
    readonly primary: ButtonColorPair;
    readonly secondary: ButtonColorPair;
    readonly success: ButtonColorPair;
    readonly warning: ButtonColorPair;
    readonly destructive: ButtonColorPair;
    readonly info: ButtonColorPair;
    readonly default: ButtonColorPair;
  };
  readonly disabled: ButtonColorPair;
  readonly transparent: string;
}

export interface CheckboxColorTokens {
  /** Passed to Universal Host.seedColor for Material 3 / SwiftUI tint. */
  readonly accent: string;
}

export interface CollapsibleColorTokens {
  /** Themes native disclosure chrome through Universal Host.seedColor. */
  readonly accent: string;
  readonly label: string;
}

export interface SwitchColorTokens {
  /** Applied through Host.seedColor as SwiftUI tint / Material 3 primary. */
  readonly accent: string;
}

export interface DateTimePickerColorTokens {
  /** Applied to Expo DateTimePicker's native tint/accent. */
  readonly accent: string;
}

export interface SegmentedControlColorTokens {
  /** Applied to Expo SegmentedControl's native tint where supported. */
  readonly accent: string;
}

export interface ThemeTokens {
  readonly colors: ColorTokens;
  readonly typography: typeof TYPOGRAPHY;
  readonly radius: typeof RADIUS;
  readonly borderWidth: typeof BORDER_WIDTH;
  readonly opacity: typeof STATE_OPACITY;
  readonly controlHeight: typeof CONTROL_HEIGHT;
  readonly iconSize: typeof ICON_SIZE;
  readonly touchTargetSize: typeof TOUCH_TARGET_SIZE;
  readonly shadows: {
    readonly item: ShadowStyle;
    readonly card: ShadowStyle;
    readonly floatingAction: ShadowStyle;
  };
  readonly components: {
    readonly button: typeof COMPONENT_TOKENS.button & {
      readonly color: ButtonColorTokens;
    };
    readonly checkbox: {
      readonly color: CheckboxColorTokens;
    };
    readonly collapsible: {
      readonly color: CollapsibleColorTokens;
    };
    readonly dateTimePicker: {
      readonly color: DateTimePickerColorTokens;
    };
    readonly segmentedControl: {
      readonly color: SegmentedControlColorTokens;
    };
    readonly switch: {
      readonly color: SwitchColorTokens;
    };
    readonly text: {
      readonly color: TextSemanticColorTokens;
    };
    readonly textInput: typeof COMPONENT_TOKENS.textInput & {
      readonly color: TextInputColorTokens;
    };
  };
}

function createThemeTokens(
  colors: ColorTokens,
  isDark: boolean,
): ThemeTokens {
  return {
    colors,
    typography: TYPOGRAPHY,
    radius: RADIUS,
    borderWidth: BORDER_WIDTH,
    opacity: STATE_OPACITY,
    controlHeight: CONTROL_HEIGHT,
    iconSize: ICON_SIZE,
    touchTargetSize: TOUCH_TARGET_SIZE,
    shadows: {
      item: {
        ...SHADOWS.sm,
        shadowOpacity: isDark ? 0.3 : SHADOWS.sm.shadowOpacity,
        elevation: isDark ? 3 : SHADOWS.sm.elevation,
      },
      card: {
        ...SHADOWS.lg,
        shadowOpacity: isDark ? 0.4 : SHADOWS.lg.shadowOpacity,
        elevation: isDark ? 8 : SHADOWS.lg.elevation,
      },
      floatingAction: {
        ...SHADOWS.floating,
        shadowOpacity: isDark ? 0.45 : SHADOWS.floating.shadowOpacity,
        elevation: isDark ? 6 : SHADOWS.floating.elevation,
      },
    },
    components: {
      button: {
        ...COMPONENT_TOKENS.button,
        color: {
          semantic: {
            primary: {
              background: colors.primary,
              foreground: colors.primaryForeground,
            },
            secondary: {
              background: colors.secondary,
              foreground: colors.secondaryForeground,
            },
            success: {
              background: colors.success,
              foreground: colors.successForeground,
            },
            warning: {
              background: colors.warning,
              foreground: colors.warningForeground,
            },
            destructive: {
              background: colors.destructive,
              foreground: colors.destructiveForeground,
            },
            info: {
              background: colors.info,
              foreground: colors.infoForeground,
            },
            default: {
              background: colors.default,
              foreground: colors.defaultForeground,
            },
          },
          disabled: {
            background: colors.disabled,
            foreground: colors.disabledForeground,
          },
          transparent: "transparent",
        },
      },
      checkbox: {
        color: {
          accent: colors.primary,
        },
      },
      collapsible: {
        color: {
          accent: colors.primary,
          label: colors.foreground,
        },
      },
      dateTimePicker: {
        color: {
          accent: colors.primary,
        },
      },
      segmentedControl: {
        color: {
          accent: colors.primary,
        },
      },
      switch: {
        color: {
          accent: colors.primary,
        },
      },
      text: {
        color: {
          default: colors.foreground,
          muted: colors.mutedForeground,
          primary: colors.primary,
          secondary: colors.secondary,
          success: colors.success,
          warning: colors.warning,
          destructive: colors.destructive,
          info: colors.info,
        },
      },
      textInput: {
        ...COMPONENT_TOKENS.textInput,
        color: {
          background: colors.card,
          foreground: colors.foreground,
          placeholder: colors.mutedForeground,
          border: "transparent",
          error: colors.destructive,
          cursor: colors.primary,
          selection: colors.secondary,
        },
      },
    },
  };
}

/** The complete design-token tree selected by ThemeProvider. */
export const THEME_TOKENS = {
  light: createThemeTokens(LIGHT_COLORS, false),
  dark: createThemeTokens(DARK_COLORS, true),
} as const satisfies Record<ThemeMode, ThemeTokens>;
