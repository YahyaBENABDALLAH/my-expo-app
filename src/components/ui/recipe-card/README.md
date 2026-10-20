# Recipe card

Exports: `RecipeCard`, `RecipeCardProps`. Implementation: `recipe-card.tsx`.

A compact recipe summary and native action using the shared text/button
components. Compose inside an existing Host. The caller supplies `RecipeCardData`
and a required `onPress(recipeUuid)` callback. The card has no routing dependency.
Recipe screens use the stable `openRecipe` action from their feature to open
`/recipe/[uuid]`; other callers choose their own behavior. Fetching and collection
state remain in the recipe feature.

The card is memoized with React's default prop comparison. Keep the recipe object
stable for unchanged data (TanStack Query's structural sharing already does this)
and reuse a stable press callback.
Updated recipe data, inherited theme and language still update the card.

See the Home card family for the separate popular/editorial presentation.

The card's native action fills its section width with zero extra button padding.
The surface owns symmetric 16-point padding and corners; inset images use the
shared 12-point radius. Colors retain the existing `surface` and text roles.
`Components/Page Section/Interaction` in
[page-section.stories.tsx](../../../../.rnstorybook/stories/components/page-section.stories.tsx)
embeds the production card and counts activations. Controls select light/dark
appearance and the existing brand theme. Native layout and presses need device
checks; retired page stories and recipe suites are not current coverage.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
