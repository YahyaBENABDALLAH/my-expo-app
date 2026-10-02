/**
 * Type definitions for the Universal Text component.
 *
 * This file contains all the TypeScript types, enums, and interfaces
 * that describe how Text can be configured. Think of it as the
 * "contract" between the Text component and the rest of the app.
 */

import type {
  Text as ExpoText,
  UniversalStyle,
  UniversalTextStyle as ExpoUniversalTextStyle,
} from "@expo/ui";
import type { ComponentProps } from "react";

// ─────────────────────────────────────────────────────────────
// TEXT VARIANTS — the typographic scale of the design system.
//
// Instead of repeating fontSize/lineHeight/fontWeight everywhere,
// you just write <Text variant="h1"> and the component looks up
// the matching style from the theme tokens (TYPOGRAPHY.text).
//
// "as const" makes each value a literal type ("h1", not string),
// so TypeScript can narrow and autocomplete them.
// ─────────────────────────────────────────────────────────────
export const TEXT_VARIANT = {
  H1: "h1",           // Largest heading
  H2: "h2",           // Second-level heading
  H3: "h3",           // Third-level heading
  H4: "h4",           // Fourth-level heading
  BLOCKQUOTE: "blockquote", // Styled quote text
  LEAD: "lead",       // Intro / hero text (slightly larger than body)
  LARGE: "large",     // Emphasized body text
  BODY: "body",       // Default body text (used if no variant is specified)
  SMALL: "small",     // Smaller text (labels, captions)
  CAPTION: "caption", // Smallest text (timestamps, footnotes)
  CODE: "code",       // Monospace code text
} as const;

/**
 * Union of all valid variant values: "h1" | "h2" | ... | "code".
 *
 * How this works:
 *   typeof TEXT_VARIANT          → the shape of the object
 *   keyof typeof TEXT_VARIANT    → "H1" | "H2" | ... | "CODE" (the keys)
 *   (typeof TEXT_VARIANT)[keys]  → "h1" | "h2" | ... | "code" (the values)
 */
export type TextVariant = (typeof TEXT_VARIANT)[keyof typeof TEXT_VARIANT];

// ─────────────────────────────────────────────────────────────
// TEXT SEMANTICS — convey meaning through color.
//
// Rather than hard-coding colors like "#FF0000" for errors,
// you write <Text semantic="destructive"> and the theme picks
// the right color for the current light/dark mode.
// ─────────────────────────────────────────────────────────────
export const TEXT_SEMANTIC = {
  DEFAULT: "default",       // Normal text color (foreground)
  MUTED: "muted",           // De-emphasized text (secondary info)
  PRIMARY: "primary",       // Brand / accent color
  SECONDARY: "secondary",   // Secondary accent
  SUCCESS: "success",       // Positive feedback (green-ish)
  WARNING: "warning",       // Cautionary feedback (orange/yellow)
  DESTRUCTIVE: "destructive", // Error / danger (red-ish)
  INFO: "info",             // Informational highlight (blue-ish)
} as const;

/** Union of all valid semantic values. Same pattern as TextVariant. */
export type TextSemantic =
  (typeof TEXT_SEMANTIC)[keyof typeof TEXT_SEMANTIC];

// ─────────────────────────────────────────────────────────────
// FONT & WEIGHT — human-readable aliases.
//
// These map to the actual font family names and weight numbers
// defined in theme.tokens. Using aliases means if you swap fonts
// later, you only change the mapping in text-styles.ts, not
// every usage site.
// ─────────────────────────────────────────────────────────────

/** Which font family to use. */
export type TextFont = "primary" | "secondary" | "mono";

/** How thick/bold the text should be. */
export type TextWeight =
  | "regular"   // 400 — normal reading weight
  | "medium"    // 500 — slightly emphasized
  | "semibold"  // 600 — strong emphasis
  | "bold"      // 700 — headings, buttons
  | "extrabold"; // 800 — extra heavy emphasis

// ─────────────────────────────────────────────────────────────
// STYLE TYPES — what you can pass to the `style` / `textStyle` props.
// ─────────────────────────────────────────────────────────────

/**
 * Re-export of the Expo UI text style type.
 * Contains: color, fontSize, fontWeight, fontFamily, lineHeight,
 *           letterSpacing, textAlign.
 */
export type UniversalTextStyle = ExpoUniversalTextStyle;

/**
 * A combined style type that accepts BOTH text properties AND
 * container/layout properties (padding, backgroundColor, etc.).
 *
 * Our Text component will split this into two separate objects
 * before passing them to Expo's Text (which requires them separate).
 * This lets consumers write one `style` prop instead of two.
 */
export type TextStyle = UniversalTextStyle & UniversalStyle;

/** A single combined style, or an ordered list merged from left to right. */
export type TextStyleProp =
  | TextStyle
  | readonly (TextStyle | null | false | undefined)[];

// ─────────────────────────────────────────────────────────────
// TEXT PROPS — the public API of the <Text> component.
// ─────────────────────────────────────────────────────────────

/**
 * Props accepted by our Universal Text component.
 *
 * We start from Expo's Text props but:
 *   1. Omit "children" — we re-add it as `string` only (no JSX).
 *   2. Omit "style" and "textStyle" — we replace them with our
 *      extended versions that support design-system shortcuts.
 *   3. Add our own convenience props: variant, semantic, font, weight.
 */
export type TextProps = Omit<
  ComponentProps<typeof ExpoText>,
  "children" | "style" | "textStyle"
> & {
  /** The text content. Only strings allowed — no JSX children. */
  children?: string;

  /** Typographic variant from the design system scale. Defaults to "body". */
  variant?: TextVariant;

  /** Semantic color — resolved from the current theme. */
  semantic?: TextSemantic;

  /** Font family alias ("primary", "secondary", "mono"). */
  font?: TextFont;

  /** Font weight alias ("regular" through "extrabold"). */
  weight?: TextWeight;

  /**
   * Combined style object. Text-specific keys (color, fontSize, etc.)
   * are extracted and sent to Expo's `textStyle` prop; layout keys
   * (padding, backgroundColor, etc.) go to Expo's `style` prop.
   */
  style?: TextStyleProp;
};
