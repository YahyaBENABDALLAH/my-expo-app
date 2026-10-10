# White-label production audit — 2026-10-04

**Verdict: the existing architecture is a useful foundation, but the app is not ready for a white-label production release.** Automated checks and bundling pass. Component coverage, consistent branding, product workflows, native verification and iOS configuration still need work.

Scope: current working tree, including staged, unstaged and untracked source; iOS and Android; all universal Expo UI components plus the three requested replacements; Storybook; theme; authentication; TanStack Query; services; product data; release configuration. `Reference/` was excluded. All packages and lockfiles were retained, including unused dependencies.

The review used Context7 for Expo UI theming, TanStack Query v5 native lifecycle/cancellation and Axios refresh/cancellation. Context7 has no pinned SDK 57 source snapshot for every API: examples were checked against the SDK 57 docs and installed `@expo/ui` **57.0.21** types/native source. Installed Expo is **57.0.26**, React Native **0.86.3**, TanStack Query **5.104.0**, and Axios **1.20.0**. The linked `latest` Expo UI pages currently describe SDK 57; this report records the installed version rather than assuming `latest` remains stable.

## Focused fixes completed in this review

- `UniversalHost` defaults its native `seedColor` to the active shared accent, or its existing auth/button palette accent, while preserving explicit seeds. This supplies Android Material colors and iOS native tint without another theme provider.
- Text-input content, recipe cards and recipe stepper content now inherit the owning Host's forced light/dark scheme. Explicit component overrides remain supported.
- Android refresh uses `tint`/`surface` tokens, fills the viewport and explicitly sets `contentAlignment="topCenter"`. iOS refresh applies the active tint while retaining native positioning. Centering means horizontally centered at the top of the scroll viewport. Hidden/disabled scrolling installs no refresh interaction; pending pulls still share one request and complete safely after failure.
- `PageScreen` accepts an optional scheme for deterministic previews. Added a dark refresh story and inherited light/dark input compositions. Removed eight default Storybook seed literals that bypassed brand tokens; deliberate custom-color examples remain.
- Added 13 native-prop and interaction regressions for Host seeds, field inheritance/overrides, themed refresh, hidden/disabled behavior and pending-request deduplication. These execute real JS compositions with native boundaries mocked; they do not establish rendered native geometry.

These are narrow corrections. They do not complete the larger changes identified below.

## Universal component and Storybook coverage

All **19 universal components** have an implementation or native export. Fifteen have dedicated stories, ListItem has shared List coverage, and three infrastructure components have only implicit composition coverage. Of the requested extras, SegmentedControl exists; DateTimePicker and Menu are missing from the project UI API and Storybook.

| Component        | Project implementation                   | Storybook status / remaining check                                                             |
| ---------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Host             | UniversalHost                            | Implicit; add focused scheme/seed, sizing and nesting cases                                    |
| Column           | Native export                            | Dedicated; replace remaining default fixture color literals                                    |
| Row              | Native export                            | Implicit; add narrow layout, alignment and RTL composition                                     |
| Text             | Native export + UniversalText/content    | Dedicated; remove duplicated default color literals, verify font scaling                       |
| Button           | Semantic native platform adapters        | Dedicated; six intents, overrides, disabled and activation; verify native contrast/tap bounds  |
| ScrollView       | Native export + refresh adapters         | Dedicated + refresh composition; native centering/tint still unverified                        |
| Switch           | Native export                            | Dedicated; controlled, disabled, long label                                                    |
| Slider           | Native export                            | Dedicated; boundaries, steps, disabled                                                         |
| Checkbox         | Native export                            | Dedicated; controlled, disabled, long label                                                    |
| BottomSheet      | Native export                            | Dedicated; opening, dismissal, detents; verify inner native Host theme                         |
| Collapsible      | Native export                            | Dedicated; expansion and long content                                                          |
| FieldGroup       | Native export                            | Dedicated; sections and controlled fields                                                      |
| Icon             | Native export                            | Dedicated; verify icon-only action labels and passive icon traversal                           |
| List             | Native export                            | Dedicated; native grouped list, not a general virtualized product feed                         |
| ListItem         | Native export + Android selector adapter | Shared List slot/interaction coverage                                                          |
| Picker           | Native export                            | Dedicated; menu/wheel, disabled, long labels                                                   |
| RNHostView       | Native export                            | Implicit; add bridge sizing and narrow-container composition                                   |
| Spacer           | Native export                            | Dedicated; fixed/flexible axes                                                                 |
| TextInput        | UniversalTextInput/content               | Extensive dedicated states; new Host-inheritance fixtures                                      |
| DateTimePicker   | Missing                                  | Add themed adapter only where necessary, cancellation/confirmation, bounds and date/time cases |
| Menu             | Missing                                  | Add actions, disabled/destructive options, long labels and accessibility                       |
| SegmentedControl | Existing iOS/Android adapters            | Pages/Segmented navigation; add disabled behavior to public contract                           |

