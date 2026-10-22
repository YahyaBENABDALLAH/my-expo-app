---
name: foodiya-ui-skeleton
description: Compose or maintain Foodiya SkeletonContent static native placeholders and hosted Skeleton pulses, supported shapes, reduced motion and focus handling. Use for loading placeholder composition and the in-app showcase.
---

# Skeleton

Import `Skeleton`, `SkeletonContent` and their public types from
`@components/ui`. Follow [Foodiya implementation](../foodiya-implementation/SKILL.md)
and [mobile UI requirements](../expo-mobile-ui-only/SKILL.md).
Read the [implementation/types](../../../src/components/ui/skeleton/skeleton.tsx)
and [native shape adapters](../../../src/components/ui/skeleton/).

## Choose the boundary and motion

| Component         | Ownership and behavior                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `SkeletonContent` | Static shape inside an existing native Host. No timers, motion subscriptions or nested Host. |
| `Skeleton`        | Standalone RN boundary with its own Host; pulses by default.                                 |

Both support `style`, `colorScheme` and `testID`. Only `Skeleton` supports
`animate`; do not pass it to SkeletonContent. Shapes have no children or press
handlers. Do not replace an ordinary native placeholder with an RN bridge
merely to animate it.

```tsx
<Row spacing={spacing.md} modifiers={nativeFillWidth}>
  <SkeletonContent style={{ width: 48, height: 48, borderRadius: radii.pill }} />
  <Column spacing={spacing.sm} modifiers={nativeRowWeight}>
    <SkeletonContent style={{ height: 20 }} />
    <SkeletonContent style={{ width: 120, height: 12 }} />
  </Column>
</Row>
```

## Supported shape style

The flat `SkeletonStyle` accepts only `width`, `height`, `borderRadius`,
`backgroundColor` and `opacity`. Numeric dimensions are points/dp.
Omitted width or `'100%'` fills a constrained parent; default height is 16.
Other percentage sizes, flex styles, style arrays and arbitrary RN styles
are unsupported. Use finite nonnegative geometry and opacity from 0 to 1.

Defaults use the shared control radius, theme `border` fill and 0.72 opacity.
Override fill only with an intentional shared theme color. Full width needs
a real parent constraint; fixed artwork and text rails should use useful
dimensions rather than measurement state.

## Motion and loading ownership

Standalone Skeleton animates its existing RN Host with Reanimated native
CSS-style keyframes: 900 ms per direction, alternating to 45% opacity.
This is not a browser stylesheet or JS interval. The native shape remains
Expo UI content.

Use `animate={false}` for a static standalone shape; pass route focus state
when pausing an offscreen screen is needed. The shared motion hook also stops
the pulse for reduced motion and background activity. Do not add another pulse
clock, view layer or timer. SkeletonContent intentionally remains static.

Keep loading announcements and query states in the
[loading composition](../foodiya-ui-loading/SKILL.md). Skeletons do not express
failure, successful empty results or a disabled/paused query. Preserve usable
cached content during background refresh. Do not add artificial loading delays.

## Showcase

[UI showcase → Skeleton](../../../src/features/ui-showcase/skeleton-screen.tsx),
route `/ui-component/skeleton`, covers line/avatar/image shapes, a static card,
a content toggle and animated/static hosted previews. The toggle is local;
there is no fake fetch or timeout.

Check bounds, native colors, hidden decorative accessibility nodes, reduced
motion, app background/resume and route focus on iOS/Android. A visible
placeholder or static type check does not establish pulse timing on device.
