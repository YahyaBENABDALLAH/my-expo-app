# Reference pages and navigation plan

Goal: implement every page represented in `Reference/app`, make it reachable from the app, and open a specific page from a route or notification even when the app is closed (cold start). Keep the implementation simple.

This is an implementation plan, not an implementation of the screens. Target: the existing Expo SDK 57 app, iOS and Android. Reuse current auth, query provider, validation, and UI components. Use Reference for behavior and content; port features individually rather than copying its application infrastructure.

Implementation status: inventory routes and native navigation shells are now created with five product tabs and a development-page directory for fixture detail links. Existing auth pages are reused; Reset Password uses the existing recovery API and requires a valid challenge ID. Device Info reads local device metadata. Product data queries, recipe/chef forms, settings sheets, and notification entry coordination remain subsequent phases. `/UI` is not a separate alias file because Windows paths are case-insensitive; use canonical `/ui` until incoming-link normalization is implemented.

## 1. Page inventory

Reference has 21 page files, excluding layouts. Each has a destination below. `/main` is an empty page used as a context-sensitive tab button in Reference; preserve its URL as a redirect to Create rather than introduce an empty screen. The auth index becomes the existing Login page so `/` has exactly one meaning: Home.

| Reference page                   | Destination URL               | Entry point / work                                                                  |
| -------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------- |
| `(auth)/index.tsx`               | `/login`                      | Existing login; reuse, compare Reference auth entry                                 |
| `(auth)/sign-up.tsx`             | `/register`                   | Existing register; `/sign-up` compatibility redirect                                |
| `(auth)/forgot-password.tsx`     | `/forgot-password`            | Existing page; reuse                                                                |
| `(auth)/reset-password.tsx`      | `/reset-password`             | Add reset form and validate recovery parameters                                     |
| `(auth)/verify-email.tsx`        | `/verify-email`               | Existing page; reuse                                                                |
| `(tabs)/index.tsx`               | `/`                           | Home tab: featured recipes, categories, recipe links                                |
| `(tabs)/search.tsx`              | `/search`                     | Search tab: results, category browser, filters                                      |
| `(tabs)/main.tsx`                | `/main` → `/create-recipe`    | Compatibility redirect; no empty tab                                                |
| `(tabs)/create-recipe.tsx`       | `/create-recipe`              | Create tab: title, summary, ingredients, steps, time, servings, cuisine, difficulty |
| `(tabs)/recipes.tsx`             | `/recipes`                    | My Recipes tab: links to the three collections below                                |
| `(tabs)/more.tsx`                | `/more`                       | More tab: account, settings, tools, logout                                          |
| `recipe/[uuid]/index.tsx`        | `/recipe/:uuid`               | Recipe cards: overview, facts, ingredients, steps, actions, detail panel            |
| `category/[uuid].tsx`            | `/category/:uuid`             | Home / Search category selection                                                    |
| `my-recipes/liked-favorites.tsx` | `/my-recipes/liked-favorites` | My Recipes; preserve `tab=liked` or `tab=favorite`                                  |
| `my-recipes/history.tsx`         | `/my-recipes/history`         | My Recipes → History                                                                |
| `my-recipes/creations.tsx`       | `/my-recipes/creations`       | My Recipes → Creations                                                              |
| `ingredients/index.tsx`          | `/ingredients`                | More → Ingredients; list with ingredient detail sheet                               |
| `become-chef/index.tsx`          | `/become-chef`                | More → Become a chef; profile form                                                  |
| `device-info/index.tsx`          | `/device-info`                | More → Device information                                                           |
| `health-check/index.tsx`         | `/health-check`               | More → Health check                                                                 |
| `UI/index.tsx`                   | `/ui`                         | Development tools → UI showcase; `/UI` compatibility redirect                       |

Keep existing `/account` reachable from More. Keep Skia, Maps, and Storybook available under development tools while replacing their main tab slots with product pages. UI showcase is development-only; it has no notification target.

Search uses the existing Reference parameter names: `q`, `categoryUuid`, `cuisineUuid`, `difficultyUuid`. Detail pages take an ID from the URL and load their own data; they must not require a previously selected card in memory.

Search filters, profile preferences, ingredient details, and recipe detail panels remain components/sheets of their parent page. They do not need extra routes in the first version. Preserve their behavior when porting the parent feature.

## 2. Small navigation structure

