# SonarQube report — 2026-10-11 UTC

This is the initial baseline. See the [HIGH-impact fix report](sonarqube-high-impact-fixes-2026-10-11.md)
for the subsequent code changes and current results.

The local analysis completed successfully and reported **186 issues: 1
vulnerability, 3 bugs, and 182 code smells**. These are scanner classifications;
the review below distinguishes them from demonstrated application failures.

[Open the dashboard](http://localhost:9000/dashboard?id=my-app-expo).
[Login and repeat-scan instructions](sonarqube.md).

## Measured results

| Measure                         | Result                                             |
| ------------------------------- | -------------------------------------------------- |
| Vulnerabilities                 | 1                                                  |
| Bugs                            | 3                                                  |
| Code smells                     | 182                                                |
| Security hotspots               | 0                                                  |
| Severity totals                 | 1 blocker, 10 high, 56 medium, 119 low             |
| Duplicate lines                 | 0.8%                                               |
| Lines of code                   | 17,531                                             |
| Production files metric         | 380                                                |
| Coverage                        | Not measured; Sonar displays 0.0% without a report |
| Quality gate                    | Passed; no conditions evaluated on this first scan |
| Typecheck, lint, formatting     | Passed                                             |
| Full unit/regression test suite | Passed                                             |

The gate response was `status: OK` with `conditions: []`. A passing initial gate
does not establish that existing code is free of issues or that coverage meets a
target. Use this scan as a baseline for subsequent changes.

In Sonar's current software-quality model, there are 1 security issue, 4
reliability issues, and 181 maintainability issues. These classifications differ
from the legacy vulnerability/bug/code-smell categories above.

## Findings to review first

1. **Installation ID uses `Math.random()` — security finding.**
   [device-installation.ts](../src/services/auth/device-installation.ts), line 14,
   rule `typescript:S2245`. The generator produces a UUID-shaped installation ID
   and persists it in SecureStore. It is sent as device metadata in authentication
   requests. Confirm how the backend treats this identifier; the available client
   code does not prove that predicting it grants access. Prefer a cryptographic
   UUID generator, especially if device trust depends on unpredictability.
   [Sonar issue](http://localhost:9000/project/issues?id=my-app-expo&issues=a987dbb2-b462-4ddd-907b-2e281b417862).

2. **All three reported bugs are Storybook export names.**
   `Error` in [loading-state.stories.tsx](../.rnstorybook/stories/expo-ui/loading-state.stories.tsx),
   line 110; `Error` and `Number` in
   [text-input.stories.tsx](../.rnstorybook/stories/expo-ui/text-input.stories.tsx),
   lines 270 and 414, rule `typescript:S2137`. These names shadow built-in
   constructors. The loading fixture explicitly uses `globalThis.Error`, and the
   text-input fixture does not call either shadowed constructor. No runtime failure
   was demonstrated. Descriptive export names would resolve the warnings, but
   renaming stories may also require updating their IDs in native test flows.

3. **Blocker code smell in session restoration needs contextual review.**
   [auth.lifecycle.ts](../src/services/auth/auth.lifecycle.ts), line 29, rule
   `typescript:S3516`. `restoreSession()` returns the cached session on both paths;
   its conditional behavior is whether it starts a background token refresh.
   This matches the documented intention to retain cached identity during temporary
   network failures. The passing session tests cover restoration and a pending
   refresh. The scanner's invariant-return finding does not demonstrate an
   authentication failure; review the intended contract before changing behavior.
   [Sonar issue](http://localhost:9000/project/issues?id=my-app-expo&issues=43fd068e-0f01-46c0-af0b-ba414ac5c713).

4. **Eight functions exceed the cognitive-complexity threshold of 15.**
   Reported scores: button prop normalization 23; form input 20; query content 16;
   universal text input 29; recipe creation screen 20; recipe detail screen 24;
   recipe creation hook 16; API error normalization 16. Consider small
   refactors around these responsibilities while preserving the existing regression
   tests. Complexity is a maintainability measure, not evidence of incorrect output.

## Main maintainability groups

| Rule               | Count | Finding                                      |
| ------------------ | ----- | -------------------------------------------- |
| `typescript:S6759` | 104   | Component props are not declared read-only   |
| `typescript:S3358` | 44    | Nested ternary expressions                   |
| `typescript:S3776` | 8     | Cognitive complexity above 15                |
| `typescript:S1874` | 5     | Deprecated API signatures                    |
| `typescript:S6571` | 4     | Redundant union members                      |
| `typescript:S6481` | 3     | Storybook provider values change each render |
| `typescript:S6478` | 2     | Inline component/render definitions          |

Read-only props and nested ternaries account for 148 of the 182 code smells.
Inspect the two inline-render findings against the actual callback contract and
mount behavior before refactoring them. No scanner issues were marked accepted,
resolved, or false-positive during this audit, and application behavior was not
changed.

## Scope and execution evidence

- SonarQube Community Build `26.9.0.129388`, official Docker image pinned to that
  version, running locally with persistent Docker volumes.
- SonarScanner for NPM `5.0.1`; JavaScript analyzer `13.8.0.44569`; default
  **Sonar way** profiles. The TypeScript and JavaScript profiles contain 435 and
  420 active rules respectively.
- 467 files indexed; all 426 JavaScript/TypeScript files selected by the analyzer
  completed. Application source, maintained Storybook source, tests/helpers,
  GitHub workflows, and app/build configuration are in scope. Generated Storybook
  registration, dependencies, native build output, assets, and documentation are
  outside the configured scope.
- The analyzer created a TypeScript **6.0.3** program and reported no parsing
  errors. The published language-support page still lists TypeScript through
  5.9.3; this discrepancy should be considered when evaluating newer syntax.
- The first attempt failed in JGit blame retrieval. Native Git successfully read
  the referenced blob. The completed scan used `-Dsonar.scm.disabled=true`, so
  blame annotations and SCM-based author assignment are unavailable. New-code
  identification uses analysis dates.
- Dependency vulnerability analysis was skipped by Sonar. Native device behavior
  and instrumented test coverage were not assessed.
- The scanner's generated bundle initially entered ESLint's root scan. Adding
  `.scannerwork/**` and `.sonarqube-local/**` to lint ignores restored a passing
  lint run. The scanner folders are also ignored by Git and Prettier.

Raw findings, metrics, quality-gate response, hotspots response, and scanner logs
are saved in the Git-ignored `.sonarqube-local/` directory. The completed compute
task is `323eee96-21a6-48d3-9510-c281a4ce5faf`.

References: [official image](https://hub.docker.com/_/sonarqube),
[language support](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/languages/javascript-typescript-css),
[SCM integration](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/scm-integration).
