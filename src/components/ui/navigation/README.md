# Navigation presentation

Exports: `ReferenceNavigationBar` and navigation tab types.

`reference-navigation-bar.tsx` composes the dock and raised floating action.
`navigation-tab.*` owns destination controls;
`navigation-glass-surface.*` owns passive native glass/blur artwork.
Each adapter's types stay here.

Keep route selection and tab action workflow in `src/features/pages/`.
This family renders the supplied state and callbacks.

See [navbar verification](../../../../docs/navbar-wave-verification.md) for
safe-area geometry, native glass differences and touch verification limits.

Existing composition story: [reference-navigation.stories.tsx](../../../../.rnstorybook/stories/pages/reference-navigation.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