- One root Stack: auth routes, the tab group, and detail/tool routes.
- Five visible tabs: Home, Search, Create, My Recipes, More.
- Thin route files in `src/app/`; screens and sheets in `src/features/`.
- Put recipe/category/collection/detail pages on the root stack, above the tabs. One canonical route per page; no duplicated detail screens inside each tab.
- Use Expo Router `Link` for ordinary links, `router.push` for actions, and `router.replace` for entry redirects and completion of login.
- Preserve the current authenticated-app policy: product pages require login; auth pages are signed-out routes. Backend authorization still applies to loaded data.
- Normal launch: Login when signed out, Home when signed in. Stop redirecting `/` to `/skia`.
- A valid incoming destination overrides the normal launch page. Splash completion must never navigate to Home and overwrite that destination.
- Ordinary navigation pops back to the previous screen. Cold-start detail pages get Home as the stack anchor; provide a Home fallback if there is no usable back history.

Keep tab buttons predictable: Create always opens Create, and filters/profile/submit actions live on their own screens. Do not port Reference's context-dependent center-tab controller.

## 3. Open a specific page

Use the existing `myappexpo` scheme initially:

```text
myappexpo://recipe/<uuid>
myappexpo://category/<uuid>
myappexpo://search?q=tagine
myappexpo://my-recipes/liked-favorites?tab=favorite
```

Every production page supports its own URL, including forms with an empty initial state. Internal navigation uses those same paths. Public HTTPS app/universal links can follow later when a domain and association files are available.

One small entry coordinator and one pending destination are sufficient:

1. Capture and normalize the initial deep link before protected routing discards it. Listen for subsequent links to preserve destinations received while signed out. Expo Router continues to handle ordinary URL routing; avoid dispatching the same link twice.
2. Resolve notification taps to the same canonical destinations. Read the last notification response for cold starts and subscribe to responses for running/backgrounded apps. Receiving a notification alone does not navigate.
3. Validate known paths, IDs, and query parameters. Normalize `/sign-up`, `/main`, and `/UI` aliases before checking access. Ignore invalid notification targets; show a recoverable not-found page for unknown links. Never dispatch an arbitrary push-supplied URL.
4. Wait until session restoration and the root navigator are ready. Hold only one pending destination; the latest explicit link/tap wins. Deduplicate the cold-start response against the live listener.
5. When signed out and the destination requires auth, retain it and show Login. Preserve it through register, verification, and recovery within the same auth journey.
6. After authentication and protected routes are available, consume the pending destination once and replace Login with it. Without a destination, open Home. Keep this navigation in the UI coordinator, rather than adding router calls to the auth services.
7. Clear handled OS notification responses. Clear pending navigation on explicit logout or cancellation of the entry journey. A fresh session must not reopen an old notification.

Use an in-memory pending value for this first version. It survives the current login journey, including an app launch from a notification; resuming after the OS kills the app mid-login is outside this first version.

Preserve Reference's push contract:

```json
{
  "version": 1,
  "target": "recipe",
  "targetId": "recipe-uuid",
  "notificationId": "unique-id"
}
```

Initial allowlist: `home`, `recipe`, `category`, `search`, `liked-favorites`. Search supports the filters listed above; liked/favorites supports `tab`. Accept version `1` as a number or string to match Reference. Other pages remain addressable by route; add new push targets only when needed.

Use Reference's notification routing as a starting point, adapting it to current auth and SDK 57. Choose one notification tap owner; do not let both Firebase Messaging and Expo Notifications independently route the same message. Token registration/delivery is separate: Reference documents no backend device-token endpoint. Add token upload, refresh, and logout cleanup when that backend contract exists. Navigation can be verified with local notifications beforehand.

## 4. Expo UI and screen queries

Documentation approach: use Context7 to resolve Expo, Expo UI, and TanStack Query documentation when its tools are available, selecting SDK 57 and Query v5. Context7 was unavailable in this session; the guidance below was checked against official documentation and the installed project setup instead. Do not use a newer SDK API just because an unversioned example contains it.

### Native UI

- Use `@expo/ui` controls and content on iOS and Android, through existing `src/components/ui/` wrappers. Keep native trees inside Host; reuse semantic theme tokens.
- Use Expo UI Text, Button, TextInput, Picker, FieldGroup, Switch, and BottomSheet for page content, forms, filters, preferences, and details. Confirm each component's installed types and SDK 57 API before implementation.
- Use List/ListItem for short settings groups. The universal List is not virtualized: keep large feeds/search/catalogs bounded with pagination, and resolve the native rendering approach before porting them. Do not silently substitute React Native controls or a third-party UI kit; the project skill requires asking if an unavailable component needs another library.
- Isolate necessary SwiftUI/Compose adaptations in `.ios.tsx` / `.android.tsx` components outside routes. No web implementation.
- New or changed reusable wrappers need a catalog update and native Storybook coverage under the component-library skill. Page-specific compositions reuse those wrappers without adding a new abstraction per page.

### Each page owns its query

