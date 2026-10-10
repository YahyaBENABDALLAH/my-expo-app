# Production readiness

Validation date: 2026-10-03. Verdict: **not production-ready; suitable for continued development testing.**

## Checks

| Check                                     | Result                                                                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `npm run check`                           | PASS: typecheck, zero-warning lint, repository formatting, 80 tests                                                    |
| Expo Doctor                               | PASS: 21/21                                                                                                            |
| SDK dependency compatibility              | PASS                                                                                                                   |
| Staged/unstaged whitespace checks         | PASS                                                                                                                   |
| Current production JS exports             | PASS: iOS and Android Hermes bundles exported to `.expo/readiness-check`; no native release build/runtime verification |
| Native device flows                       | Not run: no Android device connected; no iOS execution available here                                                  |
| Earlier Android development build         | FINISHED; this is not a production release build                                                                       |
| Dependency audit (`npm audit --omit=dev`) | 28 affected-package entries: 25 high, 3 moderate, 0 critical                                                           |

The audit includes transitive toolchain dependencies because Expo is an application dependency. Counts are not distinct exploitable mobile vulnerabilities. Advisory reachability and SDK-compatible remediation need review. Suggested automatic fixes include incompatible downgrades; no force fix or dependency changes were applied.

## Release blockers

1. **Password reset:** both password fields pass `secureTextEntry`, but FormTextInput overrides it from its `password` flag, which defaults to false. Passwords are therefore unmasked. Success/draft state also survives a changed recovery challenge; old pending responses are not scoped to the current challenge. Both source findings remain open.
2. **Notification navigation:** cold-start response handling, deduplication and preserving a destination through sign-in are not implemented.
3. **Native verification:** no completed real-device/Maestro check for guest entry/exit, native fields, safe areas, keyboard behavior, navigation, accessibility, or Skia performance. Live backend login/publication/likes/chef registration are also unverified.
4. **iOS build:** missing Firebase plist for `com.hyrkul.likan`; Apple signing/device provisioning and a native iOS build remain unverified.
5. **Dependency advisories:** review the audit and remediate applicable findings with SDK-compatible versions before release.

Health diagnostics remain a placeholder. Full Reference feature parity, translations, persistent theme selection, and some list pagination are incomplete. Either finish them or explicitly reduce the release scope.

## Development guest mode

The access predicate is gated by `__DEV__`, requires completed signed-out restoration, and never creates a fake user or token. Tests verify production denies guest access. This establishes the JavaScript access contract, not a complete authorization/security audit; server-side authorization remains required.

## Next steps

Fix the two recovery defects, finish notification entry, review dependency advisories, supply the iOS Firebase configuration, then run native and backend flows. Build and test release binaries before making a production readiness claim.
