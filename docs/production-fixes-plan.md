# Production fixes plan

Scope: audit items 3, 4, 8, 9, 10 and 11. Keep every package manifest, lockfile and installed dependency unchanged. Preserve the existing session-generation, cancellation, storage-serialization and submission safeguards.

## Steps

1. **Explicit buttons** — require a project variant (`primary`, `secondary`, `link`, `success`, `warning`, `destructive`); support composition inside an existing Expo UI Host; migrate app and story callers; prohibit raw buttons in screens.
2. **Expo UI and layout** — replace remaining app RN text, press controls, scroll controls and loading indicators with Expo UI content. Use Row/Column/Spacer for ordinary native composition, keeping RN boundaries only for navigation, safe areas, keyboard, canvas and overlay geometry.
3. **Loading and startup** — distinguish disabled, fetching, paused, failed, cached-refresh and empty states. Show persistent retry context. End launch when fonts and session restoration are ready, with a brief accessible transition.
4. **Zod boundaries** — validate authentication responses, restored sessions and consumed entity/pagination responses once at their I/O boundary. Reject malformed data with a safe error; retain unknown server additions and documented nullability. Add regression cases for corrupt storage and malformed successful HTTP responses.
5. **Cleanup** — remove verified native no-ops and unused web branches without package edits; make tab action kinds explicit instead of deriving behavior from English labels. Remove trivial adapters only after migrating all consumers.
6. **Skills and verification** — update project UI/API skill contracts and component references with the implemented conventions. Run typecheck, lint, formatting and affected/full tests. Update deterministic stories and native flows; record native checks that could not run.

## Progress

- Planning and SDK 57 / installed API review: complete.
- Steps 1–5: implemented.
- Step 6: skills, stories and automated checks complete; Android button/loading flows passed. Navbar native verification remains incomplete after the ADB driver connection closed.

## Implemented changes

- **3 / Expo UI:** screen recovery, launch captions, map/Skia content and controls, route loading fallbacks and story example text use Expo UI. Native progress adapters use Compose CircularProgressIndicator and SwiftUI ProgressView. RN remains at required navigation, keyboard/safe-area, overlay and specialized map/Skia/Lottie boundaries. ESLint rejects RN rendered controls/content in app source and story examples.
- **4 / Native layout:** ordinary content uses Row/Column/Spacer. The navbar now uses one Host with a weighted Row and a native center Spacer; PageScreen sheds an extra RN wrapper. Native modifier adapters retain necessary platform differences. Standalone Storybook fixtures cross through RNHostView inside an Expo UI scroll canvas.
- **8 / Buttons:** UniversalButton/UniversalButtonContent require primary, secondary, link, success, warning or destructive. All **37 recipe/page sites checked during this fix pass** declare a variant; the earlier audit counted 36 before the chef prerequisite action was added. Auth callers declare primary/secondary/link; the subsequent UI consolidation replaces AuthButton with universal button content. Specialized icon/navigation/toast adapters retain explicitly selected native styles. Shared content inherits its owning Host's scheme. Native geometry, feedback and disabled treatment are retained.
- **9 / States:** QueryContent separates disabled prerequisites, offline paused requests, active fetching, persistent failure/retry, empty success and cached refresh/failure. Account-dependent actions explain missing sign-in/profile prerequisites; writes show pending labels and persistent failure context. Launch follows font/session readiness, removes the five-second hold and changes its three-second exit to 300 ms (immediate with reduced motion). No measured startup-performance claim is made.
- **10 / Boundaries:** Zod validates JSON entity/auth responses at the transport boundary, pagination metadata and nested recipe details. DTOs infer from schemas; additive entity fields/nullability survive. Invalid successful responses never enter caches or trigger successful-write maintenance and do not retry automatically. Session normalization validates canonical/legacy storage, rejects corrupt sessions and protects metadata updates/rotation failure paths.
- **11 / Cleanup:** removed unused Themed helpers, the trivial Spacer adapter, obsolete client-only/theme web helpers, the web HTML/map fallback and the native no-op Skia loader. Tab action kinds are explicit rather than derived from English labels. Cancellation, serialized storage, session generations and submission guards remain.
- **Skills:** updated the mobile UI, universal component library and API services SKILL.md files, plus their component/theme/Storybook references and architecture/API documentation.

