# SonarQube MEDIUM-impact fixes — 2026-10-11 UTC

All **42 open MEDIUM-impact findings are fixed**. The completed local analysis
reports **0 open MEDIUM** and **0 open HIGH** findings and marks every original
MEDIUM issue `FIXED`. Comparison with the preceding analysis found no new issues.
The scan retains the existing rules, severity settings, source scope and gate.

[MEDIUM findings](http://localhost:9000/project/issues?id=my-app-expo&impactSeverities=MEDIUM).
[Dashboard and scan instructions](sonarqube.md).
[Previous HIGH fixes](sonarqube-high-impact-fixes-2026-10-11.md).
The subsequent [duplication cleanup](sonarqube-duplication-fixes-2026-10-11.md)
records the latest analysis; the figures below describe this MEDIUM pass.

## Changes

| Rule    | Original findings | Resulting behavior                                                                                                                                                                                             |
| ------- | ----------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `S3358` |                30 | Separate nested conditional choices in native adapters, screens, query fixtures, theme resolution and auth error handling. Existing labels, native controls, query states and animation targets are preserved. |
| `S2137` |                 3 | Rename built-in-shadowing story exports to `ErrorState` and `Numeric`, preserve display names, update the loading Maestro story selector and regenerate registration.                                          |
| `S6481` |                 3 | Memoize adjusted Storybook insets by their content edges; use stable module constants for zero-inset providers.                                                                                                |
| `S6478` |                 2 | Move the tab-bar render function to module scope while retaining the component boundary. Name the private stepper render callback `renderArtwork(width)` in both adapters.                                     |
| `S1121` |                 1 | Assign an empty session separately from returning it, retaining version and storage guards.                                                                                                                    |
| `S2245` |                 1 | Generate new installation IDs with Expo Crypto's secure UUID generator. Keep valid stored UUIDs, shared concurrent work and retries after failures.                                                            |
| `S6479` |                 1 | Key ingredient rows by their sort order, name and unit instead of their array index.                                                                                                                           |
| `S8786` |                 1 | Trim trailing API URL slashes with a linear backward scan, preserving whitespace normalization and internal path content.                                                                                      |

`expo-crypto ~57.0.3` was installed with `npx expo install expo-crypto` for SDK 57.
The [versioned Crypto documentation](https://docs.expo.dev/versions/v57.0.0/sdk/crypto/)
and installed implementation confirm that `randomUUID()` uses cryptographically
secure UUIDv4 generation. Rebuild the development/release native binary to include
this dependency before running the changed app in an existing custom build.

Component READMEs and the project UI catalog document the affected contracts.
Existing native Storybook compositions remain available. Loading's initial-error
story ID is now `expo-ui-loading-state--error-state`; TextInput's renamed IDs end
in `--error-state` and `--numeric`.

## Verification

| Measure              | Before this pass | After |
| -------------------- | ---------------: | ----: |
| Open MEDIUM findings |               42 | **0** |
| Open HIGH findings   |                0 | **0** |
| Total open findings  |              162 |   120 |
| Bugs                 |                3 |     0 |
| Vulnerabilities      |                1 |     0 |
| Code smells          |              158 |   120 |
| Duplicate lines      |             0.8% |  0.8% |

The remaining findings have **119 LOW impacts and 1 BLOCKER impact**. Their
classification as code smells does not change their impact severity.

- `npm run lint`, `npm run typecheck`, `npm run format:check`: passed.
- `npm test`: **422 passed**, no failures or skipped tests.
- New regressions cover retaining stored installation IDs, retrying native UUID
  failures without a fallback, generator calls across storage failures, and API
  normalization with long trailing/internal slash runs.
- Existing native adapter, form, auth/session race, query-state, geometry and
  render-stability checks passed.
- `npm run storybook:generate` and `git diff --check`: passed.
- All 426 selected JavaScript/TypeScript source files completed analysis.
- Compute task `59e3bf5f-c468-45d4-9ccf-dca71653b529`: **SUCCESS**, completed
  **09:24:02 UTC**. Analysis ID: `8ce4f492-bba2-46db-9785-a4a71e2554ba`.

The quality gate **fails only on new-code coverage**: Sonar displays 0.0%
against the 80% requirement because no instrumented coverage report is supplied.
New issues (0) and new duplication (0.0%) pass. The scanner exit code is 1 for
that gate failure; the analysis was successfully uploaded and processed.

Native iOS/Android interaction was not verified on devices. Mocked checks do not
establish native geometry, keyboard/focus behavior, touch targets or accessibility.

## Saved evidence

The Git-ignored `.sonarqube-local/` directory contains `medium-before.json`,
`medium-after.json`, `medium-original-statuses.json`, `medium-all-before.json`,
`medium-all-after.json`, `medium-new-issues.json`, and `high-after-medium.json`.
Validation and scan evidence is saved in `medium-tests.log`, `medium-lint.log`,
`medium-typecheck.log`, `medium-format.log`, `medium-scanner.log`,
`medium-task.json`, `medium-measures.json` and `medium-quality-gate.json`.
The shared current issue, measure and gate exports were refreshed; prior HIGH
and baseline evidence remains available.
