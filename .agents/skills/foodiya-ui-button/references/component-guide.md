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

`primary`, `success`, `warning`, `info` and `destructive` use filled/prominent buttons.
`secondary` uses outlined/bordered; `tertiary` and `link` use text/plain.
Tertiary uses the shared muted foreground when semantic colors are applied;
link uses the theme tint. Info uses the existing info/onInfo token pair. Destructive also
sets the native iOS role. `glass` uses
[`buttonStyle('glass')`](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/button/)
on iOS 26+, automatic native styling on older iOS, and outlined Material on Android.

All themes use their existing semantic token pairs when both color props are
omitted: primary/onPrimary, secondary, muted tertiary, tint for links, paired
status colors, and surfaceVariant/text for glass. This prevents secondary and
status actions from inheriting the Host's primary accent. UX Template retains
its black/white primary in both appearances. Supplying either color prop skips
those defaults. Hosted content follows `useHostColorScheme`;
standalone controls use their explicit scheme. Both public controls and their
types live in `universal-button.tsx`, alongside their private color resolver.
Native controls own feedback and disabled styling.

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

[Native stories](../../../../.rnstorybook/stories/components/button.stories.tsx)
cover variants, appearance, disabled actions, rounding, diagonal corners and
observable press counts. Controls expose width, radius, padding and colors.
All button stories exercise component defaults without injecting a preview-only
palette. `SemanticVariantsLight` and `SemanticVariantsDark` compare all nine
variants under the selected theme, with disabled actions and observable counts.

Automated button suites have been removed. Use the native stories to check
count/reset, light/dark appearance, disabled actions, diagonal edge taps and
native/rounded/square surfaces. Existing test IDs are retained for future tests.

Before this refactor, geometry light/dark passed on physical Android 13 on
2026-10-19; manual iOS 27 checks covered both diagonal shapes and edge activation.
These historical checks do not verify the current refactor. Repeat manual checks
on both platforms for touch geometry and visual behavior.

[Back to the UI guide](../../../../docs/ui.md).
