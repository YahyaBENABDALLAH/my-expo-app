**Global project audit — 16 October 2026**

Follow-up: the hosted skeleton timer finding below is resolved. `SkeletonContent`
is now explicitly static, with no animation timers, motion subscriptions, or
nested Hosts; standalone `Skeleton` retains its UI-runtime CSS pulse. Callers,
Storybook fixtures, and regression coverage were updated. The remaining text
records the original audit snapshot.

The application has a sound foundation: thin Expo Router routes, feature modules, native Expo UI adapters, validated API contracts, and tested authentication race protection. The main gaps are incomplete list behavior, inconsistent production separation for development tools, recurring decorative rendering, and missing native CI coverage. The current evidence does not establish a frame-rate regression or guarantee smooth rendering on devices.

This is an analysis of the current working tree, including its existing uncommitted changes. Application code was not changed. Prior audit documents were treated as historical context and checked against current source.

| Requested area            | Assessment                                                               | Main action                                                                  |
| ------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| 1. Architecture           | Clear boundaries, enforced by lint and tests                             | Keep the structure; clarify the role of sample content and development tools |
| 2. Core components        | Native wrappers, semantic themes, useful platform adapters               | Reduce eager content and image mounting before adding abstractions           |
| 3. Routing                | Correct file-based structure and authentication groups                   | Apply production restrictions to development routes themselves               |
| 4. Helpers                | Small focused helpers; important cancellation and session safeguards     | Preserve race protection; avoid generic helper frameworks                    |
| 5. Testing                | 519 passing tests with useful behavioral coverage                        | Add native release validation and repair outdated Maestro expectations       |
| 6. Automation             | CI checks and commit hooks exist                                         | Include the pages suite and native smoke tests in automation                 |
| 7. JavaScript / animation | No `.js`/`.jsx` application files; native/UI-runtime motion predominates | Eliminate recurring JS animation timers where required; measure UI/GPU work  |
| 8. KISS                   | Most layers have a clear purpose                                         | Simplify expensive composition and outdated documentation first              |
| 9. Context7               | Used for Reanimated, React Native performance, and Expo Router           | Cross-check version-sensitive results with SDK 57 docs and installed source  |

**Verification performed.** The project uses npm with `package-lock.json`, Expo `~57.0.27`, React Native `0.86.3`, React `19.2.3`, Expo UI `57.0.21`, Router `57.0.24`, and Reanimated `4.5.1`. Neither `ios/` nor `android/` exists; native configuration follows Continuous Native Generation. The Expo SDK 57 reference matches the installed React and React Native major versions. [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)

| Check                                                                               | Current result                                                    |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `npm run typecheck`                                                                 | Passed                                                            |
| `npm run lint`                                                                      | Passed, zero warnings                                             |
| `npm test`                                                                          | Passed: 519 tests, zero failures or skips                         |
| `npm run format:check`                                                              | Passed                                                            |
| `EXPO_OFFLINE=1 npm exec -- expo install --check`                                   | Reported dependencies up to date, with explicit limitations below |
| Native interaction tests and release frame-time profiling                           | Not run in this audit                                             |
| New native builds, production bundle analysis, full Expo Doctor, live backend flows | Not run in this audit                                             |

The offline compatibility command warns that validation is unreliable offline and excludes `@expo/ui` and `expo-router` because of the existing `expo.install.exclude` configuration. Its success is a limited local check, not a complete dependency or native-build certification. Node on this host was `24.21.0`; CI pins `22.18.0`. Maestro and a booted iOS simulator are available; `adb` is absent. The simulator's installed application was not verified against this working tree, and no release performance trace was captured.

Test totals by script: validation 19; navigation 36; onboarding 12; auth 65; recipes 35; services 118; layout 203; localization 7; architecture 24. Logs from this run are `/tmp/expo-global-audit-tests-2026-10-16.log` and `/tmp/expo-global-audit-format-2026-10-16.log`.

