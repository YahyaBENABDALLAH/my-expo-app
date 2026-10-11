# Recipe stepper

Exports: `RecipeStepper` and `RecipeStepperProps`.

`recipe-stepper.tsx` renders the four-stage progress artwork and labels inside
an existing Host. `recipe-stepper-layout.*` aligns native labels with the RN/Skia
canvas; its types stay here.

The private adapters call `renderArtwork(width)` as a render callback after
measurement; they do not mount it as a component type. Animation target values
and label colors are selected separately before applying springs or rendering.

`current` is clamped to 0-3. `isCurrentValid` controls current-step fill.
`animate` and `colorScheme` support deterministic previews. Indicators describe
state; they do not bypass validation or navigate.

Keep native geometry measurements on layout changes and retain the motion
lifecycle guards. Form validation and step transitions belong in the recipe
creation workflow.

Both native layout adapters filter duplicate and invalid widths before updating
React. A genuine resize still supplies concrete bounds for the hosted canvas.
`tests/layout/geometry-stability.test.mjs` checks repeated reports and resize on
both platform adapters.

React's default memo comparison skips unchanged step/validity props during form
typing. Real prop, theme and translation changes still render; shared-value
animation continues independently of React. `tests/layout/render-stability.test.mjs`
checks that unchanged props skip the canvas tree and validity changes update it.

Existing composition story: [recipe-stepper.stories.tsx](../../../../.rnstorybook/stories/pages/recipe-stepper.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
