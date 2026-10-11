# Bottom sheet

Export: `BottomSheet`. Implementation: `bottom-sheet.tsx`.

Wraps the native Expo UI sheet to bridge the owning Host's theme and live layout
direction into its presented content. Explicit `containerColor` and
`contentColor` override the theme defaults. Content padding defaults to 24 points
on each edge and accepts the native `contentPadding` override, including `0`.
Let the sheet own edge padding; avoid adding a second inset to its content.
Other native sheet props pass through.

The Host/RNHostView bridge is necessary for presented content. Keep it here.
Both platforms use one universal content tree in `bottom-sheet.tsx`. A guarded
iOS sizing modifier reads the native sheet's available width with
`onGeometryChange`, then gives the nested Host that numeric width while matching
only its height to content. This avoids percentage-width sizing through a
self-sizing RN bridge and follows iPad sheet/window resizing. Explicit detents
anchor content to the top; auto-sized sheets retain their intrinsic height.
Duplicate/position-only geometry reports are filtered before calling React's
state setter. Actual width changes still resize the bridge; zero/invalid reports
retain the last presented width.
The inner full-width Column stacks direct children and follows the Host's live
LTR/RTL direction. Use content controls within the sheet and `nativeFillWidth`
on nested stacks or scrolling content.

Existing composition story: [bottom-sheet.stories.tsx](../../../../.rnstorybook/stories/expo-ui/bottom-sheet.stories.tsx).
It covers long wrapping text, themes, detents, padding and a full-width close
action. JS tests check width updates, state preservation and prop forwarding;
native geometry and gestures still require iOS/Android verification.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