**Priority findings.** P1 means user-visible correctness should be addressed before release. P2 means a concrete coverage, performance-policy, or release-scope gap. Performance risks below are source-based hypotheses unless explicitly identified as measured.

| Priority | Finding                                                                        | Evidence and impact                                                                                                                                                                                                                              |
| -------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P1       | My creations filters the first global recipe page                              | `collection-screens.tsx:182` requests 100 global recipes and filters them by chef locally. A chef whose recipes fall outside that page can see an empty or incomplete collection.                                                                |
| P2       | Several other lists have no path beyond page one                               | Category results use the default 12-item page; liked recipes use a 50-item page; search filter pickers use 20-item lookups. Their consumers do not offer pagination for those lists.                                                             |
| P2       | Development routes are not consistently restricted in production               | The production environment flag hides selected links and blocks Storybook content, but authenticated users can still reach `/ui`, `/ui-component/[name]`, `/skia`, `/maps`, and `/development-pages`. More directly links to the page directory. |
| P2       | Home eagerly mounts 42 card instances                                          | Eight sample items are repeated across six horizontal rails and a bottom list. The current composition creates 49 image views across those cards; source URLs are shared among eight images. This is a native layout/image workload to profile.  |
| P2       | Animated `SkeletonContent` still needs periodic JavaScript work                | One shared interval publishes an endpoint every 900 ms, causing subscribed placeholders to render. Native interpolation handles the intervening frames. This does not satisfy a strict zero-JS-animation-timer policy.                           |
| P2       | Native UI tests are absent from CI and pages are absent from default discovery | The sole GitHub workflow runs the JavaScript checks. `.maestro/config.yaml` lists storybook, auth, and onboarding, excluding `pages/*`.                                                                                                          |
| P2       | An existing direct-entry flow expects removed search UI                        | `.maestro/pages/direct-entry.yaml:26` expects `Searching for: c1, c2, d1`; the current search screen does not render that summary. This stale assertion is hidden from default Maestro discovery.                                                |
| P2       | Ingredient typing changes the query on every keystroke                         | `browse-screens.tsx:55` uses the raw controlled input value in the query key. Recipe search already uses a 300-ms debounce. Uncached ingredient input can start unnecessary requests.                                                            |
| P3       | Historical documentation contradicts current Home                              | The scroll investigation says Home renders live recipes and the skeleton README says Home loads recipe skeletons. Current Home intentionally renders a sample catalog with no recipe query.                                                      |

**1. Architecture.** The current structure is appropriate for this app:

```text
src/app              Route entry points, navigator layouts, error boundaries
src/features         Screen composition and feature workflows
src/components/ui    Shared native controls, presentation, platform adapters
src/services         HTTP contracts, entity queries/mutations, session lifecycle
src/validation       Runtime API schemas and form validation
src/lib + src/hooks  Shared identifiers, feedback, insets, lifecycle helpers
src/context          App-level preferences, auth, locale, query ownership
```

There are 35 route files, 50 feature files, 67 service files, and 144 TypeScript files under shared UI. The folder count alone is not evidence of overengineering. ESLint prevents service-to-feature/UI imports, keeps route files out of reusable modules, and requires feature screens to use the shared UI entry point. Architecture tests exercise those restrictions. See [eslint.config.js](/Users/yahya/Documents/Expo/my-expo-app/eslint.config.js:72).

Keep these boundaries. Avoid reorganizing the repository or merging every service/query/hook into screens. The authentication version checks, serialized storage, cancellation, and cache maintenance address real tested races. Simplifying them away would remove behavior.

The main architectural ambiguity is that product Home imports `HomeCatalogSections`, which intentionally uses sample data and a local-only save state. Tests explicitly enforce the absence of recipe API requests. That is a deliberate current behavior, so connecting Home to a backend would be a product change. Document its status clearly and keep reusable presentation independent of whether its data is sample or live. See [Home](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/home-screen.tsx:9) and [sample catalog](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/home-catalog.data.ts:6).

