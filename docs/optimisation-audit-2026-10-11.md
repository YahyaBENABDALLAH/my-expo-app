# Project optimisation review — 2026-10-11

Reviewed Expo SDK 57, React 19.2.3, React Native 0.86.3 and Reanimated 4.5.1.
The review covers startup and background artwork, shared UI and animation
lifecycle, recipe screens, scrolling, queries and development tooling. Findings
come from source inspection and real React hook/render fixtures with native views
substituted at their boundary. These are not device FPS, memory or battery measurements.

## Implemented

### CSS-style animation for standalone skeletons

[Skeleton](../src/components/ui/skeleton/skeleton.tsx) now runs an opacity loop
through Reanimated CSS keyframes on its existing native Host. It keeps the Expo UI
shape, dimensions, semantic theme colour, caller opacity and accessibility rules.
The pulse takes 900 ms per direction, from full opacity to 45% of the caller's
opacity, with an ease-in-out curve. There is no extra view, pulse interval or
periodic React update. Reduced motion and backgrounding remove the animation and
restore the configured static appearance; callers can pass `animate={false}`
when unfocused.

This uses CSS-style properties supported by the installed native animation
library, not a `.css` stylesheet or WebView. See the
[SDK 57 Reanimated reference](https://docs.expo.dev/versions/v57.0.0/sdk/reanimated/)
and [CSS animation documentation](https://docs.swmansion.com/react-native-reanimated/docs/css-animations/overview/).

`SkeletonContent` lives inside a SwiftUI/Compose tree. Its modifiers cannot be
targeted directly by Reanimated's RN style animation. It retains one shared
900-ms endpoint clock and native interpolation. Converting each content shape
would require additional RN bridges and Hosts; the standalone conversion avoids
that overhead. Its endpoints can still be delayed by a busy JS runtime.
Production recipe queries currently use native progress indicators; animated
content skeletons are demonstrated in Storybook.

### Shared animation lifecycle subscriptions

[useMotionEnabled](../src/hooks/use-motion-enabled.ts) now shares one AppState
listener, one reduced-motion listener and one initial accessibility read across
visible animation consumers. Previously each consumer created its own pair of
listeners and asynchronous read. Equal native events do not publish updates.
Hidden consumers do not subscribe, and the last visible consumer releases the
native subscriptions. A live accessibility event takes precedence over an older
async result; a disposed subscription's result cannot affect a new subscription.
The synchronous Reanimated startup setting remains the fallback if the read fails.

Controlled evidence:

| Fixture                                      | Result                                                                 |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| Ten visible motion consumers                 | One AppState listener, one accessibility listener, one setting read    |
| Duplicate app/motion events                  | Zero additional consumer renders                                       |
| Standalone skeleton over ten pulse endpoints | Zero intervals and zero additional shape renders                       |
| Static standalone skeleton                   | No motion hook subscription; flexible width and zero opacity preserved |
| Background/reduced-motion changes            | Motion stops and resumes according to the current setting              |
| Last subscriber unmounts                     | Both native subscriptions released                                     |

The fixtures do not run Reanimated's native animation engine. The updated
[skeleton stories](../.rnstorybook/stories/expo-ui/skeleton.stories.tsx) include
`CSSAnimationControls` for fixed/flexible width, custom opacity and pause/resume,
alongside the existing native-content examples.

## Remaining opportunities

These are source-supported follow-ups, not measured speedup claims.

| Priority                     | Finding and evidence                                                                                                                                                                                                                                                                                                                                 | Suggested next change                                                                                                                                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High: data and request scope | `CreationsScreen` in [collection-screens.tsx](../src/features/recipes/collection-screens.tsx) fetches the first 100 recipes across all chefs, then filters locally by chef UUID. It transfers unrelated recipes and can omit the current chef's recipes beyond that page. The current `RecipeListQuery` has no chef filter.                          | Add a paginated chef-specific backend endpoint/filter and matching service contract. Verify page two and empty results; changing the client filter alone cannot solve completeness.                                          |
| High: profile first          | [Root layout](../src/app/_layout.tsx) keeps a full-screen [Aurora shader](../src/components/ui/aurora-background/aurora-background.tsx) and header wave mounted after onboarding. The shader updates its clock on every frame; the header and floating action also animate. UI-runtime animation removes JS rendering work but still costs GPU work. | Compare the current effects with static artwork on the slowest supported Android release build. Measure UI frame time and sustained power use before choosing a lower frame cadence or changing the requested visual design. |
| Medium: request volume       | `IngredientsScreen` in [browse-screens.tsx](../src/features/recipes/browse-screens.tsx) changes the query key on every keystroke. Recipe search already waits 300 ms.                                                                                                                                                                                | Debounce the ingredient query criteria while updating the input immediately, reset pagination when the committed search changes, and retain cancellation and offline handling.                                               |
| Medium: hidden requests      | `MyRecipesScreen` observes favorites, history and likes without a route-focus gate. `SavedRecipesScreen` observes both tabs' queries even though it displays one. Home and search already gate remote queries by route focus.                                                                                                                        | Gate remote reads by focus/selection while retaining cached results and authenticated-query prerequisites. Verify that refresh targets the selected collection and that returning to the screen fetches stale data.          |
| Medium: list scale           | Favorites/history render up to 50 recipe cards through `.map()` inside the native scroll container; creations can render up to 100. All card/image trees are mounted. Home's eight cards and search's 12-item pages already bound that cost.                                                                                                         | Add pagination or one virtualized scroll owner for longer collections, preserving Expo UI card content, safe areas and pull to refresh. Avoid nesting another vertical list inside `PageScreen`'s scroller.                  |

Already useful: memoized recipe cards and provider values, query caching and
request cancellation, debounced recipe search, focus-gated Home/search requests,
static development Home skeletons, UI-runtime artwork and motion guards.
Preserve the tested session-generation and serialized-storage safeguards.

## Verification

- Typecheck and the 11 focused skeleton/motion tests pass. Six new regression
  tests exercise timer/render work, accessibility races and shared cleanup.
- Native Storybook registration regenerated successfully.
- `npm run check` passes typecheck, zero-warning lint, repository formatting and
  all **468 tests**. Log: `.expo/optimisation-check.log`. Two existing preview
  fixtures lacked mocks for `OtpBottomSheet` and `UniversalTextContent`; their
  native boundaries were supplied without changing the assertions or app behaviour.
- `git diff --check` passes.
- Android `adb devices -l` reports no connected devices. Native iOS/Android CSS
  rendering, clipping, width negotiation and reduced-motion toggles still require
  device verification; no release performance claim is made.
