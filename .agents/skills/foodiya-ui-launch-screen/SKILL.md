---
name: foodiya-ui-launch-screen
description: 'Use or maintain the Foodiya launch-screen presentation, readiness and reduced-motion exit lifecycle.'
---

# Launch screen

Export: `LaunchScreen`. Implementation: `launch-screen.tsx`. Public props are
`exiting`, `onExitComplete`, optional `onReady` and `mode: 'minimal' | 'branded'`.
Direct callers default to branded for compatibility. The root passes the brand's
`presentation.launch`: the neutral template selects minimal, Likan selects branded.
Minimal mounts native loading content with no artwork/wave loop, hold or slide;
it completes after its layout, `exiting` and foreground activity are ready.

Native startup presentation combines Expo UI content, configured artwork and a
Skia reveal edge. `getAppBrand` supplies the name; the translated loading label
interpolates `brandName`. The existing asset helper selects a bundled Lottie or
`expo-image` image and the heading family for the current language. Specialized
artwork stays inside `RNHostView`; native text stays in the owning Host.
Keep selection and static imports with the
[configuration owner](../foodiya-implementation/references/configuration.md).

The root owns font resolution, appearance/session/language/header readiness and
the initial page frame's native layout. It mounts the overlay after appearance
restoration; `onReady` fires on overlay layout and the root hides the native
splash. `exiting` waits for a usable page or recovery frame beneath the overlay.
For branded mode, a cancellable two-second foreground hold precedes the
two-second upward Reanimated slide. Backgrounding pauses the remaining hold and
cancels the slide at its current offset; resume continues from that offset.
`onExitComplete` is guarded against duplicate branded completion. Reduce Motion
keeps artwork static, retains the branded hold and skips the slide; enabling it
mid-exit completes after the hold. Lottie pauses while inactive; image artwork
is always static. The saved motion preference overrides the live system choice.

Restoration failure uses minimal presentation so recovery is reachable without a
branding delay. The root exposes `app-recovery` after its layout and overlay exit;
it must not expose `app-ready`. Successful `app-ready` requires resolved fonts
(native fallback on load error), hydrated preferences/language, resolved auth
without restoration error, initial page layout and completed overlay exit. It
does not claim every background request or native child has finished rendering.

Keep startup state in the root. This component owns presentation.

The bottom edge reuses `PageMotionOverlay`'s `splash` variant: the same two
oppositely drifting cached paths with an eight-second cycle and opaque foreground
matching the splash background. It continues moving during the branded slide.
Splash does not evaluate deforming header contours, detail geometry or SVG
strings. Both placements share `PAGE_WAVE_HEIGHT` and respect live reduced motion
and app activity. The header's selected style does not replace this launch edge.

Branded selectors remain `app-brand-screen`, `app-brand-artwork` and
`app-brand-name`; minimal uses `app-launch-minimal` and native loading content.
`Components/Launch Screen/Ready`, `Waiting` and `ReducedMotion` retain examples
of the selected build's artwork and resource-dependent exit. `MinimalReady` and
`MinimalWaiting` cover the cheaper mode; Replay uses
`launch-preview-replay`. The normal application currently has no Storybook route.
Registration and exports do not establish native rendering or timing. Inspect
both configured brands, startup, recovery, font fallback and reduced motion on
iOS and Android. Do not restore the retired automated fixtures in this step.

Historical iOS 27 / iPhone 18 Pro development preview: the upward exit was observed and
completed on login without a runtime error. The two-second intervals are checked
in the animation configuration, not a native stopwatch test.
This observation predates configurable artwork/fonts. Both brands' new native
presentation, Android, release startup and native reduced-motion verification
remain pending.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/launch-screen/](../../../src/components/ui/launch-screen/).
