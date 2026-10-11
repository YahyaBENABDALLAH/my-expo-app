# Home recipe cards

Exports: `HomeRecipeCard`, `HomeRecipeCardData` and `HomeRecipeCardProps`.

`home-recipe-card.tsx` composes display data with an explicit `width`,
`onPress`, optional `testID` and `variant="popular"` or `"editorial"`.
The image platform adapters place native badges above passive `expo-image`
content without an additional Host.

Popular cards show likes and chef pills; editorial cards add category,
description and metadata. Cards set native button padding/rounding to zero;
their surface/image corners are independent.

See [Home card examples](../../../../docs/home-recipe-card-examples.md). The
editorial collection shares Home's page scroll. The showcase optionally uses a
fixed 300-point viewport. The light/dark `HomeSections` stories cover Home's
horizontal food cards, inline vertical cards and initial-loading skeletons.

Existing composition story: [home-recipe-card.stories.tsx](../../../../.rnstorybook/stories/pages/home-recipe-card.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
