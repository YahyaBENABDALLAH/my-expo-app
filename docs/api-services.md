# API services and TanStack Query

The API layer covers the 16 entity contracts in `Reference/`. It uses the existing authenticated Axios client and TanStack Query v5; no dependencies were added. Configure `EXPO_PUBLIC_API_URL` and render consumers inside the existing `AppQueryProvider`.

## Error notifications

The HTTP client normalizes failures into `ApiError.kind`: `http`, `network`,
`timeout`, `configuration`, `invalid-response`, or `unexpected`. `message` is a
diagnostic; `displayMessage` is localized user feedback. Setup and programming
failures keep their diagnostic message without showing it in the UI. Timeout
diagnostics use the request's configured duration, including custom timeouts.
Backend validation-message lists retain only nonempty strings.

The shared query client retries network failures, timeouts and HTTP
408/500/502/503/504 once. Other HTTP failures, invalid responses, configuration
failures and unexpected errors are terminal. Status zero alone does not imply a
connection failure. Auth refresh remains owned by the HTTP interceptor, and
mutations have no automatic retry or deferred offline replay.

The app's shared `QueryCache` and `MutationCache` report failed operations through `src/lib/error-toasts.ts`. Query notifications fire only after retries finish, once per shared query. Auth forms, recipe writes, lookups, profile reads, and pull-to-refresh use the same toast flow. Background session refresh and best-effort remote logout also report errors while retaining their existing auth behavior.

`ErrorToastHost` is mounted above navigation after the launch screen. It retains errors received before mounting, displays distinct messages in order, and coalesces identical messages while queued or visible. Notifications survive navigation and auth redirects. Canceled reads, aborts, and `SessionChangedError` are excluded; Axios preserves these errors instead of converting them to `ApiError`. API `displayMessage` values and validation-message arrays are used, with existing friendly auth/server fallbacks.

Android uses Expo UI's native Compose `SnackbarHost`; iOS uses a SwiftUI text/button toast because SDK 57 has no universal or SwiftUI Snackbar. Both appear inside the top safe area so the keyboard cannot cover API feedback. Android uses its native long timeout and dismiss button. iOS dismisses after six seconds, announces the error to VoiceOver, and stays visible while a screen reader is enabled. No new dependencies are needed.

Screens retain drafts, client-side field validation, cached content, and retry controls. `QueryContent` keeps persistent failure context beside Retry after a toast disappears, with separate initial-load and saved-content messages. Avoid reporting the same error again in consumer callbacks. When an imperative operation runs outside the shared query client, catch it with `reportErrorToast(error)`; do not add notification effects to entity transport methods. Local collection failures handled by the shared cache also use toasts.

`tests/services/error-toasts.test.mjs` exercises real Axios/TanStack behavior with mocked I/O: display text, coalescing, queue dismissal, retry success/exhaustion, shared observers, mutation callbacks, cancellation/session changes, and imperative auth failures. Native stories cover light/dark, long, and multiline notifications; `.maestro/storybook/error-toast.yaml` covers dismissal and reopening when a native device is available.

## Module responsibilities

Each entity has directly importable modules under `src/services/<entity>/`:

- `<entity>.service.ts`: typed HTTP methods, documented paths, DTOs and cancellation.
- `<entity>.queries.ts`: reusable list/detail/infinite query options for hooks, prefetching and imperative reads.
- `<entity>.hooks.ts`: React query hooks, supported mutation hooks and an invalidation hook.
- `<entity>.mutations.ts`: writes and mandatory cache maintenance, for entities with documented writes.

Response schemas live in `src/validation/schemas/api/`; item/auth DTOs in `src/types/` infer from those schemas. Request and query DTOs remain explicit. Cache identifiers live in the pure `src/lib/api-query-keys.ts`. Import specific modules rather than a broad barrel.

## Response and session validation

Every consumed JSON response from the 16 entity services and authentication endpoints has a Zod `responseSchema` attached to `apiClient`. Parsing happens once after HTTP/session checks and before returning data to callers or the query cache. Entity/profile schemas retain additive fields with `z.looseObject` and preserve contract nullability. Pagination validates array data, positive integer page/take, nonnegative counts and boolean navigation flags. Recipe detail validates its nested ingredient, step and nutrition shapes.

A malformed successful response raises `ApiResponseValidationError`. Its safe message contains no response body, token values or Zod input. The shared query policy skips retries for this deterministic failure. Failed parsing never seeds detail caches or triggers successful-write invalidation. A malformed write response may follow a completed server write; automatic repetition is disabled and server reconciliation remains necessary before retrying an uncertain write.

