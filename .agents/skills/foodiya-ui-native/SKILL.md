---
name: foodiya-ui-native
description: 'Apply Foodiya native width, size, row-weight and minimum-height layout modifiers across iOS and Android.'
---

# Native layout helpers

Public helpers: `nativeFillWidth`, `nativeFillWidthEnd`,
`nativeFillWidthCenter`, `nativeFillSize` and `nativeRowWeight`.

`native-fill-width.ios.ts` and `native-fill-width.android.ts` supply necessary
platform layout modifiers. `native-fill-width.ts` is their shared declaration.
`native-children.ts` privately flattens compound native children.

Use these helpers for Expo UI layout where platform modifiers differ. Keep them
small; component-specific layout helpers stay with their component. Read the
installed native APIs before changing modifier behavior.

Existing composition story: [column.stories.tsx](../../../.rnstorybook/stories/components/column.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/native/](../../../src/components/ui/native/).
