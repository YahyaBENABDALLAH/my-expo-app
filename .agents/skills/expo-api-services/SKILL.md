---
name: expo-api-services
description: "Create or update this project's API services, DTOs, response/session boundaries, TanStack Query options, hooks and cache invalidation. Use for endpoint contracts, auth transport/session mapping/logout, documented writes, pagination, cancellation and cache behavior. Extend the existing auth lifecycle; native UI uses its component skills."
---

# Expo API Services

Extend the repository's existing API layer. Keep HTTP contracts, cache behavior and React consumption consistent when adding services or changing them.

## Establish the contract

Read the repository's `AGENTS.md`, `package.json`, [API guide](../../../docs/api-services.md) and [architecture](../../../docs/architecture.md). Inspect the affected entity and shared helpers before editing. Resolve paths below from the repository root.

Use the backend contract supplied for the task; otherwise inspect `Reference/services/<entity>/` and `Reference/types/<entity>.types.ts`. Check the exact HTTP verb, path, identifier order, parameters, nullability, request body and response shape. The reference tree is supporting material; application changes belong in `src/`.

Implement the documented capabilities. Do not assume every entity has POST, PATCH or DELETE. If an essential write contract is missing, ask for that specific contract while completing independent work. Preserve server field names and the actual pagination envelope; do not infer response types from a screen's minimal display fields.

Use Context7 for TanStack Query or Axios API syntax when needed: resolve the library ID, then query the relevant documentation for the installed major version. If Context7 is unavailable, use official documentation and installed types. For changes touching Expo or React Native APIs, follow the versioned documentation requirements in `AGENTS.md`; reread the installed Expo version rather than copying an old SDK number.

## Add an entity

The starter retains authentication in `src/services/auth/` and generic request/query/mutation/invalidation helpers in `src/services/`. Recipe-specific services and DTOs have been removed. Use `auth.api.ts`, `auth.queries.ts` and the generic helpers as current examples; add a feature entity only for a real backend contract.

| Location                                   | Responsibility                                                     |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `src/types/<entity>.types.ts`              | Item, list query/result and supported write DTOs                   |
| `src/validation/schemas/api/<entity>.ts`   | Runtime response shape; item DTOs infer from these Zod schemas     |
| `src/lib/api-query-keys.ts`                | Pure entity key factory and any additional endpoint keys           |
| Existing entity `.api.ts` or `.service.ts` | HTTP through `apiClient`; request normalization and paths          |
| `<entity>.queries.ts`                      | Typed list/detail/infinite options and additional documented reads |
| `<entity>.mutations.ts`                    | Supported writes and mandatory cache maintenance                   |
| `<entity>.hooks.ts`                        | Query hooks, supported mutation hooks and entity invalidation      |

Create the mutation module only when there are supported writes. Keep services independent of React, navigation, feature modules and cache effects. Use exact module imports; keep all non-route code outside `src/app/`. Direct service calls do not maintain the query cache.

