# Home recipe card examples

Home includes 21 local recipe samples, shown independently of the recipe API. All 21 appear in a horizontal popular-card row and again as wider editorial cards in a vertical section. Both sections use the same sample order and unique identifiers. Three base recipes (avocado toast, chickpea salad, and pesto pasta) repeat with numbered titles, sharing their bundled photos. A tap opens a native sheet with the selected sample's description and facts. Closing or swiping away the sheet clears the selection. These sample identifiers never navigate to real recipe endpoints.

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

`src/features/recipes/home-card-examples.data.ts` supplies translated display fixtures. `home-card-examples.tsx` owns the selection and preview sheet. The horizontal row owns horizontal scrolling. The vertical section uses a native `ScrollView` with `style={{ height: 300 }}`, containing all 21 editorial cards in a Column. The viewport has no height calculation or measurement state. All 42 card instances are rendered eagerly; these finite demo lists do not use virtualization. English, French, and Arabic dictionaries include the sample count and numbered titles, and an open preview follows a live language change without losing its selection.

Three 800-pixel JPEGs in `assets/images/recipe-examples/` total 294,283 bytes. They are bundled locally, so scrolling and sample previews do not depend on image downloads or API availability. Their source links are recorded beside the images.

`tests/recipes/home-cards.test.mjs` exercises the 21 matching samples in each direction, first/last-card selection, close/native dismissal, compact screen resizing, absence of sample fetches or interval loops, and live French/Arabic preview translation. Existing timed skeleton lifecycle checks remain in place. Metro resolution checks include both image adapters. `Recipes/Home recipe card` in native Storybook exposes popular/editorial light/dark variants, long titles, a visible press counter, and the complete horizontal/vertical lists in both themes.

The fixed-height viewport passed lint, typecheck, touched-file formatting, and all 125 recipe/layout/localization tests. The initial three-card implementation also passed production JavaScript/Hermes exports for Android and iOS. Those exports were generated locally under `.expo/home-cards-preview/`; they are not native app builds or published updates, and were not regenerated for the list expansion or fixed-height viewport.

No native device is connected. Image/pill stacking, whole-card touch coverage, large system fonts, RTL geometry, sheet fit, nested vertical gesture handoff, and release scroll smoothness remain unverified on Android and iOS. JavaScript tests and bundle compilation do not establish these native behaviors.

The APIs were checked against installed SDK 57 source and the versioned [ScrollView](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/scrollview/), [Icon](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/icon/), [Image](https://docs.expo.dev/versions/v57.0.0/sdk/image/), [Compose Box](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/box/), and [SwiftUI ZStack](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/zstack/) references.
