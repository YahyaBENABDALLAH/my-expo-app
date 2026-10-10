# Shared Skia page motion

The root layout mounts `AuroraBackground` once behind navigation as the default full-screen background. Authentication, tabs, recipe/category details, collections, tools and not-found pages share the same theme-aware shader. Navigation themes, stack content, tab scenes, page frames, headers, auth forms, loading and recovery boundaries are transparent. Cards, fields and native controls keep their semantic surfaces. Maps and intentional Storybook fixture surfaces cover the artwork where their own content fills the screen.

The original `PageMotionOverlay` also remains mounted once above navigation and below the splash. Its two translucent Skia waves animate across the top 144 points of every page on a 12-second cycle. It ignores touches and accessibility, pauses while the splash covers it, and respects app lifecycle and live Reduce Motion changes. The top header animation and full-screen aurora are both part of the shared root composition.

The splash's bottom edge now uses this same component with `variant="splash"`, replacing its fixed quadratic curves. This variant keeps the header's wave paths, opposite drift and lit crest, but uses opaque theme fills and normal-flow placement to form the moving reveal edge. The waves continue animating throughout the two-second upward exit. The shared `PAGE_WAVE_HEIGHT` keeps both artwork and exit geometry consistent.

The existing aurora shader uses the selected theme's `background`, `surfaceRaised`, `primary` and `secondary` tokens. Its native wrapper's layout event updates resolution, including narrow previews. One Reanimated frame callback advances shader time on the UI thread; frames do not measure views, construct paths or update React state. No dependencies were added.

Both wrapper and canvas ignore touches and the decorative wrapper is hidden from accessibility. `useMotionEnabled` observes app lifecycle and live Reduce Motion changes. Explicit static mode, reduced motion and inactive app state stop the frame callback, preserving the current frame. Resuming does not advance through the time spent paused. The root keeps its canvas static while the launch screen covers it; the launch screen's own aurora supplies the visible startup artwork. Ordinary pages do not mount additional background loops. The dedicated Skia demo retains its interactive palette canvas.

The requested splash minimum is three seconds, starting after the animated launch screen receives native layout and the root hides the native splash. Fonts are already ready; language and session restoration continue during the display. Once both the minimum and startup readiness are satisfied, a two-second upward wave exit reveals the app, easing in and out so the movement starts and ends gently. Reduce Motion keeps the startup artwork static and completes exit immediately after the minimum. Session restoration errors still expose recovery after branding. `app-ready` appears only after the launch overlay completes.

`Pages/Skia background` stories cover the combined aurora and header wave in Light, Dark, Static and NarrowPhone with page content, native action buttons, an action counter and pause/resume controls. `.maestro/storybook/aurora-background.yaml` checks one action per tap and those control states across light/dark/static compositions. `Pages/Animated splash/ThreeSeconds` previews the production launch artwork and supports replay. `Pages/Shared Skia motion` retains focused previews of the top-edge wave.

## Verification

Completed checks:

- `npm run typecheck` and `npm run lint` pass.
- `npm run test:layout` passes, including root fixture checks for fast and slow restoration, the three-second boundary, readiness after exit and retaining one shared background through direction changes.
- `npm run test:navigation` passes (28 route checks).
- `npm run storybook:generate` completes; its recursive story matcher includes both new story files.
- Existing page, auth and loading stories use a static aurora matching their explicit light/dark scheme, independently of the app's appearance.

Native rendering and performance remain unverified: `adb devices` reports no connected devices, and this Windows workspace has no local iOS simulator. On iOS and Android, cold-launch the app and inspect the three-second Lottie/Skia presentation and transition. Inspect light/dark auth, tab, detail, map and tool pages; confirm native headers, buttons and inputs remain readable and interactive. Enable Reduce Motion while open, background/resume the app, switch pages and resize/rotate on supported devices. Check the native splash handoff and smoothness in a release build on the slowest supported device.

Run the focused native interaction flow with a connected development build:

```sh
maestro test .maestro/storybook/aurora-background.yaml
```