Authentication validates challenge/token unions, current identity and token expiry formats. Session normalization validates both canonical saved sessions and the supported legacy token response format before restoring or persisting them. Corrupt sessions are removed. Invalid metadata updates preserve the previous valid session. A malformed successful token rotation clears the consumed token pair through the existing failure path. Session generations, serialized storage, cancellation and account-switch safeguards remain in place.

`QueryContent` distinguishes missing prerequisites, offline paused requests, active loading, successful empty results and background refresh. Disabled/offline queries do not display a spinner. Cached content survives refresh/failure; Retry is disabled while fetching, offline or disabled. Account-dependent collection and chef screens supply specific prerequisite messages.

## Supported contracts

All entities provide `list(query?, options?)`, `detail(...identifiers, options?)`, list/detail/infinite hooks, and an invalidation hook. List responses retain the backend's `{ data, meta }` shape. A detail response is the item itself.

| Entity / folder                      | Detail identifier(s)       | Additional documented methods                                                                                     |
| ------------------------------------ | -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| ChefProfile / chef-profile           | uuid                       | createSelf (POST /me), update (PATCH /uuid), toggleVerified (PATCH /uuid/toggle-verified), forUser (paged lookup) |
| Cuisine / cuisine                    | uuid                       | —                                                                                                                 |
| DailyRecipeStat / daily-recipe-stat  | uuid                       | today (GET /today), last (GET /last)                                                                              |
| Difficulty / difficulty              | uuid                       | —                                                                                                                 |
| FoodCategory / food-category         | uuid                       | —                                                                                                                 |
| Ingredient / ingredient              | uuid                       | —                                                                                                                 |
| IngredientType / ingredient-type     | uuid                       | —                                                                                                                 |
| MoroccanCity / moroccan-city         | uuid                       | —                                                                                                                 |
| MoroccanRegion / moroccan-region     | uuid                       | —                                                                                                                 |
| Recipe / recipe                      | uuid                       | create (POST /chefUuid)                                                                                           |
| RecipeIngredient / recipe-ingredient | recipeUuid, ingredientUuid | —                                                                                                                 |
| RecipeLike / recipe-like             | recipeUuid, userUuid       | create (POST), delete (DELETE /recipeUuid/userUuid)                                                               |
| RecipeNutrition / recipe-nutrition   | recipeUuid                 | —                                                                                                                 |
| RecipeShare / recipe-share           | uuid                       | —                                                                                                                 |
| RecipeStep / recipe-step             | uuid                       | —                                                                                                                 |
| Unit / unit                          | uuid                       | —                                                                                                                 |

Endpoints use the exact PascalCase entity path, for example `/api/FoodCategory`. Additional POST/DELETE methods require a backend contract before they can be added. Authentication keeps its existing separate service/session lifecycle.

## Reads in components

Hook names follow the entity name, for example `useCuisineListQuery`, `useCuisineInfiniteQuery`, `useCuisineDetailQuery`, and `useInvalidateCuisineQueries`.

```tsx
import {
  useRecipeListQuery,
  useRecipeDetailQuery,
  useRecipeInfiniteQuery,
} from '@/services/recipe/recipe.hooks';

// Inside a component or custom hook:
const recipes = useRecipeListQuery({ search, page: 1, pageSize: 12 });
const recipe = useRecipeDetailQuery(recipeUuid);
const feed = useRecipeInfiniteQuery({ search, pageSize: 12 });

// Flatten for a native list:
const items = feed.data?.pages.flatMap((page) => page.data) ?? [];

// In your list's onEndReached handler:
if (feed.hasNextPage && !feed.isFetchingNextPage) {
  void feed.fetchNextPage();
}
```

List and infinite hooks accept a second `{ enabled }` argument. Detail hooks accept an optional identifier and use `skipToken` until every identifier is present. Composite detail hooks require both identifiers.

Infinite queries begin at page 1 and advance only when `meta.page` matches the
requested page, `hasNextPage` is true, and `pageCount` includes another page. Empty,
repeated, skipped or contradictory final-page metadata stops pagination. Finite
and infinite queries use separate cache namespaces.

Catalog data is fresh for five minutes; recipes, profiles, and activity data are fresh for one minute. Query hooks inherit the provider's mobile focus/reconnect behavior and retry policy. Every query forwards TanStack's `AbortSignal` through Axios.

