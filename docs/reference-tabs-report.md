# Reference tab implementation report

Reviewed 2026-10-03. The app uses Reference's four icon tabs and raised center action with native Expo UI controls. Navbar geometry, glyphs, colors, and static gradients follow Reference; pixel equality remains unverified on devices.

| Area              | Implemented                                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation        | Expo Router four icon tabs, Reference bar geometry/colors, raised native context action, route parameters retained, no sliding tab transitions                         |
| Home              | Search entry, category links, popular/editor selections from Reference's recipe list endpoint, refresh, Skia flame                                                     |
| Search            | Debounced text, native category/cuisine/difficulty filter sheet, direct-entry query parameters, paging, loading/error/empty/content                                    |
| Create            | Info/details/ingredients/instructions, liquid Skia indicators, step validation, add/remove rows, publish mutation, failed-save draft retention, duplicate-submit guard |
| Recipes           | Liked/favorite segmented selection, local account-scoped favorites/history, creations from Reference's public-list fallback                                            |
| More              | Profile preferences sheet, app theme toggle, account/tools links, sign out                                                                                             |
| Supporting routes | Recipe detail/ingredients/instructions, category recipes, ingredient catalog, chef self-registration                                                                   |

Skia artwork is noninteractive. SwiftUI and Compose buttons own hit testing, disabled behavior, labels, and native feedback. Reanimated shared values drive the drawings without per-frame React renders. Reduced motion renders static artwork; off-screen/background loops stop. The motion stories include a static mode for inspection.

## Context7 Skia review

Reviewed the flame, floating action, and recipe stepper using [Context7's public Skia documentation](https://context7.com/shopify/react-native-skia/llms.txt?tokens=10000) and its linked [Shopify animation documentation](https://github.com/Shopify/react-native-skia/blob/main/apps/docs/docs/animations/hooks.md). Context7 MCP tools are not connected in this session; the public documentation was used directly. That index follows the upstream main branch, so it is not evidence of compatibility with a specific release. The installed Skia 2.6.2 source confirms `PathBuilder` and the shared-value `Canvas.onSize` API used here. The existing animations use Reanimated derived values for drawing properties and cancel repeating animations on cleanup. No runtime changes were needed for this documentation review. Device rendering and performance remain unverified.

## Verification

Latest [global check](global-check-report.md): the full `npm run check` passes, Expo Doctor passes 21/21, SDK dependency compatibility passes, and both native platform JavaScript exports compile. The three earlier formatting failures have been resolved with formatting-only changes.

Architecture follow-up: [application architecture](architecture.md) documents the recipe transport, query/mutation definitions, pure validation, workflow hook, and lint-enforced import boundaries. The latest suite has 73 tests; lint, typecheck, and both platform bundle exports pass. Liked-list invalidation is now scoped to the current user.

Follow-up: [safe-area handling](safe-area-handling.md) removes duplicate tab offsets, protects side cutouts, and adds four layout regression tests. The latest suite has 70 tests; lint, typecheck, and both platform bundle exports pass. Native device verification remains pending.

- Lint and typecheck pass.
- Repository-wide formatting still reports three pre-existing files: the Expo overview skill and its agent YAML, and `docs/pages-navigation-plan.md`. Touched implementation files are formatted.
- All 66 automated tests pass: 19 validation, 20 navigation, 23 auth/API lifecycle, and 4 collection tests. These cover recipe payloads, cancellation, account isolation, history retention, failed storage followed by retry, and concurrent saves.
- iOS and Android production JavaScript/Hermes exports compile; this does not build or run the native app.
- Storybook registration includes Pages/Reference motion. Native Maestro actions and route flows are prepared.
- `adb devices` reports no connected devices. Native Maestro, screenshots, release-device animation performance, keyboard/large-text fit, and accessibility have not run.
- No live recipe publication, likes, or chef registration was performed. The endpoints and DTOs come from Reference; live server compatibility is unverified.

## Differences and limits

Reference's Skia visuals are adapted to native Expo UI compositions. The stepper uses a simpler liquid indicator; the floating action overlays the requested Skia wave on Reference's gradient colors. Existing project palette values and native control geometry remain in use. Screen typography/cards/spacing have not been compared on a device against Reference. Profile language selection and Reference's complete translated UI have not been ported; the app theme override currently lasts for the app session.

Public recipe lists supply popular/editor selections using Reference's existing slices rather than separate ranking endpoints. Creations retain Reference's first-100-recipes fallback because its API lacks a chef filter. Identity tokens omit chef profile IDs, so existing chef accounts resolve their public profile by paging the profile endpoint. Favorites/history remain on-device and retain 50 entries per account. Like entries currently show the first 50 results. Auxiliary health-check/UI-development tools remain as previously implemented.

The earlier `code-quality-report.md` describes a historical route-shell review. Its password-reset masking and challenge-state findings are still open and are outside this navigation change. Notification delivery and post-auth destination retention also remain outside this update. These limitations prevent claiming complete Reference feature parity or that every native screen works on devices.

## Reference navigation bar correction (2026-10-03)

The main navigation now follows `Reference/features/home/tab-navigator.tsx`: four icon-and-label destinations (Home, Search, Recipes, More) surround a raised center context action. Create remains reachable through that action and direct routing; it is not a fifth labeled tab. The bar uses Reference's 76-point height, 10-point vertical padding, 8-point horizontal padding, 16-point corner radius, shadow, 12-point semibold labels, and exact native glyphs. The center button is 76 points across and raised 24 points from its row, with Reference's static vertical gradient and palette calculation. Its states include create, continue, submit, filters/active filters, liked recipes, and profile preferences. The middle button retains its Skia liquid wave by user request. Reanimated drives a two-second loop clipped to the circle; the wave pauses for reduced motion, disabled state, app backgrounding, and navigator blur. Native Expo UI retains button interaction and accessibility; Expo Router retains cancellable tab presses, parameters, and screen state. The center action retains Reference's 800ms repeat guard. The bar hides while the keyboard is open.

`reference-navigation.stories.tsx` exercises the production bar composition with light/dark appearance, action states, selection, action counts, and disabled interaction. Maestro flows now enter creation through Home's center action. Device screenshot comparison, raised-button hit coverage, bottom-system-inset behavior, large text, and keyboard behavior remain unverified: no Android device tool is available in this session. This section supersedes earlier claims that the main navbar preserves segmented navigation or adds a liquid wave.

Correction verification: `npm run lint`, `npm run typecheck`, all 20 navigation tests, Storybook registration, and iOS/Android production JavaScript/Hermes exports passed. Exports are saved under `.expo/navbar-check/ios` and `.expo/navbar-check/android`; these verify bundling, not native rendering or touch behavior.

Middle-button depth follow-up: the animated wave now uses one prebuilt periodic path translated on the UI thread, with static highlight/shading/rim gradients for a rounded 3D appearance. A Skia offscreen comparison found and resolved a loop seam; the final start/end artwork is pixel-identical in CanvasKit. See [wave verification](navbar-wave-verification.md) for checks, optimization details, and native-device limits.
