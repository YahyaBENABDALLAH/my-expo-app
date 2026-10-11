# Page layout and motion

Exports: `PageScreen`, `PageFrame`, `PageHeader` and `PageMotionOverlay`.

`page-screen.tsx` composes scrolling content and actions.
`headerAccessory` accepts standalone hosted UI above the scroll view and inside
keyboard protection. Home and Search pin their matching SearchField there, so
scrolling and descriptions cannot move the search entry between screens.
`headerAction` is a labelled native link control beside the title, used for Search's
Cancel action. Headers use the same 24-point side inset as content and a 48-point
minimum row without fixing the maximum text height. Descriptions use subdued
14-point text to keep the main content prominent. `search-field.stories.tsx`
exercises both slots and the Home/Search transition.
`page-frame.tsx` handles the header's safe area and leaves other edges to content.
Its adjusted safe-area context keeps a stable identity until bottom/left/right
insets change, so unrelated parent updates do not notify every inset consumer.
`tests/layout/render-stability.test.mjs` checks this and real inset propagation.
`page-header.tsx` uses the private `page-back-button.*` adapters.
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
Frames, headers and page content are transparent so they reveal that shared
canvas; native cards and controls keep their usual semantic surfaces.

Theme controls live in App Settings, with no preference footer on page shells.
Keep system insets outside keyboard padding and preserve the existing tab-bar
inset ownership.

Page actions accept stable `testID` values independent of translated labels.
Motion follows focus/activity/reduced-motion guards and ignores touches.
See [shared motion](../../../../docs/shared-skia-motion.md).

Existing composition story: [page-screen.stories.tsx](../../../../.rnstorybook/stories/pages/page-screen.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
