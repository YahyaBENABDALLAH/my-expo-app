/**
 * Universal Text component.
 *
 * This is the main file — it brings everything together:
 *   1. Takes our friendly props (variant, semantic, font, weight)
 *   2. Resolves them into actual styles using text-styles.ts
 *   3. Splits the combined `style` prop into text + container parts
 *   4. Renders the native Expo UI Text inside a Host (if needed)
 *   5. Provides a TextStyleContext for style cascading
 *
 * WHY THIS EXISTS (vs using @expo/ui Text directly):
 *   - Expo's Text requires you to manually compute colors, fonts, sizes
 *   - Expo's Text requires you to always wrap in <Host>
 *   - Expo's Text has no design-system awareness (no variants, no semantic colors)
 *   - This wrapper adds all of that with zero runtime overhead
 */

import { WithinHostContext } from "@/components/Universal/host-context";
import { Host } from "@/components/Universal/host";
import { useTheme } from "@/context/theme.context";
import type { UniversalStyle, UniversalTextStyle } from "@expo/ui";
import { Text as ExpoText } from "@expo/ui";
import {
  createContext,
  useContext,
  type ComponentProps,
  type ComponentType,
} from "react";

import { resolveTextColor, resolveTextStyle } from "./text-styles";
import {
  TEXT_VARIANT,
  type TextProps,
  type TextStyle,
  type TextStyleProp,
} from "./types";

// ─────────────────────────────────────────────────────────────
// TEXT STYLE CONTEXT
//
// This React context lets parent components inject text styles
// into all child Text components without passing props manually.
//
// Example: <Surface> sets foreground color via this context,
// and all <Text> inside it automatically pick up that color.
//
// Components that USE this context:
//   - Surface (sets foreground color)
//   - Badge (sets badge text color)
//   - Dialog (sets dialog text color)
//   - Popover (sets popover text color)
//   - Select (sets dropdown text color)
//   - Icon (inherits color from parent Text context)
// ─────────────────────────────────────────────────────────────
const TextStyleContext = createContext<UniversalTextStyle | undefined>(
  undefined,
);

// ─────────────────────────────────────────────────────────────
// STYLE SPLITTING
//
// Our TextProps accepts a single `style` prop with BOTH text keys
// (color, fontSize) AND layout keys (padding, backgroundColor).
// But Expo's native Text component needs them in two separate props:
//   - textStyle: typography (color, fontSize, fontWeight, etc.)
//   - style: layout/container (padding, backgroundColor, etc.)
//
// This Set lists all the keys that belong to textStyle.
// Everything else goes into containerStyle.
// ─────────────────────────────────────────────────────────────
const TEXT_STYLE_KEYS = new Set<keyof UniversalTextStyle>([
  "color",
  "fontSize",
  "fontWeight",
  "fontFamily",
  "lineHeight",
  "letterSpacing",
  "textAlign",
]);

const EMPTY_SPLIT_STYLE = {
  textStyle: {} as UniversalTextStyle,
  containerStyle: {} as UniversalStyle,
};

// ─────────────────────────────────────────────────────────────
// TYPE NARROWING for Expo's Text component.
//
// Expo's Text types `children` as ReactNode (allows JSX, arrays, etc.)
// but the native implementation only supports plain strings.
// We create a narrower type that restricts children to `string`
// so TypeScript catches invalid usage at compile time.
//
// Without this:  <ExpoText><View /></ExpoText>  → compiles but CRASHES
// With this:     <NativeText><View /></NativeText> → TypeScript ERROR ✓
// ─────────────────────────────────────────────────────────────
type ExpoTextProps = Omit<ComponentProps<typeof ExpoText>, "children"> & {
  children?: string;
};

/** Type-safe alias for Expo's Text that only accepts string children. */
const NativeText = ExpoText as ComponentType<ExpoTextProps>;

/**
 * Split a combined TextStyle into two separate objects:
 * one for text-specific properties, one for container/layout properties.
 *
 * @param style - The combined style (may contain both text and layout keys)
 * @returns An object with { textStyle, containerStyle }
 *
 * Example:
 *   splitStyle({ color: "red", fontSize: 16, padding: 8, backgroundColor: "#FFF" })
 *   // → {
 *   //     textStyle: { color: "red", fontSize: 16 },
 *   //     containerStyle: { padding: 8, backgroundColor: "#FFF" }
 *   //   }
 */
