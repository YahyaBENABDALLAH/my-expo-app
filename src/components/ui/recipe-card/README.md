# Recipe card

Export: `RecipeCard`. Implementation: `recipe-card.tsx`.

A compact recipe summary and native action using the shared text/button
components. Compose inside an existing Host. The caller supplies data and
navigation behavior; fetching and collection state remain in the recipe feature.

See the Home card family for the separate popular/editorial presentation.

There is no dedicated story for this compact card. The Home card stories cover
the separate popular/editorial component; verify this card in its recipe screens.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
