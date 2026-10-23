# Project implementation pattern

Read this reference for feature, screen, and workflow work. Paths in code spans
are relative to the repository root. Use the existing feature's naming and folder
shape; this is a responsibility pattern, not a request to restructure the app.

## Place each responsibility once

| Responsibility                        | Location                                                                      | Boundary                                                                                                           |
| ------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Route and navigator composition       | `src/app/`, `src/guards/`                                                     | Import feature screens, configure navigation and guards; keep transport, storage, and workflows outside routes     |
| Feature presentation                  | `src/features/<feature>/`                                                     | Compose shared UI, interpret route parameters, and connect workflows to events                                     |
| Feature workflow                      | A colocated `use-<workflow>.ts` or existing feature context                   | Own draft transitions, prerequisite reads, submission coordination, and success navigation                         |
| Pure domain rules                     | Feature domain files and `src/validation/schemas/`                            | Validate and normalize values without rendering, transport, or storage                                             |
| Response contracts                    | `src/validation/schemas/api/`, `src/types/`                                   | Define runtime schemas and matching DTOs at the I/O boundary                                                       |
| Entity transport                      | Existing entity `.api.ts` or `.service.ts` in `src/services/<entity>/`        | Use the existing HTTP client; preserve endpoint and payload contracts                                              |
| Remote-state policy                   | Entity `.queries.ts`, `.mutations.ts`, `.hooks.ts`; existing feature adapters | Own keys, cancellation, pagination, session guards, and successful cache maintenance                               |
| Shared native presentation            | `src/components/ui/<family>/`                                                 | Own rendering, controlled interactions, theme and platform adapters; leave feature orchestration with the consumer |
| Shared preferences and infrastructure | Existing `src/context/`, `src/hooks/`, `src/lib/`, `src/services/auth/`       | Extend the current owner rather than creating a second theme, session, HTTP, or preference system                  |
| Native component examples             | `.rnstorybook/`, `src/features/ui-showcase/`                                  | Keep story tooling outside production imports; distinguish starter showcase routes from isolated native fixtures   |
| Brand and API configuration           | `config/`, `src/config/`, `src/services/api.config.ts`                        | Keep Node resolution outside native imports; project only public metadata and share the native-safe API policy     |

The normal dependency direction is:

```text
route -> feature screen -> workflow -> entity hooks/options -> transport
               |              |
               v              v
          shared UI       pure domain rules
```

Services must not import feature UI. Pure domain rules must not depend on React,
Expo, query caches, or I/O. Within a feature, reuse existing adapters rather than
adding another transport path. See the maintained
[architecture guide](../../../../docs/architecture.md) for enforced boundaries.
Its lint scopes cover current screen/route presentation, both transport suffixes,
schemas/DTOs/mappers, shared UI and raw refresh. Keep a small documented endpoint
submission inside the existing `useAuthForm` consumer when that is the complete
workflow. Recovery's confirmation and challenge-keyed completion guards already
belong there; do not move them merely to make an import glob pass.

## Implement a coherent feature slice

1. Locate the current screen, route, workflow, UI consumers, schemas, and relevant
   native examples with `rg`. Read the relevant component skill and installed types. Establish the
   observable result, affected states, and existing public contract.
2. Start at the changed contract. For a UI-only change, stay in presentation. For
   a data change, confirm the backend contract, update schemas/DTOs and transport,
   then query/mutation options before connecting the screen. Follow
   [API services](../../expo-api-services/SKILL.md) for those layers.
3. Keep server state in TanStack Query. Keep transient interaction state local;
   put multi-step drafts and submission coordination in the existing workflow.
   Reuse React Hook Form, existing validation resolvers and `FormTextInput` for
   forms. Use existing providers for persisted app preferences.
4. Compose the screen from the existing frame, sections, fields, query feedback,
   and actions. Pass values and callbacks to presentation. Keep navigation in the
   route or feature consumer; preserve mandatory mutation callbacks before
   navigating on success.
5. Extend the relevant native example and manual verification where behavior changed.
   Verify the result through the same public entry point used by the feature.

