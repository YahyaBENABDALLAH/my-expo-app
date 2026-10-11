# React render audit

Reviewed 2026-10-11 with Expo SDK 57, React 19.2.3, React Native 0.86.3 and installed
TanStack Query 5.104.0. This pass found and fixed avoidable context, parent and timer
updates. The evidence is source review and real React render counters with native
views substituted at their boundary. It is not device frame-rate profiling.

## Fixed findings

| Source                                                              | Unnecessary work                                                                                                                 | Change and retained behavior                                                                                                                                                                                                       |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/context/theme.context.tsx`                                     | A fresh provider value notified context consumers on an unrelated ancestor update.                                               | Memoize the value by theme and appearance; actual preference edits still propagate.                                                                                                                                                |
| `src/context/layout-direction.context.tsx`                          | The same provider identity problem affected direction consumers.                                                                 | Memoize by direction; RTL changes still propagate.                                                                                                                                                                                 |
| `src/context/language.context.tsx`                                  | The language command and provider value were recreated on ancestor updates.                                                      | Stabilize both; readiness and i18next language notifications still update consumers.                                                                                                                                               |
| `src/context/auth.context.tsx`                                      | Token renewal supplied a new user object and notified all auth consumers even when displayed fields stayed equal.                | Ignore equal user/status notifications within the same session generation. Profile changes, sign-out and a new generation still notify. A same-account new login must refresh captured mutation session guards.                    |
| `src/components/ui/page/page-frame.tsx`                             | Recreating the adjusted inset object notified descendants without an inset change.                                               | Memoize bottom/left/right insets, keeping top at zero; real inset changes still propagate.                                                                                                                                         |
| `src/components/ui/auth/auth-theme.ts`                              | Every auth parent update created a new button palette for the native Host context.                                               | Memoize by semantic colors; theme changes still update the palette.                                                                                                                                                                |
| `src/features/pages/tab-actions.tsx` and registering recipe screens | Screens subscribed to the entire action registry to obtain its setter. Draft changes also replaced the published press callback. | Split the stable command context from registry readers, ignore equal registrations, and register only when visible action properties change. A stable callback invokes the latest committed handler, preserving the current draft. |
| `src/components/ui/recipe-card/recipe-card.tsx`                     | A parent update rebuilt unchanged card text and image composition.                                                               | Default React memo comparison skips stable recipe props; changed data, theme and translations still render.                                                                                                                        |
| `src/components/ui/recipe-stepper/recipe-stepper.tsx`               | Draft edits rebuilt unchanged canvas and label composition.                                                                      | Default React memo comparison skips unchanged step/validity props. Real validity, theme and translation changes still render; shared-value motion continues.                                                                       |
| `src/features/auth/screens/verify-email-screen.tsx`                 | An unconditional one-second clock kept rendering after resend became available, after expiry, and without valid deadlines.       | Schedule countdown ticks while needed, then only the expiry deadline. Equal visible clock state does not update React; replaced deadlines restart scheduling.                                                                      |

## Render evidence

The initial render is excluded from the following comparison. These are controlled
JS fixtures, not production render totals.

| Fixture event                                                                     | Before the fix                              | After the fix                                          |
| --------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------ |
| Unrelated parent update: theme/direction, adjusted inset or auth palette consumer | 1 extra render in each fixture              | 0 extra renders                                        |
| Unrelated parent update: unchanged recipe image or stepper canvas tree            | 1 extra render in each fixture              | 0 extra renders                                        |
| Token-only notification with cloned equal user fields and the same generation     | 1 extra consumer render                     | 0 extra renders                                        |
| Clock advance during the idle interval after resend readiness                     | 1 extra render in the batched timer fixture | 0 extra renders; expiry still adds its required render |

The recipe creation integration also verifies that each title/summary edit causes
one necessary page render and zero action-reader renders, and that the floating
Continue action uses the latest draft. Publishing tests still exercise pending
disabled state, duplicate-submit suppression, failure retention and navigation
after cache maintenance. The language and registry tests check stable commands
and real updates without assuming every parent render can be skipped.

Regression files:

- `tests/layout/render-stability.test.mjs`: providers, commands, inset context,
  palettes, recipe cards and stepper data/theme/locale updates.
- `tests/auth/render-stability.test.mjs`: token renewal, metadata, session
  generation and sign-out.
- `tests/auth/verification-clock.test.mjs`: countdown, idle interval, expiry,
  replacement deadlines and absent/invalid/elapsed deadlines.
- `tests/recipes/creation.test.mjs`: one render per draft edit and latest action.

Baseline logs are `.expo/render-baseline.log` and
`.expo/verification-clock-baseline.log`. The focused run passes **20 tests**, of
which **15** are new render/timer regressions. Output: `.expo/render-focused.log`.

The final shared-workspace `npm run check` passes typecheck, zero-warning lint,
repository formatting and all **409 tests**, including concurrent UI/service
work. Output: `.expo/render-quality-check.log`. Story registration and
`git diff --check` also pass. The dimensions inventory was refreshed to keep its
source links aligned with the edits; sizing formulas are unchanged by this pass.

## Layout calculation follow-up

The follow-up removes unnecessary measurement updates and repeated preparation
of fixed content. Arithmetic such as `Math.min`, `Math.max`, a ratio or inset
subtraction does not request a React render by itself. A state/context update or
subscription does. A same-value `setState` can still call the component before
discarding its result; filtering duplicate external events before the setter
avoids that work. This follows React's
[state setter guidance](https://react.dev/reference/react/useState#setstate).

Implemented:

- `useMeasuredWidth` filters equal, negative and non-finite native widths before
  updating React. The input bridge, iOS sheet and both stepper layout adapters
  reuse this small hook. Input rounding is retained; sheets also retain their
  positive-width guard. Real resizing still updates the native/RN bridge.
- Aurora no longer subscribes to the window dimensions. Its actual container
  layout writes a shared shader resolution, with a safe 1 × 1 initial value and
  duplicate/invalid-report guards. Neither a geometry write nor a window event
  renders its React canvas tree in the fixture.
- The page/splash wave's two immutable SVG paths are parsed once at module load.
  Installed Skia 2.6.2's JS draw processor parses a string on each invocation;
  its native recorder also converts strings through an SVG parser. Supplying
  existing `SkPath` objects removes this repeated parsing. Frame transforms stay
  on the UI thread. Context7 guidance was checked against installed source and
  the official [path documentation](https://github.com/Shopify/react-native-skia/blob/main/apps/docs/docs/shapes/path.md).
- Search's height subscription belongs to its filter viewport. Window resizing
  updates that scroll constraint without rebuilding the results/query screen or
  discarding a filter draft.
- Home card examples cache their translated fixtures and each card collection
  by data/actual card width. Opening/closing a preview and a height-only change
  reuse the cards. Changing editorial width rebuilds only that collection;
  changing language rebuilds the translated content and updates an open preview.

Measured JS evidence:

| Controlled event                                                           | Before                                  | After                                                             |
| -------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------- |
| Duplicate width after a real layout update, in each bridge fixture         | 1 extra component function call         | 0 extra component calls                                           |
| Equal Aurora layout report                                                 | Another shader resolution write         | No write                                                          |
| Window change affecting only Aurora's redundant subscription               | React canvas rerender                   | No React canvas rerender; actual layout still updates shader size |
| Twenty additional JS draw-processing passes over the three page wave nodes | 60 additional SVG parses                | 0 additional parses; 2 at module initialization                   |
| Opening a sample preview                                                   | All 8 card instances rendered again     | 0 card renders                                                    |
| Filter viewport window update                                              | Search owned the dimension subscription | No result/page rerender or query-hook rerun in the new fixture    |

Baseline logs: `.expo/geometry-baseline.log` and
`.expo/showcase-geometry-baseline.log`. The focused run passes **11 tests**, with
**8 new regressions**, in `.expo/geometry-focused.log`. Native views, animation
delivery and parser construction are mocked at their boundaries; the draw
processor and React updates are real. These counts are not native frame times.
Existing bottom-sheet, text-input, stepper, page-motion, Aurora and home-card
stories remain the native composition coverage. Initial shader paint, live
resizing, device gestures and frame rates still need native verification.

The final follow-up `npm run check` passes strict typecheck, zero-warning lint,
repository formatting and all **417 tests**. Output:
`.expo/geometry-quality-check.log`. The refreshed dimensions snapshot lists
11 size-reading sites instead of 12 after removing Aurora's window subscription.

Cheap responsive formulas remain. Removing them would not establish better
performance and could break rotation, safe areas or smaller sheet layouts.
Necessary native/RN width changes still render their small layout adapters.
Static wave geometry, shader compilation and palette conversion occur once;
continuous animation calculations use worklets/shared values rather than React
state. This pass does not claim zero GPU work or zero native layout work.

## Reviewed behavior retained

TanStack Query uses tracked result properties and structural sharing for JSON
data. The reviewed consumers do not spread/rest-destructure query results or opt
into `notifyOnChangeProps: 'all'`; spreading query **options** is different.
`QueryContent` reads fetching, paused, error and cached-data state because the UI
displays those states. Those updates are necessary. The hook's top-level result
object is not stable, so memoizing a child around the whole query object would
not provide the same benefit as stable recipe data. See the official
[render optimization guide](https://github.com/TanStack/query/blob/main/docs/framework/react/guides/render-optimizations.md).

Controlled drafts, meaningful validation changes, query loading/error/refresh
states, navigation focus, measured geometry, theme/direction and locale changes
still render. The skeleton's shared 900-ms endpoint clock intentionally starts
native opacity transitions; it is not a per-frame React animation loop. Reviewed
Skia/Reanimated motion uses shared values/worklets, with LaunchScreen returning to
React only after its exit completes.

The app does not currently opt into React Compiler. This pass applies targeted
memoization to demonstrated work rather than enabling the compiler across the
project. Expo documents compiler setup in its
[React Compiler guide](https://docs.expo.dev/guides/react-compiler/).

## Native coverage and next measurement

The new **Recipes/Compact recipe card** Storybook fixture covers light/dark,
embedded/missing images, long titles, unrelated parent updates and changed likes.
Existing page, auth and recipe-stepper compositions cover the other shared UI.
Story registration is regenerated. These fixtures do not establish native timing.

A release build on an iOS/Android device is still needed to measure commit
durations and frame drops while typing, opening filters, refreshing lists,
switching tabs and animating the stepper. No connected device was available in
this pass, so there is no claim that every remaining render is necessary or that
these changes establish smoother native frame rates.

## Documentation used

Context7 supplied the React context/memo guidance and TanStack Query render
optimization guidance, checked against installed packages and local usage.
Official React references explain
[context identity](https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions)
and [memo behavior](https://react.dev/reference/react/memo).
The project Expo overview, component-library, mobile-UI and animation skills
guided this pass.
