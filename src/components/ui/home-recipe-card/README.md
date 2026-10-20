# Home recipe cards

Cards and artwork use the shared geometry in `src/constants/layout.ts`: 16-point
card/image corners, 12-point thumbnail corners and consistent content gaps.
Home's content sections own their 16-point gutters and padding. Production card
actions, local save state and bundled images are included in
`Components/Page Section/Interaction`; appearance is selectable in Controls.
Native image clipping and hit areas require device verification. Older story
and test references below describe the retired page catalog.

Exports: `HomeRecipeCard`, `HomeRecipeCardData` and `HomeRecipeCardProps`.

`HomeCatalogCard`, `HomeCatalogItem` and `HomeCatalogCardProps` supply the
store-style home compositions: `hero`, `landscape`, `artwork`, `compact` and
`giveaway`. Explicit widths size photos; compact rows share a
thumbnail, title, duration badge and the existing secondary Button. Hero cards
add a tinted footer and an optional save action. Giveaway artwork can include a
status ribbon. Actions are callbacks supplied by the screen; no queries or
navigation live in the card. Each item supplies an `image` source. Artwork hosts
passive `expo-image` content in Expo UI `RNHostView`, with explicit dimensions,
cover cropping, corners and memory/disk caching. Native Columns, text and controls
retain the layout and interaction. A neutral surface remains while images load
or fail; artwork-only buttons retain a native title below the photo.

Colors inherit the owning Host and use `warningContainer`, `surfaceVariant`,
`text`, `muted`, `tint`, `info` and `onInfo`. Button implementation, native
geometry and feedback are unchanged. `Recipes/Home catalog` provides light/dark
composition stories with bundled image fixtures, sample preview and local save interaction.
`tests/recipes/home-catalog.test.mjs` exercises the production cards and sections
with native rendering boundaries mocked: preview selection, retained dismissal
content, reopening, save toggling, routing, resizing, live translations and stable
Picsum sources shared by artwork and thumbnails.
`.maestro/storybook/home-catalog.yaml` exercises repeated Details presentation,
closing, Android back dismissal and selection after horizontal and vertical scrolling. Run it
with `npm run test:e2e:home`. Native execution results are recorded in
[Home catalog layout](../../../../docs/home-catalog-layout.md).

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