The installed package already supplies DateTimePicker at `@expo/ui/community/datetime-picker` and Menu at `@expo/ui/community/menu`. No dependency installation is needed. Keep the existing segmented adapters unless a concrete limitation warrants changing them. Reuse native exports when a wrapper would add no theme, behavior or platform adaptation.

## Remaining findings, ordered for implementation

### 1. P1 — One brand change does not propagate across the app

[App colors](../src/constants/colors.ts), [auth colors](../src/components/ui/auth/auth-theme.ts:4), [navigation artwork palettes](../src/constants/navigation-action-theme.ts:15) and launch artwork are independent sources. The Host fix themes ordinary controls, but does not consolidate these palettes. Navigation uses Expo Router's default navigation themes in [the root layout](../src/app/_layout.tsx:146), rather than mapping all navigation colors to the app palette. Some default story text/backgrounds still repeat palette hex values.

Brand identity is also scattered: `app.json` contains the app name, scheme and package IDs; [LaunchScreen](../src/components/ui/launch-screen/launch-screen.tsx:77) and the account screen contain “Likan”. Launch forces dark appearance and literal artwork colors, while map/Skia route fallbacks also contain literals. These choices prevent complete light/dark and brand substitution.

**KISS change:** one typed build-time brand configuration for identity/assets and one semantic light/dark token source. Have auth, navigation, launch, stories and native controls consume it. Add only repeated, useful spacing/typography/radius tokens. Use named foreground tokens for semantic filled surfaces; do not introduce a general theme engine or a large wrapper hierarchy.

Host seeding produces a native palette; it does not guarantee exact hex values on every Android control. Installed BottomSheet creates its own inner native Host, so outer seed inheritance alone does not establish sheet theming. Check this on both platforms before claiming every control matches the brand.

The current auth light success foreground/background pair (`#FFFFFF` on `#12A150`) has a calculated contrast ratio of approximately **3.37:1**. It needs review if used for normal-sized semantic action text; actual native typography and rendered states must be checked. A single `onAccent` value is not automatically suitable for every semantic surface.

### 2. P1 — Development demonstrations are visible in production

[Home](../src/features/recipes/home-screen.tsx:43) always renders “Skeleton preview” and “Browse all pages”. [More](../src/features/recipes/more-screen.tsx:42) links development pages and diagnostics. [The root stack](../src/app/_layout.tsx:168) registers development destinations under authentication alone. The release Storybook route redirects to the Skia demo.

**KISS change:** gate demo entry points and matching route availability with `__DEV__`; redirect the production Storybook destination home. Keep the source, packages and Storybook for future development. A guard must cover direct links as well as hidden buttons. Treat placeholder health diagnostics as out of release scope until implemented.

### 3. P1 — iOS Firebase configuration prevents a native build

[app.json](../app.json:11) enables Firebase plugins but omits `ios.googleServicesFile`. The installed RNFirebase app plugin explicitly requires that plist during prebuild. Android's configured Firebase package matches the app ID.

**KISS change:** supply the correct plist per branded iOS bundle ID and reference it in app configuration. Do not hand-edit generated native projects. Verify the installed RNFirebase setup before selecting linkage options; its current React Native path uses SPM, so older static-framework recipes are not automatically applicable. A successful iOS JS export does not resolve this native build blocker.

### 4. P1 — Password recovery state belongs to the route instance, not its challenge

[ResetPasswordScreen](../src/features/auth/screens/reset-password-screen.tsx:24) retains its form, mutation state and `saved` flag when `challengeId` changes. A completed or late response for challenge A can hide challenge B's form or leave A's password/code draft visible.

**KISS change:** move the stateful form into a small subtree keyed by the validated challenge ID. Completion from the old form must affect only that old instance. Add challenge replacement and late-response regressions. Password masking is already fixed in current FormTextInput; earlier reports listing unmasked reset fields are stale.

### 5. P1 — Collections and selection catalogs silently stop at the first page

[Creations](../src/features/recipes/collection-screens.tsx:155) loads the first 100 public recipes and filters them locally. [Liked recipes](../src/features/recipes/queries.ts:50) stops at 50. Category recipes stop at the default 12. [Lookup options](../src/features/recipes/queries.ts:30) expose the first 20 choices, and creation/search pickers offer no additional pages. Existing infinite-query service helpers do not make these screens complete automatically.

