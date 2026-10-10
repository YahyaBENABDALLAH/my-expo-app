# Shared Skia page motion

The root layout mounts `PageMotionOverlay` once above the navigation tree and below the launch screen. Every routed page receives the same gentle top-edge wave, including authentication, tabs, recipe/category details, collections, tools, maps, and not-found screens. Existing page content and native navigation own their usual layouts and safe areas.

The 144-point canvas draws two fixed, oversized paths using existing light/dark `tint` and `tabIconSelected` tokens. Reanimated translates the paths in opposite directions over a seamless 12-second cycle. The canvas sizes from the wrapper's layout event; the frame loop performs no view measurement, path construction, network work, or React state updates. No dependencies were added.

The overlay is decorative and ignores touches. It is hidden from the accessibility tree. Existing `useMotionEnabled` observes app lifecycle and live Reduce Motion changes; disabled motion cancels the loop and returns to a static wave. The root requests static mode while the launch screen covers the app. A single root scene avoids hidden tab/stack screens owning extra animation loops.

Native Storybook provides `Pages/Shared Skia motion` stories for Light, Dark, Static, and NarrowPhone. The composition includes an action button underneath the wave, an action counter, and pause/resume controls. The status label describes the story's requested animation mode; the OS accessibility setting and app lifecycle can still suppress motion.

`.maestro/storybook/page-motion.yaml` checks touch-through, one action per tap, pause/resume controls, dark mode, and static-mode interaction. It does not assert rendered wave frames or system Reduce Motion behavior.

## Verification

Completed checks:

- `npm run typecheck` and `npm run lint` pass.
- `npm run test:layout` and `npm run test:navigation` pass (28 existing checks).
- `npm run storybook:generate` completes; its generated recursive story matcher includes the new story file.
- Prettier checks pass for the new source, root integration, story, native flow, and this document.

Native rendering and performance are unverified: the Android SDK reports no connected devices, and this Windows workspace has no local iOS simulator. On iOS and Android, inspect light/dark auth, tab, detail, map, and tool pages; confirm headers and inputs remain readable and interactive. Enable Reduce Motion while open, background/resume the app, switch pages, and resize/rotate on supported devices. Judge smoothness in a release build on the slowest supported device.

Run the focused native interaction flow with a connected development build:

```sh
maestro test .maestro/storybook/page-motion.yaml
```
