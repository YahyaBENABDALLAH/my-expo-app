# Home scroll lag investigation

Date: 2026-10-06. Reported platform: Android. Expo SDK 57, React Native 0.86.3, installed Expo UI 57.0.21.

The initial investigation identified nested vertical scrolling and persistent decorative rendering as the strongest home-specific candidates. The code establishes both workloads; it does **not** establish which causes the reported lag. `adb devices -l` returned no attached devices, and no Metro server was listening on ports 8081 or 8082. Build mode and device model are unknown. No FPS, native layout timing, GPU timing, or gesture trace was captured. The findings below describe the original implementation.

## Implemented follow-up

At the user's request, Home now displays static skeleton placeholders and unmounts the entire preview ten seconds after it mounts. Its isolated timer does not rerender the home queries when it expires, restart on focus or refresh, or remain pending after unmount. A new screen mount starts a new ten-second preview.

Static `SkeletonContent` now bypasses the pulse hook entirely, creating no pulse timer or motion lifecycle subscriptions. Animated skeletons elsewhere retain the shared native endpoint animation and existing accessibility/lifecycle guards. The flame component, UI export, and Storybook flame example were deleted. `StaticReferenceCard` exercises the lightweight placeholder composition in native Storybook.

Four lifecycle regressions in `tests/recipes/home-skeleton.test.mjs` pass: timed removal without query rerenders or lost control state, no restart on focus/refresh, timeout cleanup, and shared animated pulse pause/resume. Native smoothness and gesture handoff still require device verification. The nested scroll containers have not been changed.

## Findings

### 1. Four vertical scroll owners can consume the same swipe

`src/components/ui/page/page-screen.tsx:91` wraps the home content in `RefreshableScrollView`. The installed Android universal `ScrollView` renders a Compose `Column` with `verticalScroll(rememberScrollState())`.

Three more vertical scroll containers live inside it:

| Home content                                         | Source                                     | Android implementation                                                                                    |
| ---------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Preferences form, 240 points high                    | `src/features/recipes/home-screen.tsx:205` | The project `FieldGroup` adapter embeds a `LazyColumn` at `src/components/ui/field-group/field-group.android.tsx:68`. |
| Three sample meal rows, inside a 240-point container | `src/features/recipes/home-screen.tsx:231` | The project `List` adapter embeds a `LazyColumn` at `src/components/ui/list/list.android.tsx:24`.              |
| Six tips, 224 points high                            | `src/features/recipes/home-screen.tsx:283` | Another universal vertical `ScrollView`.                                                                  |

These containers are bounded, so this is not an unbounded nested-list diagnosis. They still own separate scrolling gestures. If the page feels sticky specifically when a swipe begins over the form, meal list, or tips, gesture consumption and fling handoff are the first things to inspect. Frame drops are a separate symptom and must be measured separately.

The horizontal meal, category, and recipe scrollers do not add another vertical scroll owner. They still need ordinary diagonal-gesture checks.

### 2. Ten skeleton previews keep pulsing after content has loaded

`src/features/recipes/home-screen.tsx:47` mounts the skeleton demonstration unconditionally. All ten placeholders use `animate={focused}`; this is independent of query loading and scroll visibility.

`src/components/ui/skeleton/use-skeleton-pulse.ts:16` uses one shared timer, ticking every 900 ms. Each enabled placeholder subscribes through `useSyncExternalStore` and renders new native modifier endpoints on every tick. Android interpolates the background color natively between endpoints; this is **not** a React update on every animation frame.

A temporary diagnostic exercised the real `SkeletonContent` and pulse hook with the repository's React fixture renderer, substituting only native view, theme, and motion boundaries. The placeholder count was read from the actual home source. Results:

- Ten mounted placeholders shared one timer.
- Ten simulated ticks caused 100 placeholder component renders, in addition to initial mounting.
- Disabling animation stopped the timer and removed animation durations.

This demonstrates recurring React work and native animation requests. It does not measure Android frame cost or prove that the entire home screen rerenders on a pulse. Scrolling the preview out of view does not disable it in this eager scroll tree. Screen blur, app backgrounding, and reduced motion do disable the animation through the existing guards.

### 3. The flame rebuilds seven paths for each animation phase update