**KISS change:** connect the existing pagination helpers to screens and add catalog paging/search. Proper creations scaling needs a documented owner endpoint/filter; do not invent a backend parameter absent from the current contract. A home preview may be intentionally limited, but a full collection must not report empty merely because matching records are on page two.

### 6. P2 — A successful chef POST can be repeated after local persistence fails

[Chef creation](../src/services/chef-profile/chef-profile.mutations.ts:36) completes the server POST before persisting profile metadata. If storage fails, cache maintenance is skipped and [the screen](../src/features/recipes/become-chef-screen.tsx:58) permits another POST. A source-level probe confirmed one successful POST followed by storage failure yields a rejected mutation and no seeded detail.

**KISS change:** retain the confirmed profile and offer retry of metadata persistence/reconciliation. Do not repeat creation to repair a local failure. Keep the existing generation checks so account switching cannot attach the profile to a different session.

### 7. P2 — Corrupt local collections cannot recover or even clear

[Collection reads](../src/features/recipes/collections.ts:25) and [all writes](../src/features/recipes/collections.ts:45), including Clear history, parse the same stored JSON without corruption recovery. A malformed value permanently blocks that collection. This was reproduced with a malformed persisted history value.

**KISS change:** share one validated collection loader and recover only the corrupt account/kind entry. Preserve genuine storage I/O errors as retryable failures. Test malformed JSON, obsolete card shapes, clear/rewrite and isolation of another account.

### 8. P2 — Like state is derived from the last mutation rather than the server

[Recipe detail](../src/features/recipes/detail-screen.tsx:62) uses `like.isSuccess` to show “Liked”. Reopening an already-liked recipe offers another create operation. Existing delete support is not exposed by product screens.

**KISS change:** read account/recipe like state through the existing query layer and select the existing create/delete mutation from that state. Test revisit, unlike and account switching.

### 9. P2 — Root error recovery bypasses the component/theme contract

[The root layout](../src/app/_layout.tsx:29) exports Expo Router's default ErrorBoundary. Its installed implementation displays `error.message` in production and uses hardcoded RN black/white controls. It does not follow this app's semantic Expo UI component contract.

**KISS change:** use a small sanitized, token-aware native recovery boundary based on ScreenError. It must work outside AuthProvider, expose retry and avoid showing raw exceptions to production users.

### 10. P2 — Responsive and reusable component contracts remain incomplete

[RecipeCard](../src/components/ui/recipe-card/recipe-card.tsx:27) fixes image width at 260 while page/card horizontal padding consumes another 72 points; this exceeds the available image width on a 320-point viewport. [SegmentedControlProps](../src/components/ui/segmented-control/segmented-control.types.ts:1) has no disabled state. Infrastructure stories do not yet exercise the full theme/sizing contract.

**KISS change:** constrain media to available content width, add disabled semantics where the control needs them, and exercise the shared primitives at narrow widths, large text sizes, RTL and both schemes. Keep specialized RN boundaries for images/maps/Skia; use Row/Column/Spacer for ordinary composition.

## TanStack Query assessment

**Keep the current architecture.** It already has a single QueryClient/Axios transport, normalized entity keys, separate finite/infinite namespaces, signal forwarding, native focus/connectivity subscriptions and schema validation before responses enter caches. Query presentation distinguishes disabled prerequisites, paused offline requests, fetching, empty success and cached refresh/failure. Refresh targets exact active screen queries.

Authenticated mutations disable retries and deferred offline replay, preserve session ownership, cancel detail reads before replacement and await required cache maintenance. Auth storage serializes writes and protects token rotation/logout against stale-session races. Those safeguards address tested failures and should not be removed merely to reduce line count.

A small remaining improvement is the [read retry policy](../src/lib/react-query.ts:18): it excludes malformed-response errors but still retries terminal HTTP responses such as 403/404 once. Restrict retries to suitable transient/network failures, with deliberate handling for throttling. Use TanStack Query for server state; retain local form/interaction state in React and local persistent collections behind their current query adapters. No new state-management library is needed.

## Verification and release limits

