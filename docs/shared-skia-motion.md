# Shared Skia page motion

Navigation themes, root/authentication/onboarding stack content and tab scenes use the active theme's opaque `background` token. Each incoming route covers the outgoing route's text during transitions. Page frames, headers, auth forms, loading and recovery content reveal their owning scene's background. Cards, fields and native controls keep their semantic surfaces. The full-screen `AuroraBackground` remains available in the launch screen, dedicated Skia demo and Storybook previews; the root does not render a hidden shader behind opaque navigation scenes.

`PageMotionOverlay` wraps navigation and draws original vector artwork above it and below the splash. Header control points deform independently on one UI-thread active-time clock: waves travel, ribbon folds flow, dunes shift slowly, smoke curls with translucent wisps, water rolls with fine highlights, and rain falls in twelve staggered drops with impact ripples. Smoke is the default. The leading 40% stays level beneath the title/back control and RTL mirrors the full artwork. Skia's numeric path builders and the iOS animated SVG mask consume the same control points; Android masks with the same Skia paths. There is no header SVG parsing or React update per animation frame. The 120-second clock wrap is seamless, pauses retain phase, and frame stalls advance at most 64 ms. Login expansion/collapse, absolute bounds, theme tint and reduced-motion/app-activity guards remain. Splash retains its cached artwork and original drift.

Settings → Appearance → Header motion switches the root effect immediately and saves it under `appHeaderMotion`. Invalid or unavailable storage keeps the default; readiness joins the existing launch prerequisites. Storybook uses isolated unsaved preferences. The AppSettings header story previews this control against its local overlay. `assets/images/header-motion/` contains static smoke/water/rain SVG counterparts.

Its context shares deforming paths and UI-thread transforms with the native blur mask
in scrolling page frames. Android uses Expo UI's `MaskedView` to clip `expo-blur`
to the union of the two wave silhouettes. iOS uses a SwiftUI `ultraThin` material
and native SwiftUI mask with an animated SVG, keeping UIKit blur and a Metal canvas
out of that mask's render tree. SVG paths serialize the same numeric control points and
use the same shared motion as the artwork. The rest of the header remains transparent. The blur
samples each frame's content target and sits below its title/back controls, so
those controls remain sharp. A single wave loop drives both artwork and mask;
no snapshots or per-frame React updates are used. The existing reduced-motion
guard freezes both shapes together. The root's `visible` prop hides waves during
onboarding without remounting navigation. Splash waves remain unmasked.

The wave now accumulates active frame time on the UI thread. Pausing, backgrounding,
Reduce Motion and visibility changes keep its current phase instead of resetting
the drift to zero. Resuming excludes paused time; a delayed frame advances by at
most 64 ms. Page-local masks join the existing root phase when they mount. The
memoized frame callback is retained through root updates and navigation changes.
`Pages/Shared Skia motion/NavigationContinuity` replaces page frames beneath a
single overlay and offers pause/resume and back actions. Its Maestro flow checks
those controls; the JS geometry suite checks continuity at 60/120 Hz through page
replacement and lifecycle pauses on both platform adapters. Native visual
continuity remains unverified without a connected device.

The splash's bottom edge uses this same component with `variant="splash"`. This variant keeps its original wave paths, opposite drift and lit crest, with opaque theme fills and normal-flow placement to form the moving reveal edge. The waves continue animating throughout the 300-ms upward exit. The 80-point `PAGE_WAVE_HEIGHT` keeps splash artwork and exit geometry consistent; titled headers use their own measurements.

The aurora shader uses the selected theme's `background`, `surfaceRaised`, `primary` and `secondary` tokens. Its native wrapper's layout event updates resolution, including narrow previews. One Reanimated frame callback advances shader time on the UI thread; frames do not measure views, construct paths or update React state. Android updates the full-screen shader at 30 Hz; iOS follows the display refresh rate. Elapsed time accumulates between shader updates so the artwork keeps the same speed. No dependencies were added.

Both wrapper and canvas ignore touches and the decorative wrapper is hidden from accessibility. `useMotionEnabled` observes app lifecycle and live Reduce Motion changes. Explicit static mode, reduced motion and inactive app state stop the frame callback, preserving the current frame. Resuming does not advance through the time spent paused. The launch screen's own aurora supplies the startup artwork. Ordinary pages do not mount background loops. The dedicated Skia demo retains its interactive palette canvas.

The root hides the native splash once the animated launch screen receives native layout. When fonts, language, onboarding preferences and session restoration are ready, a 300-ms upward exit reveals the app without an artificial branding delay. Reduce Motion keeps the startup artwork static and completes exit immediately. Session restoration errors expose recovery after branding. `app-ready` appears only after the launch overlay completes. The shared header wave then animates on Android and iOS.

Root, authentication and onboarding stacks share `stackMotionOptions` from `src/constants/navigation-motion.ts`. Android uses `slide_from_right` so route text does not cross-fade together. iOS uses `simple_push` with a 220-ms duration and matching dismissal gesture. Reduced Motion disables stack animation. Android retains `freezeOnBlur` to avoid updates to covered screens. [Expo's stack options](https://docs.expo.dev/router/advanced/stack/) document the supported transitions and the iOS-only duration setting.

`Pages/Skia background` stories cover the combined aurora and header wave in Light, Dark, Static and NarrowPhone with page content, native action buttons, an action counter and pause/resume controls. `.maestro/storybook/aurora-background.yaml` checks one action per tap and those control states across light/dark/static compositions. `Pages/Animated splash/Ready` and `Waiting` preview the production launch artwork and support replay. `Pages/Shared Skia motion` retains focused previews of the top-edge wave.

## Verification

Completed checks:

- `npm run typecheck` and `npm run lint` pass.
- Focused checks across `geometry-stability`, `layout-direction`, `motion-enabled` and navigation cover startup readiness, the header wave resuming after launch, opaque navigation surfaces, platform transition choices, direction changes, accessibility/activity guards and route behavior. Simulated 60/120-Hz frame callbacks verify 30 shader updates per second on Android, unchanged motion speed, pause/resume without a jump and unmount cleanup.
- Existing Storybook compositions expose the production artwork and pause/resume controls; registration uses the project's recursive story matcher.
- Existing page, auth and loading stories use a static aurora matching their explicit light/dark scheme, independently of the app's appearance.

An iPhone 18 Pro simulator on iOS 27 was checked by opening History from My Recipes and returning with the page back button. Both destinations rendered with opaque backgrounds and the header wave remained visible. Frame-by-frame transition analysis and native performance remain unverified; Android device and Maestro tooling are unavailable. The portable checks mock native boundaries and cannot establish device frame rate or touch delivery. For broader native coverage, cold-launch the app and inspect the Lottie/Skia presentation and transition. Inspect light/dark auth, tab, detail, map and tool pages; confirm native headers, buttons and inputs remain readable and interactive. Enable Reduce Motion while open, background/resume the app, push/pop screens and resize/rotate on supported devices. Check the native splash handoff and smoothness in a release build on the slowest supported device.

Run the focused native interaction flow with a connected development build:

```sh
maestro test .maestro/storybook/aurora-background.yaml
```

On 2026-10-21, the iPhone 18 Pro simulator on iOS 27 was used to open the actual
Settings → Appearance → Header motion menu and select Water, Rain and Smoke.
The selected native label and the corresponding header artwork updated immediately;
water highlights, rain streaks and smoke curls were visible in the RTL dark layout.
This is manual native verification, not a screenshot regression or frame-rate profile.
Android native appearance and release-device performance remain unverified.
