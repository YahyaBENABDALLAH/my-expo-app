# Native layout helpers

Public helpers: `nativeFillWidth`, `nativeFillWidthEnd`,
`nativeFillWidthCenter`, `nativeFillSize` and `nativeRowWeight`.

`native-fill-width.ios.ts` and `native-fill-width.android.ts` supply necessary
platform layout modifiers. `native-fill-width.ts` is their shared declaration.
`native-children.ts` privately flattens compound native children.

Use these helpers for Expo UI layout where platform modifiers differ. Keep them
small; component-specific layout helpers stay with their component. Read the
installed native APIs before changing modifier behavior.

Existing composition story: [column.stories.tsx](../../../../.rnstorybook/stories/expo-ui/column.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
