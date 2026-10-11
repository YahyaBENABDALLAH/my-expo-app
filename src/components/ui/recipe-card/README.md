# Recipe card

Export: `RecipeCard`. Implementation: `recipe-card.tsx`.

A compact recipe summary and native action using the shared text/button
components. Compose inside an existing Host. The caller supplies `RecipeCardData`;
activation opens `/recipe/[uuid]` through Expo Router. Fetching and collection
state remain in the recipe feature.

The card is memoized with React's default prop comparison. Keep the recipe object
stable for unchanged data (TanStack Query's structural sharing already does this).
Updated recipe data, inherited theme and language still update the card.

See the Home card family for the separate popular/editorial presentation.

Native story: [recipe-card.stories.tsx](../../../../.rnstorybook/stories/pages/recipe-card.stories.tsx).
It covers light/dark, missing image, embedded image, long titles, unrelated parent
updates and changed like counts. The fixture route is not backed by a live API.
`tests/layout/render-stability.test.mjs` verifies unchanged data skips the image
tree while real data updates render. Native layout and presses need device checks.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