Use the existing authentication workflow in
`src/features/auth/auth-flow.context.tsx`, transport in `src/services/auth/`,
and `currentIdentityQuery` for current examples. Its pure `auth.mapper.ts` maps
Identity wire tokens to the frontend session schema in
`src/validation/schemas/auth-session.ts`; storage/refresh/logout stay with their
existing auth owners. Do not introduce a repository or DI container for those
boundaries. Recipe-specific workflows and
entity services have been removed from this starter. Generic query, mutation,
pagination and invalidation utilities remain available for future backend work.

## Compose native UI without duplicating infrastructure

Keep each shared component's implementation, private helpers, types, and
necessary `.ios` / `.android` adapters in one existing family folder. Add files
only for an actual responsibility or native difference. A common type contract
must continue to work on both platforms; changing one adapter requires checking
the other and any declaration file. Export public additions through
`src/components/ui/index.ts`; preserve deliberate lazy entry points only when a retained feature requires them.

Use `@components/ui` from screens and exact implementation paths inside the UI
library. Native primitives already re-exported by the public entry point do not
need local wrappers merely to acquire a project name.

Reuse `PageScreen` / `PageFrame` or `AuthScreenFrame` as appropriate. Reuse their
keyboard, safe-area and refresh handling; do not add duplicate inset padding.
Inside an existing Host, use content components such as
`UniversalButtonContent`, `UniversalTextContent`, `LoadingContent`, and
`SkeletonContent`. Hosted standalone counterparts serve React Native boundaries.
Use Expo UI `Row`, `Column`, and `Spacer` for ordinary content layout; a Host
supplies native hosting and theme rather than arranging siblings.

Render project controls with Expo UI. Keep existing specialized map, Lottie,
Skia, navigation, and keyboard boundaries where needed. Use semantic tokens from
`src/constants/themes/` and shared layout tokens. Read the button's current props
before choosing an explicit semantic variant; do not assume every button shares
the same props. Preserve native feedback, accessible names, focus, disabled
behavior, and alignment between visible surfaces and touch targets.

For detailed library requirements, use
[the component-library skill](../../expo-universal-component-library/SKILL.md).
Find the family's skill through [the component index](component-skills.md) and
read its canonical component guidance and only the references needed for the task.

## Preserve product states and localization

For data-backed presentation, distinguish missing prerequisites, offline/paused
reads, initial fetching, initial failure, successful empty data, populated data,
and refresh. Reuse `QueryContent`, shared loading/error presentation, and
`useScreenRefresh` where appropriate. Keep cached content during refresh or
refresh failure. Do not replace persistent failure/retry context with an alert.

Reuse existing form submission guards. Preserve draft values on errors and
language changes. When a field or response changes, update the real validation
boundary rather than adding screen casts or bypasses. Shared UI may consume
shared preference contexts and receive query snapshots; it should not initiate
entity writes or own feature navigation.

Translate app-owned labels and accessibility text with the existing i18n setup.
Update `fr.json`, `en.json`, and `ar.json` together in `src/shared/locales/`, with
matching keys and interpolation parameters. Keep IDs, enum values, route names,
and test selectors independent of translations. Use logical start/end placement
for ordinary RTL layout and preserve physical map coordinates and safe-area
insets. Follow [localization](../../../../docs/localization.md) and
[layout direction](../../../../docs/layout-direction.md) when those concerns
change; reuse the live providers rather than introducing reload-based switching.

## Match verification to the change

- Run `npm run check` for typecheck, lint and maintained-file formatting. Format
  edited files without rewriting unrelated working-tree changes.
- Read current `package.json` scripts before choosing additional checks. Automated
  suites and Maestro flows have been removed. Do not add a runner or restore old
  test commands unless requested; preserve stable native selectors.
- For reusable UI behavior, update a discoverable native story or focused
  composition story with deterministic fixtures and stable selectors. Regenerate
  registration after story changes. Follow the current preview workflow; source
  fixtures and registration alone do not establish a runnable native preview.
- On available native devices, exercise the affected iOS and Android interactions,
  relevant light/dark and RTL states, keyboard, large text, and touch targets.
  Use current native compositions for manual checks. Static checks and JS fixtures do not prove
  native rendering, interaction, or performance.
- Update the canonical component skill, catalog, or architecture guide only when
  its contract changed. Report implementation, validation results, and remaining
  verification limits without claiming device or live-backend checks from mocks.
