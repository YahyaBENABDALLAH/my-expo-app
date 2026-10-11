# Navigation presentation

Exports: `ReferenceNavigationBar` and navigation tab types.

`reference-navigation-bar.tsx` composes the dock and raised floating action.
`navigation-tab.*` owns destination controls;
`navigation-glass-surface.*` owns passive native glass/blur artwork.
Each adapter's types stay here.

The borderless dock fills the screen width and bottom edge. Its glass continues
under the bottom safe area; side insets apply only to destination controls.
The 84-point touch frame overlaps the page by 28 points through a negative top
margin, so layout reserves only the 56-point dock plus the system bottom inset.
The transparent frame uses `box-none`: page controls beside the raised action
remain reachable, and the complete action stays inside its parent's touch bounds.

`navigation-tab-icons.ts` is the common symbol/size mapping through Expo UI
`Icon.select`. Both controls render root Icon with the same native modifiers;
the selected Home glyph remains filled on iOS and unchanged on Android.
Native tab feedback, selected semantics and touch geometry stay in the adapters.

Keep route selection and tab action workflow in `src/features/pages/`.
This family renders the supplied state and callbacks.

See [navbar verification](../../../../docs/navbar-wave-verification.md) for
safe-area geometry, native glass differences and touch verification limits.

Existing composition story: [reference-navigation.stories.tsx](../../../../.rnstorybook/stories/pages/reference-navigation.stories.tsx).
`PageOverlap` shows page content at the dock edge and an observable page control
beside the raised action. The navigation Maestro flow exercises both hit areas.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
