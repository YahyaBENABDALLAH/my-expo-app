/**
 * Type definitions for the Universal Button component.
 *
 * Defines all the design-system axes for buttons:
 *   - Variant:  visual style (filled, outlined, text)
 *   - Semantic: color meaning (primary, destructive, success, etc.)
 *   - Size:     dimensions (sm, md, lg)
 *   - Shape:    border radius preset (rounded, pill, square)
 *
 * Also defines ButtonProps and IconButtonProps.
 */

import type {
  ButtonProps as ExpoButtonProps,
  IconName,
  UniversalStyle,
} from "@expo/ui";
import type { StyleProp, ViewStyle } from "react-native";

// ─────────────────────────────────────────────────────────────
// BUTTON VARIANTS — the visual style of the button.
//
// These match Expo's built-in variants exactly:
//   - filled:   solid background color (most prominent)
//   - outlined: transparent background with a border
//   - text:     no background or border, just text (least prominent)
//
// "as const" makes each value a literal type for TypeScript narrowing.
// ─────────────────────────────────────────────────────────────
export const BUTTON_VARIANT = {
  FILLED: "filled",    // Solid background — primary actions
  OUTLINED: "outlined", // Border only — secondary actions
  TEXT: "text",         // No chrome — tertiary / inline actions
} as const;

/**
 * Derives the variant type directly from Expo's ButtonProps.
 *
 * We use NonNullable<ExpoButtonProps["variant"]> instead of deriving
 * from our own const because this guarantees our variants always
 * match what Expo actually accepts. If Expo adds a new variant,
 * TypeScript will flag it.
 */
export type ButtonVariant = NonNullable<ExpoButtonProps["variant"]>;

// ─────────────────────────────────────────────────────────────
// BUTTON SEMANTICS — convey meaning through color.
//
// Similar to Text semantic colors, but applied to button backgrounds.
// The theme resolves each semantic to a { background, foreground } pair
// that works in both light and dark mode.
//
// Example: "destructive" → red background + white text (filled)
//                        → no background + red text (outlined/text)
// ─────────────────────────────────────────────────────────────
export const BUTTON_SEMANTIC = {
  PRIMARY: "primary",       // Brand / main action color
  SECONDARY: "secondary",   // Secondary accent
  SUCCESS: "success",       // Positive action (confirm, save)
  WARNING: "warning",       // Cautionary action
  DESTRUCTIVE: "destructive", // Dangerous action (delete, remove)
  INFO: "info",             // Informational action
  DEFAULT: "default",       // Neutral / unstyled
} as const;

/** Union of all valid semantic values. */
export type ButtonSemantic =
  (typeof BUTTON_SEMANTIC)[keyof typeof BUTTON_SEMANTIC];

// ─────────────────────────────────────────────────────────────
// BUTTON SIZES — predefined dimension presets.
//
// Each size maps to a set of tokens in the theme:
//   - height, paddingHorizontal, paddingVertical
//   - fontSize, lineHeight (for the label text)
//   - iconSize (for IconButton)
// ─────────────────────────────────────────────────────────────
export const BUTTON_SIZE = {
  SM: "sm",  // Small — compact buttons, toolbars
  MD: "md",  // Medium — default size for most buttons
  LG: "lg",  // Large — prominent CTAs, hero sections
} as const;

/** Union of all valid size values: "sm" | "md" | "lg". */
export type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE];

// ─────────────────────────────────────────────────────────────
// BUTTON SHAPES — border radius presets.
//
// Each shape controls how rounded the button corners are:
//   - rounded: moderately rounded corners (size-dependent radius)
//   - pill:    fully rounded (radius = height / 2) — for icon buttons
//   - square:  sharp corners (small or zero radius)
// ─────────────────────────────────────────────────────────────
export const BUTTON_SHAPE = {
  ROUNDED: "rounded", // Default rounded corners
  PILL: "pill",       // Fully circular ends (capsule shape)
  SQUARE: "square",   // Sharp or minimal corners
} as const;

/** Union of all valid shape values. */
export type ButtonShape = (typeof BUTTON_SHAPE)[keyof typeof BUTTON_SHAPE];

// ─────────────────────────────────────────────────────────────
// STYLE TYPE
//
// We extend Expo's UniversalStyle but replace width/height with
// number-only types. This is because on Android, Expo's native
// buttons require numeric pixel values — percentage strings like
// "100%" don't work. The fullWidth prop handles the percentage
// case via layout measurement instead.
// ─────────────────────────────────────────────────────────────

type NumericButtonStyleKey =
  | "borderRadius"
  | "borderWidth"
  | "height"
  | "opacity"
  | "padding"
  | "paddingBottom"
  | "paddingHorizontal"
  | "paddingLeft"
  | "paddingRight"
  | "paddingTop"
  | "paddingVertical"
  | "width";

/** Universal styles with native-safe numeric geometry. */
export type ButtonStyle = Omit<UniversalStyle, NumericButtonStyleKey> & {
  borderRadius?: number;
  borderWidth?: number;
  height?: number;
  opacity?: number;
  padding?: number;
  paddingBottom?: number;
  paddingHorizontal?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingVertical?: number;
  width?: number;
};

// ─────────────────────────────────────────────────────────────
// BUTTON PROPS
//
// Extends Expo's ButtonProps, replacing `style` with our version
// and adding design-system props (semantic, size, shape, loading, etc.)
// ─────────────────────────────────────────────────────────────

/** Expo Universal Button plus Foodiya design-system recipes. */
export interface ButtonProps extends Omit<ExpoButtonProps, "style"> {
  /** Semantic color — resolved from the current theme. */
  semantic?: ButtonSemantic;

  /** Predefined size — controls height, padding, and font size. */
  size?: ButtonSize;

  /** Border radius preset — rounded, pill, or square. */
  shape?: ButtonShape;

  /** When true, disables the button and shows a "…" loading indicator. */
  loading?: boolean;

  /** When true, the button stretches to fill its parent's width. */
  fullWidth?: boolean;

  /** React Native style for the outer container View. */
  containerStyle?: StyleProp<ViewStyle>;

  /** Style for the button itself (height, padding, background, border, etc.) */
  style?: ButtonStyle;
}

// ─────────────────────────────────────────────────────────────
// ICON BUTTON PROPS
//
// A specialized subset of ButtonProps for icon-only buttons.
// Omits props that don't make sense for icon buttons:
//   - children: the icon IS the content
//   - fullWidth: icon buttons are always compact
//   - label: no text label
//   - loading: typically not needed for icon actions
//   - shape: always pill (hardcoded)
//
// Adds:
//   - icon: required icon name
//   - iconSize: optional override for the icon dimensions
//   - accessibilityLabel: REQUIRED because there's no visible text
// ─────────────────────────────────────────────────────────────

export interface IconButtonProps
  extends Omit<
    ButtonProps,
    "children" | "fullWidth" | "label" | "loading" | "shape"
  > {
  /** The icon to display (e.g., "star.fill" on iOS, a require() on Android). */
  icon: IconName;

  /** Override the icon size (defaults to the size token's iconSize). */
  iconSize?: number;

  /** REQUIRED — screen readers need this since there's no visible text. */
  accessibilityLabel: string;
}
