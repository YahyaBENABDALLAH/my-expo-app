/**
 * Text style resolution helpers.
 *
 * These pure functions translate our design-system shortcuts
 * (variant, semantic, font, weight) into the actual style objects
 * that Expo UI's Text component understands.
 *
 * All the "magic" mapping lives here — the Text component itself
 * just calls these functions and spreads the results.
 */

import {
  FONT_FAMILY,
  FONT_WEIGHT,
  TYPOGRAPHY,
  type TextSemanticColorTokens,
} from "@/constants/theme.tokens";
import type {
  TextFont,
  TextSemantic,
  TextVariant,
  TextWeight,
  UniversalTextStyle,
} from "./types";
import { TEXT_SEMANTIC } from "./types";

// ─────────────────────────────────────────────────────────────
// VARIANT → STYLE mapping
//
// TYPOGRAPHY.text is an object in theme.tokens that looks like:
//   { h1: { fontSize: 32, lineHeight: 40, fontWeight: "700" }, ... }
//
// We just re-export it with a typed Record so TypeScript knows
// every TextVariant key maps to a valid UniversalTextStyle.
// ─────────────────────────────────────────────────────────────
const TEXT_VARIANT_STYLES: Record<TextVariant, UniversalTextStyle> =
  TYPOGRAPHY.text;

// ─────────────────────────────────────────────────────────────
// FONT FAMILY mapping: human name → actual font family string.
//
// Example: "primary" → "Inter", "mono" → "JetBrains Mono"
// The actual values come from FONT_FAMILY in theme.tokens.
// ─────────────────────────────────────────────────────────────
const FONT_BY_NAME: Record<TextFont, string> = {
  primary: FONT_FAMILY.primary,
  secondary: FONT_FAMILY.secondary,
  mono: FONT_FAMILY.mono,
};

// ─────────────────────────────────────────────────────────────
// FONT WEIGHT mapping: human name → numeric weight value.
//
// Example: "bold" → "700", "regular" → "400"
// The actual values come from FONT_WEIGHT in theme.tokens.
// ─────────────────────────────────────────────────────────────
const WEIGHT_BY_NAME: Record<TextWeight, UniversalTextStyle["fontWeight"]> = {
  regular: FONT_WEIGHT.normal,
  medium: FONT_WEIGHT.medium,
  semibold: FONT_WEIGHT.semibold,
  bold: FONT_WEIGHT.bold,
  extrabold: FONT_WEIGHT.extrabold,
};

/**
 * Resolve a semantic name ("muted", "destructive", etc.) into a color string.
 *
 * @param colors  - The theme's text color tokens (an object like
 *                  { default: "#000", muted: "#666", destructive: "#FF0000", ... })
 * @param semantic - Which semantic meaning to use. Defaults to "default".
 * @returns        The resolved color string for the current theme.
 *
 * Example:
 *   resolveTextColor(tokens.text.color, "destructive")
 *   // → "#FF3B30" (in light mode) or "#FF453A" (in dark mode)
 */
export function resolveTextColor(
  colors: TextSemanticColorTokens,
  semantic: TextSemantic = TEXT_SEMANTIC.DEFAULT,
) {
  return colors[semantic];
}

/**
 * Build a UniversalTextStyle from design-system shorthand props.
 *
 * Starts from the variant's base styles (fontSize, lineHeight, fontWeight)
 * and optionally overrides fontFamily and fontWeight if `font` or `weight`
 * are provided.
 *
 * @param variant - The typographic scale step ("h1", "body", etc.)
 * @param font    - Optional font family alias ("primary", "mono", etc.)
 * @param weight  - Optional weight alias ("bold", "semibold", etc.)
 * @returns       A complete UniversalTextStyle object.
 *
 * Example:
 *   resolveTextStyle({ variant: "h1", weight: "extrabold" })
 *   // → { fontSize: 32, lineHeight: 40, fontWeight: "800" }
 */
export function resolveTextStyle({
  font,
  variant,
  weight,
}: {
  font?: TextFont;
  variant: TextVariant;
  weight?: TextWeight;
}): UniversalTextStyle {
  if (!font && !weight) {
    return TEXT_VARIANT_STYLES[variant];
  }

  return {
    // Start with the full style for this variant (fontSize, lineHeight, etc.)
    ...TEXT_VARIANT_STYLES[variant],

    // If a font family alias was provided, override fontFamily.
    // The `? ... : null` pattern means "only spread if truthy".
    // Spreading `null` is a no-op in JS — it doesn't add any keys.
    ...(font ? { fontFamily: FONT_BY_NAME[font] } : null),

    // If a weight alias was provided, override fontWeight.
    ...(weight ? { fontWeight: WEIGHT_BY_NAME[weight] } : null),
  };
}
