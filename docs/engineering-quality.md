# Engineering quality report — 2026-10-11

This is a historical report. Its recipe screens, startup timings and automated
suites describe the state recorded below. Current ownership and commands live in
[architecture](architecture.md), [development](development.md) and the
[implementation plan](white-label-template-plan.md). Automated suites are removed;
`npm run check` runs TypeScript, lint and formatting.

Verified 2026-10-11 against Expo SDK 57. The change preserves the existing feature
architecture and native component library while improving product behavior and
adding checks that prevent regressions.

## Product behavior

- Home leads with recipe search, categories and live recipes. Local card samples,
  demonstration controls and timed skeletons live in **UI showcase → Recipe UI
  examples**. Each recipe appears once; an unranked API result is no longer labeled
  as a popularity or editorial selection.
- Search filters remain a draft until **Apply filters**. Cancel and native dismissal
  preserve the applied criteria. Applying filters and committing debounced text
  start at page one. Filter counts replace raw identifiers; successful empty
  searches offer reset. Catalog requests run while the filter sheet is open,
  and its content scrolls on shorter screens.
- Startup follows font, language and authentication readiness. There is no fixed
  branding hold; existing artwork exits in 300 ms, immediately under reduced
  motion. Restoration failures release the overlay to expose recovery.
- Recovery forms are keyed by their validated challenge. A changed link clears
  passwords and success state; an old response cannot complete the new form.
  Both password fields declare masking and independent visibility toggles.
- New copy is supplied in English, French and Arabic. Existing theme, direction
  and settings edits in the shared workspace are preserved.

## Reliability and boundaries

The shared query client retries network failures and HTTP 408/500/502/503/504
once. Other HTTP failures, response validation errors, cancellations, obsolete
sessions and unexpected programming errors do not restart a read. Authentication
refresh remains in the HTTP client; authenticated mutations retain session guards
and disabled retries. Missing API configuration is a distinct error and fails
before transport, without retrying or exposing configuration in user messages.

The API follow-up classifies normalized errors as HTTP, network, timeout,
configuration, invalid response or unexpected failure. Status zero defaults to an
unexpected failure unless transport evidence identifies a connection error.
Timeouts use the configured request duration and distinct localized feedback;
Axios aborts are not mislabeled as timeouts. Setup/storage diagnostics stay out of
user messages. Cancellation suppression is shared by cache and imperative toast
paths. Infinite pagination advances only when the returned page matches the
requested page and the total includes another page; contradictory metadata stops
further requests. Existing response schemas, scoped mutation invalidation and
session generation checks remain in place.

ESLint's scoped import policies compose common restrictions, because a later
flat-config rule replaces earlier rule options. Transport services cannot own
React rendering or cache effects; recipe screens cannot import transport, storage
or showcase fixtures; domain rules stay independent of I/O. Production restrictions
survive overrides for services, domain modules and shared UI. Regression probes
execute ESLint against forbidden and permitted imports. These scoped rules are not
a complete dependency-cycle or dynamic-import analyzer.

`npm run check` runs strict types, zero-warning lint and formatting.
The GitHub Actions workflow installs locked dependencies
with Node 22.18.0, regenerates Storybook registration and runs the same command.
Automated test suites and architecture probes have been removed. The workflow has not been run on a hosted runner in this chat.

## Verification

Completed checks:

- `npm run check`: strict typecheck, zero-warning lint, repository formatting and
  all **354 tests** pass. Output: `.expo/tech-lead-check.log`.
- A separate source snapshot without `Reference/`, `.env.local`, generated Expo
  files or generated Storybook registration also passes all checks after story
  generation. It reused installed dependencies and local Node 26.7.0; dependency
  installation and the configured Node 22.18.0 still need a hosted CI run.
  Output: `.expo/tech-lead-clean-check.log`.
- Android and iOS production JavaScript/Hermes exports pass under
  `.expo/tech-lead-review/android` and `.expo/tech-lead-review/ios`. These are bundle
  exports, not native builds or device runs.
- Storybook registration was regenerated; `git diff --check` passes.

The API follow-up adds **20 regression tests** for transport errors and pagination.
Its isolated review snapshot uses committed revision `72b66f3` plus the data-layer
changes, without concurrent bottom-sheet UI edits. `npm run check` passes **374
tests**, typecheck, zero-warning lint and formatting in that snapshot. It reuses
installed dependencies and the local Node runtime. Output:
`.expo/data-layer-isolated-check.log`. The shared workspace's API/auth-focused
checks also pass. After the concurrent UI work was updated, the full shared
workspace passed `npm run check` with **378 tests**, including typecheck,
zero-warning lint and formatting. Output: `.expo/data-layer-check.log`.
No live backend requests or native device runs were performed for this follow-up.

The [React render follow-up](render-performance-audit.md) adds **15 regressions**
for stable provider values, token-only updates, current tab handlers, unchanged
card/stepper props and verification timing. The final shared workspace passes
`npm run check` with **409 tests**, strict typecheck, zero-warning lint and
formatting. Output: `.expo/render-quality-check.log`. These counters establish
JS render behavior; native frame rates have not been measured.

The layout-calculation follow-up adds **8 regressions** for duplicate native
measurements, actual shader layout, parsed wave reuse, isolated filter resizing
and cached example cards. `npm run check` passes **417 tests**, typecheck,
zero-warning lint and formatting. Output: `.expo/geometry-quality-check.log`.
Native first paint, live geometry and frame rates remain unverified.

ADB is unavailable on this host. Native screens, keyboard behavior, sheet fit,
large text, accessibility and release motion remain unverified. JS fixtures test
behavior with native views substituted at the boundary; they do not establish
native rendering or frame rates. The affected device flow is
`.maestro/pages/search-filters.yaml`; startup's Ready/Waiting stories exercise the
production component.

## References

The Expo overview, API-services, mobile-UI, design-system and component-library
skills guided the changes. Context7 supplied TanStack Query v5 retry behavior and
Axios error/timeout handling, plus ESLint 9 import-policy guidance, checked against
installed packages.
Primary references:
[Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/),
[splash lifecycle](https://docs.expo.dev/versions/v57.0.0/sdk/splash-screen/),
[native scrolling](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/scrollview/),
[React Native 0.86 window dimensions](https://reactnative.dev/docs/0.86/usewindowdimensions),
[TanStack retries](https://tanstack.com/query/v5/docs/framework/react/guides/query-retries),
[Axios errors](https://axios-http.com/docs/handling_errors),
[ESLint configuration](https://eslint.org/docs/latest/use/configure/configuration-files),
and [GitHub's Node CI guide](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs).
