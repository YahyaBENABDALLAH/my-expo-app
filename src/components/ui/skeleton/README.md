# Skeleton placeholders

Exports: `Skeleton`, `SkeletonContent` and their types through the existing
`index.ts`. `skeleton.tsx` owns presentation; `skeleton-modifiers.*` owns
native shapes; `use-skeleton-pulse.ts` shares one pulse clock.

Use `Skeleton` at an RN boundary and `SkeletonContent` inside a Host.
Shapes have no children or press handlers. Keep loading/error announcements in
the owning query composition.

Supported style fields: `width`, `height`, `borderRadius`, `backgroundColor`
and `opacity`. Numeric dimensions are native points/dp. Omitted width or
`'100%'` fills a constrained parent; default height is 16. Other percentage
sizes, flex styles and style arrays are unsupported.

The default shape uses 12-point corners, neutral `border` fill and 0.72 peak
opacity. Native interpolation alternates between peak opacity and 45% of it,
with 900-ms fades and one shared timer. There are no per-frame React updates.
Set `animate={false}` for a static shape that bypasses motion subscriptions;
pass focus state to pause offscreen. Reduced motion/backgrounding restore the
static appearance.

Home's static preview disappears ten seconds after mounting. That isolated
timeout stays with the Home feature and does not restart on refresh/focus.

Existing composition story: [skeleton.stories.tsx](../../../../.rnstorybook/stories/expo-ui/skeleton.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
