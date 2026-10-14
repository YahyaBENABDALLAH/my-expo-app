# Buttons

Exports: `UniversalButton`, `UniversalButtonContent` and their public types.

Both use native Expo UI buttons: SwiftUI on iOS and Material on Android.
`UniversalButton` owns a Host at a React Native boundary;
`UniversalButtonContent` uses its existing Host.

Keep the API small: required `variant`, `label` or `children`, `onPress`,
`disabled`, `testID`, `fullWidth`, `color`, `contentColor`, `contentPadding`,
`borderRadius` and `colorScheme`.

Buttons do not import theme hooks or look up tokens. Primary uses a native
filled/prominent button, secondary uses outlined/bordered, and link uses
text/plain. Status variants use the filled style; their callers pass the desired
status colors explicitly. iOS also supplies the native destructive role.

Use `variant="glass"` for a native glass button on iOS 26+, through Expo UI's
[`buttonStyle('glass')`](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/button/).
Expo UI falls back to the automatic native style on older iOS. Android uses an
outlined Material button. The same color, geometry and disabled props apply;
no additional dependency or decorative overlay is needed.

`color` and `contentColor` are optional direct overrides. Without them, the native
control chooses its colors and contrast. `UniversalButton` uses a plain Expo UI
Host with optional `colorScheme`; `UniversalButtonContent` inherits its native
Host's appearance and has no color-scheme prop or React theme context bridge.
There is no button color helper, lookup table, palette context, generated color,
measurement or size calculation.

Omit `contentPadding` and `borderRadius` to retain native defaults. Zero is
supported for both. Full width uses native fill modifiers. iOS maps a supplied
radius to native button border shape and clips custom content to that shape;
Android supplies the native rounded shape and padding directly. Native feedback
and disabled behavior remain platform-owned.

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
They cover variants, themes, direct colors, padding, radius and observable enabled/
disabled actions. `.maestro/storybook/button.yaml` checks counting and reset.
Glass, GlassDark, GlassDisabled, GlassFullWidth and GlassInteraction cover the new
variant. Run the same flow with `-e BUTTON_STORY_ID=expo-ui-universal-button--glass-interaction`
to exercise enabled/disabled glass actions. Native glass appearance and press
bounds still require device verification; no simulator was booted for this change.
JS adapter checks use mocked native controls and do not prove native geometry.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
