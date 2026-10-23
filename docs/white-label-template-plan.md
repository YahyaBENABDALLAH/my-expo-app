# White-label template implementation plan

Prepared on 2026-10-22 from the current source audit. Implementation status is
recorded below; unchecked acceptance criteria are still pending. Component
contracts continue to belong to their existing skills. See
[architecture](architecture.md) and [documentation ownership](documentation.md).

## Implementation status

- Step 1 verification tooling implemented: both formatting commands target the
  same maintained folders and root config/documentation files, avoiding generated
  directory traversal. Existing ignore rules remain in effect and new untracked
  files inside the scopes are included.
- Local `npm run check` passes: typecheck, zero-warning lint and maintained-file
  formatting. The existing CI workflow uses that command; a hosted CI run and a
  fresh dependency installation were not performed in this step.
- Implementation and component-library skills now describe the current no-suite
  verification workflow, stable native selectors and preview limitations.
- Native startup/frame measurements remain pending before the motion work. No
  native interaction or performance result is claimed from these static checks.
- Step 2 configuration implemented: `config/brands/` owns native identity/assets
  and integration references; `app.config.js` resolves the selected brand. Local
  default is the unlinked template; existing EAS profiles explicitly select Likan.
  Likan bundle IDs, scheme and Firebase mapping are preserved. Variants within a
  brand retain that identity rather than automatically adding suffixes.
- `config/api.js` shares URL normalization and timeout policy between Node
  validation and native transports; native environment reads remain lazy and
  refresh remains interceptor-free. Production configuration requires explicit
  brand, EAS references and API configuration.
- Resolved Expo configs were checked for template/Likan development and Likan
  production. Invalid selectors, missing release configuration/assets, malformed
  identifiers/URLs and Firebase package mismatch were exercised. Android and iOS
  Hermes exports succeed without backend configuration; native builds/devices and
  live backend behavior remain unverified.
- Step 3 source integration implemented on 2026-10-23: public presentation IDs
  select app-owned copy, heading fonts and launch artwork. Likan uses bundled
  Inter Black and Lottie; the neutral template uses native typography and an
  existing Expo placeholder image. Arabic retains native heading fallback.
  Literal Metro imports stay separate from Node config and manifests. Component
  skills and setup guides describe these owners and native-build requirements.
- Step 3 verification: `npm run check` and native story registration passed.
  Actual template/Likan Expo configs select the expected font plugin files and
  public presentation IDs. Locale keys and both brand messages match in all
  three languages; invalid presentation IDs and missing/out-of-project files
  produce actionable diagnostics. All four local Android/iOS Hermes exports
  succeeded without API credentials. Their bytecode contains the public asset
  registry, and source maps exclude the Node brand resolver. All registered
  assets are bundled; asset removal is not an outcome of this step. No connected
  native device target was available to this session.
- Step 4 source integration implemented on 2026-10-23: primary text uses `tint`,
  and primary buttons retain their existing fill/foreground pair. Each manifest
  selects a fixed palette; the root guards palette changes. System/Light/Dark
  user appearance restores through the existing theme provider and joins launch
  reveal readiness. Preview providers stay in memory. Palette controls moved
  from Settings to the isolated Text showcase, which also compares three page
  surfaces, color overrides and a counted primary button.
- Step 4 configuration/contrast checks passed: both brands resolve their intended
  palette with automatic native appearance; registered palettes are accepted,
  unknown IDs are rejected and all three dictionaries retain matching keys.
  All 96 explicit text/surface pairs exceed 4.5:1. UX dark primary text changes
  from 1.11:1 to 18.88:1 against its background; black/white primary buttons
  remain 21:1. Android and iOS Hermes exports succeed. Native restart, live
  System changes, storage recovery, local overrides and first-reveal checks
  remain pending; no connected device target was available.
- Step 5 source integration implemented on 2026-10-23: standalone buttons reuse
  the existing `UniversalHost` at the same boundary. Inline sizing preserves
  intrinsic behavior; the existing full-width match policy, selector suffix,
  physical corner styles and native radius handling are unchanged. The public
  API, color resolver and both native renderers are unchanged. Custom children
  now receive the shared Host's scheme and live direction context.
- The Buttons page and retained `StandaloneHostLight`/`StandaloneHostDark`
  fixtures share one preview composition for forced schemes, inherited intrinsic
  width, diagonal corners and disabled activation. A local RTL toggle and action
  counter support manual verification. Typecheck, zero-warning lint, registration,
  locale/interpolation checks and both native Hermes exports passed. Updated
  component skills describe the current ownership; dimensions, edge activation,
  live Arabic and physical RTL clipping still need native device checks. No
  connected native target was available.
- Step 6 source integration implemented on 2026-10-23: recovery/account/verification
  actions and shared query retry expose explicit IDs. Optional password and
  Collapsible fixture suffixes are conditional. Query content accepts an instance
  prefix; floating actions accept an explicit ID while preserving their default.
  Visible input labels reach native editable-control naming modifiers through
  the existing platform adapters. No new wrapper family, package or test runner
  is introduced. Component skills own these contracts and their limits.
- The in-app Loading and retry page and retained RepeatedQueries fixture share
  two independent local examples. Buttons preserves its existing floating action
  and adds explicit enabled/disabled content actions; retained RepeatedActions
  covers independent standalone counts. WithoutFieldSelectors covers omitted
  form IDs. These examples support manual checks; they are not native execution.
- Step 6 upstream gaps: Collapsible has no supported header-specific selector;
  an outer Host/Column ID does not solve that. Android's universal input maps
  noneditable to read-only without exposing native enabled state. VoiceOver/
  TalkBack output, focus, large text, RTL and activation remain pending. No
  connected native device target is available in this session.
