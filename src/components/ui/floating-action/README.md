# Floating action

Exports: `FloatingAction`, `FloatingActionButton` and their public types.

`floating-action.tsx` combines Skia artwork and native activation.
`floating-action-button.*` owns the native button and its shared props.
`floating-action-layout.*` stacks artwork and control in one native tree.

Keep this rendering boundary together: native activation delivers the action;
artwork remains passive. Motion follows the existing focus, app activity and
reduced-motion guards.

See [navbar verification](../../../../docs/navbar-wave-verification.md) for
geometry, touch coverage and native verification limits.

Existing composition story: [reference-navigation.stories.tsx](../../../../.rnstorybook/stories/pages/reference-navigation.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