The flow is: **notification/link → route parameters → screen query → native UI**. Notifications carry navigation intent, not recipe data or query-cache contents. A screen must work with an empty cache and no previously mounted tab. Use TanStack Query for server data and local state for sheets/form drafts; do not copy fetched recipes into a global selected-recipe context.

Keep the existing stable QueryClient in `src/lib/react-query.ts` and AppQueryProvider. They already supply one-minute stale time, 30-minute garbage collection, one query retry, no mutation retries, and native focus/network integration. Start with those settings; adjust only a specific resource that needs it. Do not add a second client, TanStack Router, web loaders, or persistent cache for this first version.

Define small `queryOptions` factories in the relevant service modules, like the existing auth queries. A factory owns its key, API call, cancellation signal, and enabled prerequisites; screens use `useQuery`, or `useInfiniteQuery` with separate infinite-query keys for paginated endpoints. Include every input affecting returned data in the key. Include user identity for authenticated data whose result can differ between users, including detail action flags. Never put access tokens in keys.

| Screen                       | Route inputs                            | Planned query identity (illustrative)                                                    |
| ---------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| Home                         | None                                    | `['recipes', 'home', userId]` plus independently loaded categories                       |
| Search                       | `q`, category/cuisine/difficulty IDs    | `['recipes', 'search', userId, normalizedFilters]`                                       |
| Category                     | `uuid`                                  | `['recipes', 'category', userId, uuid, filters]`                                         |
| Recipe Detail                | `uuid`                                  | `['recipes', 'detail', userId, uuid]`                                                    |
| My Recipes                   | Collection overview                     | `['my-recipes', userId, 'overview']`                                                     |
| Liked/Favorites              | `tab`                                   | `['my-recipes', userId, 'saved', tab]`                                                   |
| History / Creations          | Collection type                         | `['my-recipes', userId, 'history']` / `['my-recipes', userId, 'creations']`              |
| Ingredients                  | Optional local search                   | `['ingredients', filters]` if backend search changes the response                        |
| More / Account / Become Chef | Current user                            | Reuse identity query; add profile/preferences queries only for actual separate endpoints |
| Create                       | Empty draft                             | Query form reference data; submit with a mutation                                        |
| Health Check                 | Explicit diagnostic action              | On-demand query; no perpetual polling                                                    |
| Device Info / UI showcase    | None                                    | Local device data / fixtures; no unnecessary server query                                |
| Auth pages                   | Validated recovery/verification context | Reuse existing auth operations; submit with mutations                                    |

The identities are proposals, not new API endpoint contracts. Check Reference services and backend responses before creating each factory. For infinite queries put cursor in `pageParam`, and include fixed filters in the key; ordinary page-number queries include the page number in the key. Do not share one key between finite and infinite response shapes.

- Normalize route parameters once: reject malformed or repeated IDs, default saved tab to a known value, and normalize filters consistently. Missing/invalid IDs show route recovery; they must not trigger a request with an undefined ID.
- Fetch protected data only after auth restoration and valid identity. Avoid dependent fetch waterfalls where endpoints can load independently.
- Pass TanStack's AbortSignal through the existing API client to the request. Changing a query key does not itself guarantee the underlying network request is aborted; the query function must consume the signal.
- Render initial loading, failed load/retry, resolved empty, content, and offline/no-cache states. Keep cached content visible during refresh or refresh failure. A disabled/offline query without data is not an empty result.
- For deleted/unavailable recipes show a recoverable unavailable state with Home/Search actions. For expired authentication use existing session handling and preserve the destination.
- On create success, seed detail cache only if the server returns a complete detail response, invalidate the affected collections/feed, then open the returned recipe ID. On like/favorite/profile updates invalidate only affected keys. Start without optimistic updates; preserve form drafts and disable repeated submission while pending.
- On logout or identity replacement, cancel and remove the previous user's queries, using the current session lifecycle. Do not display another user's cached personal data.

### Notification access stays simple

Navigate as soon as auth and Router are ready; the destination screen performs its own fetch. Optional prefetch must reuse that screen's queryOptions, run only after authentication, and never block navigation or be required for correctness. On a tap indicating changed data, mark only the relevant destination query stale so a mounted or cached screen refreshes; do not invalidate every query for every notification. A duplicate response must not trigger duplicate navigation or invalidation.

Acceptance additions: open Recipe Detail from a push with an empty cache; open Search from a push with filters; verify offline cached content versus offline/no-cache; change users and ensure private cache is cleared; simulate failed creation and confirm the draft survives retry. Use the existing navigation payload contract rather than adding a separate query-screen registry.

## 5. Implementation order

### Step 1 — Route skeleton and reachable pages

