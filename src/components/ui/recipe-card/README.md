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

Native story: [recipe-card.stories.tsx](../../../../.rnstorybook/stories/pages/recipe-card.stories.tsx).
It covers light/dark, missing image, embedded image, long titles, unrelated parent
updates and changed like counts. Activation increments a visible press count and
logs the UUID without leaving Storybook or querying a fixture route.
`tests/layout/render-stability.test.mjs` verifies unchanged data skips the image
tree while real data updates render, and activation uses the current UUID and
latest callback. `tests/recipes/home-skeleton.test.mjs` verifies Home still opens
the recipe detail route with a stable action. The native flow is
`.maestro/storybook/recipe-card.yaml`; native layout and presses need device checks.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
