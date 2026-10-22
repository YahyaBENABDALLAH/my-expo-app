---
name: foodiya-ui-launch-screen
description: 'Use or maintain the Foodiya launch-screen presentation, readiness and reduced-motion exit lifecycle.'
---

# Launch screen

Export: `LaunchScreen`. Implementation: `launch-screen.tsx`.

Native startup presentation combines Expo UI content, Lottie artwork and a Skia reveal edge; Aurora has been removed.
The root owns font/session/language readiness. `onReady` fires when the animated
screen has native layout and the root hides the native splash. When `exiting` is
ready, a cancellable two-second timer holds the presentation, then Reanimated slides it upward over two seconds. `onExitComplete` ends the overlay. Reduce Motion keeps the artwork
static, retains the two-second hold and skips the slide. Lottie pauses while the app is inactive. The saved app motion preference overrides the live system preference after a choice is made.

Keep startup state in the root. This component owns presentation.

The bottom edge reuses `PageMotionOverlay`'s `splash` variant: the same two
oppositely drifting paths, 12-second cycle and crest as the header wave, with an
opaque foreground matching the splash background. It replaces the fixed quadratic
curves and continues moving during the two-second upward exit. Both placements
share `PAGE_WAVE_HEIGHT` and respect live reduced motion and app activity.

`Components/Launch Screen/Ready`, `Waiting` and `ReducedMotion` preview the production artwork and
resource-dependent exit. Root fixtures cover restoration, language readiness and
readiness after exit.
These JS checks do not establish native rendering or timing. Inspect startup,
recovery and reduced motion on iOS and Android.

iOS 27 / iPhone 18 Pro development preview: the upward exit was observed and
completed on login without a runtime error. The two-second intervals are checked
in the animation configuration, not a native stopwatch test.
Android, release startup and native reduced-motion verification remain pending.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/launch-screen/](../../../src/components/ui/launch-screen/).