Both transport suffixes share the existing ESLint boundary. General query hooks,
session storage, device metadata and auth lifecycle have their own current owners;
do not apply the entity-transport rule to every service file. Schemas, DTOs and
`.mapper.ts` modules have the pure-module policy. Preserve shared restrictions
when extending flat-config scopes and verify allowed/forbidden cases without
adding a runner. See the canonical
[architecture boundaries](../../../docs/architecture.md#enforced-import-boundaries).

Use `src/services/api.config.ts` for native API configuration and the shared
`config/api.js` normalizer/timeout. Do not read the API environment independently
in another transport. Refresh remains interceptor-free and must not import the
authenticated `api.ts` client. The native read is lazy so local public previews
can open without backend configuration; build-time production validation owns
release prerequisites. See the [configuration boundaries](../foodiya-implementation/references/configuration.md).

## Validate I/O boundaries

- Add a Zod response schema for every consumed JSON entity/auth response and attach it with the transport's `responseSchema` option. `apiClient` validates once before returning data to callers or TanStack Query. Do not cast an unvalidated response into a DTO, or repeat parsing in screens.
- Infer item/auth response DTOs from the schema. Preserve documented required fields, optional fields and nullability. Use `z.looseObject` for additive entity/profile fields; validate pagination integers and boolean flags with `paginatedResponseSchema`. Avoid restricting identifier/date formats beyond the established backend contract.
- Malformed successful responses become `ApiResponseValidationError` with a safe message and no raw payload, token values or Zod input attached. The shared query retry policy does not retry this error. Do not invalidate or seed caches from malformed write responses, and do not automatically repeat authenticated writes.
- Keep Identity wire schemas in `validation/schemas/api/auth.ts`. Frontend storage/display schemas live in `validation/schemas/auth-session.ts`; `auth.mapper.ts` validates/maps fresh tokens and supported legacy records without I/O. Canonical sessions require a nonempty access token and identified user. Preserve explicitly supported nullable refresh/expiry metadata for older canonical records; non-null tokens/dates must remain valid. Backend `roles` stay in wire DTOs, without unused frontend chef/role flags. Corrupt stored sessions are removed; invalid updates preserve the previous valid session and generation.
- Logout captures the access-token string and checks ownership after its asynchronous read, then awaits durable local deletion/cache cleanup. Start bounded revocation afterward with an explicit captured bearer on the existing unauthenticated client; do not await it, refresh it, read live credentials or alert a new account on failure. Repeated local clears share the owning promise; same-generation deletion failure restores retryable local state, while stale failure cannot restore another account. See [session lifecycle](../../../docs/api-services.md#session-model-and-logout) for limits and manual checks.

## Preserve query behavior

- Reuse `request-utils.ts` for normalized list parameters and encoded identifier segments. Use the same normalized parameter snapshot for the request and cache key. Preserve explicit `false` filters and valid default pagination.
- Reuse `query-utils.ts` for typed options. Forward its `AbortSignal` on every read, including additional endpoints. Disable incomplete detail reads with `skipToken`; composite details need every identifier.
- Keep finite lists and infinite lists in separate key namespaces. Infinite reads follow the backend metadata and stop on the final, empty or repeated page; preserve the shared pagination safeguards.
- Match query and service defaults. Use existing freshness conventions as a starting point: five minutes for catalogs and one minute for user data, adjusting when the entity's behavior warrants it.
- Use `useQueryClient()` in hooks and an explicit client in imperative mutation factories. Reuse `useEntityInvalidation` and `query-invalidation.ts`; specify the identifier tuple for composite detail invalidators.
- For a screen's pull-to-refresh, reuse `useScreenRefresh` with exact keys from its query-options factories and the shared screen's async `onRefresh` prop. Include only displayed reads; keep selected filters/pages and draft values. Preserve completion, error, offline and disabled-query behavior in `query-refresh.ts` rather than broadly invalidating every entity.
- Use `QueryContent` for query presentation: distinguish disabled prerequisites, paused connectivity, fetching, persistent errors and successful empty results. Preserve cached content during refresh/failure, disable retry during fetching/offline/disabled states, and keep persistent failure context even when a native alert announces the error.

## Preserve mutation behavior

Use `sessionMutationOptions` for authenticated entity writes. It guards session generations and prevents automatic retries or deferred offline replay. If a task explicitly calls for a different offline workflow, design that behavior deliberately rather than bypassing the guard.

Define cache effects from the write contract: which returned detail can be seeded, which filtered finite/infinite lists can change, and which related entities display affected values. Reuse `invalidateEntityLists` and exact detail keys. Keep unrelated account filters and unrelated entity details fresh.

Cancel an in-flight detail read before replacing or removing that entry. Call the supplied `assertCurrent()` after asynchronous cancellation and before cache changes; an account switch can happen during the await. Await invalidations so mutation completion and success navigation follow required cache maintenance. Failed writes must retain existing cache freshness.

Compose hook callbacks with `withMutationCallbacks`. Spreading a mutation and replacing `onSuccess` discards mandatory maintenance unless the original callback is explicitly awaited. Keep navigation in the consumer.

Retain special session effects only where required by the entity workflow. Keep token rotation and secure storage in the auth module.

Do not add optimistic writes by default. If requested, define cancellation, snapshots, rollback, account ownership and reconciliation before applying them. Distinguish server-write failures from callback or refetch failures before offering a repeated POST.

## Update an existing service

Search with `rg` for its DTOs, exported methods, hook names, key factory, feature adapters and imperative cache consumers. Change the contract and its callers together. Preserve compatible public names and cache keys where practical; when a key must change, update every affected cache operation and test.

When fields or filters change, update DTO nullability, normalized request parameters, query keys and invalidation predicates together. For a new endpoint, add its own read options/key/hook or write factory/hook as appropriate. Avoid implementing a second transport in a feature adapter. Keep the existing auth client/interceptor/session architecture.

Update the API guide when exposed capabilities change.

## Validate the affected behavior

This checkout has no automated service test runner. Do not restore historical test commands. Run `npm run typecheck`, `npm run lint` and formatting checks for edited files. Exercise changed auth/contracts with the actual backend and report that verification separately.

Report supported operations, integration changes and validation results. Distinguish mocked contract/cache tests from live backend or device verification; do not claim production verification from local checks.
