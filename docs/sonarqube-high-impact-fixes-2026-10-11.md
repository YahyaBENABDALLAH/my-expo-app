# SonarQube HIGH-impact fixes — 2026-10-11 UTC

All **10 open HIGH-impact findings are fixed**. The new local analysis reports
**0 open HIGH-impact issues** and marks every original issue `FIXED`. No rule,
severity, source exclusion, or quality-gate threshold was changed to obtain this
result.

[Open HIGH-impact findings](http://localhost:9000/project/issues?id=my-app-expo&impactSeverities=HIGH).
[Dashboard login and scan instructions](sonarqube.md).
[Initial baseline report](sonarqube-report-2026-10-11.md).
The subsequent [MEDIUM-impact pass](sonarqube-medium-impact-fixes-2026-10-11.md)
records the latest results; the figures below describe this HIGH pass.

## Changes

| Function / location                                                                                   | Original finding             | Change                                                                                                                           |
| ----------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `buttonAppearance`, [button types](../src/components/ui/button/universal-button.types.ts)             | Complexity 23                | Select semantic palette roles from a fixed variant table, retaining existing fallbacks.                                          |
| `FormTextInput`, [form input](../src/components/ui/form/form-text-input.tsx)                          | Complexity 20                | Resolve password overrides separately; preserve caller props, observable value, ref, and validation lifecycle.                   |
| `QueryContent`, [query presentation](../src/components/ui/loading/query-content.tsx)                  | Complexity 16                | Separate resolved/empty content selection from error, offline, fetching, and prerequisite presentation.                          |
| `UniversalTextInputContent`, [native input](../src/components/ui/text-input/universal-text-input.tsx) | Complexity 29                | Separate field appearance and trailing-icon composition; preserve the native tree, focus guards, padding, and disabled behavior. |
| `CreateScreen`, [recipe creation screen](../src/features/recipes/create-screen.tsx)                   | Complexity 20                | Give chef eligibility/recovery presentation its own stable component.                                                            |
| `DetailScreen`, [recipe detail screen](../src/features/recipes/detail-screen.tsx)                     | Complexity 24                | Return the invalid-link page after all hooks; separate favorite/like action labels.                                              |
| `useRecipeCreation`, [recipe creation hook](../src/features/recipes/use-recipe-creation.ts)           | Complexity 16                | Group lookup queries, search pagination, and active refresh keys in a private hook; preserve draft and submission guards.        |
| `toApiError`, [API transport](../src/services/api.ts)                                                 | Complexity 16                | Select localized Axios feedback by error kind in a separate function.                                                            |
| Async interceptor error paths, [API transport](../src/services/api.ts)                                | 2 promise-rejection findings | Throw normalized errors from the async handler; preserve cancellation and session-change identities.                             |

Sonar's complexity limit remains 15. Neither the changed functions nor the new
helpers produced another HIGH-impact issue.

## Verified results

| Measure                 | Before   | After |
| ----------------------- | -------- | ----- |
| Open HIGH-impact issues | 10       | **0** |
| Code smells             | 182      | 158   |
| Bugs                    | 3        | 3     |
| Vulnerabilities         | 1        | 1     |
| Duplicate lines         | 0.8%     | 0.8%  |
| New issues              | Baseline | **0** |

The remaining 162 open findings include other severities and the previously
reported blocker. This change targets the requested `impactSeverities=HIGH`
filter.

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run format:check`: passed.
- `npm test`: **417 tests passed**, with no failures or skipped tests.
- `git diff --check`: passed.
- All 426 selected JavaScript/TypeScript files completed analysis.
- Sonar compute task `caadfab0-d2e7-411f-8227-9d0677733a4f`: `SUCCESS`, completed
  at **09:05:55 UTC**. Analysis ID: `4a14dcc0-9d33-4685-864a-3661d7974cac`.

The overall quality gate **fails only on new-code coverage**. Sonar displays 0.0%
against its 80% threshold because no instrumented coverage report is supplied.
This is not a measured execution-coverage result. The new-issue condition passes
with 0 issues, and new duplication passes with 0.0%. The scanner's nonzero exit
code reflects the failing gate; the report was successfully processed.

Native iOS/Android interaction was not verified: no local `adb` command/device
verification was available. Existing native Storybook stories and selectors are
retained. Mocked render tests establish JS behavior, not device appearance,
keyboard behavior, touch geometry, or accessibility.

## Saved evidence

The Git-ignored `.sonarqube-local/` directory contains:

- `high-before.json`, `high-after.json`, and `high-original-status.json` for the
  HIGH filter and the ten original issue statuses.
- `high-scanner.log`, `high-tests.log`, `high-task.json`, `high-measures.json`, and
  `high-quality-gate.json` for the completed analysis and validation.
- `issues.json` and `measures.json` refreshed to the current open findings and
  measures; `issues-baseline.json` preserves the initial issue export.

The scan uses the existing local server, default Sonar way profiles, and the
documented SCM-attribution workaround.
