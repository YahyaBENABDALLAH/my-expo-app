# Buttons

Exports: `UniversalButton`, `UniversalButtonContent` and their public types.

`universal-button.tsx` owns a Host at a React Native boundary.
Use `UniversalButtonContent` inside an existing Host. Its iOS/Android files keep
native geometry, feedback and disabled behavior; `universal-button.types.ts`
contains the shared contract and appearance mapping.

Every call requires `variant`: `primary`, `secondary`, `link`, `success`,
`warning` or `destructive`. Pending actions use `disabled`.

Content inherits its Host scheme and optional `buttonPalette`. Explicit
`colorScheme` or `palette` overrides inheritance. Theme roles supply fills and
foregrounds. `borderRadius` and `contentPadding` optionally override native
geometry for custom content; recipe cards pass zero to prevent pill clipping.
Ordinary buttons retain the defaults.

Existing composition story: [button.stories.tsx](../../../../.rnstorybook/stories/expo-ui/button.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
