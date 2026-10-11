# SonarQube duplication cleanup — 2026-10-11 UTC

The completed local analysis confirms **0.0% duplication**, with **0 duplicated
lines, 0 blocks and 0 affected files**. HIGH and MEDIUM impact counts remain zero;
comparison with the previous analysis found no new issues.

The original scan reported **153 duplicated lines, 3 blocks and 3 affected files**
at **0.8% duplication**. All three blocks were the palette assembly in
`facebook.ts`, `instagram.ts` and `tiktok.ts`, starting at line 4 and spanning
51 lines per file. The color values differed; their assembly was repeated.

## Change

[Brand configuration](../src/constants/themes/brand-palettes.json) holds the
original explicit light/dark colors. The typed `createBrandTheme` factory in
[tokens.ts](../src/constants/themes/tokens.ts) combines shared feedback defaults
and calls the existing derived-token mapper once for each appearance. The three
existing brand modules retain their public exports through this factory.

The WhatsApp palette retains its distinct feedback choices. Existing theme IDs,
labels, semantic roles and UI imports are preserved. No dependency, source
exclusion, duplication setting or quality-gate threshold was changed.

## Validation

- All **544 resolved tokens** across four brands and eight appearances exactly
  match the values exported before the refactor.
- `npm test`: **422 passed**, no failures or skipped tests.
- `npm run lint`, `npm run typecheck`, `npm run format:check`: passed.
- `git diff --check`: passed.
- Existing Theme and App Settings stories remain applicable. The appearance
  tests passed, including brand/scheme selection, draft retention and propagation.
- Native rendering and contrast were not verified on devices in this pass.

## SonarQube result

| Measure                     | Before |     After |
| --------------------------- | -----: | --------: |
| Duplicate line density      |   0.8% |  **0.0%** |
| Duplicated lines            |    153 |     **0** |
| Duplicated blocks           |      3 |     **0** |
| Files with duplication      |      3 |     **0** |
| Open HIGH / MEDIUM findings |  0 / 0 | **0 / 0** |
| Total open issues           |    120 |       120 |

All 426 selected JavaScript/TypeScript files completed analysis. Compute task
`ed9d5496-cd4e-4b8d-8563-71b69acdc9ea` finished with **SUCCESS** at
**09:32:34 UTC**. Analysis ID: `7c0eca34-11d8-4b4a-ac5f-49abeaf163d2`.

The quality gate fails solely on new-code coverage: no instrumented coverage
report is supplied, so Sonar displays 0.0% against its 80% requirement. New
duplication (0.0%) and new issues (0) pass. The scanner's exit code 1 reflects
that gate; the report was uploaded and processed successfully.

## Saved evidence

The Git-ignored `.sonarqube-local/` directory preserves the original duplicate
blocks and metrics in `duplication-blocks-before.json`, `duplication-before.json`
and `duplication-measures-before.json`. `duplication-palettes-before.json` holds
the resolved token baseline; `duplication-palette-verification.json` records the
exact comparison. Check output is saved in `duplication-tests.log`,
`duplication-typecheck.log`, `duplication-lint.log`, `duplication-format.log`
and `duplication-scanner.log`.
Final API evidence is saved in `duplication-after.json`,
`duplication-measures-after.json`, `duplication-all-after.json`,
`duplication-new-issues.json`, `duplication-task.json` and
`duplication-quality-gate.json`. Shared current exports were refreshed.

[Scan instructions and dashboard](sonarqube.md).
[Previous MEDIUM fixes](sonarqube-medium-impact-fixes-2026-10-11.md).
