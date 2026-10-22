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
- Steps 3–12 remain planned. In-app brand copy, custom launch artwork and heading
  fonts are not yet connected to the manifest. Package versions and linked cloud
  projects were not changed.

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

**Files:** `src/shared/locales/{en,fr,ar}.json`, `src/app/_layout.tsx`,
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
- Preserve distinct native font names: the current auth frame intentionally uses
  `InterBlack` on iOS and `Inter-Black` on Android. Validate embedded font metadata
  and native rendering before replacing these with a shared alias.
- Preserve readable Arabic fallback fonts unless a client provides an Arabic-capable
  family. Do not apply a Latin-only brand font to every native text control.
- Document which icon/font/plugin changes require a new native build.

Acceptance:

- [ ] A second brand changes app-owned copy, launch artwork and supported heading
      fonts without editing screen implementations.
- [ ] No previous client name appears in generic app-owned user messages.
- [ ] French, English and Arabic retain matching translation/interpolation keys.
- [ ] Native headings and Arabic text are readable on both platforms.

### 4. Repair text semantics and clarify preferences

**Files:** `src/components/ui/text/universal-text.tsx`,
`src/constants/themes/tokens.ts`, existing palettes,
`src/context/theme.context.tsx`, `src/features/settings/`,
`src/features/ui-showcase/text-screen.tsx`.

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
5. Treat current session-only theme/appearance behavior accurately. Recommended
   template default: fixed configured brand, saved `system`/`light`/`dark` user
   appearance preference. Reuse existing restoration/write patterns if persistence
   is added; validate stored values and keep isolated preview providers in memory.
6. Include appearance hydration in reveal readiness when needed to prevent a
   wrong-scheme first frame. Retain existing language/header/motion restoration.
   Avoid a generic preference manager for a few scalar settings.

Acceptance:

- [ ] UX dark primary text no longer resolves to black on its near-black background.
- [ ] Existing black primary buttons retain their intended white labels.
- [ ] Explicit local theme overrides remain deterministic.
- [ ] Appearance restart behavior matches the chosen documented policy.
- [ ] Production users cannot select another client's/demo brand.

### 5. Unify standalone Host behavior without changing button geometry

**Files:** `src/components/ui/button/universal-button.tsx`,
`src/components/ui/host/universal-host.tsx`, existing button examples/stories.

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
- [ ] No additional nested Host is introduced.

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
- [ ] No generated selector contains `undefined` or depends on language.
- [ ] Repeated compositions can be distinguished on one screen.
- [ ] Remaining upstream selector limitations are listed explicitly.
- [ ] VoiceOver/TalkBack names remain understandable independently of test IDs.

### 7. Make startup and header motion configurable and cheaper

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

- [ ] Minimal mode introduces no configured branding wait after startup readiness.
- [ ] Configured branded timing remains available and is accurately documented.
- [ ] Restore failure exposes retry and does not expose `app-ready` prematurely.
- [ ] Login succeeds in static and animated modes without a stuck transition.
- [ ] Android performs no unused SVG serialization for the header.
- [ ] Static splash does not execute unused animated header contour/serialization work.
- [ ] Background and reduced-motion behavior remains correct.

Update the existing launch/mobile/appearance contracts when implementing the new
defaults. Current skills explicitly require the existing launch timing; it is a
deliberate behavior change, not an undocumented bug fix.

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

- [ ] Slow/offline server logout does not delay successful local durable sign-out.
- [ ] An old revoke response cannot affect a new account or show it an old error.
- [ ] Storage deletion failure remains visible and retryable.
- [ ] Session generations, refresh deduplication, rotation safety and cache cleanup
      remain in place.
- [ ] Wire DTOs remain compatible; frontend models no longer imply unused product roles.

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

- [ ] A developer can open the maintained examples using documented commands.
- [ ] Disabled catalog URLs do not expose the examples in a client build.
- [ ] Production bundles contain no Storybook integration.
- [ ] Any stronger claim about stripping showcase code is supported by its artifact.
- [ ] Every custom wrapper has a concrete responsibility and a maintained owner.
- [ ] SDK upgrades include native adapter review rather than only compilation.

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

- [ ] Rules cover real current source and legitimate workflows still pass.
- [ ] A new screen has one clear path to UI, workflow and data access.
- [ ] Documentation explains brand setup and native upgrades without historical scripts.
- [ ] No new repository/container/base-component hierarchy exists without a concrete need.

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