- Create the missing thin route files and feature screen shells for every inventory entry.
- Update the root stack protection and replace product tab slots with the five tabs.
- Add obvious links in Home, My Recipes, and More to every page. Use fixture IDs for shell-stage recipe/category links.
- Add aliases, not-found recovery, titles, and back/Home behavior.
- Keep current auth screens working and expose Account through More.

Done when every inventory destination opens and Back works. Shells are only this phase's milestone, not completed page implementations.

### Step 2 — Cold starts and return after login

- Add the canonical destination validator, one pending value, and one entry coordinator outside `src/app/`.
- Capture signed-out deep links before guards redirect; consume after auth becomes ready.
- Handle notification startup responses, live taps, deduplication, and logout cleanup.
- Connect route parameter validation to each screen's query prerequisites; verify direct entry with an empty cache before adding optional prefetch.
- Configure Home as a detail stack anchor and check the brand/splash overlay does not change the route.

Done when a recipe link or notification opens that recipe from a closed app, both with an existing session and after login.

### Step 3 — Discovery and detail pages

- Port Home, Search and filters, Category, and Recipe Detail from Reference.
- Reuse the current API client/query provider; migrate only the required recipe/category services and types.
- Add resource queryOptions factories, user-scoped keys where needed, cancellation, pagination, and native query-state content using the rules above.
- Load from route IDs/filters, including direct entry. Implement loading, empty, error/retry, and deleted/unavailable entity states.
- Keep the recipe drawer/detail content as a simple panel or sheet unless the drawer is needed for usability.

Done when Home → Category/Search → Recipe works with real data and URL parameters restore the expected view.

### Step 4 — Personal recipes and creation

- Port My Recipes, liked/favorites, history, and creations; connect collection cards to recipe routes.
- Port the full Create form, its validation, and submission behavior. Keep Submit on the form.
- After successful creation open the returned recipe ID. Handle missing chef eligibility using the backend's existing rules and the Become Chef route.

Done when collections load, liked/favorite selection survives direct entry, and a submitted recipe opens its detail page.

### Step 5 — Remaining pages and settings

- Port More/settings, profile/preferences sheet, Become Chef, Ingredients/detail sheet, Device Info, Health Check, and the development UI showcase.
- Complete Reset Password against the actual recovery API contract. Do not invent token or OTP parameter names; show recovery guidance if required context is missing.
- Compare existing login/register/forgot-password/verification behavior against Reference and fill any gaps without replacing the current auth infrastructure.

Done when every non-placeholder Reference page has its content and primary actions, and `/main` resolves to Create.

### Step 6 — Acceptance on iOS and Android

- Run `npm run lint` and `npm run typecheck` after each implementation phase.
- Extend navigation tests for destination validation, aliases, pending destination consumption, deduplication, and logout cleanup.
- Verify every route from its in-app entry and directly on a device; detail IDs must load independently.
- Test link and notification taps with the app closed, backgrounded, and foregrounded, both signed in and signed out.
- Test delayed/failed session restore, login cancellation, duplicate responses, latest destination wins, unknown routes, malformed IDs, and deleted recipes.
- Check Back/Home from cold-start details and ensure Login is not left underneath after successful authentication.
- Test push on physical iOS and Android devices using a development build. Rebuild if notification plugin or scheme configuration changes.

The full task is complete when all inventory pages have their behavior, all are reachable, and direct entry plus notification entry pass the checks above. Push delivery additionally needs the backend token registration contract.

## Documentation checked

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- [Expo Router route notation](https://docs.expo.dev/router/basics/notation/)
- [Protected routes](https://docs.expo.dev/router/advanced/protected/) — guards redirect away from unavailable routes; retain the requested destination explicitly. Do not use the SDK 58-only `redirectTo` prop on SDK 57.
- [Linking into your app](https://docs.expo.dev/linking/into-your-app/)
- [SDK 57 notifications](https://docs.expo.dev/versions/v57.0.0/sdk/notifications/) — startup response plus response listener.
- [SDK 57 universal Expo UI](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/) and the project's universal component catalog.
- [TanStack Query v5 keys](https://tanstack.com/query/v5/docs/react/guides/query-keys), [queryOptions](https://tanstack.com/query/v5/docs/react/guides/query-options), [React Native integration](https://tanstack.com/query/v5/docs/react/react-native), [cancellation](https://tanstack.com/query/v5/docs/react/guides/query-cancellation), and [mutation invalidation](https://tanstack.com/query/v5/docs/react/guides/invalidations-from-mutations).
- Local sources: `Reference/app`, `Reference/features/home/tab-navigator.tsx`, `Reference/docs/push-notifications.md`, `Reference/services/notifications/notification-routing.ts`, and the existing `src/app` layouts/auth guards.