## Verification

- `npm run check`: **pass** — typecheck, lint with zero warnings, project formatting, and **193 tests** (19 validation, 20 navigation, 37 auth, 12 recipes, 79 services, 26 layout) on the combined source after the UI consolidation.
- 49 tests added in this fix pass relative to the audit's 134-test baseline, plus 10 button-contract tests from the concurrent UI consolidation: malformed API response/cache/retry behavior, corrupt saved sessions/metadata/rotation, loading-state JS rendering and native Metro resolution. JS/native-boundary mocks do not establish device layout or interaction.
- Story registration regenerated with `npm run storybook:generate`.
- Android and iOS production JavaScript/Hermes exports: **pass** for the six core fixes before the later navbar adapter and concurrent UI consolidation. Those later changes are covered by the latest full check but need fresh export/native verification. Outputs are ignored under `.expo/production-fixes-export-android` and `-ios`.
- Static button inventory: **37/37 recipe/page sites** have explicit variants. ESLint probes reject RN Text and raw screen Expo UI Button imports.
- `package.json` and `package-lock.json` SHA-256 hashes match the task-start snapshot. No dependency installation or package edits were performed. Existing earlier package changes in the working tree were preserved.
- Android button and loading-state Maestro flows: **2/2 pass** on the connected emulator — enabled count increments once, disabled suppression/reset, persistent Retry, completion, active loading and offline context. The navbar flow first exposed overlapping fixture labels (fixed with Column) and an unresponsive/obscured floating action. A native stacking adapter and passive touch observation are implemented, but its device retest did not complete: the final attempt reached the story-opening stage before an ADB/gRPC connection closed. No successful final navbar activation claim is made.

## Limits and retained work

- iOS device interaction, native accessibility/font scaling, map/Skia appearance, keyboard behavior and detailed startup timing remain unverified. Successful Hermes exports establish bundling, not native runtime behavior.
- Maestro emits repeated Windows file-lock heartbeat errors; both Android button/loading flows nevertheless completed successfully. These tool warnings did not fail their app assertions.
- The original fix retained CanvasKit copying under its frozen-manifest scope. The selected redundancy cleanup on 2026-10-05 removed the web copy script and WASM asset together with that postinstall step. The 2026-10-10 cleanup removes the remaining Expo UI postinstall patch and uses unmodified SDK 57 packages.
- Malformed successful write responses may follow a completed server write. Automatic write retries remain off; failure context directs users to check the result before repeating uncertain server writes.
- The original audit remains a historical baseline. Unrelated recovery-challenge, server-write/local-persistence partial success and collection/catalog pagination findings are outside this requested fix scope. Creations still explicitly shows the first-100-public-recipes limitation.

## Updated line inventory

Snapshot includes the concurrent UI consolidation; its additional changes are tracked in the separate chat.

| Category                                            | Files | Physical lines | Nonblank lines |
| --------------------------------------------------- | ----: | -------------: | -------------: |
| Application src, including types/declarations       |   263 |         10,809 |          9,997 |
| Automated test files                                |    20 |          2,922 |          2,785 |
| Test helpers                                        |     3 |            359 |            353 |
| Storybook stories                                   |    24 |          2,911 |          2,789 |
| Storybook support, excluding generated registration |    15 |            340 |            303 |
| Maestro YAML, including helpers/configs             |    33 |          1,214 |          1,213 |

Physical lines include comments/blanks and omit a final empty line created by a trailing newline. Counts exclude dependencies, generated/native output, assets, documentation, Reference and generated story registration. Story/test volume is not a coverage percentage.