- Step 6 verification: `npm run check`, native story registration, locale-key
  parity, changed skill metadata and local documentation links pass. A type-aware
  review of 222 maintained source/fixture files found 47 more nullable ID suffixes
  in retained fixtures; these now omit derived IDs when their prefix is absent.
  No unguarded nullable template ID remains in that review. All targeted auth/
  root form and button actions have explicit IDs in source. Android and iOS
  Hermes exports pass without backend configuration; source-map checks match
  the current shared controls/screens and the appropriate platform adapters,
  with Storybook and the Node brand resolver excluded. These checks do not close
  the native acceptance criteria below.
- Step 7 source integration implemented on 2026-10-23 with the requested animated
  SVG/header behavior retained. Both manifests still select Dunes; Settings adds
  a saved Default rectangular header through the existing preference owner. Its
  wave/clock/canvas/mask unmount while the navigation subtree keeps its position.
  Animated pauses preserve their phase; re-enabling from Default starts a new
  wave instance. Header geometry, SVG assets, native blur and interaction remain.
- Common motion now publishes numeric contours. Only the iOS native material
  mask serializes SVG, through its existing animated-prop callbacks. Android
  consumes numeric Skia paths; cached launch paths skip header contours/details.
  Header-only identity drift no longer reads the frame clock. React state only
  publishes geometry/lifecycle changes, never individual animation frames.
- `presentation.launch` selects minimal for the neutral template and branded for
  Likan. Branded retains the two-second foreground hold and two-second upward
  exit; backgrounding pauses the hold/exit. Recovery uses minimal presentation.
  `app-ready` now requires successful hydration/auth, launch exit and initial page
  frame layout; restoration failure exposes `app-recovery`. Optional font errors
  use native typography. Default/reduced-motion login cannot await a wave that
  will not complete. Native startup, saved-style changes, login/recovery, focus,
  large text, RTL and background/reduced-motion observations remain pending.
- Step 7 verification: `npm run check`, story registration, locale-key parity,
  changed skill metadata and local links pass. All eight header/launch pairs are
  accepted; invalid/missing presentation fields produce field-specific errors.
  Resolved template/Likan development and Likan production configs preserve
  identity and project references. All four local Android/iOS Hermes exports pass
  without API credentials. Each map matches 13 current startup/motion sources,
  selects its native surface and excludes Storybook/Node resolution. Source
  review finds exactly two SVG-serialization calls, both in the iOS surface;
  the original contour/detail geometry is unchanged. No native target was
  connected, so no startup-duration or frame-rate improvement is claimed.
- Step 8 source integration implemented on 2026-10-23: frontend session schemas
  now require an identified user and live separately from unchanged Identity wire
  schemas/DTOs. A pure auth mapper retains legacy wire-token restoration and
  canonical nullable refresh/expiry metadata, strips old unused role/chef flags,
  and rejects invalid updates before persistence. Neutral auth copy replaces
  recipe promises; registration's obsolete recipe-info row is retired.
- Logout captures the old access-token string and checks its generation, awaits
  durable local deletion/cache cleanup, then starts bounded revocation with the
  explicit captured bearer on the existing unauthenticated client. Remote failure
  is consumed; it cannot refresh, read new credentials or mutate session/cache
  state. Matching clear/logout calls share pending work. Same-generation storage
  failure remains retryable through `auth-logout`/`auth-logout-error`; stale
  completion/failure cannot restore or clear a newer account. Refresh retains its
  raw transport and now checks generation before failure cleanup as well.
- Step 8 verification: `npm run check` passes. Fifteen isolated JavaScript
  scenarios using in-memory native-storage/network adapters pass for legacy and
  malformed records, invalid updates, delayed/failed revoke, rapid taps, failed
  deletion/retry, overlapping account changes, refresh deduplication, temporary
  failure, invalid sessions and rotation persistence failure. They execute actual
  auth modules with simulated I/O, issue no backend requests and add no test files
  or runner. Four wire response schemas and the wire DTO file remain unchanged;
  locale parity, pure-module imports and changed skill/link validation pass.
- Step 8 Android and iOS Hermes exports pass without backend configuration.
  Their source maps match all nine changed auth/schema/screen modules and exclude
  Storybook and the Node brand resolver. Packages and wire DTOs are unchanged.
- Native SecureStore failures, Account navigation/feedback and live revocation
  remain unverified because no native target/backend flow was available. Expired
  or rejected access tokens, offline operation and process termination can prevent
  remote revocation; no unsupported refresh-token logout contract is invented.
- Step 9 source integration implemented on 2026-10-23: the existing public
  developer-screen flag now owns Home/Settings catalog links and protected root
  routes. The default is disabled; EAS development/preview enable the catalog and
  production disables it. An explicit `__DEV__` Storybook route and cross-platform
  launcher expose retained fixtures, Controls and canvas links. The route reuses
  PageFrame for cold-link startup readiness and Back navigation. Both embedded
  profile flags and the exact local launch workflow are documented.
- Step 9 maintains direct primitive exports and documents concrete wrapper
  responsibilities plus the native adapter upgrade checklist. The deliberate
  Expo UI/Router pins remain unchanged. Catalog route hiding is explicitly
  separate from code removal: 22 showcase modules remain in each inspected client
  graph. Storybook sources are absent from client and preview release exports,
  including the client check with their public opt-in set to true.
