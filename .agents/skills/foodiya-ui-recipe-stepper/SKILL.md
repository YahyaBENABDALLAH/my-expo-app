---
name: foodiya-ui-recipe-stepper
description: 'Use or maintain Foodiya recipe stepper geometry, progress, native labels and RTL artwork.'
---

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
Check repeated reports and resizing manually on both platforms; automated suites
have been removed and existing test IDs are retained for future tests.

React's default memo comparison skips unchanged step/validity props during form
typing. Real prop, theme and translation changes still render; shared-value
animation continues independently of React. Verify that validity changes update
the canvas when checking the form manually.

Existing composition story: recipe-stepper.stories.tsx (retired fixture).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/recipe-stepper/](../../../src/components/ui/recipe-stepper/).
