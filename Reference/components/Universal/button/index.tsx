/**
 * Barrel export for the Universal Button component.
 *
 * This file is the public API for the button module.
 * Other parts of the app import from "@/components/Universal/button".
 */

// Re-export all types and const enums
// (ButtonVariant, ButtonSemantic, ButtonSize, ButtonShape, ButtonProps, IconButtonProps)
export * from "./types";

// The main Button component — supports filled, outlined, and text variants
// with design-system sizing, semantic colors, shapes, loading, and fullWidth.
export { Button } from "./button";

// A convenience wrapper for icon-only buttons — renders a Button with
// pill shape, square dimensions, and a centered Icon inside.
export { IconButton } from "./icon-button";