- Step 9 verification: `npm run check`, story registration, 24 isolated flag/Home
  combinations, all three protected-route declarations and launcher forwarding/
  environment isolation checks pass. Actual Expo-manifest development bundle URLs
  return HTTP 200 for Android and iOS with Storybook and retained fixtures present.
  Release source maps are checked separately from those development bundles.
  Final Hermes inspection confirms catalog/Storybook values of false/false in
  client bundles and true/false in preview bundles on both platforms. A clean
  export corrects an observed SDK 57 transform-cache reuse after changing flags;
  the preview guide now requires `--clear` for that switch and compiled-value
  inspection, since original source-map text alone cannot prove flag values.
  No suite/runner, dependency version, native primitive wrapper or cloud operation
  is added. Native cold/direct links, Back, Controls, state retention, layout and
  device interactions remain unverified.
- Step 10 source enforcement implemented on 2026-10-23: retired recipe lint scopes
  are replaced with current route/screen, service `.api.ts`/`.service.ts`, pure
  schema/DTO/mapper/key/preview-flag and shared-UI boundaries. Common native-control,
  route and Storybook restrictions survive scoped overrides. The Storybook feature
  retains a narrow import exception; catalog/preview composition entries have
  explicit scope exceptions. Raw refresh also rejects imports that would connect it
  back to authenticated transport/auth lifecycle.
- Current recovery submissions remain in their existing `useAuthForm` consumers,
  preserving challenge keys and completion guards; no runtime refactor was needed.
  Architecture and implementation/API skills describe the enforced scopes and
  their static-analysis limits. The existing development guide now has a client
  setup checklist linking asset, appearance, preview and native upgrade ownership.
  Auth guidance reflects the implemented reset screen and pending delivery contract;
  dated engineering/build/guest-mode material is clearly historical in the index.
- Step 10 import probes pass for 361 isolated allowed/forbidden cases, including
  both transport suffixes, future screen path conventions, pure modules, UI, raw
  refresh, shared-policy composition and legitimate preview/auth consumers. No
  probe files or runner are added. Runtime modules, packages, native animations,
  wire DTOs and backend behavior are unchanged by this enforcement/docs step.
- Step 10 verification: `npm run check` and `git diff --check` pass. Changed skill
  metadata and 125 local documentation links validate. This step changes static
  enforcement and guidance; native interaction, backend delivery and performance
  evidence remain with Steps 11–12.
- Steps 11–12 remain planned. Package versions and linked cloud projects were not
  changed. Both brands' font rendering, artwork and Arabic readability still
  require matching native builds/device checks.

## Outcome and scope

The target is an iOS/Android starter that a senior developer can brand, connect to
a backend, maintain and upgrade without editing unrelated screens or rebuilding
its architecture. Success means a second brand can be configured through named
configuration owners, native behavior is consistent, startup is predictable and
the supported component surface is easy to inspect.

This plan assumes build-time brands: each client has its own application identity.
It does not introduce runtime tenant switching, remote themes or a backend-provider
marketplace. Keep the current Foodiya Identity integration until a real replacement
contract is supplied. Adding an API origin does not translate backend contracts.

Constraints:

- No new unit, integration, snapshot or end-to-end test suites for now. Preserve
  and complete selectors, existing native examples and manual verification.
- Retain installed packages. Unused-package cleanup is outside this work.
- Keep Expo Router, the native Expo UI controls and generated native projects.
- Keep session generations, serialized secure storage, refresh deduplication,
  cancellation, response validation and duplicate-submit guards.
- Separate correctness changes from SDK upgrades and broad file reorganizations.
- Do not start builds, publish updates or change linked cloud projects merely to
  prepare this plan. Those operations belong to implementation/release work.

## Architecture decisions

The current dependency direction remains appropriate:

```text
route -> feature screen -> workflow -> query/mutation options -> API transport
              |                 |                              |
              v                 v                              v
          shared UI        domain rules                  response schemas

app composition -> brand + environment + session + query/preferences providers
```

Use the smallest additional boundary that has a concrete responsibility.

| Mechanism            | Decision for this implementation                                                                                                                              | When to extend it                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository           | Keep current entity services. Extract an auth DTO-to-session mapper where it owns real translation. Do not add a pass-through repository above every service. | Add a feature-specific repository when a second backend, local durable data source or meaningful domain mapping needs one owner.                    |
| Dependency injection | Use explicit parameters and the existing factories at actual construction boundaries. Keep default application composition straightforward.                   | A dependency container becomes a candidate when several real implementations need scopes/lifetimes that explicit composition no longer keeps clear. |
| Primitive wrappers   | Retain direct public exports for native primitives; retain wrappers that add application behavior, theme or necessary platform adaptation.                    | Add a wrapper for an actual selector, accessibility, semantic or compatibility gap that the installed API can support.                              |
| Query cache          | TanStack Query owns remote-state caching, request status and invalidation.                                                                                    | A future repository can coordinate durable offline data, but must not silently add a competing memory cache.                                        |
| Composition          | Extend existing root/provider/factory owners.                                                                                                                 | Introduce a small composition module only when multiple constructed adapters actually need a shared selection point.                                |

A repository is useful when it translates an application requirement into data
access policy. A DI framework manages construction and lifetime. Neither removes
the need to validate responses, isolate account state or verify native controls.

If a repository is required later, introduce it for one real feature first:

1. Define the domain operations and actual result models, not generic CRUD.
2. Keep endpoint/DTO knowledge in its remote adapter.
3. Inject the adapter through a factory at the composition boundary.
4. Keep navigation in the feature and query-cache effects in query/mutation modules.
5. Migrate one consumer and compare complexity before expanding the pattern.

Do not combine this with an all-services rename or move. Existing
`createApiClient`, callback-based query helpers and explicit query-client arguments
already provide useful dependency injection without a container.

## Implementation sequence

### 1. Establish a reproducible verification baseline

**Files:** `package.json`, `.prettierignore`, `.github/workflows/quality.yml`,
`docs/development.md`, `docs/architecture.md`.

Work:

- Record the installed SDK and native UI/Router pins and their existing reasons.
  The current checkout uses SDK 57 with intentionally pinned Expo UI and Router.