Strings are trimmed and empty/undefined parameters removed before creating both the key and request. Defaults are page 1 and page size 12, or 20 for catalogs. Pagination must be a positive integer. Identifiers are trimmed and encoded as individual path segments. Use the query-options factories when addressing a normalized list cache entry.

## Prefetching and services

```ts
import { recipeDetailOptions } from '@/services/recipe/recipe.queries';
import { recipeService } from '@/services/recipe/recipe.service';

await client.prefetchQuery(recipeDetailOptions(recipeUuid));
const cached = client.getQueryData(recipeDetailOptions(recipeUuid).queryKey);

// Direct HTTP outside React. This does not maintain the query cache:
const controller = new AbortController();
const result = await recipeService.list(
  { search: 'tagine', pageSize: 12 },
  { signal: controller.signal, timeoutMs: 10_000 },
);
```

Use mutation hooks/options for application writes. Direct service writes deliberately have no cache effects.

## Writes and callbacks

```tsx
import { router } from 'expo-router';
import { useCreateRecipeMutation } from '@/services/recipe/recipe.hooks';
import {
  useCreateRecipeLikeMutation,
  useDeleteRecipeLikeMutation,
} from '@/services/recipe-like/recipe-like.hooks';
import {
  useCreateChefProfileMutation,
  useUpdateChefProfileMutation,
  useToggleChefProfileVerifiedMutation,
} from '@/services/chef-profile/chef-profile.hooks';

// Inside a component or custom hook:
const create = useCreateRecipeMutation({
  onSuccess: (recipe) => {
    // Cache maintenance and active refetches have completed here.
    router.navigate({ pathname: '/recipe/[uuid]', params: { uuid: recipe.uuid } });
  },
});
const like = useCreateRecipeLikeMutation();
const unlike = useDeleteRecipeLikeMutation();
const registerChef = useCreateChefProfileMutation();
const updateChef = useUpdateChefProfileMutation();
const toggleVerified = useToggleChefProfileVerifiedMutation();

// Inside event handlers:
await create.mutateAsync({ chefUuid, body: validatedRecipeBody });
await like.mutateAsync({ recipeUuid, userUuid });
await unlike.mutateAsync({ recipeUuid, userUuid });
await registerChef.mutateAsync({ displayName: 'Chef Amal' });
await updateChef.mutateAsync({ uuid: chefUuid, body: { bio: 'Seasonal Moroccan cooking' } });
await toggleVerified.mutateAsync(chefUuid);
```

Every mutation hook accepts optional `onSuccess`, `onError`, and `onSettled` callbacks. They compose with the mandatory lifecycle; they cannot overwrite cache maintenance. Use hook-level callbacks for awaited navigation/side effects. A callback supplied to `mutate(..., callbacks)` follows TanStack's normal observer lifecycle.

Mutation-options factories accept an explicit `QueryClient` for imperative operations and tests, for example `createRecipeMutationOptions(client)`.

| Successful write                  | Cache maintenance                                                                                                             |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Recipe creation                   | Seed returned detail; invalidate all finite/infinite recipe lists and daily statistics                                        |
| Like creation                     | Seed composite like detail; invalidate matching like lists, all recipe lists, the affected recipe detail and daily statistics |
| Like deletion                     | Cancel/remove composite like detail; invalidate the same related lists/detail/statistics                                      |
| Chef creation/update/verification | Seed returned profile detail; invalidate profile lists, that user's profile lookup and recipe data containing chef metadata   |

Like invalidation matches the user and recipe filters, including unfiltered aggregate lists. Other users' filtered lists and unrelated recipe details remain fresh. Failed writes do not invalidate caches.

Detail reads are canceled before a write response replaces/removes their cache entry. Mutation promises remain pending until cache maintenance and active refetches finish; refetch errors follow TanStack's default invalidation behavior. A failed consumer callback can reject the mutation lifecycle after the server write has succeeded, so do not automatically repeat POST requests based only on callback errors.

Writes have no automatic retries and use `networkMode: 'always'`: connectivity failures surface instead of silently queuing a write for another login. Session generation is checked before/after the request and around asynchronous cache maintenance. A late write from an earlier session cannot modify a new account's cache. Existing login/logout clears the shared query cache.

Chef registration persists `isChef` and the returned profile UUID through the existing serialized session adapter. If secure-storage persistence fails after server creation, reconcile the existing profile before trying registration again.

## Pull-to-refresh for a screen

