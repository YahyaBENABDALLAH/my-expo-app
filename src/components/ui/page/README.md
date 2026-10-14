# Page layout and motion

Exports: `PageScreen`, `PageFrame`, `PageHeader` and `PageMotionOverlay`.

`page-screen.tsx` composes scrolling content and actions.
`page-frame.tsx` handles the header's safe area and leaves other edges to content.
Its optional `headerOverlay` floats the transparent header above full-height content,
as used by Cartes. Overlay content retains the top device inset for native map controls;
a title-only overlay ignores touches so map gestures work beneath the header.
Its adjusted safe-area context keeps a stable identity until content insets change,
so unrelated parent updates do not notify every inset consumer.
`tests/layout/render-stability.test.mjs` checks this and real inset propagation.
`page-header.tsx` uses the private `page-back-button.*` adapters.
The existing title layout is preserved. iOS adds only 4 points of vertical
header padding; Android retains 8. The status-bar inset is applied once by
`PageFrame`, while the header Host ignores automatic native safe areas.
`page-motion-overlay.tsx` contains the shared animated top-edge wave artwork.
Its two fixed SVG paths are parsed once into immutable Skia objects and reused
by every drawing instance. Animation updates transforms, with no path parsing
or React state update per frame.
Its default `overlay` variant decorates headers; `variant="splash"` places the
same moving paths in normal flow with opaque fills for the launch screen's bottom
edge. Both use the exported `PAGE_WAVE_HEIGHT` and the same motion guards.
The back wave resolves theme opacity first; the splash keeps full opacity.
The root mounts it above navigation, alongside `AuroraBackground` behind navigation
as the default background.
The production root enables both layers on Android and iOS after the launch screen
exits. Android's full-screen aurora uses 30 updates per second; the small header
wave retains its smooth transform animation. Both retain their activity and
reduced-motion guards.
Frames, headers and page content are transparent so they reveal that shared
canvas; native cards and controls keep their usual semantic surfaces.

Theme controls live in App Settings, with no preference footer on page shells.
Keep system insets outside keyboard padding and preserve the existing tab-bar
inset ownership.

Page actions accept stable `testID` values independent of translated labels.
Motion follows focus/activity/reduced-motion guards and ignores touches.
See [shared motion](../../../../docs/shared-skia-motion.md).

Existing composition story: [page-screen.stories.tsx](../../../../.rnstorybook/stories/pages/page-screen.stories.tsx),
including `TransparentHeader` for the overlay with a simulated notch.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
