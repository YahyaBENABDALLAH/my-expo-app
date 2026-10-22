---
name: foodiya-ui-skeleton
description: 'Use or maintain Foodiya skeleton shapes, semantic surfaces, native hosting and reduced-motion pulse behavior.'
---

# Skeleton placeholders

Exports: `Skeleton`, `SkeletonContent` and their types through the existing
`index.ts`. `skeleton.tsx` owns presentation; `skeleton-modifiers.*` owns
native shapes. There is no JavaScript pulse clock.

Use `Skeleton` at an RN boundary and static `SkeletonContent` inside a Host.
`SkeletonProps` includes `animate`; `SkeletonContentProps` intentionally does not.
Shapes have no children or press handlers. Keep loading/error announcements in
the owning query composition.

Supported style fields: `width`, `height`, `borderRadius`, `backgroundColor`
and `opacity`. Numeric dimensions are native points/dp. Omitted width or
`'100%'` fills a constrained parent; default height is 16. Other percentage
sizes, flex styles and style arrays are unsupported.

The default shape uses 12-point corners, neutral `border` fill and 0.72 peak
opacity. `Skeleton` animates its existing RN Host with Reanimated CSS keyframes:
900 ms per direction, alternating between peak opacity and 45% of it. The opacity
loop runs on the UI runtime without a JS timer, extra view, or periodic React renders.
The shape itself stays in Expo UI. This uses native CSS-style animation properties,
not a browser stylesheet.

`SkeletonContent` stays static in its owning SwiftUI/Compose tree. Reanimated CSS
cannot target that native modifier tree directly, and the installed Expo UI
adapters do not expose an infinite pulse on both platforms. Content allocates no
animation timers, motion subscriptions, or nested Hosts and retains the configured
opacity. Use the standalone CSS `Skeleton` where animated placeholders are needed
at an RN boundary.

For standalone `Skeleton`, set `animate={false}` to bypass motion subscriptions;
pass focus state to pause offscreen. Reduced motion/backgrounding restore its
static appearance.

The development Home examples' static preview disappears ten seconds after mounting. That isolated
timeout stays with the Home feature and does not restart on refresh/focus.

Native stories: [skeleton.stories.tsx](../../../.rnstorybook/stories/components/skeleton.stories.tsx).
`Line`, `Avatar` and `ImagePlaceholder` expose flat, circular and rectangular
placeholders using the existing dimensions/radius API. `Card` composes a static
avatar, image and text placeholders inside one Host.
`AnimationControls` exercises standalone CSS pause/resume, custom opacity and fill
width alongside static hosted content. Device rendering and timing must also be
checked on iOS and Android.

The Home recipe-card composition story uses `HomeRecipeSkeletons` for two static
cards inside its existing Host. Current product Home renders a sample catalog.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/skeleton/](../../../src/components/ui/skeleton/).
