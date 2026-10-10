# Launch screen

Export: `LaunchScreen`. Implementation: `launch-screen.tsx`.

Native startup presentation combines Expo UI content, Lottie and Skia artwork.
The root owns font/session readiness and requests exit through `exiting`;
`onExitComplete` ends the overlay. There is no artificial branding delay.
The existing brief transition respects reduced motion.

Keep startup state in the root. This component owns presentation.

There is no dedicated story. Verify the root startup composition in a native
app, including successful restoration, recovery and reduced motion.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
