# Engineering quality and product cleanup

Reviewed 2026-10-10 against Expo SDK 57. The change preserves the existing feature
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

ESLint's scoped import policies compose common restrictions, because a later
flat-config rule replaces earlier rule options. Transport services cannot own
React rendering or cache effects; recipe screens cannot import transport, storage
or showcase fixtures; domain rules stay independent of I/O. Production restrictions
survive overrides for services, domain modules and shared UI. Regression probes
execute ESLint against forbidden and permitted imports. These scoped rules are not
a complete dependency-cycle or dynamic-import analyzer.

`npm run check` runs strict types, zero-warning lint, formatting, behavioral tests
and architecture probes. The GitHub Actions workflow installs locked dependencies
with Node 22.18.0, regenerates Storybook registration and runs the same command.
Localization tests use a checked-in key contract, so a fresh checkout does not
require the ignored local `Reference/` directory. The workflow has not been run on
a hosted runner in this chat.

## Verification

Final results follow the completed checks. JS fixtures test behavior with native
views substituted at the boundary; they do not establish native rendering, frame
rates or accessibility. The affected device flow is
`.maestro/pages/search-filters.yaml`; startup's Ready/Waiting stories exercise the
production component.

## References

The Expo overview, API-services, mobile-UI, design-system and component-library
skills guided the changes. Context7 supplied TanStack Query v5 retry behavior and
ESLint 9 import-policy guidance, checked against installed packages.
Primary references:
[Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/),
[splash lifecycle](https://docs.expo.dev/versions/v57.0.0/sdk/splash-screen/),
[native scrolling](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/scrollview/),
[React Native 0.86 window dimensions](https://reactnative.dev/docs/0.86/usewindowdimensions),
[TanStack retries](https://tanstack.com/query/v5/docs/framework/react/guides/query-retries),
[ESLint configuration](https://eslint.org/docs/latest/use/configure/configuration-files),
and [GitHub's Node CI guide](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs).
