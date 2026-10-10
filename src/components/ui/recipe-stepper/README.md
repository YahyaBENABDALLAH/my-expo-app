# Recipe stepper

Exports: `RecipeStepper` and `RecipeStepperProps`.

`recipe-stepper.tsx` renders the four-stage progress artwork and labels inside
an existing Host. `recipe-stepper-layout.*` aligns native labels with the RN/Skia
canvas; its types stay here.

`current` is clamped to 0-3. `isCurrentValid` controls current-step fill.
`animate` and `colorScheme` support deterministic previews. Indicators describe
state; they do not bypass validation or navigate.

Keep native geometry measurements on layout changes and retain the motion
lifecycle guards. Form validation and step transitions belong in the recipe
creation workflow.

Existing composition story: [recipe-stepper.stories.tsx](../../../../.rnstorybook/stories/pages/recipe-stepper.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
