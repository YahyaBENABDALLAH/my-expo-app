# Launch screen

Export: `LaunchScreen`. Implementation: `launch-screen.tsx`.

Native startup presentation combines Expo UI content, Lottie and Skia artwork.
The root owns font/session/language readiness. `onReady` fires when the animated
screen has native layout and the root hides the native splash. `exiting` starts
a 300-ms upward transition as soon as resources are ready, including when a
session restoration failure needs to expose recovery. `onExitComplete` ends the
overlay. Reduce Motion keeps the artwork static and completes the exit immediately.

Keep startup state in the root. This component owns presentation.

The bottom edge reuses `PageMotionOverlay`'s `splash` variant: the same two
oppositely drifting paths, 12-second cycle and crest as the header wave, with an
opaque foreground matching the splash background. It replaces the fixed quadratic
curves and continues moving during the brief upward exit. Both placements
share `PAGE_WAVE_HEIGHT` and respect live reduced motion and app activity.

`Pages/Animated splash/Ready` and `Waiting` preview the production artwork and
resource-dependent exit. Root fixture checks cover fast and slow restoration,
language readiness, and readiness after exit.
These JS checks do not establish native rendering or timing. Inspect startup,
recovery and reduced motion on iOS and Android.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
