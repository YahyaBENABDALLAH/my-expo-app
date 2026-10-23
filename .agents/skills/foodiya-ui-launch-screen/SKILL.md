---
name: foodiya-ui-launch-screen
description: 'Use or maintain the Foodiya launch-screen presentation, readiness and reduced-motion exit lifecycle.'
---

# Launch screen

Export: `LaunchScreen`. Implementation: `launch-screen.tsx`.

Native startup presentation combines Expo UI content, configured artwork and a
Skia reveal edge. `getAppBrand` supplies the name; the translated loading label
interpolates `brandName`. The existing asset helper selects a bundled Lottie or
`expo-image` image and the heading family for the current language. Specialized
artwork stays inside `RNHostView`; native text stays in the owning Host.
Keep selection and static imports with the
[configuration owner](../foodiya-implementation/references/configuration.md).

The root owns selected-font/appearance/session/language/header readiness. It
mounts this overlay after appearance restoration; `onReady` fires when the screen
has native layout and the root hides the native splash. When `exiting` is
ready, a cancellable two-second timer holds the presentation, then Reanimated slides it upward over two seconds. `onExitComplete` ends the overlay. Reduce Motion keeps the artwork
static, retains the two-second hold and skips the slide. Lottie pauses while the app is inactive. Image artwork is always static. The saved app motion preference overrides the live system preference after a choice is made.

Keep startup state in the root. This component owns presentation.

The bottom edge reuses `PageMotionOverlay`'s `splash` variant: the same two
oppositely drifting paths, 12-second cycle and crest as the header wave, with an
opaque foreground matching the splash background. It replaces the fixed quadratic
curves and continues moving during the two-second upward exit. Both placements
share `PAGE_WAVE_HEIGHT` and respect live reduced motion and app activity.

Selectors are `app-brand-screen`, `app-brand-artwork` and `app-brand-name`.
`Components/Launch Screen/Ready`, `Waiting` and `ReducedMotion` retain examples
of the selected build's artwork and resource-dependent exit; Replay uses
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
