/**
 * Barrel export for the Universal Text component.
 *
 * This file acts as the public API for the text module.
 * Other parts of the app import from "@/components/Universal/text"
 * and this file decides exactly what is exposed.
 */

// Re-export every type and constant from types.ts
// (TextVariant, TextSemantic, TextFont, TextWeight, TextProps, etc.)
export * from "./types";

// Re-export the Text component and the TextStyleContext.
// - Text: the main component used to render text throughout the app.
// - TextStyleContext: a React context that lets parent components
//   (like Surface, Badge, Dialog) cascade text color/font into children.
export { Text, TextStyleContext } from "./text";
