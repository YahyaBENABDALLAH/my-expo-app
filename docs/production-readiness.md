# Production readiness

Reviewed: 2026-10-11. Verdict: **not production-ready; suitable for continued development testing.**

This report replaces the 2026-10-03 readiness snapshot. Current source findings
are separated from recorded build and device results. The historical
[code quality report](code-quality-report.md) describes earlier recovery defects;
the current recovery implementation resolves them.

## Current local checks

The cleanup removes the legacy `Reference/` directory and preserves the current
application, entity hooks, API definitions, dependencies and root Firebase
placeholder. Application imports and tests use `src/`; the removed directory is
not required at runtime or by the current test suite.

| Check               | Result                                   |
| ------------------- | ---------------------------------------- |
| `npm run lint`      | PASS: zero warnings or errors            |
| `npm run typecheck` | PASS                                     |
| `npm test`          | PASS: 417 tests across eight test groups |

## Recorded build and device results

These results come from the linked reports; native builds, device flows, Expo
Doctor, dependency auditing and bundle exports were not repeated for this cleanup.

| Check                               | Recorded result                                                                                                                                                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aggregate repository checks         | [Engineering quality](engineering-quality.md) records typecheck, zero-warning lint, formatting and 417 tests on 2026-10-11.                                                            |
| Expo Doctor and SDK compatibility   | [Build verification](build-verification.md) records 21/21 Doctor checks and compatible dependencies with the documented Expo UI/Router pins.                                           |
| Production JavaScript exports       | [Build verification](build-verification.md) records successful iOS/Android Hermes exports with Storybook excluded.                                                                     |
| Android development build and flows | [Build verification](build-verification.md) records a successful development build and passing login and Storybook text-input flows. Broader device coverage remains incomplete.       |
| iOS development build               | [Startup repair](build-verification.md#ios-startup-repair) records a successful replacement simulator build with Firebase excluded; its launch and runtime behavior remain unverified. |
| Dependency audit                    | [Cleanup notes](project-cleanup.md#security-overrides) record 27 findings on 2026-10-10: 24 high and three moderate. This is a historical count, not a new audit result.               |

The dependency audit includes transitive toolchain dependencies. Affected-package
counts are not counts of distinct exploitable mobile vulnerabilities. Review
reachability and SDK-compatible remediation; the retained dependency overrides
and pins are documented in the linked reports.

## Resolved source findings

- **Password masking:** both recovery password fields pass `password` to
  [FormTextInput](../src/components/ui/form/form-text-input.tsx), which masks each
  field until its independent visibility action is used.
- **Recovery challenge isolation:**
  [ResetPasswordScreen](../src/features/auth/screens/reset-password-screen.tsx)
  keys its form by the validated challenge. Changing the link clears draft and
  success state; a mounted-instance guard suppresses an old response.
  [Recovery regression tests](../tests/auth/password-reset-screen.test.mjs)
  exercise masking, draft reset and stale-response handling with native controls
  substituted at the test boundary.
- **iOS Firebase bootstrap:** the active configuration no longer references or
  bundles the placeholder plist. Firebase modules are excluded from iOS, and the
  replacement simulator build compiled successfully. The root
  `GoogleService-Info.plist` remains intentionally preserved. Future iOS Firebase
  features require a valid generated plist and restored native integration.

## Release blockers

1. **Notification navigation:** cold-start response handling, deduplication and
   preserving a destination through sign-in are not implemented in current source.
2. **Native and backend verification:** the recorded Android flows cover a limited
   subset. Recovery completion, guest entry/exit, safe areas, keyboard behavior,
   accessibility, Skia performance and live backend login/publication/likes/chef
   registration still need verification. The replacement iOS simulator build
   needs launch and runtime testing.
3. **Release builds:** development builds do not establish production readiness.
   Production signing, Apple device provisioning and release binaries still need
   validation on supported devices.
4. **Dependency advisories:** review the latest audit and resolve applicable
   findings with compatible versions or document accepted release risks.

Health diagnostics remain a placeholder. Theme selection is held in memory rather
than persisted; some recipe lists still expose only the first page. English,
French and Arabic dictionaries and language persistence exist; translation quality
and RTL behavior still need native review. Define the release scope against the
current app instead of the removed legacy directory.

## Development guest mode

Guest access uses `appDevEnabled`, which is true in development or when a preview
build explicitly sets `EXPO_PUBLIC_ENABLE_DEV_SCREENS=true`. It requires completed
signed-out restoration and never creates a fake user or token. A production build
without that opt-in denies guest access. These JavaScript predicates do not replace
server-side authorization or native verification.

## Next steps

Complete notification entry if it is in release scope, verify native recovery and
backend flows, test the replacement iOS build, review dependency advisories and
resolve the remaining product gaps. Build and test signed release binaries before
making a production readiness claim. Restore iOS Firebase only when a feature
needs it and a valid configuration is available.
