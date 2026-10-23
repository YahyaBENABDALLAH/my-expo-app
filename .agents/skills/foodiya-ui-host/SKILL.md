---
name: foodiya-ui-host
description: Choose and maintain Foodiya UniversalHost boundaries, intrinsic or viewport sizing, inherited theme and live layout direction. Use for RN/native ownership and the Host showcase, not ordinary Row/Column layout.
---

# UniversalHost

Use `UniversalHost` from `@components/ui` where React Native enters a native
Expo UI tree. Follow [Foodiya implementation](../foodiya-implementation/SKILL.md)
and [mobile UI requirements](../expo-mobile-ui-only/SKILL.md).
Read the [implementation](../../../src/components/ui/host/universal-host.tsx)
before changing its sizing or provider behavior.

## Choose the boundary

`PageScreen` and `AuthScreenFrame` already host ordinary native content.
Use `Column`/`Row` for their children; a Host provides ownership, not sibling
layout. Direct sibling controls in a Host can overlap. Avoid nested Hosts for
ordinary text, buttons or fields.

Entering an [RNHostView](../foodiya-ui-rn-host-view/SKILL.md) subtree returns to RN.
A native group inside it needs one UniversalHost, or a standalone hosted control.
The [showcase bridge](../../../src/features/ui-showcase/hosted-preview.tsx)
exists specifically to demonstrate these real boundaries with an explicit width.
Do not add bridges to ordinary native layout.

Standalone `UniversalButton` reuses this owner at its RN boundary, with inline
sizing for intrinsic width. A content button still adds no Host. Follow the
[button contract](../foodiya-ui-button/SKILL.md) for its per-axis sizing, physical
corner clipping and custom-child examples; do not add a second Host around it.

## Sizing defaults

| Configuration             | Default matchContents | Geometry                                               |
| ------------------------- | --------------------- | ------------------------------------------------------ |
| Ordinary Host             | `{ vertical: true }`  | Full available width, intrinsic native height.         |
| `inline`                  | `true`                | Intrinsic on both axes; no automatic full-width style. |
| `viewportHeight={height}` | `false`               | Full width and an explicit RN viewport height.         |
| Explicit `matchContents`  | Supplied value        | Overrides the defaults above.                          |

Viewport sizing takes priority over inline sizing when both are provided.
`inline` is a sizing flag, not CSS display or native sibling arrangement.
A fill Host needs real parent dimensions. Do not expect an unconstrained
`matchContents={false}` Host to infer a screen height or use a full-height
native child in an intrinsic vertical scroll measurement.

```tsx
<UniversalHost matchContents={false} style={{ flex: 1 }}>
  <Column modifiers={nativeFillSize}>
    <UniversalTextContent>{t('showcase.gallery.bounded')}</UniversalTextContent>
  </Column>
</UniversalHost>
```

This example belongs at an RN boundary with a bounded parent. Consumer `style`
is applied after derived sizing, so intentional width/height overrides can win.
The public ref addresses the RN Host view, not a native field or sheet.

## Theme and direction

- `colorScheme` and `layoutDirection` override inherited project context;
  omitted values inherit the nearest project Host, then app preferences.
- `useHostColorScheme` and `useHostLayoutDirection` read those resolved values.
  Read them in a descendant when inspecting a newly created Host's overrides;
  a hook in the component returning that Host still sees its parent context.
- `seedColor` defaults to the selected theme's tint. It seeds native control
  colors; it does not replace the whole semantic project palette.
- `UniversalThemeProps` is a shared type, not another provider.
- Preserve state during theme/direction changes. Use the live providers rather
  than reloads or global I18nManager changes. Pass direction through the Host
  prop instead of conflicting RN style direction overrides.
- `ignoreSafeArea` is an infrastructure choice. Reuse the owning page's inset
  handling rather than adding it indiscriminately.

## Showcase

[UI showcase → Host](../../../src/features/ui-showcase/host-screen.tsx), route
`/ui-component/host`, compares inherited, bounded and inline sizing, with local
theme/direction overrides and working counters. Check real bounds, retained
state, touch activation, scrolling and RTL on native devices. Context values
alone do not prove native rendering.

Checked for SDK 57 / `@expo/ui` 57.0.21:
[Host](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/).
