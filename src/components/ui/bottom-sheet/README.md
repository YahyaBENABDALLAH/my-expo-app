# Bottom sheet

Export: `BottomSheet`. Implementation: `bottom-sheet.tsx`.

Wraps the native Expo UI sheet to bridge the owning Host's theme and live layout
direction into its presented content. Explicit `containerColor` and
`contentColor` override the theme defaults. Content padding defaults to 24 points
on each edge and accepts the native `contentPadding` override, including `0`.
Let the sheet own edge padding; avoid adding a second inset to its content.
Other native sheet props pass through. On iOS, a native presentation modifier
sets a stable 28-point corner radius from the first presentation. Caller
`modifiers` follow this default and can override it. Android keeps its Material
sheet shape.
The iOS handle is a small Expo UI Column painted with the owning theme's `muted`
color; the native handle is hidden to avoid its appearance switching during
entrance. `showDragIndicator={false}` hides the themed handle too. Native swipe
dismissal remains enabled; use an explicit close action in the content.

Height uses Expo UI's default: the sheet fits its content when `snapPoints` is
omitted. Explicit `snapPoints` pass through without an extra content height
override. There is no window-width calculation or caller width seed.
Keep controlled sheets mounted and retain their body when `isPresented` becomes
false so Expo UI can finish its native dismissal animation.

The Host/RNHostView bridge is necessary for presented content. Keep it here.
`useBottomSheetContentWidth` lets OTP reuse the bridge's measured width for its
LTR input Host and digit slots, avoiding a second native geometry callback.
Both platforms use one universal content tree in `bottom-sheet.tsx`. Native
sizing modifiers read the sheet's available content width: `onGeometryChange`
on iOS and `onSizeChanged` on Android. The nested Host receives that numeric
width while matching only its height to content. Percentage-width sizing
through this self-sizing RN bridge can collapse Android preference controls to
zero width. Measuring the padded native Column also follows sheet/window
resizing without guessing the screen width. Expo UI owns sheet height.
Duplicate/position-only geometry reports are filtered before calling React's
state setter. Actual width changes still resize the bridge; zero/invalid reports
retain the last presented width.
The inner full-width Column stacks direct children and follows the Host's live
LTR/RTL direction. Use content controls within the sheet and `nativeFillWidth`
on nested stacks or scrolling content.

Existing composition story: [bottom-sheet.stories.tsx](../../../../.rnstorybook/stories/expo-ui/bottom-sheet.stories.tsx).
It covers long wrapping text, themes, detents, padding and a full-width close
action. JS tests check width updates, state preservation and prop forwarding.
`tests/layout/geometry-stability.test.mjs` also checks shared native width,
presentation modifiers and content identity on both platform adapters;
native geometry and gestures still require iOS/Android verification.
The Storybook harness updates visibility without remounting the sheet when its
theme or snap-point controls change. The Maestro flow includes initially open
sheets and repeated opening/closing; it does not compare animation frames.
`Pages/Login preferences` and `.maestro/storybook/login-preferences.yaml` also
exercise all three language choices, selection, reopening and draft retention.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
