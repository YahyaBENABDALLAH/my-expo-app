# Home recipe card examples

Home now includes four local food samples alongside live recipes. The popular cards scroll horizontally; the wider editorial cards use the page's vertical scroll. The samples also remain available in **UI showcase → Recipe UI examples**. Both sections use the same sample order and unique identifiers. Three base recipes (avocado toast, chickpea salad, and pesto pasta) share bundled photos; the fourth repeats toast with a numbered title. A tap opens a native sheet with the selected sample's description and facts. Closing or swiping away the sheet clears the selection. These sample identifiers never navigate to real recipe endpoints, and their sample label distinguishes them from the live recipe section.

The layout follows `Reference/components/popular-recipe-card.tsx` and `Reference/components/editors-choice-card.tsx`: rounded food photos, a likes pill and chef pill for popular cards, and a category badge, chef, title, description and metadata for editorial cards. The implementation uses the project's semantic theme colors and Expo UI controls. Chef icons replace extra avatar downloads, and the new cards have no continuous animations, blur, or decorative shadows.

## Public component

`src/components/ui/home-recipe-card/home-recipe-card.tsx` exports `HomeRecipeCard` through `@components/ui`.

- `recipe`: `HomeRecipeCardData` with image source, title, description, formatted duration, category, chef, likes, and secondary metadata.
- `variant`: `popular` or `editorial`.
- `width`: available card content width in points/dp; the card button has zero content padding.
- `onPress`: supplied by the caller; the component performs no data fetching or navigation.
- `testID`: optional selector for the native button.

Content inherits its owning `UniversalHost` scheme. Long popular titles truncate after two lines; editorial titles and descriptions wrap. Dimensions follow screen width and physical safe area insets without layout measurement state. The image adapters are isolated in `.android.tsx` and `.ios.tsx` files: Compose Box and SwiftUI ZStack stack native overlays above `RNHostView` image content. Images are passive, have fixed dimensions, use `contentFit="cover"`, and request no transition animation.

Card buttons explicitly use `borderRadius={0}` and `contentPadding={0}`. This removes Android TextButton's default rounded clipping from the entire card. The image and editorial surface retain Reference's small 14-point corners. Regular app buttons keep their native geometry unless a caller provides these overrides. Two native adapter regressions verify that explicit zero is honored and omitted overrides retain defaults.

## Samples and verification

`src/features/recipes/home-card-examples.data.ts` supplies translated display fixtures. `home-card-examples.tsx` owns the selection and preview sheet, shared by Home and the showcase. The horizontal row owns horizontal scrolling. Home passes `editorialScroll={false}` so the editorial Column shares `PageScreen`'s vertical scroll and pull to refresh. The showcase retains its bounded 300-point vertical viewport. All eight card instances are rendered eagerly; these finite sample lists do not use virtualization. English, French, and Arabic dictionaries include the sample count and numbered titles, and an open preview follows a live language change without losing its selection.

`home-recipe-skeletons.tsx` adds two native skeleton cards during the first uncached recipe fetch. Eight shapes share the existing pulse clock and page Host. Leaving Home or receiving cached data unmounts them and releases their subscriptions. Idle/disabled queries, offline pauses, initial failures and cached refreshes do not show animated skeletons. `QueryContent` retains loading announcements, offline/error context, retry controls and live cached recipes. The food samples remain visible independently of API availability.

Three 800-pixel JPEGs in `assets/images/recipe-examples/` total 294,283 bytes. They are bundled locally, so scrolling and sample previews do not depend on image downloads or API availability. Their source links are recorded beside the images.

`tests/recipes/home-cards.test.mjs` exercises the four matching samples in each direction, first/last-card selection, close/native dismissal, compact screen resizing, absence of sample fetches or interval loops, live French/Arabic preview translation, and Home's single horizontal scroll owner. `tests/recipes/home-skeleton.test.mjs` verifies initial-load skeletons, animation cleanup on blur, cached-content retention, absence of idle/offline animations, and stable real-recipe navigation. The showcase retains its separate timed preview tests. `Recipes/Home recipe card` in native Storybook exposes popular/editorial light/dark variants, long titles, a visible press counter, bounded horizontal/vertical examples and `HomeSections`/`HomeSectionsDark` for the actual Home composition with skeletons.

The Home integration passes `npm run check`: typecheck, zero-warning lint, repository formatting and all 472 tests. Output: `.expo/home-content-check.log`. Storybook registration and `git diff --check` also pass.

The earlier fixed-height viewport passed lint, typecheck, touched-file formatting, and all 125 recipe/layout/localization tests. The initial three-card implementation also passed production JavaScript/Hermes exports for Android and iOS. Those exports were generated locally under `.expo/home-cards-preview/`; they are not native app builds or published updates, and were not regenerated for this Home integration.

No native device is connected. Image/pill stacking, whole-card touch coverage, large system fonts, RTL geometry, sheet fit, nested vertical gesture handoff, and release scroll smoothness remain unverified on Android and iOS. JavaScript tests and bundle compilation do not establish these native behaviors.

The APIs were checked against installed SDK 57 source and the versioned [ScrollView](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/scrollview/), [Icon](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/icon/), [Image](https://docs.expo.dev/versions/v57.0.0/sdk/image/), [Compose Box](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/box/), and [SwiftUI ZStack](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/zstack/) references.