| Check                                                       | Result                                                                                       |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Repository typecheck, zero-warning lint and formatting      | Pass                                                                                         |
| Full automated suite                                        | 232 passing tests: 19 validation, 20 navigation, 37 auth, 12 recipes, 79 services, 65 layout |
| New regressions in this review                              | 13 passing                                                                                   |
| Storybook registration                                      | Regenerated after story changes                                                              |
| Expo Doctor                                                 | 21/21 pass                                                                                   |
| SDK dependency compatibility                                | Pass with network verification                                                               |
| Android production Hermes export                            | Pass; output under `.expo/all-page-rtl-export`                                               |
| iOS production Hermes export                                | Pass; output under `.expo/all-page-rtl-export`                                               |
| Staged/unstaged whitespace checks                           | Pass                                                                                         |
| Native device/Maestro execution                             | Not run: ADB reports no connected device; no iOS simulator available                         |
| Native release binaries, signing and live backend workflows | Not verified                                                                                 |
| Production dependency audit                                 | 28 affected-package entries: 25 high, 3 moderate, 0 critical                                 |

The npm audit entries propagate three advisory families through installed dependency chains; they are not 28 proven exploitable mobile vulnerabilities. Review build/runtime reachability and SDK-compatible remediation. Several automatic suggestions downgrade Expo, React Native or native modules incompatibly. No audit force fix, package removal, installation or version change was performed.

Initial Hermes compilation was denied inside the shell sandbox; both exports succeeded after the compiler was allowed to execute. Export success establishes bundling, not native buildability or runtime behavior. Existing Node module-type/deprecation warnings are separate from the successful zero-warning ESLint check; package configuration was retained as requested.

There is no current notification integration or operational OTA configuration. Treat those as future capabilities unless included in the intended release scope; installed unused packages may remain. Confirm branded EAS environment values, signing, server authorization, real login/recovery/publication/likes and device behavior before approving a release.

## Small implementation order

1. Consolidate build-time identity and semantic tokens; add DateTimePicker/Menu and focused Host/Row/RNHostView stories.
2. Isolate production routes/demos, replace the root error boundary, and scope recovery forms to their challenge.
3. Complete pagination and account state; repair chef partial-success and corrupt-collection recovery.
4. Supply branded native configuration, review applicable dependency advisories, build release binaries and run iOS/Android flows in both themes.

Do not redesign services, add a second query client, replace valid native controls, add unused wrapper layers or delete reserved packages. The required work fits the existing architecture.

## Documentation checked

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) and [Expo documentation index](https://docs.expo.dev/llms.txt).
- [Universal UI catalog](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/) and [Host native theme contract](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/).
- [PullToRefreshBox](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/pulltorefreshbox/) for alignment and indicator colors; installed SwiftUI modifier implementation for tint/refresh completion.
- User-requested [DateTimePicker](https://docs.expo.dev/versions/latest/sdk/ui/drop-in-replacements/datetimepicker/), [Menu](https://docs.expo.dev/versions/latest/sdk/ui/drop-in-replacements/menu/) and [SegmentedControl](https://docs.expo.dev/versions/latest/sdk/ui/drop-in-replacements/segmentedcontrol/), cross-checked with installed exports/types.
- Context7 returned official [TanStack React Native lifecycle guidance](https://tanstack.com/query/latest/docs/framework/react/react-native), [query cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation) and [Axios cancellation](https://axios-http.com/docs/cancellation) examples. Installed source and existing behavioral tests were used to assess the application's implementation.

## Follow-up: live LTR / RTL

Implemented **the persistent LTR / RTL toolbar above every page** without a restart
or navigation remount. Auth, tab, detail, map, tool and Storybook routes share it.
The direction control is a native theme-aware switch: off selects LTR and on selects RTL.
The frame consumes the top safe area once and preserves physical side/bottom insets.
Expo Router's public `LocaleProvider`, local RN direction and all shared
native Hosts use the same state. Native sheet content gets a theme/direction bridge;
the stepper mirrors its artwork; the action stays centered with logical offsets;
Android's back arrow changes explicitly because SDK 57 ignores XML `autoMirrored`.

Added four native Storybook fixtures and a Maestro flow for switching while a
draft and sheet stay mounted. Nine new JS update tests pass, including repeated
flips in both themes, native Host identity, draft preservation, sheet callbacks,
back-arrow selection and tab-bar insets. Five further tests cover the persistent
toolbar, top/side/bottom insets, selector prefixes and signed-in/signed-out root
navigation without remounting. These establish the React/native prop
contract, not device rendering.

The latest full check passes **248 tests** (19 validation, 20 navigation, 37 auth,
12 recipes, 79 services, 81 layout), typecheck, zero-warning lint and formatting.
Both production Hermes exports pass under `.expo/all-page-rtl-export`. Package files remain
unchanged. Native RTL appearance, keyboard focus and back gestures remain unverified
without connected iOS/Android devices. The manual preference is session-only and
does not translate content. See [live direction usage](layout-direction.md).
