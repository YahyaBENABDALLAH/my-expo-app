# Page layout and motion

Exports: `PageScreen`, `PageFrame`, `PageHeader` and `PageMotionOverlay`.

`PageScreen` and Home blur scrolling content only inside the animated wave shapes.
`PageFrame.headerBlur` enables this behavior; scrolling children use
`usePageHeaderInset()` for padding inside their scroll content. The inset measures
the real header, including the status bar, back button and larger text. The first
item starts below the title and can scroll behind it. Content mounts before the
blur and supplies a `BlurTargetView` reference for Android that excludes the title
and back button. The mask sits below those controls so they stay sharp.

`PageMotionOverlay` wraps root navigation with `PageWaveContext`, sharing the same
cached paths and UI-thread transforms between the visible artwork and the
platform blur mask. No second animation loop or per-frame
React updates are needed. Outside the two wave silhouettes the header is clear.
The optional `children` slot supplies this context to local previews; `visible`
hides the artwork and mask without remounting navigation. Splash waves keep their
existing opaque fills and do not supply a blur mask.

On iOS, `page-wave-surface.ios.tsx` renders an Expo UI SwiftUI `ultraThin` material
inside a native SwiftUI mask. An animated SVG uses the same wave path strings and
transforms as the artwork. This avoids masking an ancestor of UIKit's
`UIVisualEffectView`, which disables its blur, and keeps a Metal canvas out of the
SwiftUI mask. The native mask has an explicit height and a bounded Host.

Android retains Expo UI's `MaskedView` with a Skia mask and `expo-blur`.
The Android backdrop uses `extraLight` / `dark` tint at intensity 40, avoiding its
gray thin-material overlay and keeping more of the content visible. Android 12+
uses native blur; older Android versions use a translucent fallback. iOS Reduce
Transparency replaces the blur with the theme's `background` token. The backdrop
ignores touches and title-only floating headers pass gestures through to content.
Settings' native grouped form and other plain frames retain their in-flow layout.

`BlurredHeader`, `DarkBlurredHeader` and `AnimatedWaves` in `Pages/Navigation shell`
provide long, deterministic cards and a counted back action. The header Maestro flow exercises
scrolling and back actions in both appearances. JS checks cover measured scroll
padding, retained drafts during header resizing and live Reduce Transparency
changes. Geometry checks confirm that mask and artwork share paths, drift and
width, and that hiding waves removes the mask. iOS checks also ensure the material
is native SwiftUI, the mask is SVG, and Metro selects the platform surface adapter.
Native blur appearance still
requires a device.

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
