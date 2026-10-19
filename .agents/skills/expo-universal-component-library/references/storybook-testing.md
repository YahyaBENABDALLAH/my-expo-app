# Native stories and tests

Keep two groups: **Components** and **Forms**. Stories live in
`.rnstorybook/stories/components/` and `.rnstorybook/stories/forms/`.
Use one interactive story per component; add a separate story only when behavior
needs a different harness. Use Controls for appearance, disabled states and minor
prop variations. Do not recreate page, onboarding, service or decorative demos.

Use typed CSF stories from `@storybook/react-native`, production UI wrappers,
local state and deterministic fixtures. Forms must not call the backend. Reuse
the shared preview theme and `NativeStoryFrame` where appropriate. Native
composition uses an owning Host with Row/Column; keep development imports out of
production code. This project has no web Storybook.

After story changes, run `npm run storybook:generate`, lint and typecheck.

## Verification

- `npm test` runs `tests/components/` and `tests/forms/`.
- `npm run test:components` or `npm run test:forms` runs one JS suite.
- `npm run test:e2e` runs the native component/form flows.

Retain meaningful behavior checks: value/reset, disabled suppression, validation,
submission, dismissal and retry. Avoid source-shape assertions and duplicate
permutations. Shared JS helpers live in `tests/helpers/`.

Native flows live in `.maestro/components/` and `.maestro/forms/`. Reuse
`.maestro/helpers/open-story.yaml` with `STORY_ID` and `READY_ID`; assert a
visible result after interacting. Use native target selectors and readiness
conditions. See [device setup](../../../../docs/native-ui-tests.md) and
[selectors](../../../../docs/storybook-test-ids.md).

JS fixtures mock native boundaries. They do not prove SwiftUI/Compose layout,
keyboard, accessibility, colors or touch geometry. Report native execution
separately; do not claim device verification from registration or screenshots.
