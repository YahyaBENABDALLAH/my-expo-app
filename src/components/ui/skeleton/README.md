# Skeleton placeholders

Exports: `Skeleton`, `SkeletonContent` and their types through the existing
`index.ts`. `skeleton.tsx` owns presentation; `skeleton-modifiers.*` owns
native shapes; `use-skeleton-pulse.ts` shares one pulse clock for native content.

Use `Skeleton` at an RN boundary and `SkeletonContent` inside a Host.
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

`SkeletonContent` is part of its owning SwiftUI/Compose tree. Reanimated CSS cannot
target that native modifier tree directly. It retains native interpolation and
one shared 900-ms endpoint timer, avoiding an additional RN bridge and nested Host
per shape. All visible motion consumers now share native lifecycle/accessibility
subscriptions and one initial setting read.

Set `animate={false}` for a static shape that bypasses motion subscriptions;
pass focus state to pause offscreen. Reduced motion/backgrounding restore the
static appearance.

The development Home examples' static preview disappears ten seconds after mounting. That isolated
timeout stays with the Home feature and does not restart on refresh/focus.

Existing composition story: [skeleton.stories.tsx](../../../../.rnstorybook/stories/expo-ui/skeleton.stories.tsx).
`CSSAnimationControls` exercises standalone pause/resume, custom opacity and fill
width; `AnimationControls` exercises native content. Device rendering and timing
must be checked on iOS and Android.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
