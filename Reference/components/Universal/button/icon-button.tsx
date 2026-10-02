/**
 * IconButton — a convenience wrapper for icon-only buttons.
 *
 * Instead of manually configuring a Button with square dimensions,
 * pill shape, zero padding, and a centered Icon, this component
 * does it all for you.
 *
 * KEY DESIGN DECISIONS:
 *   - Always uses "pill" shape (fully circular)
 *   - Forces square dimensions (width = height) for a perfect circle
 *   - Defaults to "text" variant (transparent background)
 *   - Defaults to "primary" semantic (brand color icon)
 *   - Requires accessibilityLabel (no visible text = screen reader needs it)
 *
 * COMPOSITION:
 *   IconButton doesn't re-implement button logic — it composes the
 *   existing Button component and just overrides shape/style/children.
 *   This means it inherits all Button features: Host wrapping, disabled
 *   state, theming, etc.
 *
 * @example
 *   // Simple icon button
 *   <IconButton
 *     icon="trash"
 *     accessibilityLabel="Delete item"
 *     semantic="destructive"
 *     onPress={handleDelete}
 *   />
 *
 *   // Custom size
 *   <IconButton
 *     icon="settings"
 *     accessibilityLabel="Settings"
 *     size="lg"
 *     onPress={handleSettings}
 *   />
 */

import { Icon } from "@/components/Universal/icon";
import { useTheme } from "@/context/theme.context";

import { Button } from "./button";
import { resolveButtonVisuals } from "./button.shared";
import {
  BUTTON_SEMANTIC,
  BUTTON_SHAPE,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  type IconButtonProps,
} from "./types";

export function IconButton({
  icon,               // The icon name to display
  iconSize,           // Optional override for icon dimensions
  accessibilityLabel, // REQUIRED — screen readers need this
  variant = BUTTON_VARIANT.TEXT,      // Default: transparent (just the icon)
  semantic = BUTTON_SEMANTIC.PRIMARY, // Default: brand color
  size = BUTTON_SIZE.MD,              // Default: medium
  disabled = false,
  style,
  ...buttonProps      // Pass through onPress, testID, etc.
}: IconButtonProps) {
  const { tokens } = useTheme();

  // ── Resolve visual properties ──
  // We need this to get the foreground color for the icon
  // and the size tokens for dimensions.
  // Shape is always PILL for icon buttons (fully circular).
  const visuals = resolveButtonVisuals({
    tokens: tokens.components.button,
    variant,
    semantic,
    size,
    shape: BUTTON_SHAPE.PILL,
    disabled,
    style,
  });

  // ── Force square dimensions ──
  // Icon buttons should be perfectly circular (pill shape + equal width/height).
  // Use explicit style.width or style.height if provided,
  // otherwise fall back to the size token's height (making it a square).
  const dimension = style?.width ?? style?.height ?? visuals.size.height;

  return (
    <Button
      {...buttonProps}
      variant={variant}
      semantic={semantic}
      size={size}
      shape={BUTTON_SHAPE.PILL} // Always pill (fully circular)
      disabled={disabled}
      style={{
        ...style,
        width: style?.width ?? dimension,   // Force square: width = height
        height: style?.height ?? dimension, // Force square: height = width
        padding: 0, // No padding — the icon fills the entire circle
      }}
    >
      {/* Render the icon centered inside the button */}
      <Icon
        name={icon}
        size={iconSize ?? visuals.size.iconSize} // Size from tokens or override
        color={visuals.foreground}                // Theme-aware icon color
        accessibilityLabel={accessibilityLabel}
      />
    </Button>
  );
}