- Keep the committed npm lockfile and existing install workflow.
- Run typecheck and lint; distinguish source checks from native execution.
- Repair whole-project formatting enumeration so it does not traverse inaccessible
  generated tooling. `.prettierignore` already lists `.expo/`; simply adding that
  entry again will not fix the observed directory-expansion failure. Prefer
  maintained-source scopes or a safe tracked-file enumeration that also accounts
  for newly created source files in local checks.
- Keep formatting coverage for source, stories, config, documentation and skills;
  do not solve the failure by excluding maintained code.
- Record the current manual native gaps instead of copying historical test counts.
- Capture the existing startup/motion baseline using the method in step 11 before
  implementing step 7. If devices are unavailable, leave the performance comparison
  open rather than labeling an unmeasured change an improvement.

Acceptance:

- [ ] Typecheck and zero-warning lint pass.
- [ ] Formatting succeeds on a clean checkout and on the current workspace without
      reading generated media tooling.
- [ ] CI and local verification describe the same maintained sources.
- [ ] No claim of device performance or native interaction comes from static checks.

### 2. Create one brand and environment configuration path

**Existing owners:** `app.config.js`, `app.json`, `eas.json`, `.env.example`,
`src/constants/themes/`, `src/hooks/use-theme.ts`, `src/lib/i18n.ts`.

**Small proposed additions:** serializable manifests under `config/brands/`, a
build-time resolver, and runtime configuration under `src/config/`. Choose the
exact extensions to work with the existing Node/Expo setup; do not add a loader
dependency just to read a manifest.

Define only fields that have actual consumers:

| Group              | Values owned here                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| Identity           | Brand ID, display name, slug, scheme, iOS bundle ID, Android application ID                         |
| Build integrations | Explicit EAS owner/project reference and Firebase file selection when enabled                       |
| Native assets      | App/adaptive icons, native splash asset/colors and font plugin paths                                |
| Presentation       | Palette ID, native font family names, runtime asset IDs, launch mode and header mode                |
| Capabilities       | Component catalog and developer previews; auth only if actual auth-disabled behavior is implemented |

Work:

1. Preserve the existing app identity as an explicit named brand. Add a neutral
   template/example brand for local setup; do not leave the existing cloud project
   as an invisible default for a new client release.
2. Separate brand selection from environment selection. Use explicit build-time
   selectors such as `APP_BRAND` and `APP_VARIANT`; keep the API origin in its
   existing public environment variable.
3. Keep one resolver for build metadata and a small validated, public runtime
   projection. Do not read `app.json` directly from application screens.
4. Make `app.config.js` derive identity, integration paths and native presentation
   from the selected manifest. Keep configuration synchronous and serializable.
5. Validate unknown brand IDs, missing required assets, malformed IDs and missing
   release integration references with actionable developer diagnostics.
6. Centralize API-origin normalization and timeout defaults in a pure configuration
   reader used by ordinary requests and token refresh. Preserve useful local
   device/network endpoints. Missing API configuration must not prevent a local
   public component preview from opening; a release with auth enabled must have
   its required backend configuration validated before distribution.
7. Keep public runtime configuration limited to values safe to ship. Credentials
   and signing material do not belong in the manifest or public environment.
8. Keep brand and API environment consistent across build and any later update
   workflow. If OTA updates are adopted, document brand/native compatibility;
   changing JavaScript must not silently change an installed binary's identity.

Acceptance:

- [x] Two brands resolve through configuration without screen edits.
- [x] Each configured brand resolves its intended native identity; existing Likan
      variants preserve their shared identity and integration mapping.
- [x] The template has no inherited EAS/Firebase identity; production requires an
      explicit brand and its release configuration.
- [x] Unknown or incomplete release configuration fails with a useful diagnostic.
- [ ] The fresh local template can open its public shell without backend credentials.
- [x] Ordinary API calls and refresh share the origin/timeout resolver; live backend
      verification remains pending.

### 3. Connect brand copy, fonts and artwork

**Files:** `config/brand-assets.json`, `config/brands/`, `app.config.js`,
`src/config/brand-assets.ts`, `src/shared/locales/{en,fr,ar}.json`, `src/app/_layout.tsx`,
`src/components/ui/auth/auth-screen-frame.tsx`,
`src/components/ui/launch-screen/launch-screen.tsx`, `docs/assets.md`.

Work:

- Replace embedded Likan names in app-owned sentences with a translated sentence
  that interpolates the selected public brand name. Translate sentences, not the
  brand ID. Keep localization keys and interpolation parameters aligned.
- Route launch artwork and heading-font selection through the brand owner.
- Keep Metro asset imports statically discoverable using literal imports or
  `require` calls. Do not construct a dynamic `require(manifest.assetPath)`.
- Keep native config asset paths and runtime asset IDs coordinated without
  duplicating palette definitions or creating a generic asset-loading framework.
- Keep font names explicit per platform and inspect embedded font metadata. The
  supplied file's PostScript name is `Inter-Black`; the old iOS `InterBlack` alias
  does not occur in its name table. The registry now uses `Inter-Black` for both
  platforms while retaining separate entries. Native rendering is still pending.
- Preserve readable Arabic fallback fonts unless a client provides an Arabic-capable
  family. Do not apply a Latin-only brand font to every native text control.
- Document which icon/font/plugin changes require a new native build.

Acceptance:

- [x] A second brand selects app-owned copy, launch artwork and supported heading
      fonts through configuration without editing screen implementations.
- [x] No previous client name appears in generic app-owned user messages.
- [x] French, English and Arabic retain matching translation/interpolation keys.
- [ ] Native headings and Arabic text are readable on both platforms.

### 4. Repair text semantics and clarify preferences

