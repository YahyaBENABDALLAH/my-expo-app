# Bottom sheet

Export: `BottomSheet`. Implementation: `bottom-sheet.tsx`.

Wraps the native Expo UI sheet to bridge the owning Host's theme and live layout
direction into its presented content. Explicit `containerColor` and
`contentColor` override the theme defaults. Content padding defaults to 24 points
on each edge and accepts the native `contentPadding` override, including `0`.
Let the sheet own edge padding; avoid adding a second inset to its content.
Other native sheet props pass through.

The first presentation frame uses the window width minus the resolved left/right
content padding, so auto-sized content does not wrap at zero width and change the
sheet's resting height during its entrance. `initialContentWidth` optionally
overrides that fallback with a positive content width (for example, Home's
available width minus the sheet's 48-point horizontal padding). Native measurement
remains authoritative once available, including constrained sheets and resizing.
Keep controlled sheets mounted and retain their body when `isPresented` becomes
false so Expo UI can finish its native dismissal animation.

The Host/RNHostView bridge is necessary for presented content. Keep it here.
`useBottomSheetContentWidth` lets internal sheet content reuse the bridge's width,
including its first-frame seed. OTP uses it for its LTR input Host and digit
slots, avoiding a second native geometry callback and delayed input mounting.
Both platforms use one universal content tree in `bottom-sheet.tsx`. Native
sizing modifiers read the sheet's available content width: `onGeometryChange`
on iOS and `onSizeChanged` on Android. The nested Host receives that numeric
width while matching only its height to content. Percentage-width sizing
through this self-sizing RN bridge can collapse Android preference controls to
zero width. Measuring the padded native Column also follows sheet/window
resizing without guessing the screen width. Explicit iOS detents anchor content
to the top; auto-sized sheets retain their intrinsic height.
Duplicate/position-only geometry reports are filtered before calling React's
state setter. Actual width changes still resize the bridge; zero/invalid reports
retain the last presented width.
The inner full-width Column stacks direct children and follows the Host's live
LTR/RTL direction. Use content controls within the sheet and `nativeFillWidth`
on nested stacks or scrolling content.

Existing composition story: [bottom-sheet.stories.tsx](../../../../.rnstorybook/stories/expo-ui/bottom-sheet.stories.tsx).
It covers long wrapping text, themes, detents, padding and a full-width close
action. JS tests check width updates, state preservation and prop forwarding.
`tests/layout/geometry-stability.test.mjs` also checks padding-aware first-frame
width without a seed, invalid seed fallback, an explicit first-frame width seed,
native measurement precedence and content identity on both platform adapters;
native geometry and gestures still require iOS/Android verification.
`Pages/Login preferences` and `.maestro/storybook/login-preferences.yaml` also
exercise all three language choices, selection, reopening and draft retention.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
