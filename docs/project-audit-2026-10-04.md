# Project audit — 2026-10-04

Follow-up: implementation and verification for items 3, 4, 8, 9, 10 and 11 are tracked in [the production fixes plan](production-fixes-plan.md). The assessments below remain the original audit baseline.

The architecture and service tests provide a useful foundation. The project does **not yet meet the requested production criteria**: button semantics and Expo UI usage are inconsistent, recovery state can belong to an old challenge, collection/catalog screens omit available results, and native verification remains incomplete.

This is an analysis of the current working tree, including existing staged, unstaged, and untracked work. Application code, package manifests, lockfiles, and dependencies were not changed by this audit. The new deliverables are this report and ignored Maestro logs under `.expo/project-audit-2026-10-04/`.

Installed versions checked directly: Expo **57.0.26**, Expo UI **57.0.21**, React **19.2.3**, React Native **0.86.3**, TanStack Query **5.104.0**, Skia **2.6.2**, and Zod **4.6.5**. These are installed versions; some manifest ranges begin at earlier compatible versions.

## Requested checklist

| #   | Area                                            | Assessment                                       | Main action                                                                                                                                                                   |
| --- | ----------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Architecture                                    | Good foundation, with remaining coupling         | Keep thin routes, feature screens, pure domain rules, and separate transport/query/mutation layers. Give tab actions a typed kind instead of deriving it from display labels. |
| 2   | API services and error handling                 | Strong core; partial-success recovery needs work | Preserve cancellation, session guards, refresh deduplication, and cache maintenance. Distinguish a completed server write from failed local persistence.                      |
| 3   | Only Expo UI                                    | Fails the strict requirement                     | Replace remaining React Native rendered controls/text, or explicitly document an accepted exception for the resilient error boundary.                                         |
| 4   | Row / Column / Spacer                           | Mostly adopted                                   | Keep native layout inside a Host. Replace remaining ordinary content layouts where appropriate; retain RN infrastructure for safe areas, keyboards, and canvas positioning.   |
| 5   | Maintainability                                 | Generally sound                                  | Unify the product button contract, decouple labels from behavior, and remove confirmed obsolete web paths.                                                                    |
| 6   | Testing                                         | Good service tests; incomplete native evidence   | Add the missing recovery/partial-success regressions and complete device interaction checks on Android and iOS.                                                               |
| 7   | Code / test / Storybook lines                   | Measured                                         | See the inventory below; test volume is not coverage.                                                                                                                         |
| 8   | Explicit primary / secondary / semantic buttons | Fails                                            | Require an explicit role at every app button call site and use the shared semantic palette.                                                                                   |
| 9   | Loading states                                  | Partially correct                                | Separate fetching, offline, disabled, error, empty, and successful states; avoid fixed startup delays.                                                                        |
| 10  | Zod validation                                  | Good forms; incomplete trust boundaries          | Validate important API responses and the persisted session before consuming them.                                                                                             |
| 11  | Unnecessary logic/code; packages untouched      | Targeted cleanup candidates                      | Simplify native-only no-ops and presentation coupling. Keep useful race guards and public entity APIs. No package changes are required for the recommended code work.         |

## Verification completed