**Files:** `src/components/ui/text/universal-text.tsx`,
`src/constants/themes/tokens.ts`, existing palettes,
`src/context/theme.context.tsx`, `src/features/settings/`,
`src/features/ui-showcase/text-screen.tsx`, `config/brands/`,
`config/brand.js`, `src/config/brand.ts`, `src/app/_layout.tsx`.

Work:

1. Resolve text `tone="primary"` through the existing foreground/accent `tint`
   role. Introduce a new text role only if an actual brand requires a separate
   foreground color; do not add one solely to rename `tint`.
2. Preserve `primary`/`onPrimary` as the filled-button pair. Keep explicit text
   override precedence, including final `textStyle.color`.
3. Inspect default, accent, muted and status text on supported page surfaces in
   both palettes and appearances. Evaluate actual foreground/background pairings.
4. Make configured brand identity the production default. Keep the UX/Instagram
   switcher in developer/component previews; it should not compete with a client's
   configured identity in ordinary settings.
5. Use a fixed configured palette with saved `system`/`light`/`dark` user
   appearance. Reuse the existing restoration/write patterns, validate stored
   values and keep isolated preview providers in memory. Missing/invalid data or
   failed reads retain System at the root; failed writes keep the current session
   usable and leave restart behavior tied to the last successful save.
6. Include appearance hydration in reveal readiness when needed to prevent a
   wrong-scheme first frame. Retain existing language/header/motion restoration.
   Avoid a generic preference manager for a few scalar settings.

Acceptance:

- [x] UX dark primary text resolves through tint rather than black on its near-black background.
- [x] Existing black primary buttons retain their white foreground tokens.
- [ ] Explicit local theme overrides remain deterministic.
- [ ] Appearance restart behavior matches the chosen documented policy.
- [x] Ordinary Settings cannot change the configured root brand/palette; demo
      selection is isolated to component previews.

The first two checks describe source mappings and calculated token contrast.
Device checks for local overrides, native button appearance, saved appearance,
live System changes and launch reveal remain open. See
[appearance verification](appearance-themes.md).

### 5. Unify standalone Host behavior without changing button geometry

**Files:** `src/components/ui/button/universal-button.tsx`,
existing `src/components/ui/host/universal-host.tsx` owner,
`src/features/ui-showcase/buttons-screen.tsx`,
`.rnstorybook/stories/components/button.stories.tsx` and matching component skills.

Work:

- Use the existing `UniversalHost` for the standalone button so native props and
  React child context agree on scheme, live direction and seed.
- Preserve intrinsic sizing by using its inline mode for a button that is not
  full width. A naive replacement would add the Host's default `width: '100%'`.
- Preserve existing per-axis `matchContents`, full-width constraints, container ID,
  asymmetric physical corner clipping and native-renderer radius handling.
- Keep one Host at a standalone RN boundary. Continue to render content buttons
  directly inside an existing native Host.
- Preserve semantic colors, explicit override precedence, disabled suppression and
  native feedback. Do not expand the public button API as part of this repair.

Acceptance:

- [ ] Intrinsic and full-width buttons retain their intended dimensions.
- [ ] Native appearance and custom children use the same resolved scheme.
- [ ] Live Arabic switching updates custom icon/text order correctly.
- [ ] Physical corner clipping is preserved in both directions.
- [ ] Edge taps activate once; disabled taps never invoke the action.
- [x] No additional nested Host is introduced; the shared owner replaces the raw
      Host, and content buttons remain Host-free.

Source integration and static exports are complete. The other acceptance items
are native observations; do not mark them verified from prop forwarding or
fixture registration. The existing light action selector remains, and the shared
preview adds forced dark, inherited intrinsic and disabled cases with child
scheme/direction labels. Repeat both native appearances and directions with
actual edge taps and larger text before closing those checks.

### 6. Finish the selector and accessibility contract

**Files:** root layout; account/verification screens;
`src/components/ui/loading/loading-state.tsx`,
`src/components/ui/form/form-text-input.tsx`, native adapters as needed.

Work:

- Add stable IDs to session-restoration retry, profile retry, account home,
  verification back-to-login and the shared query retry control.
- Derive optional suffixes conditionally so a missing ID never produces
  `undefined-visibility`. Preserve existing IDs used by examples.
- Allow reusable compositions to accept an explicit selector prefix when multiple
  instances could coexist. Prefer local explicit IDs over a global registry or
  selectors based on translated text, list positions or random values.
- Review native forwarding: iOS identifiers and Android Compose selectors must
  identify the real control rather than only its container.
- Investigate Collapsible against the installed native API. A wrapper with a
  `testID` on an outer layout does not identify its disclosure header. Use a small
  adapter only if a supported native path can expose that target while preserving
  native expansion/accessibility behavior. If no supported path exists, record the
  compatibility gap and required upstream change rather than declaring it solved.
- Keep accessibility names and test IDs separate. Verify icon-only labels,
  disabled states, focus order and large text.

Acceptance:

- [ ] Every application-critical action has a stable, actionable native selector.
- [x] Optional suffixes in maintained source/fixtures are guarded; new IDs are
      language-independent. Native identifier observation remains pending.
- [x] Repeated query/floating-action compositions accept distinct explicit IDs
      and have manual examples. Native lookup/activation remains pending.
- [x] Remaining upstream selector limitations are listed explicitly.
- [ ] VoiceOver/TalkBack names remain understandable independently of test IDs.

Source review confirms the targeted auth/recovery actions use the existing
native button adapters: iOS receives `testID` on Button, Android applies its
Compose `testID` modifier to the interactive control. Existing password-icon,
floating-action and page-back controls keep translated native action names and
disabled guards. Input labels now reach the native field separately from IDs.
The installed Android semantics implementation adds the description without
clearing editable/value/password semantics. Native announcements still need
observation, including whether the separate visible label adds a focus stop.

