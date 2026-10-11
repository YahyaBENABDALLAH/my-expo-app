# Application architecture

This app uses feature modules with explicit responsibilities. Expo Router files compose navigation and import feature screens. Shared UI owns native rendering, theme, and safe-area layout. There are no additional DI containers, generic repositories, or framework dependencies.

| Responsibility    | Location                                      | Rule                                                                                    |
| ----------------- | --------------------------------------------- | --------------------------------------------------------------------------------------- |
| Routes and guards | `src/app/`, `src/guards/`                     | Navigation composition; no business or storage logic                                    |
| Screens           | `src/features/*/*screen*.tsx`                 | Render native UI, interpret route parameters, invoke feature operations                 |
| Recipe workflow   | `src/features/recipes/use-recipe-creation.ts` | Draft lifecycle, step validation, lookups, submit guard, tab action and navigation      |
| Domain rules      | `recipe-draft.ts`, `chef-profile.ts`          | Pure schemas, normalization and input types; no rendering or I/O                        |
| Query definitions | `queries.ts`, `query-keys.ts`                 | Shared typed query options, account/parameter-aware keys, cancellation and cache policy |
| Mutations         | `mutations.ts`                                | Writes and successful cache invalidation; session version checked for chef registration |
| Entity transport  | `src/services/<entity>/*.service.ts`          | Documented endpoint paths and HTTP DTOs; no UI, navigation or cache logic               |
| Local collections | `collections.ts`                              | Storage validation, account isolation, serialization and bounded retention              |
| Infrastructure    | `src/services/`                               | Shared HTTP, auth lifecycle, secure storage; no dependency on screens                   |
| Native UI         | `src/components/ui/`                          | Expo UI composition, platform adaptation, safe areas and tab chrome                     |

Dependencies flow from screens/workflows toward domain rules, feature adapters, and shared infrastructure. Services never import feature UI. Domain modules do not import React, Expo, cache libraries, or services. Feature operations import exact modules directly. Screens import shared presentation through `@components/ui`; UI implementations import siblings directly to avoid cycles.

The [components guide](../src/components/README.md) explains placement. Shared UI
uses one folder per component or small family, with native adapters, types,
private helpers and a README together. The public `@components/ui` API stays
stable; implementations import concrete files directly without extra barrels.

The [shared UI guide](../src/components/ui/README.md) lists controls, fields, screen
frames, loading states, toast hosts and navigation presentation. Auth actions use
the universal button implementation with the auth Host palette. Storybook-only
hosted showcase wrappers live in `.rnstorybook/components/showcase/`. ESLint rejects
screen imports that bypass the UI entry point and UI imports of feature workflows.

`queryOptions` keeps keys, fetch functions and cache policy together. `mutationOptions` keeps writes and invalidation together. Screens retain presentation decisions such as focused/enabled queries and route parameters. Recipe creation composes its success navigation with the mutation's existing invalidation callback, so overriding the screen behavior does not discard cache maintenance. A like invalidates public recipe data and the current user's liked list; another user's private cache stays unchanged. Failed writes do not invalidate caches.

The public HTTP client and authentication storage remain unchanged. Favorites/history keep their existing storage format and serialization. Recipe adapters now delegate to the entity services and canonical entity query keys. Login/logout clears the shared cache. The recipe creation screen retains its selectors and four steps; row IDs are allocated outside React state updater functions so those updaters remain pure.

## Enforced boundaries and tests

ESLint prevents recipe screens from directly importing HTTP transport, AsyncStorage or session-write adapters; infrastructure cannot import screens or UI; recipe domain modules cannot import rendering or I/O. Existing rules also keep production imports separate from Storybook and route files. These are scoped import rules, not a complete cycle or semantic dependency analyzer.

Three mutation regression tests execute real TanStack MutationCache/QueryClient behavior with mocked external writes. They cover user-scoped like invalidation, failed-write cache retention, and isolated collection invalidation. Existing validation, API cancellation, auth races, storage serialization, navigation parsing, and safe-area tests remain part of `npm test`. Native screens and live API behavior still require device/server verification.

The [entity API layer](api-services.md) adds services, query-options factories and hooks for all 16 reference entities. Shared request utilities normalize parameters and identifiers; query utilities handle pagination and cancellation; mutation options own cache maintenance and session checks. Service tests exercise the real Axios client and TanStack cache with a network adapter. Chef registration uses the composed mutation hook so navigation cannot overwrite cache maintenance.

Verification on 2026-10-03: lint, typecheck, all 73 tests, and iOS/Android production JavaScript/Hermes exports pass. Three explicit ESLint probes confirmed rejection of screen-to-transport, service-to-screen, and domain-to-React imports. No native device or live-server checks were run for this refactor.

## Documentation used

The earlier cleanup used Context7's public indexes. The entity API implementation used the Context7 MCP documentation tool for TanStack Query v5 and checked the installed types. Primary references include [TanStack query-options guidance](https://tanstack.com/query/v5/docs/framework/react/guides/query-options), [mutation invalidation guidance](https://tanstack.com/query/v5/docs/framework/react/guides/invalidations-from-mutations), [Expo Router core concepts](https://docs.expo.dev/router/basics/core-concepts/), and [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/).

This cleanup concentrates on the recipe feature, where transport, workflow and cache responsibilities were mixed. The existing auth module already has separate session/lifecycle/API layers and was preserved. Earlier documented feature-parity, cold-start notification, and password-reset limitations remain open; an architecture refactor does not establish that every screen works on a device.

## Production audit fixes (2026-10-04)

Ordinary screen composition uses Expo UI Row/Column/Spacer, native text, semantic buttons and native progress controls. UniversalHost supplies its scheme to hosted content; content components avoid an extra Host inside native trees. Specialized RN geometry remains at navigation, keyboard/safe-area, map, Lottie and Skia boundaries. Launch completion follows font and session readiness instead of a fixed branding delay.

Zod response schemas in src/validation/schemas/api validate consumed entity/auth payloads at the transport boundary. Response DTOs infer from schemas, preserving backend fields and nullability; validated data alone enters the query cache. Stored-session normalization validates canonical and supported legacy formats while retaining generation/serialization/rotation guards. QueryContent distinguishes prerequisite, offline, fetching, persistent error, empty success and cached refresh states.

See [the implementation plan and verification](production-fixes-plan.md) and [the API validation contract](api-services.md). The package manifests and lockfiles were intentionally left unchanged. Existing unrelated audit findings remain outside this fix scope.
