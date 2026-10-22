---
name: foodiya-ui-native
description: Apply Foodiya native width, fill-size, row-weight, alignment and centered minimum-height modifiers across iOS and Android. Use for the public native layout helpers and their in-app showcase.
---

# Native layout helpers

Import the helpers from `@components/ui`. Follow
[Foodiya implementation](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md).
Read the [shared declarations](../../../src/components/ui/native/native-fill-width.ts)
and both [iOS](../../../src/components/ui/native/native-fill-width.ios.ts) /
[Android](../../../src/components/ui/native/native-fill-width.android.ts) adapters.

## Choose the actual constraint

| Helper                            | Purpose                                                                            |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `nativeFillWidth`                 | Fill a constrained parent's native width.                                          |
| `nativeFillWidthCenter`           | Full-width frame with centered alignment on iOS.                                   |
| `nativeFillWidthEnd`              | Full-width frame with trailing alignment on iOS.                                   |
| `nativeFillSize`                  | Fill both axes of a bounded native parent.                                         |
| `nativeRowWeight`                 | Share remaining width as a direct child of a native Row.                           |
| `nativeCenteredMinHeight(height)` | Center short content in a minimum-height area while allowing tall content to grow. |

The center/end helpers alias fill-width on Android. Supply `Column alignment`
as well when the cross-platform content must align center/end; do not assume
the helper alone changes Android child alignment.

## Compose without extra infrastructure

Use `Column`, `Row` and `Spacer` for ordinary native content. For equal actions:

```tsx
<Row spacing={spacing.md} modifiers={nativeFillWidth}>
  <Column modifiers={nativeRowWeight}>
    <UniversalButtonContent
      variant="secondary"
      label={t('common.recipes')}
      fullWidth
      onPress={onRecipes}
    />
  </Column>
  <Column modifiers={nativeRowWeight}>
    <UniversalButtonContent
      variant="secondary"
      label={t('common.favoritesOnly')}
      fullWidth
      onPress={onFavorites}
    />
  </Column>
</Row>
```

Weight belongs to the Row's direct children. Two unweighted full-width buttons
compete for the entire row. Prefer a vertical stack if large text makes the
actions crowded; do not fix text height to preserve a visual grid.

Give fill-size content a bounded parent. Do not use `nativeFillSize` to stretch
intrinsic content in an unbounded vertical scroll. Use
`nativeCenteredMinHeight(viewportHeight)` inside a bounded ScrollView when short
content should center and longer content should scroll.

These are modifier arrays, not RN styles. Pass them to supported `modifiers`
props, spread to combine intentionally, and never mutate shared arrays.
RN View geometry is reserved for real navigation, safe-area, keyboard or
specialized rendering boundaries. A Host is not an ordinary layout stack.
`native-children.ts` is a private compound-slot parser, not a screen layout API.

## Showcase

[UI showcase → Native layout](../../../src/features/ui-showcase/native-screen.tsx),
route `/ui-component/native`, shows width, equal actions, start/center/end,
fill-size and short/long minimum-height content. Check both native platforms,
especially direct Row weights, constrained fills, RTL and large text.

Checked for SDK 57 / `@expo/ui` 57.0.21:
[Column](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/column/).
Use installed modifier APIs before changing either adapter.
