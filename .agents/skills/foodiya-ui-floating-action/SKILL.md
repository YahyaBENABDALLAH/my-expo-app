---
name: foodiya-ui-floating-action
description: 'Use or maintain Foodiya native floating actions, named icon controls, placement and touch targets.'
---

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

The starter Buttons showcase renders the retained FloatingAction and counts presses. Route-specific actions stay in the consumer. Removed recipe navigation does not own this component.

See [navbar verification](../../../docs/navbar-wave-verification.md) for
geometry, touch coverage and native verification limits.

Interactive composition story: `.rnstorybook/stories/components/floating-action.stories.tsx`.
Controls select all seven action kinds; Interactive, Disabled and ReducedMotion exercise counted activation and static artwork.
Automated suites have been removed; existing test IDs remain for future tests.
Manually check upper/lower edge taps, single activation, disabled suppression,
icon changes, rapid actions, focus, keyboard visibility and route changes on both
platforms. Historical Android emulator interaction, visible icon and
reduced-motion/movement checks passed; native
iOS execution and release-device performance remain unverified.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/floating-action/](../../../src/components/ui/floating-action/).
