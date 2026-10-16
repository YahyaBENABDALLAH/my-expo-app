# Buttons

Exports: `UniversalButton`, `UniversalButtonContent` and their public types.

Both use native Expo UI buttons: SwiftUI on iOS and Material on Android.
`UniversalButton` owns a Host at a React Native boundary;
`UniversalButtonContent` uses its existing Host.

Keep the API small: required `variant`, `label` or `children`, `onPress`,
`disabled`, `testID`, `fullWidth`, `color`, `contentColor`, `contentPadding`,
`borderRadius` and `colorScheme`. Standalone buttons also accept `cornerRadii`.

Primary uses a native filled/prominent button, secondary uses outlined/bordered,
and link uses text/plain. Status variants use the filled style. iOS also supplies
the native destructive role. Brand themes retain native colors unless callers
pass explicit colors.

UX Template is the intentional exception: `use-wireframe-button-colors.ts` maps
the existing semantic pairs when both color props are omitted. Primary stays
black with white labels in both appearances. Links and glass stay neutral;
feedback uses the UX danger red, success green and warning amber pairs.
Disabled treatment and native geometry remain platform-owned.
Hosted content inherits its owning Host scheme; standalone controls respect
their explicit `colorScheme`. Supplying either color prop preserves the caller's
complete override behavior. `semantic-button-colors.ts` is shared with previews.
`Expo UI/Universal Button/WireframeLight` and `WireframeDark` exercise these
defaults with observable press counts, disabled suppression and reset.
`.maestro/storybook/wireframe-buttons.yaml` reuses the existing interaction flow
for both appearances. Native Android execution remains pending.

Use `variant="glass"` for a native glass button on iOS 26+, through Expo UI's
[`buttonStyle('glass')`](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/button/).
Expo UI falls back to the automatic native style on older iOS. Android uses an
outlined Material button. The same color, geometry and disabled props apply;
no additional dependency or decorative overlay is needed.

`color` and `contentColor` are optional direct overrides. Without them, brand themes
use native colors and UX Template uses its explicit semantic pairs. `UniversalButton` uses a plain Expo UI
Host with optional `colorScheme`; `UniversalButtonContent` inherits its native
Host's appearance and has no color-scheme prop. The UX mapping adds no provider,
generated palette, measurement or size calculation.

Omit `contentPadding` and `borderRadius` to retain native defaults. Zero is
supported for both. Full width uses native fill modifiers. iOS maps a supplied
radius to native button border shape and clips custom content to that shape;
Android supplies the native rounded shape and padding directly. Native feedback
and disabled behavior remain platform-owned.

For asymmetric standalone buttons, pass physical `cornerRadii` keys: `topLeft`,
`topRight`, `bottomLeft`, and `bottomRight`. Omitted corners are square, and this
option overrides `borderRadius`. The existing RN Host clips a square native button
on both platforms; SwiftUI's installed button API only exposes uniform rounding.
There is no extra Host, painted background, or custom press control. Inside an
existing Expo UI Host, `UniversalButtonContent` continues to use a uniform radius.

```tsx
<UniversalButton
  variant="primary"
  label="Continue"
  cornerRadii={{ topLeft: 24, bottomRight: 24 }}
  contentPadding={12}
  fullWidth
  onPress={onContinue}
/>
```

```tsx
<UniversalButton
  variant="primary"
  label="Continue"
  borderRadius={12}
  contentPadding={12}
  onPress={onContinue}
/>
```

Native stories: [button.stories.tsx](../../../../.rnstorybook/stories/expo-ui/button.stories.tsx).
They cover semantic variants, light/dark appearance, disabled actions, rounding,
both diagonal corner combinations and an interactive count/reset fixture. Story
callers supply the current theme's semantic colors, so changing appearance keeps
status colors and their foregrounds paired. Glass retains native colors. Use
Controls for other widths, radii and variants instead of duplicate stories.
`.maestro/storybook/button.yaml` checks counting and reset;
`button-corners.yaml` checks upper/lower edge activation on both diagonals.
Manual iOS 27 / iPhone 18 Pro checks confirmed both diagonal shapes and one
increment per upper/lower edge tap. Android appearance and the Maestro flows
remain unverified. JS adapter checks establish forwarding and disabled guards,
not native geometry.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