Compatibility gaps remain explicit:

- `@expo/ui` 57.0.21 universal Collapsible exposes no header ID/slot. The lower
  iOS DisclosureGroup label slot accepts only children and a group ID addresses
  the whole disclosure; Android creates its clickable header internally. Keep
  the native export and request a header-specific identifier on both platforms
  that preserves expansion/accessibility. The showcase external toggle has its
  own selector and does not stand in for header verification.
- Android universal TextInput exposes `editable`/`readOnly`, not the underlying
  BasicTextField's `enabled` state. Disabled input remains noneditable and its
  trailing action cannot activate; a distinct native disabled announcement needs
  an upstream API and TalkBack verification. Do not replace the native field or
  clear semantics merely to change its announcement.

Manual closure: on both native platforms, locate and activate recovery/profile
retries, Home and verification cancellation by ID. Repeat two query retries and
two floating actions independently, with pending/disabled/offline suppression.
Inspect omitted field IDs for absent suffixes, then check VoiceOver/TalkBack
names/values, secure reveal, focus order, large text and Arabic/RTL. A screenshot
or successful bundle export alone cannot close these checks.

### 7. Make startup and header motion configurable and cheaper

Implementation follows the user's clarification to keep animated SVG and header
artwork. Both brands keep Dunes as their configured initial header. Default is a
saved optional rectangular style, not removal of the three animated choices.

**Files:** `src/app/_layout.tsx`, launch screen, page frame/motion/surface modules,
`src/hooks/use-motion-enabled.ts`, existing header/launch examples.

Work:

1. Add a minimal launch mode and retain the current branded presentation as an
   explicit option. The minimal default has no artificial hold after readiness;
   configured branded mode can retain the existing two-second hold/two-second slide.
2. Split successful startup readiness from permission to reveal recovery UI.
   Restoration failure must reveal its retry screen without reporting successful
   app readiness. Keep a separate stable recovery selector.
3. Define `app-ready` as required hydration complete, auth resolved, no restoration
   error, launch presentation exited and the initial usable screen laid out.
   This is a selector contract, not proof that every background request completed.
4. Keep font errors, storage failures and retry paths from leaving the native
   splash or brand overlay covering recovery.
5. Add a plain/static header option. At that component boundary, avoid mounting the
   custom animation/canvas machinery when it is not used. Preserve ordinary header
   measurement, safe areas and navigation controls that still have real purposes.
6. Ensure static mode cannot leave login navigation waiting for a wave-collapse
   callback that will never run. Gate that transition coordination by the selected
   presentation mode or complete it deterministically.
7. Remove common SVG serialization from `usePageWaveMotion`. Keep shared vector
   contours; serialize them inside the existing unconditional iOS animated-prop
   callbacks. Android should only consume its Skia paths.
8. Do not compute animated header contours/SVG outputs for static splash paths.
   Keep React hooks unconditional; use component boundaries or safe callback
   branches rather than conditional hook calls. Split further only if needed.
9. Preserve shared subscriptions, background suspension, cancellation and live
   reduced-motion handling. Do not move animation into per-frame React state.

Acceptance:

- [x] Minimal mode has no configured branding hold/slide in source; observed
      native startup duration remains pending.
- [x] Configured branded timing remains available and is documented; foreground
      stopwatch/background-resume observations remain pending.
- [ ] Restore failure exposes retry and does not expose `app-ready` prematurely.
- [ ] Login succeeds in static and animated modes without a stuck transition.
- [x] Android's exported surface has no header SVG-serialization call; native
      frame-rate measurements remain pending.
- [x] Cached splash paths bypass deforming header contours/details and SVG
      serialization in source; native frame measurements remain pending.
- [ ] Background and reduced-motion behavior remains correct.

Update the existing launch/mobile/appearance contracts when implementing the new
defaults. The launch/page/appearance/mobile skills now describe the implemented
modes and readiness. The neutral template's shorter launch is deliberate; Likan
keeps branded timing. Retained PlainHeader, ChangeHeaderStyle, MinimalReady and
MinimalWaiting fixtures support manual checks without adding a test runner.
Story registration alone did not expose a route in Step 7; Step 9 adds an explicit
development entry. Native behavior still requires the matching device/build.

The startup layout signal comes from the initial PageFrame's native outer layout.
It does not establish that every nested native text/field has painted, every
background request completed or a native interaction/performance check passed.
Keep the remaining native acceptance observations open until measured on matching
builds. Source-verified items above describe code paths, not measured timings.

### 8. Improve auth boundaries and local logout

**Files:** `src/services/auth/auth.api.ts`, `auth.lifecycle.ts`, `auth.session.ts`,
`auth.refresh.ts`, frontend auth models/schemas, registration/account presentation.

Work:

- Remove recipe-specific registration promises from the generic starter.
- Keep Foodiya wire fields and endpoints compatible. Move provider-specific token
  mapping into a pure auth mapper if needed. Keep product-specific role helpers
  outside a generic session model unless an actual consumer needs them.
- Define valid canonical stored authentication as a token plus identified user.
  Review legacy mapping and migration before tightening nullable stored fields.
  Malformed updates must preserve the previous valid session; corrupt persisted
  sessions should recover safely without authenticating an unidentified user.
- Keep cached identity usable during transient offline refresh failures. Do not
  turn temporary connectivity failures into forced logout.

Logout requires careful ordering:

1. Capture the old access token and session generation; assert ownership after
   asynchronous capture. Deduplicate repeated logout actions for that generation.
2. Durably clear that generation through existing serialized storage and cache
   cleanup. Complete local sign-out when this operation succeeds.
