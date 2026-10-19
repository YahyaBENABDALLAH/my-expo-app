# Buttons

Import `UniversalButton`, `UniversalButtonContent` and their types from
`@components/ui`. Both render native Expo UI controls. `UniversalButton` owns a
Host at a React Native boundary; use `UniversalButtonContent` inside an existing
Host. Each resolves theme colors once before passing props to the same native
renderer.

```tsx
<UniversalButton variant="primary" label="Continue" fullWidth onPress={onContinue} />
```

`variant` is required. The remaining props are optional:

| Prop                             | Behavior                                                                                                                               |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `label`, `children`              | Native content; children take priority over the label.                                                                                 |
| `onPress`, `disabled`, `testID`  | Native action, disabled state and test selector; disabled actions are suppressed.                                                      |
| `fullWidth`                      | Fills the native surface and content together.                                                                                         |
| `color`, `contentColor`          | Direct native accent and label overrides.                                                                                              |
| `borderRadius`, `contentPadding` | Independent geometry overrides; omitted values retain native defaults, and zero is supported.                                          |
| `colorScheme`                    | Standalone Host appearance. Hosted content inherits its owning Host.                                                                   |
| `cornerRadii`                    | Standalone physical corners: `topLeft`, `topRight`, `bottomLeft`, `bottomRight`. Overrides `borderRadius`; omitted corners are square. |

`primary`, `success`, `warning` and `destructive` use filled/prominent buttons.
`secondary` uses outlined/bordered and `link` uses text/plain. Destructive also
sets the native iOS role. `glass` uses
[`buttonStyle('glass')`](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/button/)
on iOS 26+, automatic native styling on older iOS, and outlined Material on Android.

Brand themes retain native colors unless callers supply overrides. UX Template
uses existing semantic token pairs when both color props are omitted: black/white
primary, neutral secondary/link/glass, and paired status colors. Supplying either
color prop skips those defaults. Hosted content follows `useHostColorScheme`;
standalone controls use their explicit scheme. `semantic-button-colors.ts` shares
the token mapping with previews. Native controls own feedback and disabled styling.

Platform adapters are needed because the installed universal Expo Button lacks
native color, content-padding, shape and destructive-role props. iOS uses native
button-border rounding plus content clipping; Android passes shape and padding
directly. Asymmetric corners clip the existing standalone Host around a square
native button, without adding a surface or Host.

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

[Native stories](../../../../.rnstorybook/stories/expo-ui/button.stories.tsx)
cover variants, appearance, disabled actions, rounding, diagonal corners and
observable press counts. Controls expose width, radius, padding and colors.
UX stories exercise component defaults; other theme previews pass semantic pairs
unless the caller overrides either color. Glass previews keep native defaults.

`tests/layout/universal-button.test.mjs` checks props, colors, disabled guards and
geometry forwarding for both adapters. Maestro flows in `.maestro/storybook/`
cover count/reset (`button.yaml`), UX light/dark (`wireframe-buttons.yaml`),
diagonal edge taps (`button-corners.yaml`) and native/rounded/square surfaces
(`button-geometry.yaml`). The geometry flow defaults to light; select dark with
`-e GEOMETRY_STORY=expo-ui-universal-button--geometry-dark`.

Before this refactor, geometry light/dark passed on physical Android 13 on
2026-10-19; manual iOS 27 checks covered both diagonal shapes and edge activation.
These historical checks do not verify the current refactor. Rerun native flows
on both platforms; JS checks cannot establish touch geometry or visual behavior.

[Back to the UI guide](../README.md).