**2. Core components.** `UniversalHost`, hosted content variants, platform adapters, semantic button variants, and shared theme tokens provide useful consistency. The separation between standalone components and `*Content` inside an existing Host avoids unnecessary native hosting boundaries. `QueryContent` distinguishes idle/offline/loading/error/cached states. These are valuable contracts to preserve.

The strongest current rendering concern is Home composition. Its source creates 3 hero cards, 3 compact rails of 8 cards, 3 landscape cards, 3 artwork cards, 1 giveaway card, and 8 bottom cards: 42 cards. Artwork and metadata result in 49 `expo-image` views, each inside `RNHostView`. These are view counts, not 49 independent network downloads. The page has one vertical scroll owner and six horizontal rails; the older nested-vertical-scroll diagnosis does not describe this Home.

The installed Expo UI scrolling model is eager on Android, and ordinary rows/columns do not virtualize these cards. SDK 57 documents the Compose implementation as rendering all children. [Expo UI ScrollView](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/scrollview/)

First profile mount, layout, image decode, and flings on a release Android build. Reduce repeated sections or use appropriate native lazy containers if the workload causes jank. Check the installed platform APIs before selecting a lazy adapter; do not introduce another UI stack as an audit cleanup. See [section composition](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/home-catalog-sections.tsx:81) and [image boundary](/Users/yahya/Documents/Expo/my-expo-app/src/components/ui/home-recipe-card/home-catalog-card.tsx:58).

Home also changes its Picsum URL seed on each new mount. Images remain stable during saves and previews, but new mounts create different cache keys. If the catalog becomes production content, use stable image identifiers and thumbnail-sized sources; the compact 64-point thumbnail currently shares an 800×450 source. These are resource-efficiency recommendations, not measured memory results.

