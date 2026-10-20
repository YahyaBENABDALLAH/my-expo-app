# Page layout and motion

Exports: `PageScreen`, `PageSection`, `PageFrame`, `PageHeader`, `PageMotionOverlay` and `pageFormModifiers`.

Screens have zero decorative padding. Wrap ordinary content in `PageSection`,
which owns symmetric 16-point padding and a 16-point child gap. Use
`inset={false}` for full-width sections whose rails/text own horizontal gutters.
Description and route actions have their own sections. Safe areas, keyboard
avoidance and measured title clearance remain infrastructure insets.
`PageFrame` supplies the selected theme's `background`, including standalone
previews. See [shared geometry](../../../../docs/layout-consistency.md) for the
token roles, native-form limitations and component story.

Every titled `PageFrame` blurs its header by default, including Settings, maps,
developer tools and recovery screens. `headerBlur={false}` explicitly opts out.
The default frame keeps its header in normal layout and reserves the measured
title height above its content. Its full-frame blur source sits below the header.
`PageScreen`, Home and Settings use `scrollsBehindHeader` and `usePageHeaderInset()` to reserve that height
inside their scroll content instead. The inset measures
the real header, including the status bar, back button and larger text. The first
item starts below the title and can scroll behind it. Content mounts before the
blur and supplies a `BlurTargetView` reference for Android that excludes the title
and back button. The mask sits below those controls so they stay sharp.

`PageMotionOverlay` wraps root navigation with `PageWaveContext`, sharing the same
cached paths and UI-thread transforms between the visible artwork and the
platform blur mask. Header artwork and both blur masks are absolutely positioned.
SVG height, drift, expansion and visibility add no padding, margin, header height
or content clearance. Only the actual title/back row and system safe area determine
the measured header inset. The wave remains decorative when expanded on Login.
The focused frame supplies its measured header height, including safe area and
scaled title text. Collapsed artwork and SVG mask bounds match that height. Both
paths keep their leading section at full header height; only their trailing
curves vary in opposite phases. RTL mirrors the artwork so the steady section
stays beneath the title and back button. No second animation loop or per-frame
React updates are needed. Outside the two wave silhouettes the header is clear.
The wave clock accumulates active frame time instead of restarting a repeating
animation. Replacing a page's mask joins the current phase; backgrounding, Reduce
Motion, explicit pause and visibility changes retain that phase. Resume excludes
paused time, and a delayed frame advances by at most 64 ms to avoid a sudden jump.
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
ignores touches. An absolute transparent shield blocks taps and gestures within
the header band, including content scrolled underneath it. Its height follows
the greater of the measured header and the wave's current bottom edge, including
expanded Login and collapse. The back-button layer stays above it. Content below
the band remains interactive. The shield adds no spacing and is hidden from accessibility.
Settings reserves its measured header height inside the first section's custom
header, so that space scrolls away and the native form passes beneath the wave
blur. `pageFormModifiers` fills the native viewport and, on iOS, hides the system
Form canvas as well as the view background;
Android retains the transparent native FieldGroup. Neither platform nests scroll
containers. Settings label/detail columns use a leading full-width frame on iOS
so text starts at the native row inset; Android uses its weighted column.
The title and back control stay above the blur; the viewport clips
only to the full content frame. Full-height overlays retain the top device inset for map controls.
Without wave context, a rectangular native blur covers the measured header and
retains the same Reduce Transparency fallback.

`Components/Page Header` previews default, dark, scrolling, full-height overlay
and no-wave headers with deterministic cards and a counted back action.
`AppSettings` and `DarkAppSettings` render the actual grouped settings form,
with a counted back action outside the form for checking scrolling and header interaction.
`tests/components/page-frame.test.mjs` checks measured content spacing, retained
drafts during header resizing, overlay safe areas and live Reduce Transparency.
Native blur appearance and interaction still require a device.
`.maestro/components/page-header.yaml` also checks that an uncovered content
button works, a button beneath the title cannot be activated through it, and
Back remains usable before and after scrolling. This native flow remains unrun
without a connected device.

`page-screen.tsx` composes scrolling content and actions.
`page-frame.tsx` handles the header's safe area and leaves other edges to content.
Its optional `headerOverlay` floats the blurred header above full-height content,
as used by Cartes. Overlay content retains the top device inset for native map controls;
the header band blocks map gestures while the map below remains interactive.
Its adjusted safe-area context keeps a stable identity until content insets change,
so unrelated parent updates do not notify every inset consumer.
`tests/layout/render-stability.test.mjs` checks this and real inset propagation.
`page-header.tsx` uses the private `page-back-button.*` adapters.
Titles align to the leading edge on both platforms (left in LTR, right in RTL).
The iOS title uses an explicitly leading full-width frame so SwiftUI does not
center it in the available space; Android retains its weighted title column.
The existing `Components/Page Header` stories cover titles and counted back actions;
native title alignment still requires iOS and Android visual verification.
Both platforms use zero vertical and 16 points of horizontal
header padding. The temporary red debug background has been removed.
The status-bar inset is applied once by
`PageFrame`, while the header Host ignores automatic native safe areas.
The title row vertically centers the back button and title so the arrow aligns
with the text. Long titles retain their natural height. Back actions keep their
48-point native touch area. The Page Header
story's `showBack` control compares both states; `Home` opens the Accueil case.
`page-motion-overlay.tsx` contains the shared animated top-edge wave artwork.
Its two SVG paths are cached for window/header size and splash variant. Animation updates transforms,
with no path parsing or React state update per frame.
Its default `overlay` variant decorates headers; `variant="splash"` places the
original moving paths in normal flow with opaque fills for the launch screen's bottom
edge. The splash retains the exported 80-point `PAGE_WAVE_HEIGHT`; headers use
their measured height. Both retain the same motion guards.
The back wave resolves theme opacity first; the splash keeps full opacity.
Header paths use a 1000-by-100 design space. The leading 40% sits at full height;
the trailing cubic curves scale between 60% and 100% of their depth around that
fixed baseline, in opposite phases on an 8-second cycle. A 50-unit side margin
covers the 40 / 50-unit horizontal drift. Artwork and both blur masks share these
transforms, including vertical scale in the iOS SVG matrix. `AnimatedLtr`,
`AnimatedRtl` and `LongTitle` in the header stories cover the new geometry;
motion checks exercise resizing, fixed leading height, opposite depths,
60/120-Hz timing, direction changes and pause/resume without per-frame React work.
Header layers share the theme's tint with
a gentle 20% gradient fade for a more consistent color across the filled area.
`Pages/Shared Skia motion/NavigationContinuity` replaces Home, Search and Saved
recipes frames beneath one overlay, with pause/resume and a back action. Its
Maestro flow checks the controls and retained pause state across replacement;
geometry tests check the wave phase at 60/120 Hz on both platform adapters. These
checks do not establish native visual continuity or device performance.
`expanded` centers the shallow wave band at 35% of the window height and fills
continuously from the top of the screen to the curved edge. Only the straight
closing edges extend upward; the curves retain their header-relative depth.
Drawing bounds remain expanded until collapse completes, then return to the
measured header height. `Components/Page Header/ExpandedLogin` previews this filled area.
Login uses it while signed out. Successful login raises
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
Motion follows focus/activity/reduced-motion guards. The artwork ignores touches;
the page-local shield handles header touch blocking below the back-button layer.
See [shared motion](../../../../docs/shared-skia-motion.md).

Composition story: [page-header.stories.tsx](../../../../.rnstorybook/stories/components/page-header.stories.tsx),
including `FullHeightOverlay` with a simulated notch.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
