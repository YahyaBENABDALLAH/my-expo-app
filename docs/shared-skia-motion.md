# Shared Skia page motion

The root layout mounts `AuroraBackground` once behind navigation as the default full-screen background. Authentication, tabs, recipe/category details, collections, tools and not-found pages share the same theme-aware shader. Navigation themes, stack content, tab scenes, page frames, headers, auth forms, loading and recovery boundaries are transparent. Cards, fields and native controls keep their semantic surfaces. Maps and intentional Storybook fixture surfaces cover the artwork where their own content fills the screen.

The original `PageMotionOverlay` also remains mounted once above navigation and below the splash. Its two translucent Skia waves animate across the top 144 points of every page on a 12-second cycle. It ignores touches and accessibility, pauses while the splash covers it, and respects app lifecycle and live Reduce Motion changes. The top header animation and full-screen aurora are both part of the shared root composition.

The splash's bottom edge uses this same component with `variant="splash"`. This variant keeps the header's wave paths, opposite drift and lit crest, but uses opaque theme fills and normal-flow placement to form the moving reveal edge. The waves continue animating throughout the 300-ms upward exit. The shared `PAGE_WAVE_HEIGHT` keeps both artwork and exit geometry consistent.

The aurora shader uses the selected theme's `background`, `surfaceRaised`, `primary` and `secondary` tokens. Its native wrapper's layout event updates resolution, including narrow previews. One Reanimated frame callback advances shader time on the UI thread; frames do not measure views, construct paths or update React state. Android updates the full-screen shader at 30 Hz; iOS follows the display refresh rate. Elapsed time accumulates between shader updates so the artwork keeps the same speed. No dependencies were added.

Both wrapper and canvas ignore touches and the decorative wrapper is hidden from accessibility. `useMotionEnabled` observes app lifecycle and live Reduce Motion changes. Explicit static mode, reduced motion and inactive app state stop the frame callback, preserving the current frame. Resuming does not advance through the time spent paused. The root keeps its canvas static while the launch screen covers it; the launch screen's own aurora supplies the visible startup artwork. Ordinary pages do not mount additional background loops. The dedicated Skia demo retains its interactive palette canvas.

The root hides the native splash once the animated launch screen receives native layout. When fonts, language, onboarding preferences and session restoration are ready, a 300-ms upward exit reveals the app without an artificial branding delay. Reduce Motion keeps the startup artwork static and completes exit immediately. Session restoration errors expose recovery after branding. `app-ready` appears only after the launch overlay completes. Both shared page layers then animate on Android and iOS; the Android platform switch that previously held them static has been removed.

Root, authentication and onboarding stacks share `stackMotionOptions` from `src/constants/navigation-motion.ts`. Android uses the installed native 150-ms fade instead of the default transition, whose Android 13+ entry takes 450 ms. iOS uses `simple_push` with a 220-ms duration and matching dismissal gesture. Reduced Motion disables stack animation. Android retains `freezeOnBlur` to avoid updates to covered screens. [Expo's stack options](https://docs.expo.dev/router/advanced/stack/) document the supported transitions and the iOS-only duration setting; Android fade timing comes from the installed `react-native-screens` animation resources.

`Pages/Skia background` stories cover the combined aurora and header wave in Light, Dark, Static and NarrowPhone with page content, native action buttons, an action counter and pause/resume controls. `.maestro/storybook/aurora-background.yaml` checks one action per tap and those control states across light/dark/static compositions. `Pages/Animated splash/Ready` and `Waiting` preview the production launch artwork and support replay. `Pages/Shared Skia motion` retains focused previews of the top-edge wave.

## Verification

Completed checks:

- `npm run typecheck` and `npm run lint` pass.
- 74 focused checks pass across `geometry-stability`, `layout-direction`, `motion-enabled` and navigation tests. These cover startup readiness, motion resuming after launch on both platforms, shared artwork surviving direction changes, accessibility/activity guards and route behavior. Simulated 60/120-Hz frame callbacks verify 30 shader updates per second on Android, unchanged motion speed, pause/resume without a jump and unmount cleanup.
- Existing Storybook compositions expose the production artwork and pause/resume controls; registration uses the project's recursive story matcher.
- Existing page, auth and loading stories use a static aurora matching their explicit light/dark scheme, independently of the app's appearance.

Native rendering and performance remain unverified in this session: Android device and Maestro tooling are unavailable. The portable checks mock native boundaries and cannot establish device frame rate or touch delivery. On iOS and Android, cold-launch the app and inspect the Lottie/Skia presentation and transition. Inspect light/dark auth, tab, detail, map and tool pages; confirm native headers, buttons and inputs remain readable and interactive. Enable Reduce Motion while open, background/resume the app, push/pop screens and resize/rotate on supported devices. Check the native splash handoff and smoothness in a release build on the slowest supported device.

Run the focused native interaction flow with a connected development build:

```sh
maestro test .maestro/storybook/aurora-background.yaml
```
