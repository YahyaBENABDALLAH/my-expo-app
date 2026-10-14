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

```tsx
<UniversalButton variant="primary" label="Continue" borderRadius={12} onPress={onContinue} />
```

Use `borderRadius={0}` for square corners; omit it for the platform's default
shape. The same prop works on `UniversalButtonContent`. Values are points on
iOS and dp on Android.

On iOS, `buttonBorderShape('roundedRectangle', borderRadius)` sets the shape
SwiftUI draws. `clipShape` only masks the rendered result: it cannot replace an
existing capsule surface with less-rounded corners. Filled variants therefore
use `borderedProminent`, secondary uses `bordered`, and links use `plain`.
The optional clip also rounds custom label content; link buttons have no filled
surface to round. No shape or padding modifier is applied when its prop is omitted.
See [Expo's button shape API](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/modifiers/#buttonbordershapeshape-cornerradius).

Native adapter selection keeps secondary buttons outlined/bordered, links
text/plain, and other variants filled/prominent. The selection uses separate
decisions without changing native button types or modifier order.

Appearance selects palette roles from a fixed variant table. Optional primary,
secondary and foreground roles retain their existing tint/background fallbacks;
`tests/layout/universal-button.test.mjs` verifies native adapter props and actions.

Existing composition story: [button.stories.tsx](../../../../.rnstorybook/stories/expo-ui/button.stories.tsx).
`CustomRadius` exposes the numeric radius control, `Square` covers zero, and
`Interaction` exercises enabled/disabled custom-radius buttons.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
