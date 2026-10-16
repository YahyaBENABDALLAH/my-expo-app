# Launch screen

Export: `LaunchScreen`. Implementation: `launch-screen.tsx`.

Native startup presentation combines Expo UI content, Lottie and Skia artwork.
The root owns font/session/language readiness. `onReady` fires when the animated
screen has native layout and the root hides the native splash. When `exiting` is
ready, one Reanimated animation waits two seconds and then slides upward over
two seconds. `onExitComplete` ends the overlay. Reduce Motion keeps the artwork
static and completes immediately. No timer or additional React state is needed.

Keep startup state in the root. This component owns presentation.

The bottom edge reuses `PageMotionOverlay`'s `splash` variant: the same two
oppositely drifting paths, 12-second cycle and crest as the header wave, with an
opaque foreground matching the splash background. It replaces the fixed quadratic
curves and continues moving during the two-second upward exit. Both placements
share `PAGE_WAVE_HEIGHT` and respect live reduced motion and app activity.

`Pages/Animated splash/Ready` and `Waiting` preview the production artwork and
resource-dependent exit. Root fixtures cover restoration, language readiness and
readiness after exit.
These JS checks do not establish native rendering or timing. Inspect startup,
recovery and reduced motion on iOS and Android.

iOS 27 / iPhone 18 Pro development preview: the upward exit was observed and
completed on login without a runtime error. The two-second intervals are checked
in the animation configuration, not a native stopwatch test.
Android, release startup and native reduced-motion verification remain pending.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
