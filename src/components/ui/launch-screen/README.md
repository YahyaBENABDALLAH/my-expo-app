# Launch screen

Export: `LaunchScreen`. Implementation: `launch-screen.tsx`.

Native startup presentation combines Expo UI content, Lottie and Skia artwork.
The root owns font/session/language readiness and the requested three-second
minimum. `onReady` fires when the animated screen has native layout; the root
hides the native splash and starts the timer then. `exiting` starts the existing
300-ms wave transition once both the timer and startup readiness are satisfied;
`onExitComplete` ends the overlay. Reduce Motion keeps the artwork static and
completes the exit immediately, while retaining the three-second display.

Keep startup state in the root. This component owns presentation.

`Pages/Animated splash/ThreeSeconds` previews the production artwork and supports
replaying the three-second presentation. Root fixture checks cover fast and slow
restoration, the timer beginning after native layout, and readiness after exit.
These JS checks do not establish native rendering or timing. Inspect startup,
recovery and reduced motion on iOS and Android.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
