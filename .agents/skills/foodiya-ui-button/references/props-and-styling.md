# Button props and styling

Read this reference for exact props, color behavior, geometry, or troubleshooting.
The canonical contract is
[universal-button.tsx](../../../../src/components/ui/button/universal-button.tsx).

## Public props

| Prop             | Both public buttons                         | Meaning                                                             |
| ---------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| `variant`        | Required `UniversalButtonVariant`           | Explicit intent; see the skill's nine-variant table                 |
| `label`          | Optional string                             | Native text fallback when `children` is nullish                     |
| `children`       | Optional ReactNode                          | Replaces `label`; use compatible native elements for custom content |
| `onPress`        | Optional `() => void`                       | Consumer callback; the adapters suppress it when disabled           |
| `disabled`       | Optional boolean                            | Native disabled state; omitted means enabled                        |
| `fullWidth`      | Optional boolean                            | Expand the button within its parent's available width               |
| `testID`         | Optional string                             | Stable selector on the native action                                |
| `color`          | Optional string                             | Native accent; not always a background color                        |
| `contentColor`   | Optional string                             | Native label/content foreground override                            |
| `borderRadius`   | Optional number                             | Uniform native corner radius; `0` means square                      |
| `contentPadding` | Optional number                             | All-side native label padding; `0` is valid                         |
| `colorScheme`    | **Standalone only**, `'light'` or `'dark'`  | Configures `UniversalButton`'s Host and theme resolution            |
| `cornerRadii`    | **Standalone only**, physical corner object | Clips the existing Host; overrides `borderRadius`                   |

`cornerRadii` accepts `topLeft`, `topRight`, `bottomLeft`, and `bottomRight`.
Omitted corners become square, not the native default. These are physical corners
and do not swap with RTL. Inside an existing Host, use uniform `borderRadius`;
do not add a nested Host just to get asymmetric corners.

Both `borderRadius` and `contentPadding` can be overridden independently. Omit
them to retain native defaults; do not replace valid zero values with truthy
fallbacks. A card may deliberately use `contentPadding={0}`; an ordinary button
should keep native touch geometry unless a requested design needs a change.

The project buttons do not expose `style`, `modifiers`, `size`, `rounded`, `icon`,
`leftIcon`, `rightIcon`, `loading`, `pending`, `href`, `accessibilityLabel`,
`onClick`, or `enabled`. Layout goes on the appropriate parent; icons go in
native children; navigation and pending state belong to the consumer. Do not
spread arbitrary upstream Button or RN Pressable props into these wrappers.

## Colors and native differences

The [shared button implementation](../../../../src/components/ui/button/universal-button.tsx)
owns the semantic mapping and private `useButtonColors` resolver. Every theme
maps primary to primary/onPrimary, secondary to
secondary, tertiary to muted, link to tint, success/warning/info to their paired
status tokens, destructive to error/onError, and glass to surfaceVariant/text.
These pairs apply automatically unless a caller supplies color overrides.

Supplying either `color` or `contentColor` skips automatic semantic pairs entirely.
Supply a coherent pair from existing semantic tokens when a specific foreground
and accent are required. Do not assume setting only one preserves the other
default. Status hues come from the active theme rather than fixed color names.

On iOS, `color` is a tint; `contentColor` becomes the label foreground. For plain
or bordered buttons, `color` also supplies the label foreground when no explicit
content color is provided. On Android, `color` is the container color for filled
buttons and a content-color fallback for outlined/text buttons. It does not
expose an Android outline-color override. Native controls own pressed and
disabled treatments. Custom-colored children can override inherited label color.

`UniversalButton` owns a raw Expo `Host`, not `UniversalHost`. It forwards its
explicit `colorScheme`, sets intrinsic/full-width sizing, and resolves semantic colors
once. It does not independently provide the project's Host React contexts or
explicit layout-direction/seed-color props. For a group requiring shared app
scheme, tint, and live direction, prefer `UniversalHost` with content buttons;
do not infer identical theming solely from the word "universal".

`UniversalButtonContent` inherits the nearest project's Host scheme. Put a forced
scheme on the owning `UniversalHost`, not on the content button. A raw native
Host's native appearance does not itself update `useHostColorScheme`'s React
context. Keep deterministic stories within the project's themed owner.

## Diagnose common problems

| Symptom                                      | Check                                                                                                            |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Button missing, overlapping, or wrong height | Immediate native/RN boundary, Host sizing, and an actual native Row/Column for siblings                          |
| Full width does not fill the intended area   | Constrained parent width, `nativeFillWidth`, and weights when placed in a Row                                    |
| Text disappears on a filled background       | Inherited foreground versus custom text's explicit theme color; coherent color pair                              |
| Dark preview has light semantic colors       | Owning `UniversalHost` context versus a raw Host override                                                        |
| Label is absent when an icon is added        | Children replace `label`; render an explicit native Text child                                                   |
| Disabled action still runs elsewhere         | Do not invoke the consumer callback through a sibling/parent press handler; preserve the workflow's submit guard |
| Requested prop is rejected by TypeScript     | Check the project prop table, not the upstream Button API                                                        |

## Official references

Checked for the installed SDK 57. Read version-matching docs again when native
usage or dependencies change:

- [Universal Button](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/button/)
  for the upstream contract; its variants differ from the project API.
- [Universal Host](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/)
  for RN/native boundaries and sizing.
- [SwiftUI Button](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/button/)
  and [Compose Button](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/button/)
  for adapter behavior.
- [Universal Icon](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/icon/)
  for platform icon sources.
