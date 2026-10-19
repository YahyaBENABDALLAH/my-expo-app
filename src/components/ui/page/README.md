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
Its two SVG paths are cached for the window height. Animation updates transforms,
with no path parsing or React state update per frame.
Its default `overlay` variant decorates headers; `variant="splash"` places the
same moving paths in normal flow with opaque fills for the launch screen's bottom
edge. Both use the exported `PAGE_WAVE_HEIGHT` and the same motion guards.
The back wave resolves theme opacity first; the splash keeps full opacity.
The wave drifts on a 10-second cycle. Header layers share the theme's tint with
a gentle 20% gradient fade for a more consistent color across the filled area.
`expanded` positions the wave at 35% of the window height and fills its background
continuously to the top. Login uses it while signed out. Successful login raises
the wave to the header over one second. Opening Register and returning to Login
use the same slower transition. `onCollapseComplete` releases navigation only
after a completed rise, so Home cannot interrupt the successful-login animation.
Reduced motion snaps to the destination and releases navigation immediately;
the splash keeps its usual position. `Pages/Shared Skia motion/Login` previews
the transition with a repeatable button.
The root mounts it above navigation and enables it on Android and iOS after the
launch screen exits. It retains its activity and reduced-motion guards.
Navigation themes, stack content and tab scenes use the active theme's opaque
`background` token so outgoing text cannot show through an incoming screen.
Frames, headers and page content reveal their owning scene's background;
native cards and controls keep their usual semantic surfaces. The full-screen
aurora remains in the launch screen and dedicated previews, rather than running
behind opaque navigation scenes.

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
