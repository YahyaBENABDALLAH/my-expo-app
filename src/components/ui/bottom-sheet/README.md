# Bottom sheet

Export: `BottomSheet`. Implementation: `bottom-sheet.tsx`.

Wraps the native Expo UI sheet to bridge the owning Host's theme and live layout
direction into its presented content. Explicit `containerColor` and
`contentColor` override the theme defaults. Other native sheet props pass through.

The Host/RNHostView bridge is necessary for presented content. Keep it here.

Existing composition story: [bottom-sheet.stories.tsx](../../../../.rnstorybook/stories/expo-ui/bottom-sheet.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