Use `useScreenRefresh` with the exact keys from the query-options factories, then pass its async callback to `PageScreen` (or `AuthScreenFrame` for account screens):

```tsx
import { useQuery } from '@tanstack/react-query';
import { useScreenRefresh } from '@/hooks/use-screen-refresh';
import { recipeListOptions } from '@/services/recipe/recipe.queries';
import { PageScreen } from '@/features/pages/page-screen';

// Inside a screen:
const options = recipeListOptions({ page, search, categoryUuid });
const recipes = useQuery(options);
const onRefresh = useScreenRefresh([options.queryKey]);

return (
  <PageScreen title="Recipes" description="Browse recipes." onRefresh={onRefresh}>
    {/* Render recipes and their query error state here. */}
  </PageScreen>
);
```

The callback refetches exact active, enabled entries, retaining the current filters/page. Include every query displayed by that screen, and only the selected collection or current form-step lookups. Missing identifiers, disabled reads and inactive entries are skipped. Shared consumers of the same cache entry also receive the updated data.

The native indicator waits for the selected requests, and repeated gestures reuse the pending refresh. Refresh reuses existing in-flight reads instead of canceling them. A failed read keeps cached data and exposes the error through the query result; render that result with `QueryContent` or the screen's existing error feedback. Offline network reads can remain paused for reconnection without holding the gesture indicator open. Favorites/history use `networkMode: 'always'` so local storage can still be reread offline. Refresh performs reads only and preserves form drafts.

`RefreshableScrollView` is host-free and belongs inside an existing Expo UI Host. It uses SDK 57's [SwiftUI refreshable modifier](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/modifiers/) on iOS and [Compose PullToRefreshBox](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/pulltorefreshbox/) on Android; the universal ScrollView has no refresh callback. Screens without a callback keep ordinary scrolling.

## Manual invalidation

```tsx
import { useInvalidateRecipeQueries } from '@/services/recipe/recipe.hooks';
import { useInvalidateRecipeLikeQueries } from '@/services/recipe-like/recipe-like.hooks';

// Inside a component or custom hook:
const recipes = useInvalidateRecipeQueries();
const likes = useInvalidateRecipeLikeQueries();

// After an external change:
await recipes.lists(); // All filters/pages, finite and infinite
await recipes.detail(recipeUuid); // Exact detail
await likes.detail(recipeUuid, userUuid); // Composite detail
await recipes.all(); // Whole entity
await recipes.lists({ refetchType: 'none' }); // Mark stale without fetching
```

Invalidation hooks use their provider's client and return stable operations. List/all operations support `refetchType: 'active' | 'inactive' | 'all' | 'none'`; the default is active. Composite detail invalidators enforce identifier arity in TypeScript.

The chef-by-user helper scans documented profile list pages because the backend contract has no user filter. Prefer the direct profile UUID when it is available in session metadata.

## Verification

`npm run test:services` exercises real Axios interceptors and TanStack Query caches
with an in-memory network adapter. It checks endpoint contracts, normalization,
pagination, cancellation, scoped invalidation, callback ordering, screen refresh,
offline behavior, malformed response rejection and session races. Transport error
tests also verify actual retry counts, timeout durations, safe feedback and
preflight storage failures. The suite is included in `npm test`. Complete fixtures
live in `tests/helpers/api-fixtures.mjs`; the adapter does not repair malformed
payloads.

Screen-refresh tests cover exact filters/pages, inactive/disabled queries, request reuse, completion ordering, cached content after errors, and offline local collections. Native short/tall composition stories are in Pages/Navigation shell. Run `maestro test .maestro/storybook/pull-to-refresh.yaml` against a connected development build with Metro running for gesture, pending-duplicate, failure and recovery checks. Device execution is still required to verify native interaction and indicator geometry on iOS and Android.

The DTOs and endpoints come from the repository's reference contracts. Live backend and device behavior require separate integration verification. Implementation patterns were checked through Context7 and installed packages against TanStack Query v5 documentation: [query options](https://tanstack.com/query/v5/docs/framework/react/guides/query-options), [infinite queries](https://tanstack.com/query/v5/docs/framework/react/guides/infinite-queries), [cancellation](https://tanstack.com/query/v5/docs/framework/react/guides/query-cancellation), and [mutation invalidation](https://tanstack.com/query/v5/docs/framework/react/guides/invalidations-from-mutations). Axios normalization follows its [error handling](https://axios-http.com/docs/handling_errors) and [cancellation](https://axios-http.com/docs/cancellation) contracts.