`src/features/recipes/home-screen.tsx:140` runs `RealisticSkiaFlame` whenever the home tab is focused. In `src/components/ui/realistic-skia-flame.tsx`, seven derived path values each call `Skia.PathBuilder.Make()` and `build()`. The phase repeats a one-second animation indefinitely.

Those derived values execute on the UI runtime and drive Skia directly. They do not cause React renders per frame, but path allocation, tessellation, and drawing still compete with native scrolling. There is no viewport guard, so the flame also keeps updating when scrolled out of view.

The root wave (`src/app/_layout.tsx`, `PageMotionOverlay`) and the tab action (`src/components/ui/floating-action/floating-action.tsx`) add continuous drawing work. They are shared across screens, so they are secondary suspects when lag occurs only on Home. The floating action already builds its wave path once and animates transforms; it does not have the flame's per-update path construction.

### 4. Home content is eagerly laid out

The Android universal scroll view uses a normal Compose `Column`, not a lazy list. The whole home hierarchy, including the component demonstrations, is mounted. Covered recipe cards add React Native image hosting boundaries through `RNHostView matchContents`.

Recipe data is bounded to eight cards and categories to twenty. This is not evidence of a large unbounded feed. Converting everything to a virtualized list is not the first justified change. Profile native layout and image loading if lag clusters around initial data arrival or image display.

## Other paths checked

- There is no `onScroll` handler or per-scroll React state update in Home or its page wrapper.
- The home queries do not poll. The default stale time is one minute, with focus/reconnect refetching and explicit refresh.
- Sample switch and meal-selection state stays inside `HomeComponentExamples`.
- Skeleton updates share one clock; there are not ten independent intervals.
- Animation lifecycle guards already stop work on blur/background/reduced motion. The missing distinction is whether content remains visible within a focused scroll page.
- Android tab-bar blur targets its own tonal backdrop, rather than the moving page content. Its cost remains measurable, but it is not evidence of full-page live blur during scrolling.

## Device checks and proposed changes

Use the same Android device, build, data, and swipe locations for each comparison. First establish whether the symptom is gesture stickiness or actual dropped frames. Expo's [performance monitor](https://docs.expo.dev/debugging/tools/#toggle-performance-monitor) distinguishes UI and JS FPS; use a release build for the final smoothness comparison. DevTools can inspect React work, while native layout and graphics need native profiling.

1. Compare long swipes and flings starting on plain page text versus the form, sample list, and tips. If only those regions resist scrolling, temporarily flatten one inner vertical scroller at a time. The proposed permanent change is one vertical scroll owner on Home, with its short example rows rendered inline or moved into their dedicated showcase screens. Preserve the horizontal carousels, controls, selection state, and pull to refresh.
2. Compare the unchanged page with only the skeleton preview's animation disabled. If periodic stutter disappears, keep animated demonstrations in Storybook or make this home preview static; use animated placeholders only during an actual load. Do not change the shared pulse hook without evidence that its endpoint clock is a bottleneck.
3. Restore the skeleton baseline and disable only the home flame. If UI frame time improves, make the small home accent static or prebuild its artwork and animate transforms. Keep the reusable flame's consumers in mind before changing the shared component.
4. If the problem remains, isolate the global wave and floating action separately, then inspect image decode and native layout timing. Avoid changing all effects together, since that would hide which change helped.
5. Repeat the useful change on a release build and verify swipe handoff, category/recipe carousel scrolling, sample controls, and pull to refresh. Development FPS is diagnostic evidence, not a release performance result.

## Validation

- `npm run lint`: passed, zero warnings.
- `npm run typecheck`: passed.
- `npm run test:recipes`: 16 passed, including four new skeleton lifecycle regressions.
- `npm run test:layout`: 95 passed.
- `npm run storybook:generate`: passed.
- Temporary skeleton diagnostic: passed; native rendering and frame timing were not exercised.
- Native Android gesture, rendering, and release performance checks: pending a connected device.

API behavior was checked against installed source and the [SDK 57 Expo UI reference](https://docs.expo.dev/versions/v57.0.0/sdk/ui/), including [ScrollView](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/scrollview/) and [LazyColumn](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/lazycolumn/).