3. Revoke the captured session through an explicit bounded request that uses the
   captured Authorization header. It must not read global live credentials, refresh
   tokens, modify current caches or clear a newly established session.
4. Handle remote revocation as best effort without delaying local UI completion
   or displaying an old-account alert in a new session. Remote completion is not
   guaranteed offline or after process termination.
5. Preserve the current retryable storage-failure behavior. Do not report successful
   durable logout when SecureStore deletion failed.

Do not simply move `clearAuthSession` before the current `logout`: that client
reads the live session and would lose its credentials or target a newer login.
Also do not invent a refresh-token revocation endpoint/body; the repository does
not supply that backend contract. Expired-access-token revocation remains a
backend limitation to document.

Share pure API configuration with the raw refresh transport; do not replace it
with a top-level import of the authenticated API client. `api.ts` already imports
refresh, so that change could create an initialization cycle and refresh recursion.

Acceptance:

- [x] Local logout completes with delayed/unavailable revocation in isolated
      JavaScript checks; native timing remains pending.
- [x] Captured old-token revocation leaves a newer session/cache/alert state intact
      in source review and simulated late-401 checks.
- [x] Same-generation deletion failure preserves the account and retry in isolated
      checks; `auth-logout-error` identifies its UI message. Native observation is pending.
- [x] Isolated checks retain generation ownership, refresh deduplication, rotation
      failure cleanup and cache isolation. Native storage behavior remains pending.
- [x] Wire DTOs and consumed response schemas are unchanged; frontend models no
      longer imply unused product roles.

