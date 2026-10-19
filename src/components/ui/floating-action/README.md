# Floating action

Exports: `FloatingAction`, `FloatingActionButton` and their public types.

`floating-action.tsx` combines Skia artwork and native activation.
`floating-action-button.*` owns the native button and its shared props.
`floating-action-layout.*` stacks artwork and control in one native tree.

`floating-action-icons.ts` supplies one Expo UI `Icon.select` map and the existing
28-point icon size. Profile keeps its current platform glyphs. The buttons retain
their transparent 76-point circular surface, native accessibility labels,
disabled state and Android zero content padding.

Android must pass `Shape.Circle({ radius: 1 })`: the installed native ShapeRecord
defaults its radius to zero, which clips both the icon and touch shape down to
the center. Keep the full-size circular shape explicit when updating Expo UI.

Native activation delivers the action; artwork remains passive. Android and iOS
both animate while focused, active and enabled, respecting reduced motion. Static
mode pauses visual motion without disabling activation.

`ReferenceTabBar` forwards each enabled native activation to the current action.
Do not add a shared timed lockout: it discards valid taps after the visual feedback
and can block a different action after switching tabs or recipe steps. Publishing
keeps its own pending/submitting guard in `useRecipeCreation`.

See [navbar verification](../../../../docs/navbar-wave-verification.md) for
geometry, touch coverage and native verification limits.

Interactive composition story: [floating-action.stories.tsx](../../../../.rnstorybook/stories/components/floating-action.stories.tsx).
It includes all seven action kinds, a press counter, disabled and motion toggles,
and the production navigation bar. A separate production counter registers the
Storybook route's action through the real `ReferenceTabBar` dispatcher. The
[native flow](../../../../.maestro/components/floating-action.yaml)
checks upper/lower edge taps, single activation, disabled suppression and icon
changes, plus repeated production taps 100 ms apart. JS checks cover focus,
keyboard visibility, rapid actions, route changes and current recipe-step handlers
on both platforms. Android
emulator interaction, visible icon and reduced-motion/movement checks pass; native
iOS execution and release-device performance remain unverified.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
