/**
 * Shared button visual resolution logic.
 *
 * This file contains the pure function `resolveButtonVisuals` which
 * computes the visual properties (colors, radius, sizing) for a button
 * based on its variant, semantic, size, shape, and disabled state.
 *
 * WHY SHARED:
 *   Both Button and IconButton need the same color/radius logic.
 *   Extracting it here avoids duplicating the variant × semantic
 *   color matrix in two places.
 *
 * This function is pure — no hooks, no side effects, no JSX.
 * It just maps design-system tokens → concrete visual values.
 */

import type { ThemeTokens } from "@/constants/theme.tokens";

import {
  BUTTON_SEMANTIC,
  BUTTON_SHAPE,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  type ButtonSemantic,
  type ButtonShape,
  type ButtonSize,
  type ButtonStyle,
  type ButtonVariant,
} from "./types";

/** Shorthand for the button section of the theme tokens. */
type ButtonTokens = ThemeTokens["components"]["button"];

/**
 * Resolve all visual properties for a button.
 *
 * Takes design-system axes (variant, semantic, size, shape) and the
 * current theme tokens, and returns concrete values ready to be
 * applied to the native Button's style props.
 *
 * COLOR LOGIC (the most complex part):
 *
 *   The button has 3 color slots: background, foreground (text), border.
 *   These depend on variant × semantic × disabled state:
 *
 *   ┌────────────┬─────────────────────┬──────────────────────┬────────────┐
 *   │            │ FILLED              │ OUTLINED / TEXT       │ DISABLED   │
 *   ├────────────┼─────────────────────┼──────────────────────┼────────────┤
 *   │ background │ semantic.background │ transparent          │ disabled.bg│
 *   │ foreground │ semantic.foreground │ semantic.background  │ disabled.fg│
 *   │ border     │ (not used)          │ semantic.background  │ disabled.bg│
 *   └────────────┴─────────────────────┴──────────────────────┴────────────┘
 *
 *   Note: for outlined/text, the foreground color IS the semantic background
 *   color. This is intentional — in a "destructive outlined" button, the
 *   text is red (= the "background" color of the destructive semantic).
 *
 * @param tokens   - The button section of the theme tokens
 * @param variant  - filled, outlined, or text
 * @param semantic - primary, destructive, success, etc.
 * @param size     - sm, md, or lg
 * @param shape    - rounded, pill, or square
 * @param disabled - whether the button is disabled (overrides all colors)
 * @param style    - optional user style overrides
 *
 * @returns { background, border, foreground, radius, size }
 */
export function resolveButtonVisuals({
  tokens,
  variant = BUTTON_VARIANT.FILLED,
  semantic = BUTTON_SEMANTIC.PRIMARY,
  size = BUTTON_SIZE.MD,
  shape = BUTTON_SHAPE.ROUNDED,
  disabled,
  style,
}: {
  tokens: ButtonTokens;
  variant?: ButtonVariant;
  semantic?: ButtonSemantic;
  size?: ButtonSize;
  shape?: ButtonShape;
  disabled: boolean;
  style?: ButtonStyle;
}) {
  // ── Look up the size preset (height, padding, fontSize, etc.) ──
  const sizeTokens = tokens.sizes[size];

  // ── Look up the semantic color pair (background + foreground) ──
  const semanticColors = tokens.color.semantic[semantic];

  // ── Is this a filled variant? (affects color logic below) ──
  const isFilled = variant === BUTTON_VARIANT.FILLED;

  // ── Resolve border radius ──
  // Priority: explicit style override → shape preset
  // For "rounded", the radius depends on size (e.g., sm=6, md=8, lg=10)
  // For "pill" and "square", the radius is fixed (height/2 and 0 respectively)
  const radius =
    style?.borderRadius ??
    (shape === BUTTON_SHAPE.ROUNDED
      ? tokens.shapes.rounded[size]  // Size-dependent radius
      : tokens.shapes[shape]);       // Fixed radius for pill/square

  // ── Resolve background color ──
  // Disabled: filled → disabled.background, otherwise → transparent
  // Enabled:  style override → filled → semantic.background, otherwise → transparent
  const background = disabled
    ? isFilled
      ? tokens.color.disabled.background  // Disabled filled: greyed out
      : tokens.color.transparent           // Disabled outlined/text: stay transparent
    : style?.backgroundColor ??
      (isFilled ? semanticColors.background : tokens.color.transparent);

  // ── Resolve foreground (text/icon) color ──
  // Disabled: always use disabled foreground color
  // Enabled filled: use the semantic foreground (e.g., white on blue)
  // Enabled outlined/text: use the semantic BACKGROUND as text color
  //   (e.g., "destructive outlined" → red text, because red = semantic.background)
  const foreground = disabled
    ? tokens.color.disabled.foreground
    : isFilled
      ? semanticColors.foreground   // White (or dark) text on colored background
      : semanticColors.background;  // Colored text on transparent background

  // ── Resolve border color ──
  // Disabled: match the disabled background (subtle/greyed out)
  // Enabled: style override → semantic background color
  const border = disabled
    ? tokens.color.disabled.background
    : style?.borderColor ?? semanticColors.background;

  return {
    background,
    border,
    foreground,
    radius,
    size: sizeTokens,  // The full size preset (height, padding, fontSize, etc.)
  };
}
