# Code quality report

This is the earlier route-shell review. See [the Reference tab implementation report](reference-tabs-report.md) for the newer screen/data/Skia changes and current verification results. The auth findings below remain open.

Reviewed: 2026-10-03. Scope: the inventory route shells, navigation layout, password-reset screen, page composition, and tests added in this chat, with their immediate auth/UI dependencies. This is a source review and automated-check report, not a complete security, dependency, performance, or native accessibility audit. Existing unrelated workspace changes were not modified.

## Assessment

The route scaffolding is simple and the automated checks give useful confidence in validation and URL parsing. It is not ready for production: password-reset fields have a confirmed masking defect, recovery state can survive a different recovery link, native interactions remain unverified, and most product behavior is still placeholder content. Passing tests do not establish the original notification-entry goal.

## Check results

| Check                          | Result              | Evidence / limit                                                           |
| ------------------------------ | ------------------- | -------------------------------------------------------------------------- |
| `npm test`                     | PASS: 53 tests      | 14 validation, 20 navigation, 19 auth service/session tests; zero failures |
| `npm run lint`                 | PASS                | Zero warnings/errors under the configured ESLint rules                     |
| `npm run typecheck`            | PASS                | TypeScript contracts pass; native behavior is not evaluated                |
| `npm run format:check`         | FAIL                | Three files listed below                                                   |
| Android device availability    | No connected device | `adb devices` returned an empty list                                       |
| Maestro native page/auth flows | NOT RUN             | No device available; iOS execution unavailable on this Windows host        |
| Coverage percentage            | NOT MEASURED        | No instrumented coverage run; test count is not coverage                   |

Formatting failures: `.agents/skills/expo-overview/agents/openai.yaml`, `.agents/skills/expo-overview/SKILL.md`, and `docs/pages-navigation-plan.md`. This means the repository's aggregate `check` command would currently fail even though lint, types, and tests pass. Node's validation tests also emit a module-type warning; it does not fail tests. Changing the package-wide module type solely to silence that warning would need compatibility review of existing CommonJS tooling.

## Findings, highest priority first

### 1. P1 — Reset passwords render without masking

Confirmed by source: [reset-password-screen.tsx](../src/features/auth/screens/reset-password-screen.tsx) passes `secureTextEntry` for the new-password and confirmation fields (lines 59 and 68), but does not pass the wrapper's `password` flag. [form-text-input.tsx](../src/features/auth/components/form-text-input.tsx) defaults that flag to `false` and assigns `secureTextEntry={password && !showPassword}` after spreading incoming props (line 55). That overwrites the screen's `true` value with `false` for both fields.

Impact: a user entering a recovery password gets an unmasked field, despite the screen intending to mask it. Schema tests and empty-submit Maestro assertions cannot detect this.

Recommended correction: use the wrapper's `password` prop on both fields and verify masked-by-default behavior plus deliberate visibility toggling on iOS and Android. Consider excluding `secureTextEntry` from the wrapper's public prop type so future callers cannot make the same ineffective override.

### 2. P2 — Recovery state is not scoped to the challenge

Confirmed source behavior: [reset-password-screen.tsx](../src/features/auth/screens/reset-password-screen.tsx) reads a changing `challengeId` at line 19, but initializes `saved` only once (line 21). Form defaults and pending mutation state are also retained by the same component instance. There is no challenge-change reset or stale-response check before `setSaved(true)` at line 28.

Trigger: update the recovery URL on an already mounted reset screen. After a completed challenge A, challenge B can keep the old success state and hide B's form. If A is pending when B arrives, A's response can mark the screen successful for B. Draft credentials and validation errors can also carry across challenges. The exact external-link instance reuse must be confirmed on a native run; the component itself does not handle prop/parameter changes.

Recommended correction: scope the form instance to the normalized challenge and invalidate responses from a previous challenge. Add tests for A → B while idle, after success, and while A's response is pending; verify B never inherits A's success or draft.

### 3. P2 — Navigation tests do not verify the application's protected layout

[router.test.mjs](../tests/navigation/router.test.mjs) supplies synthetic exports (`default: () => null`) and hardcodes the auth layout's initial route in `discoverRoutes` (lines 36–45). Its guarded-history test manually changes StackRouter route names. These tests exercise route discovery, the installed URL parser, and router mechanics; they do not execute the actual `Stack.Protected` declarations or auth predicates.

Impact: removing a guard from the app layout or changing its real initial route can leave these tests green. This is a coverage gap, not evidence that the current guards are broken. The new signed-out Maestro guard flow would exercise the app, but has not run.

Recommended correction: run signed-out guard flows against the real layout and add an application-level test for authenticated/signed-out transitions when a suitable native harness is available. Keep the pure parser tests, but describe them as parser/discovery tests. Internal `expo-router/build/...` imports and the VM adapter also need revalidation on SDK upgrades.

## Incomplete capabilities and verification gaps

These are disclosed implementation gaps, separate from defects in finished behavior:

- Product pages in `src/features/pages/screens.tsx` mostly show availability messages. Recipe/category/search/collection queries, creation and chef forms, settings/preferences, ingredient detail sheets, and actual health diagnostics are absent. The page count indicates destinations exist, not that Reference features are implemented.
- There is no notification response coordinator or pending authenticated destination implementation under `src`. A signed-out protected link is redirected to Login; no implemented mechanism retains and consumes its requested destination after authentication. Startup notification handling, deduplication, and real delivery are not established by the parser tests.
- Native flows have never executed here. YAML syntax, Node parsing, and TypeScript cannot prove SwiftUI/Compose rendering, selectors, scrolling, safe areas, keyboard behavior, or Back behavior.
- Page Storybook examples use an empty action list and `tab: true`. They cover static/long content but do not exercise action callbacks or the Back/Home fallback. Native page flows cover some of those interactions once run.
- No tests currently exercise password-reset API success, API failure with draft preservation, retry, or a stale response following a new recovery link. Existing auth service tests cover other lifecycle concerns, not this screen's complete mutation lifecycle.
- `/UI` compatibility normalization remains unfinished; only canonical `/ui` exists. This is documented in the plan.

## What is working well

- Thin route files keep feature code outside `src/app`, with one canonical detail route per entity.
- The five visible product tabs and More links keep navigation understandable; the empty Reference center tab is replaced by a redirect.
- Page content uses the current native Expo UI wrappers and shared semantic colors. No new UI kit or query client was added.
- Password-reset validation tests use the production schema, check exact boundaries and error paths, and preserve significant password whitespace.
- URL tests assert decoded parameter values, not just route existence. Existing auth tests cover concurrency, offline restoration, credential rotation, and late-response handling.
- Drafts are retained on ordinary mutation failure and repeat submission is blocked by the existing auth form hook.

## Recommended next actions

1. Correct the password masking prop contract and add a native regression check.
2. Scope recovery state/responses to the challenge and test challenge changes.
3. Run the page and auth suites on Android, then iOS; verify selectors and actual guard behavior.
4. Implement the pending destination and notification coordinator, then test signed-out cold start → login → requested detail, duplicate taps, and logout cleanup.
5. Complete product queries/forms using the planned route-driven TanStack Query approach.
6. Resolve the three formatting failures and expand page Storybook interaction coverage.

Report only: no application defects were changed during this review.