function splitStyle(style: TextStyleProp | undefined) {
  if (!style || (Array.isArray(style) && style.length === 0)) {
    return EMPTY_SPLIT_STYLE;
  }

  // Start with empty objects for each category
  const textStyle: Record<string, unknown> = {};
  const containerStyle: Record<string, unknown> = {};
  const flattenedStyle = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style;

  // Loop over every key in the style object
  for (const key in flattenedStyle) {
    // Check if this key belongs to text styles using our Set (O(1) lookup)
    const target = TEXT_STYLE_KEYS.has(key as keyof UniversalTextStyle)
      ? textStyle      // It's a text key (color, fontSize, etc.) → goes to textStyle
      : containerStyle; // It's a layout key (padding, etc.) → goes to containerStyle
    target[key] = flattenedStyle[key as keyof TextStyle];
  }

  return {
    textStyle: textStyle as UniversalTextStyle,
    containerStyle: containerStyle as UniversalStyle,
  };
}

/**
 * Universal Text component.
 *
 * A design-system wrapper around @expo/ui's Text that adds:
 * - Variant-based typography (h1, body, caption, etc.)
 * - Semantic colors (muted, destructive, primary, etc.)
 * - Font family and weight aliases
 * - Automatic Host wrapping with RTL support
 * - Style cascading via TextStyleContext
 *
 * @example
 *   // Simple usage — body text with default color
 *   <Text>Hello world</Text>
 *
 *   // Heading with destructive color
 *   <Text variant="h1" semantic="destructive">Error!</Text>
 *
 *   // Custom font and weight
 *   <Text font="mono" weight="bold">const x = 42;</Text>
 */
function Text({
  children,
  font,
  style,
  semantic,
  weight,
  variant = TEXT_VARIANT.BODY, // Default to "body" if no variant specified
  ...props // All other Expo TextInput props (numberOfLines, onPress, etc.)
}: TextProps) {
  // ── Step 1: Get the current theme tokens ──
  // tokens contains all colors, spacing, typography values for the current
  // light/dark mode. We need it for semantic color resolution.
  const { tokens } = useTheme();

  // ── Step 2: Check for inherited styles from parent components ──
  // If this Text is inside a <Surface>, <Badge>, or similar component
  // that provides a TextStyleContext, we'll inherit its styles (usually color).
  const inheritedStyle = useContext(TextStyleContext);

  // ── Step 3: Check if we're already inside a Host ──
  // Expo UI components must be inside a <Host> to render.
  // If we're already inside one (e.g., the parent already added it),
  // we don't need to wrap again.
  const withinHost = useContext(WithinHostContext);

  // ── Step 4: Split the combined style prop ──
  // The user passes one `style` object, but Expo needs text styles
  // and container styles separately.
  const { textStyle: styleText, containerStyle } = splitStyle(style);

  const semanticColor = resolveTextColor(
    tokens.components.text.color,
    semantic,
  );

  // ── Step 5: Merge all text styles in priority order ──
  // Lower items override higher items (last spread wins):
  //   1. Theme default color
  //   2. Variant + font + weight resolution (typography from design system)
  //   3. Inherited context styles (from parent Surface/Badge/etc.)
  //   4. Explicit semantic color (only when requested)
  //   5. User's combined `style` prop (highest priority)
  const mergedTextStyle: UniversalTextStyle = {
    color: semanticColor,
    ...resolveTextStyle({ font, variant, weight }),
    ...inheritedStyle,
    ...(semantic ? { color: semanticColor } : {}),
    ...styleText,
  };

  // ── Step 6: Render the native text node ──
  const textNode = (
    <NativeText
      textStyle={mergedTextStyle}   // Typography styles (color, font, size, etc.)
      style={containerStyle}         // Layout styles (padding, background, etc.)
      {...props}                     // Pass through all other props (numberOfLines, etc.)
    >
      {children}
    </NativeText>
  );

  // ── Step 7: Wrap in Host if needed ──
  // If we're already inside a Host (withinHost === true),
  // just return the text node directly — no double-wrapping.
  if (withinHost) {
    return textNode;
  }

  // Otherwise, wrap in a Host with:
  // - layoutDirection: respects RTL (right-to-left) languages like Arabic
  // - matchContents: Host shrinks to fit the text content
  return (
    <Host matchContents>
      {textNode}
    </Host>
  );
}

export { Text, TextStyleContext };