| Check                                                                   | Result                                                                                                                                                            |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`                                                     | Passed                                                                                                                                                            |
| `npm run lint`                                                          | Passed, zero warnings                                                                                                                                             |
| `npm test`                                                              | Passed: **134 tests**, zero failures/skips                                                                                                                        |
| `npm run format:check`                                                  | Passed before adding this report; the report is checked separately                                                                                                |
| Mocked source probe: malformed stored user UUID                         | The real session module accepted an object as `user.uuid`                                                                                                         |
| Mocked source probe: chef POST succeeds, storage fails                  | One successful server response; mutation rejects and returned detail is not cached                                                                                |
| Android Maestro: recipe stepper, input icons, error toast               | Attempted; stopped during the first app bootstrap, with repeated Windows file-lock errors in Maestro's heartbeat storage. No completed native interaction result. |
| iOS native checks / release-device performance / live backend workflows | Not performed                                                                                                                                                     |

Test totals: 19 validation, 20 navigation, 30 auth/API/session, 7 recipe collection/mutation, 48 service/cache/refresh, and 10 layout/resolution tests. Node emits module-type warnings when directly loading TypeScript; these did not fail the tests. Changing the package-wide module mode is not necessary for this audit.

An Android emulator (`emulator-5554`, Android 17) and the app package were available, with Metro listening on port 8081. The attempted native command was `maestro test --udid emulator-5554 --no-ansi --test-output-dir .expo/project-audit-2026-10-04/maestro .maestro/storybook/recipe-stepper.yaml .maestro/storybook/text-input-icons.yaml .maestro/storybook/error-toast.yaml`. The run did not finish the `app-ready` bootstrap assertion. This is an inconclusive native check, not a demonstrated UI regression or a successful device test.

## Source findings and recommended fixes

### 1. P1 — Reset-password state is not scoped to the recovery challenge

Evidence: [reset-password-screen.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/auth/screens/reset-password-screen.tsx), lines 19–28.

The route reads `challengeId`, but `saved` and the form draft belong to the mounted screen. After challenge A succeeds, opening challenge B on the same route can retain “Password updated” and hide B's form. An in-flight request for A can also call `setSaved(true)` after the route has moved to B. The auth-flow provider's request sequencing does not protect this direct reset-password action.

Mount the form under a validated challenge key, and scope completion/error callbacks to that challenge and mount lifetime. Add regressions for A-success → B, A-pending → B, and navigation away before A completes. Retain the draft on a failure for the same challenge.

The older password-masking finding is **resolved in the current source**: [form-text-input.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/auth/components/form-text-input.tsx), line 69, preserves `props.secureTextEntry` when its `password` convenience prop is absent. The previous reports should not be used as current proof that passwords are unmasked. Native masking behavior still needs device verification.

### 2. P1 — Creations and other lists omit available records

Evidence: [collection-screens.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/recipes/collection-screens.tsx), lines 128–152; [queries.ts](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/recipes/queries.ts), lines 28–36 and 48–51; [create-screen.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/recipes/create-screen.tsx), lines 80–99 and 180–200.

“My creations” fetches only the first 100 public recipes, then filters by chef. A chef's recipes outside that page are missing, and an empty filtered first page can say there are no recipes despite later matching results. The caption acknowledges the limitation, but this is still an incomplete collection.

Liked recipes stop at 50 without paging. Several category/cuisine/difficulty/unit pickers consume only the first 20 catalog items; ingredients have search/paging, but the other pickers do not. The bounded 50-item local history/favorites policy is separate and may be intentional.

Prefer a documented owner-specific backend read for creations. The supplied `RecipeListQuery` does **not** expose a chef filter, so do not invent one. With the present contract, expose paging or use the existing infinite-query infrastructure and make completeness explicit. Add paging/search for catalogs that can exceed the first page. Test a matching creation on page 2 and selectable catalog items beyond item 20.

### 3. P2 — Product buttons bypass the semantic button contract

Evidence: [universal-button.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/components/ui/button/universal-button.tsx), lines 12–17 and 35–38; [auth-button.d.ts](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/auth/components/auth-button.d.ts), line 8; [create-screen.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/recipes/create-screen.tsx), lines 202 and 234; [collection-screens.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/recipes/collection-screens.tsx), line 115.

Across recipe/page feature source there are **36 direct universal Expo UI Button JSX sites; 29 omit `variant`**. This static count includes the development guest exit site and reusable query/page compositions; it is not the number of rendered buttons. Of 15 `AuthButton` JSX sites, four omit its variant. The semantic `UniversalButton` is used in Storybook rather than product screens. Its own variant and semantic variant remain optional with primary defaults.

Consequently “Clear history”, “Remove ingredient”, “Remove step”, profile actions, retries, and publication can receive the same implicit appearance. Explicit `outlined` or `text` values at other sites provide a native appearance but do not establish a shared business intent.

Use an Expo UI button content component that works inside the screen's existing Host. Require an explicit project variant such as primary, secondary, link, success, warning, or destructive; map it to native appearance and shared colors. Keep a separate hosting adapter only where RN composition requires it. Add an import restriction for direct product `Button` use and use TypeScript to make the project variant mandatory. Avoid nesting a new Host around every button inside an existing native layout.

### 4. P2 — “Only Expo UI” is not consistently applied

Evidence: [launch-screen.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/launch/launch-screen.tsx), line 101; [map-unavailable.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/maps/map-unavailable.tsx), lines 30–48; [skia-experience.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/skia/skia-experience.tsx), lines 27–60; [screen-error.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/components/screen-error.tsx), lines 14–54; loading fallbacks in `src/app/(tabs)/`.

The static inventory found 17 React Native `Text`, three `Pressable`, two `ScrollView`, and three `ActivityIndicator` JSX sites across nine source files, including development/fallback paths. `themed.tsx` also retains the template's RN text adapter. Ordinary UI in the map fallback and Skia demonstration can use Expo UI while retaining the map and Skia canvas as specialized native content.

The error boundary intentionally uses RN controls so a failure in an optional native UI module does not also break the recovery screen. That is a reasonable resilience tradeoff, but it conflicts with the literal current requirement and needs an explicit exception if retained. RN `View`, keyboard avoidance, safe-area handling, gesture roots, AppState, and canvas containers are infrastructure; their presence alone is not a violation.

### 5. P2 — Startup introduces a fixed five-second delay and three-second exit

Evidence: [root layout](C:/Users/pc/Desktop/EXPO/my-app-expo/src/app/_layout.tsx), lines 23 and 54–62; [launch-screen.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/launch/launch-screen.tsx), lines 20 and 44–60.

After fonts load, the branding overlay waits five seconds before its three-second exit starts. With reduced motion enabled the exit is immediate, but the five-second timer still remains. Navigation can already be ready underneath; these delays are not derived from required startup work. The overlay stops intercepting touches when exit begins, so five seconds is the fixed interaction block and approximately eight seconds is the normal total visual sequence.

Tie startup visibility to actual readiness, and use a brief optional exit transition. Keep the branding asset if desired without imposing a minimum wait. Verify time to first useful interaction in a release build.

### 6. P2 — A completed chef creation can be presented as a failed submission

Evidence: [chef-profile.mutations.ts](C:/Users/pc/Desktop/EXPO/my-app-expo/src/services/chef-profile/chef-profile.mutations.ts), lines 35–43; [become-chef-screen.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/recipes/become-chef-screen.tsx), lines 17–19 and 46–56.

The POST can succeed before `updateAuthUser` fails to persist local metadata. That rejects the mutation before success cache maintenance/navigation, leaving the creation form available for another POST. A mocked probe against the real modules confirmed one successful response, a rejected mutation, and no cached detail. The existing metadata-storage test verifies session integrity, not recovery of this already-created server resource.

Represent this as a completed server write with a local synchronization problem. Retain the returned profile and offer reconciliation/storage retry instead of repeating creation. Test server success followed by failed local storage and assert that recovery performs no second POST.

### 7. P2 — Loading, disabled queries, and chef lookup failures are conflated

Evidence: [query-content.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/recipes/query-content.tsx), lines 22–43; [create-screen.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/recipes/create-screen.tsx), lines 50–57; [collection-screens.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/recipes/collection-screens.tsx), lines 122–155.

`QueryContent` correctly handles paused offline reads and preserves cached content. However, every no-data/no-error state except paused becomes “Loading…”, including disabled queries with `fetchStatus: idle`. Development guest access to account-dependent collections illustrates this indefinitely idle state. After a toast disappears, a failed first read also retains only a Retry button, without persistent explanatory error text.

Creation treats an absent chef UUID plus a non-fetching lookup as requiring a chef profile, even if lookup failed or paused offline. Creations gives the same prompt while the profile lookup is still pending. These states should not imply that a known chef needs to register again.

Use explicit fetching/offline/disabled/error/empty states. Keep persistent query error context beside Retry, and make “no profile exists” depend on a successful completed lookup. Preserve the current offline-aware refresh and cached-data behavior. Use Expo UI native progress components if a spinner is needed; textual loading feedback is otherwise valid.

### 8. P2 — Zod does not yet protect important response/session boundaries

Evidence: [api.ts](C:/Users/pc/Desktop/EXPO/my-app-expo/src/services/api.ts), lines 240–257; [auth.session.ts](C:/Users/pc/Desktop/EXPO/my-app-expo/src/services/auth/auth.session.ts), lines 42–68 and 79–81.

Form schemas, recipe drafts, chef input, reset-link validation, and persisted recipe cards already use Zod. API generics supply compile-time types only; `response.data` is returned without runtime validation. Persisted auth data is cast to `AuthSession` and normalized with limited checks. A source probe confirmed that a stored object-valued user UUID is accepted. Malformed pagination/detail data can likewise reach components that expect arrays and nested metadata.

Add runtime schemas at high-value boundaries: token/auth-flow responses, stored auth session, pagination envelopes, and consumed recipe details. Derive DTOs from schemas where practical and validate once at the boundary. Expand gradually according to actual contract risk; duplicating every internal type check throughout components would add unnecessary code. Test structurally valid JSON with wrong field types, malformed response arrays, and invalid session metadata.

### 9. P2 — Native test evidence is incomplete and the main E2E command omits page flows

Evidence: [Maestro root config](C:/Users/pc/Desktop/EXPO/my-app-expo/.maestro/config.yaml), lines 1–3; [page config](C:/Users/pc/Desktop/EXPO/my-app-expo/.maestro/pages/config.yaml); [navigation tests](C:/Users/pc/Desktop/EXPO/my-app-expo/tests/navigation/router.test.mjs), lines 36–45 and 88–105.

The root `.maestro` suite lists Storybook and auth flows, while the page suite needs its separate command. Running only `test:e2e` therefore does not include the five page flows. No CI workflow was found in `.github/workflows` or `.eas/workflows`.

The Node navigation tests use real Router parsing/router logic with stubbed screen modules. Their assertion about retained login draft verifies route parameters, not the rendered react-hook-form draft. Native module-resolution tests prove Metro resolves platform implementations, not that gestures, focus, keyboard avoidance, or accessibility work on-device. Those are useful tests with narrower claims.

Include all intended native suites in the release verification path, and add deterministic device cases for recovery challenge changes, duplicate submission prevention, actual form-draft preservation, offline/retry states, password visibility, and publication success/error. Existing Maestro interactions assert visible state, which is stronger than screenshots alone. The current attempted Android run remains inconclusive; iOS and release-mode performance are unverified.

### 10. P3 — Simplify obsolete native-only branches and label-driven navigation logic

Evidence: [Skia route](<../src/app/(tabs)/skia.tsx>), lines 15–24; [native AsyncSkia](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/skia/async-skia.native.tsx); [client-only helper](C:/Users/pc/Desktop/EXPO/my-app-expo/src/hooks/use-client-only-value.ts); [tab actions](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/pages/tab-actions.tsx), line 3; [reference-tab-bar.tsx](C:/Users/pc/Desktop/EXPO/my-app-expo/src/features/pages/reference-tab-bar.tsx), lines 38–51.

On native, `useClientOnlyValue(false, true)` always returns true and `AsyncSkia` renders nothing. Web loading code, `+html.tsx`, `.web` fallbacks, and the CanvasKit copying script remain despite the configured iOS/Android-only scope. These are concrete cleanup candidates; remove obsolete code/configuration references together while retaining package declarations as requested.

The tab bar derives action kind from exact English labels such as “Submit recipe” and “Open active search filters”. A copy or translation change can alter the action icon/style. Put the kind in `TabAction` explicitly. The trivial `UniversalSpacer` re-export also adds no theme or project behavior; use the direct Expo UI primitive unless preserving that public wrapper has a documented purpose.

Do not remove the session generation, serialized storage queue, cancellation checks, submission ref, or native input synchronization effects as “extra logic”: they prevent real races and have behavioral tests. The sixteen-entity service catalog exposes public hooks that some screens do not consume yet; lack of a current caller alone does not make that deliberate API surface useless.

## Architecture, layout, and Skia assessment

The 32 route files total only 365 physical lines. Most compose or re-export features; domain rules stay outside `src/app/`. Services use a shared Axios transport, typed options, normalized parameters, separate finite/infinite keys, forwarded abort signals, and dedicated mutation cache maintenance. ESLint encodes several useful dependency boundaries. SecureStore persists the token pair atomically as one value; session generations prevent late responses from another account being applied. Local recipe collection writes are serialized per account/key.

The app query provider connects network and application focus to TanStack Query. Catalog freshness differs from frequently changing recipe/profile data. Authenticated writes attempt once instead of silently waiting offline and replaying under another session. These are intentional production patterns worth retaining.

Native layouts already use Row/Column heavily: 34 Column and five Row JSX sites from Expo UI APIs in source, plus platform-specific stacks. Spacer appears in the library adapter and iOS glass composition; the adapter is demonstrated in Storybook. These are source declaration counts, including platform components. There is no reason to insert Spacers where the layout only needs fixed inter-item spacing. The RN dock's fixed-width center slot and multiple Hosts deserve a focused native-layout simplification, without converting legitimate canvas/overlay positioning into native stacks mechanically. Expo documents Host boundaries and native layout behavior in its [SDK 57 UI guide](https://docs.expo.dev/versions/v57.0.0/sdk/ui/).

Skia animations generally pass shared/derived values directly into drawing props, following [Skia's Reanimated guidance](https://github.com/shopify/react-native-skia/blob/main/apps/docs/docs/animations/reanimated3.md). The flame, wave, and stepper include cancellation and motion guards; `useMotionEnabled` tracks AppState and live reduced-motion changes. This is stronger than a startup-only accessibility snapshot. The Aurora shader still creates a clock and lacks the same live visibility/AppState gate. Consolidate only where the component needs that lifecycle behavior. Seven dynamically rebuilt flame paths, gradients, the global wave, and decorative dock layers should be profiled on a release device before adding more effects. No FPS, allocation, or battery measurements were made, so this is a profiling recommendation rather than a measured performance defect.

Normal search pages are bounded at 12 results and home displays eight; lack of virtualization there is not automatically a bug. If collections or forms grow substantially, use the installed Expo UI native lazy primitives after checking their platform contracts. Do not introduce another UI/list dependency solely to satisfy this audit.

## Line inventory

| Category                                                  | Files | Physical lines | Nonblank lines |
| --------------------------------------------------------- | ----: | -------------: | -------------: |
| Application `src/`, including types and declaration files |   256 |     **10,432** |          9,653 |
| Automated `*.test.mjs` files                              |    17 |      **2,328** |          2,217 |
| Test helpers                                              |     2 |            138 |            133 |
| Tests plus helpers                                        |    19 |      **2,466** |          2,350 |
| Storybook `*.stories.tsx`                                 |    24 |      **2,673** |          2,566 |
| Storybook support, excluding generated registration       |     4 |             76 |             64 |
| Storybook total, excluding generated registration         |    28 |      **2,749** |          2,630 |
| Maestro YAML, including four helpers and two configs      |    31 |      **1,141** |          1,140 |

There are 25 Maestro flow files: six auth, fourteen Storybook, and five page flows. Counts include current untracked source and exclude `node_modules`, `.expo`, generated `storybook.requires.ts`, assets, documentation, `Reference/`, package/lock/config files outside these categories, and generated Android code. Physical lines include comments and blanks; a trailing newline does not add an extra line. Storybook lines and test lines are separate categories, not production-code coverage.

Application breakdown: services 2,527 lines; features 3,438; components 2,627; types 786; routes 365; remaining validation/lib/hooks/context/constants/guards 689. The largest source files are `api.ts` at 345 lines, the flame at 310, the floating action at 287, the recipe stepper at 281, and the creation screen at 264. Those sizes alone do not justify fragmentation; extract repeated behavior or meaningful responsibilities.

## Assertion quality and testing gaps

The static test review found **99 declared test callback bodies and 307 assertion calls**, averaging **3.10 assertions per source callback**. Loops expand those declarations to 134 executed tests, so static assertion totals must not be treated as runtime invocation totals. No assertion-free callback or literal always-true/self-equality assertion was found. Schema round-trip checks use nontrivial normalization/boundaries and are not inherently tautological.

| Assertion facet                                                          | Source callbacks using it | Assessment                                                                        |
| ------------------------------------------------------------------------ | ------------------------: | --------------------------------------------------------------------------------- |
| Exception acceptance/rejection                                           |                        29 | Useful coverage of failed storage, invalid input, cancellation, and session races |
| Deep structural checks                                                   |                        43 | Checks payloads, query keys, cached values, and route/access shapes               |
| Negative checks, including rejected operations and expected false states |                        55 | Good evidence for no replay, no invalidation, and no cross-account mutation       |

These categories overlap. Equality/string/collection/boolean/state checks are also present; exact categories for those can depend on the asserted expression's meaning. Type and approximate-number assertion APIs are not needed merely to increase diversity. Behavioral gaps matter more than adding assertion volume.

Examples with useful depth include `query cancellation aborts Axios and a late response never enters the cache`, `session changes during cache cancellation cannot delete the new account cache`, and `failed local logout remains visible as a failure and can be retried`. These verify effects and forbidden outcomes, not just returned objects. The source loader executes actual transport/query/business modules while replacing network/storage boundaries. It does not provide React component rendering coverage.

Prioritize regression tests for `ResetPasswordScreen` challenge replacement, chef creation after persistence failure, malformed session/response structures, second-page creations, full catalog selection, and the idle/disabled state of `QueryContent`. Extend existing native fixtures and helpers rather than installing a test package. No instrumented code coverage percentage or visual regression comparison was produced.

## Documentation used

Context7 was used for Expo/Expo UI, React Native, TanStack Query, React effects, and Skia animations. Its examples were cross-checked with installed code/types and versioned documentation where relevant; older SDK examples were not treated as SDK 57 API proof.

- Expo version/SDK contract: [SDK 57 reference](https://docs.expo.dev/versions/v57.0.0/) and [Expo documentation index](https://docs.expo.dev/llms.txt).
- Native UI, Host boundaries, and Row/Column/Spacer: [SDK 57 Expo UI](https://docs.expo.dev/versions/v57.0.0/sdk/ui/) and [universal components](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/).
- Native button appearance versus project intent: [SDK 57 universal Button](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/button/). The required semantic role is your project rule, not an Expo requirement.
- Query paused/fetching/idle semantics: [TanStack Query v5 network modes](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode). The page identifies its current documentation as v5.
- Effects for external native synchronization versus unnecessary derived state: [React effects guidance](https://react.dev/learn/you-might-not-need-an-effect).
- Rendering shared values directly with Skia: [official Skia animation documentation source](https://github.com/shopify/react-native-skia/blob/main/apps/docs/docs/animations/reanimated3.md). Current main includes newer Skia examples; advice here is limited to patterns supported by installed 2.6.2 types.
- Runtime validation: [Zod basics](https://zod.dev/basics).
- Scope of Node and native testing: [React Native testing overview](https://reactnative.dev/docs/testing-overview).

Recommended implementation order: challenge-scoped recovery; complete collection/catalog pagination; required semantic Expo UI buttons and remaining control migration; partial-success recovery and boundary validation; explicit loading/error states and startup simplification; then complete native release checks and remove verified obsolete code. Keep package files and versions unchanged throughout that code-only work.