**3. Routing.** Expo Router owns navigation, with route logic in `src/app`, screen implementation outside it, typed routes enabled, and protected auth/onboarding/app groups. Dynamic recipe/category IDs are validated before data loading. Native stack transitions and the reduced-motion options are appropriate. Context7 and the official docs confirm that protected route guards control navigation access; hiding a link is insufficient. [Protected routes](https://docs.expo.dev/router/advanced/protected/)

Production separation needs one consistent decision. `appDevEnabled` is false in the production EAS profile, yet the root app guard admits the development directory and UI showcase. The hidden Skia and Maps tabs also have no development guard. `href: null` removes a tab link; it does not block a deep link. Disabled Storybook redirects to `/skia`, which remains accessible. See [root registration](/Users/yahya/Documents/Expo/my-expo-app/src/app/_layout.tsx:194), [tab registration](</Users/yahya/Documents/Expo/my-expo-app/src/app/(tabs)/_layout.tsx:35>), and [More actions](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/more-screen.tsx:46).

If those screens are development-only, guard their routes with the same production flag and remove their production entry actions. If any are product features, state that explicitly. Existing tests intentionally permit some showcase content in production; update that contract along with the implementation. Authenticated access to tools is the issue here; this finding does not show an authentication bypass.

The creations list is a separate correctness issue: it cannot find all of a chef's recipes by filtering one global page. Use a documented chef-scoped backend query with pagination. The current `RecipeListQuery` has no chef filter, so adding an invented parameter is not a supported fix. Until backend support exists, present the limitation honestly. Category results, likes, and lookup pickers also need pagination or an explicit bounded product contract. See [creations](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/collection-screens.tsx:182), [category](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/browse-screens.tsx:24), and [lookup/like options](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/queries.ts:21).

**4. Helpers.** `screenInsets`, `entityPath`, `normalizeListQuery`, query key factories, refresh helpers, and error/toast utilities have narrow responsibilities. API reads propagate abort signals and use runtime response validation. Retries are limited to selected transient failures. Session-aware mutations prevent responses from an old login from changing a new user's cache.

Provider values are memoized, token-only auth updates preserve equivalent display users, and motion consumers share lifecycle subscriptions. There is no reason to split every context or add memoization throughout the app without profiler evidence. Likewise, the search screen's `JSON.stringify` of four small values, tiny array filters, and parameter normalization are not credible primary frame-rate suspects on source inspection alone.

The actionable helper-related inconsistency is input request control: reuse the recipe search's debounce behavior for ingredient search while preserving cancellation and page reset. Keep that implementation local or extract one small reusable hook if both callers need it. See [ingredient input](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/browse-screens.tsx:51) and [existing debounce](/Users/yahya/Documents/Expo/my-expo-app/src/features/recipes/search-screen.tsx:73).

**5. Testing.** The 519 tests cover form validation, route parsing, onboarding persistence, auth restoration and token races, transport contracts, cache invalidation, layout/render stability, localization, and architecture boundaries. They include real React hook/update behavior using a custom reconciler fixture and explicit native mocks. This provides meaningful JS behavior evidence.

It cannot prove SwiftUI/Compose layout, real hit areas, keyboard behavior, accessibility, gesture handoff, GPU cost, or frame rate. The custom renderer and private Expo Router imports also need maintenance when React/Router upgrades. Add high-value native smoke coverage around Home scrolling and sheet reopening, auth redirects, form keyboard access, RTL, reduced motion, and production tool restrictions. Repair the obsolete search summary assertion before enabling the pages suite. See [fixture renderer](/Users/yahya/Documents/Expo/my-expo-app/tests/helpers/render-fixture.mjs:1) and [stale assertion](/Users/yahya/Documents/Expo/my-expo-app/.maestro/pages/direct-entry.yaml:26).

**6. Automation.** GitHub Actions performs a reproducible npm install, regenerates Storybook registration, then runs typecheck, lint, formatting, and the test suites through `npm run check`. Husky/lint-staged checks staged edits. EAS profiles separate development, preview, and production, with remote version management and production auto-increment. These are useful foundations.

The missing link is native execution. The only GitHub workflow has no Maestro, native build, bundle-size, or frame-time check. No EAS Workflow definition is present. The default Maestro flow list omits `pages/*`, although `test:e2e:pages` can run it separately. Existing flows target a development client, so a release performance job needs its own build/launch setup. See [quality workflow](/Users/yahya/Documents/Expo/my-expo-app/.github/workflows/quality.yml:23) and [Maestro discovery](/Users/yahya/Documents/Expo/my-expo-app/.maestro/config.yaml:1).

Keep fast checks on every PR. Add a deterministic native smoke job for relevant PRs or a scheduled run; add release performance comparisons after a reproducible baseline exists. Include the pages flows deliberately, supply fixtures/backend prerequisites, and publish failure artifacts. Preserve the small pipeline instead of building a large CI framework immediately.

**7. JavaScript, CSS-style motion, and frame rate.** There are no `.js` or `.jsx` application files under `src`; the application is TypeScript. TypeScript still executes as JavaScript, so file extensions do not establish performance. The useful constraint is: no React state updates or main-JS-thread work on each animation frame, no recurring JS timers solely to drive decorative motion, and bounded UI/GPU rendering.

Reanimated supports CSS-style animation declarations on native views; no browser stylesheet, WebView, or web support is needed. Context7 confirmed the keyframe/timing model and UI-thread execution. The installed Reanimated types expose `animationName` and `animationIterationCount`. [Reanimated CSS animations](https://docs.swmansion.com/react-native-reanimated/docs/css-animations/overview)

| Animation path                                | Current execution                                             | Assessment                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Standalone `Skeleton`                         | Reanimated CSS opacity loop                                   | Fits the requested style; no JS interval or periodic React update                                               |
| Hosted `SkeletonContent`                      | Native interpolation plus one shared 900-ms JS endpoint timer | Remaining policy exception; native frames are smooth independently, but each endpoint still needs JS/React work |
| OTP feedback                                  | Reanimated CSS keyframes                                      | Fits the requested style                                                                                        |
| Stack transitions                             | Native navigation                                             | Appropriate; no reason to reimplement them in CSS                                                               |
| Launch exit                                   | Reanimated timing; one completion callback to RN              | Appropriate one-time coordination                                                                               |
| Header waves, floating action, recipe stepper | UI-runtime worklets and Skia                                  | Avoid main-JS-thread frame loops, but still consume UI/GPU resources and are not CSS animations                 |
| Aurora                                        | Shader driven by a UI-runtime frame callback                  | Android redraw updates are capped around 30 Hz; iOS follows display callbacks; profile full-screen rendering    |

The hosted skeleton timer is documented as a tradeoff: Reanimated cannot directly animate the SwiftUI/Compose modifier tree, and a nested RN Host per shape would add boundaries. To satisfy the stricter requirement, prefer a static `SkeletonContent` as the simplest option, or validate native repeating animation support on both installed adapters. At RN boundaries, use the existing CSS `Skeleton`. Avoid replacing the timer with a React frame loop or adding a Host around every tiny shape. Current product Home does not mount these skeletons; current uses include showcase/Storybook composition. See [CSS loop](/Users/yahya/Documents/Expo/my-expo-app/src/components/ui/skeleton/skeleton.tsx:23) and [endpoint clock](/Users/yahya/Documents/Expo/my-expo-app/src/components/ui/skeleton/use-skeleton-pulse.ts:16).

The global page wave stays active after startup whenever onboarding is complete, including the login screen after sign-out. App backgrounding and reduced motion stop it, but route focus and whether the artwork is actually useful do not control it. The tab action also animates continuously on iOS; its idle animation is disabled on Android. Static decoration by default, or limiting it to screens that need it, is the simplest resource reduction if performance is the priority. Changing those worklets to CSS alone would not remove their drawing cost. See [root wave ownership](/Users/yahya/Documents/Expo/my-expo-app/src/app/_layout.tsx:96).

No `requestAnimationFrame`, per-scroll `setState`, or `runOnJS` animation loop was found in the inspected application source. Other timers handle debounce, toast expiry, verification expiry, resend countdowns, or development demonstrations. They do not have the same performance implications as a frame loop.

Measure release builds on representative Android and iOS devices, separating JS and UI frame times. At 60 Hz a frame has about 16.7 ms; at 120 Hz about 8.3 ms. Compare Home scrolling with the root wave and floating action enabled/disabled individually, and record mount/layout time and image memory. Track p95/p99 frame time and dropped frames rather than claiming a guaranteed FPS from passing unit tests. React Native's performance guidance distinguishes JS and UI frame rates and recommends release-mode evaluation. [React Native performance](https://reactnative.dev/docs/performance)

**8. KISS analogy.** Treat the app like a small restaurant. Routes seat the customer, feature screens coordinate the order, services talk to suppliers, and shared UI provides the utensils. Each has one clear job. A simple order should not require several extra managers, but payment and inventory safeguards should not disappear to make the process look shorter.

Applied here: keep routes thin; keep entity services consistent; preserve concurrency safeguards; use the existing component contract; prefer static decoration; fix list completeness before tuning tiny helpers; reduce repeated Home content before adding memoization everywhere. Keep one authoritative architecture/performance document and mark older audits as historical. The current Home descriptions in [the earlier investigation](/Users/yahya/Documents/Expo/my-expo-app/docs/home-scroll-lag-investigation.md:3) and [skeleton README](../.agents/skills/foodiya-ui-skeleton/SKILL.md) need correction.

**9. Context7 and evidence quality.** Context7 was used to resolve and query three libraries: `/websites/swmansion_react-native-reanimated`, `/react/react-native-website`, and `/websites/expo_dev`. Queries covered native CSS motion, JS/UI thread performance, and protected production routes. The Expo resolver did not provide an SDK 57-specific library version; its generic examples were not treated as version-pinned API authority. Findings were cross-checked with the official SDK 57 reference, the Expo documentation index, and installed source/types. The repository's Expo overview, mobile UI, component-library, and API-service guidance informed the assessment.

Recommended order: fix creations and list completeness; settle production tool access; repair/discover native flows and add CI smoke coverage; apply the strict skeleton animation policy; then profile and simplify Home and persistent artwork. This audit adds documentation only; the findings remain open until implemented and validated.