The maintained [session/lifecycle guide](api-services.md#session-model-and-logout)
owns the implemented ordering, storage compatibility and backend limitations.
These source/isolated results do not establish native SecureStore behavior or
server-side revocation. With matching iOS/Android builds and a real account,
complete offline/slow logout, new-login overlap, deletion failure/retry and cached
identity/refresh checks before closing native verification. No automated suite or
production fake session is introduced.

### 9. Make component maintenance runnable and upgrade boundaries honest

**Files:** component showcase/routes, `.rnstorybook/`, Metro config as needed,
UI public exports, `eas.json`, `.env.example`, `docs/storybook.md`, `docs/ui.md`.

Work:

- Give the existing developer-screen flag a real single owner, or replace it with
  the selected capability configuration and remove obsolete settings/comments.
- Hide catalog navigation and guard direct catalog URLs when it is disabled.
  Protected routes control access; they do not prove code was removed from a bundle.
- Choose one usable developer preview path: the in-app catalog remains the ordinary
  component browser; expose retained Storybook stories through an explicit
  development-only entry when those fixtures are needed. Keep production imports
  independent of Storybook packages/registration.
- Document the exact launch workflow. A script that only starts Metro is not a
  runnable Storybook UI.
- Inspect exported dependency graphs before claiming developer code is absent.
  Actual bundle exclusion is a separate requirement from route hiding; implement
  and prove build-time exclusion if it is required for the release artifact.
- Keep direct primitive exports. Wrap only named application behavior or verified
  upstream gaps. An extra wrapper cannot guarantee compatibility with future
  native toolkit changes.
- Maintain an upgrade checklist for existing Host, button, input, picker, OTP,
  refresh, alerts, segmented control, header/mask, loading and skeleton adapters.
- Review the intentional Expo UI/Router pins together on a dedicated upgrade change.
  Do not remove them as incidental cleanup; reproduce the originally affected native
  sizing behavior and verify the proposed version on both platforms first.

Acceptance:

- [x] Catalog and opt-in Storybook entries have documented launch commands; native
      screen execution still needs a matching device/build.
- [x] The disabled catalog routes have a shared source guard and their navigation
      links are hidden; installed-device direct-link behavior remains unverified.
- [x] Inspected Android/iOS release graphs contain no Storybook integration.
- [x] Showcase modules are explicitly retained; no code-stripping claim is made.
- [x] Existing custom wrappers have documented concrete responsibilities and owners.
- [x] The upgrade checklist requires native adapter review and original-case
      reproduction; this step does not change package versions.

### 10. Refresh architecture enforcement and documentation

**Files:** `eslint.config.js`, existing focused guides and matching component skills.

Work:

- Replace retired recipe-specific ESLint scopes with rules for current responsibility
  boundaries. Inspect existing auth recovery workflows before tightening rules;
  move only real orchestration/transport violations, not code merely to satisfy a glob.
- Cover entity transport regardless of whether its file is currently named
  `.service.ts` or `.api.ts`. Keep request/response schemas free of rendering.
- Retain services' prohibition on UI/feature imports and UI's prohibition on feature
  workflows and route imports. Pure configuration/mappers should stay independent
  of React, query caches and native I/O.
- Preserve shared import policies when changing ESLint scopes, because later flat
  config options can replace earlier restrictions.
- Update architecture, development, assets, appearance, API and preview guides only
  where ownership or supported behavior changes. Update matching component skills
  for public contract changes; keep historical reports clearly historical.
- Add a short client setup checklist to the existing development guidance. Avoid
  new per-component READMEs and duplicate contract inventories.

Acceptance:

- [x] Rules cover current source and legitimate auth/preview workflows; isolated
      forbidden/allowed import probes verify the scopes and shared-policy composition.
- [x] Architecture and skills explain the route/screen/workflow/UI/transport path,
      keeping small existing form consumers intact.
- [x] The client setup checklist links current brand, asset, appearance, preview
      and native adapter upgrade guidance; dated reports are marked historical.
- [x] No repository/container/base-component hierarchy or runtime rewrite is added.

### 11. Verify native behavior and establish a performance baseline

Use current native fixtures and real backend flows. No new automated test suite is
part of this phase. Run lint/typecheck and changed-file formatting for each change;
regenerate Storybook registration when story sources change.

| Area          | Manual scenarios                                                                                          | Completion evidence                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Brand/config  | Existing brand and a second configured example; local preview and intended release variant                | Resolved config and installed identity/assets match the selected brand                       |
| Startup       | Fresh launch, warm launch, saved preferences, restoration error/retry, missing local API configuration    | UI/recovery is reachable; readiness selectors have the documented meaning                    |
| Theme/text    | Each palette, light/dark/system, inherited/local scheme overrides, status text                            | Readable rendered text; no black-on-near-black primary tone                                  |
| Buttons       | Intrinsic/full width, custom content, disabled/pending, asymmetric corners, edge taps                     | Correct dimensions, single activation, disabled suppression                                  |
| Forms         | Keyboard/focus, secure text/visibility, invalid fields, submission failure/retry                          | Drafts/focus remain usable; selectors identify actual fields/actions                         |
| Localization  | French/English/Arabic; live direction change while a form has values                                      | Values remain; logical order and native controls mirror correctly                            |
| Accessibility | Large text, VoiceOver/TalkBack, icon-only controls, reduced motion                                        | Understandable names, reachable actions and readable layouts                                 |
| Auth          | Login/OTP/recovery, offline restore, concurrent expired reads, logout, account switch during pending work | Current account owns state; no stale writes, token resurrection or logout delay from network |
| Motion        | Static/animated modes, background/foreground, reduced motion                                              | No stuck login transition; unused outputs avoided; background animation stops                |
| Components    | Input, picker, switch, grouped form, sheet, refresh, disclosure                                           | Native state, fit, dismissal, selector and activation behavior recorded                      |
| Distribution  | iOS and Android development/release-like builds; exported bundle inspection                               | Native behavior checked separately from JavaScript export success                            |

Measure release-like builds on representative iOS and mid-range Android devices.
Record build/version, hardware, OS, brand, launch mode and connectivity. Use several
cold starts and report the sample count and median; do not present a tiny sample's
tail percentile as a reliable result. Record ready-to-interactive delay, UI frame
behavior while scrolling/typing, and native memory where meaningful.

Initial criteria: no artificial delay in minimal launch mode, no old-account state
after a switch, no repeated foreground-only work while backgrounded, and no observed
interaction regression relative to the same-device baseline. Set numeric startup
and frame budgets after collecting the baseline rather than inventing an FPS claim.

Existing Observe tooling can be used if configured and authorized; adding analytics
infrastructure is not a prerequisite for this focused work.

### 12. Prove the template through a second-brand exercise

Use the configured example brand without editing route, screen, service or shared
component implementation files. Walk through identity/assets, palettes/fonts,
backend environment, capability settings and both native builds. Keep examples
generic rather than creating a second product feature set.

Acceptance:

- [ ] A second brand is possible through documented configuration/asset additions.
- [ ] A fresh developer can run the public starter and locate native component examples.
- [ ] Production identity and integration settings are explicit and correct.
- [ ] Remaining native/upstream limitations are recorded with affected platforms.
- [ ] No unused-package cleanup or unrequested test-suite restoration was mixed in.
- [ ] Checks, backend verification, exports and native device observations are
      reported separately.

## Suggested review-sized changes

| Order | Change                                                | Main reason to keep it separate                             |
| ----- | ----------------------------------------------------- | ----------------------------------------------------------- |
| 1     | Verification baseline and formatting enumeration      | Establish reliable checks before app changes                |
| 2     | Brand/environment resolution and client identity      | Review configuration correctness independently              |
| 3     | Brand copy/fonts/artwork integration                  | Isolate native asset and presentation changes               |
| 4     | Text-tone and standalone Host repairs                 | Review concrete UI correctness with focused native examples |
| 5     | Selectors/accessibility and preference policy         | Complete the interaction and restart contracts              |
| 6     | Startup/static header and per-platform animation work | Compare behavior and performance independently              |
| 7     | Auth mapping/storage validation and logout sequencing | Keep session lifecycle changes isolated                     |
| 8     | Developer previews/capabilities and upgrade guidance  | Prove usable maintenance without production tooling leakage |
| 9     | Architecture rules/docs and second-brand verification | Check the resulting template as a complete workflow         |

Each change should compile and lint on its own. Preserve existing defaults until
the consuming configuration and documented replacement are ready together. Avoid
a partially migrated session format or a capability flag that hides a link but
leaves an unintended direct route open.

## Definition of done

The app is ready to be described as a maintained white-label starter when brand
identity has one explicit path, the identified UI defects are repaired, critical
native actions have stable selectors, session safety is preserved, minimal startup
is predictable, previews are runnable and a second brand has been verified on both
native platforms. Passing TypeScript and lint alone does not satisfy this definition.

Repository layers, a DI container and primitive wrappers are evaluated by whether
they simplify an actual implemented requirement. Their presence is not a completion
criterion for senior-quality architecture.

## Official references

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).
- [Dynamic configuration and white labeling](https://docs.expo.dev/workflow/configuration/#switching-configuration-based-on-the-environment).
- [Multiple app variants](https://docs.expo.dev/tutorial/eas/multiple-app-variants/).
- [Environment variables](https://docs.expo.dev/guides/environment-variables/).
- [SDK 57 native Host](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/).
- [Protected routes](https://docs.expo.dev/router/advanced/protected/).
- [Code removal](https://docs.expo.dev/guides/tree-shaking/) and
  [bundle analysis](https://docs.expo.dev/guides/analyzing-bundles/).

Versioned SDK documentation and installed types must be checked again when each
native/API change is implemented. Some unversioned guides describe later SDKs;
do not copy newer APIs into this SDK 57 checkout without compatibility verification.
