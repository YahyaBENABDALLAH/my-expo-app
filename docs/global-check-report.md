# Global check report

Completed 2026-10-03 after the navigation, safe-area and recipe architecture changes.

| Check                          | Result                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `npm run check`                | Passed: typecheck, lint with zero warnings, repository-wide formatting, and all tests                     |
| Automated tests                | 73 passed: 19 validation, 20 navigation, 23 auth/API, 7 collections/mutations, 4 safe-area contract tests |
| `npx expo-doctor`              | 21/21 passed                                                                                              |
| `npx expo install --check`     | Dependencies are compatible and up to date                                                                |
| iOS/Android production exports | Both JavaScript/Hermes bundles compiled into `.expo/global-check`                                         |
| `git diff --check`             | Passed                                                                                                    |
| Native device availability     | `adb devices` returned no connected devices                                                               |

The first global run stopped on three pre-existing formatting issues. Applied Prettier-only changes to `.agents/skills/expo-overview/SKILL.md`, its `agents/openai.yaml`, and `docs/pages-navigation-plan.md`, then reran the complete check successfully. Earlier reports' formatting limitation is resolved.

Non-failing command output includes Node module-type/deprecation and terminal color-environment notices. No dependency versions or native project files were changed for this verification.

## Verification limits

Bundle exports do not build or run native binaries. Maestro, real-device safe-area/keyboard behavior, Skia performance, screenshots, and live backend writes have not been verified. Route tests check parsing and route availability rather than rendering every screen. Full Reference parity, notification destination retention across sign-in, and the earlier password-reset masking/challenge-state findings remain open as documented in the existing reports.

See [architecture](architecture.md), [safe-area handling](safe-area-handling.md), and [Reference implementation](reference-tabs-report.md) for implementation scope. Passing these automated checks does not establish that every native screen works on devices.
