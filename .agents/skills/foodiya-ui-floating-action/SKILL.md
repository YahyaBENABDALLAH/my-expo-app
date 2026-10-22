---
name: foodiya-ui-floating-action
description: 'Use or maintain Foodiya native floating actions, named icon controls, placement and touch targets.'
---

# Floating action

Exports: `FloatingAction`, `FloatingActionButton` and their public types.

Keep this family to four files. The
[shared implementation](../../../src/components/ui/floating-action/floating-action.tsx)
owns both public components, their props and the private `Icon.select` map.
The [iOS](../../../src/components/ui/floating-action/floating-action-button.ios.tsx)
and [Android](../../../src/components/ui/floating-action/floating-action-button.android.tsx)
adapters render the native circle. Their `.d.ts` supplies a private renderer
contract. Do not split icons, types or layout into additional files.

Render a static 76-point/dp circle with a 28-point/dp icon. There is no Skia,
custom animation, artwork layer or `animate` prop. Native button interaction
feedback remains. The surface uses `primary` with `onPrimary` content; disabled
controls use `controlDisabledSurface` and `controlDisabledContent` and suppress
activation. Keep the `tab-context-action` selector and translated native label.

`kind` selects `create`, `continue`, `filters`, `active-filters`, `liked`,
`profile` or `submit`; profile retains its existing platform glyphs. `label` and
`onPress` are required. `disabled` and `colorScheme` are optional.

Android must pass `Shape.Circle({ radius: 1 })`: the installed native ShapeRecord
defaults its radius to zero, which clips both the icon and touch shape down to
the center. Keep the full-size circular shape explicit when updating Expo UI.

Use `FloatingActionButton` within an existing Host. `FloatingAction` owns a
fixed-size `UniversalHost` for a React Native boundary and retains native haptic
feedback on activation. Both honor the owning Host or explicit color scheme.
The consumer owns positioning, route-specific actions and asynchronous guards.

The starter Buttons showcase renders the retained FloatingAction and counts presses. Route-specific actions stay in the consumer. Removed recipe navigation does not own this component.

The [native story](../../../.rnstorybook/stories/components/floating-action.stories.tsx)
has Interactive and Disabled examples with counted activation. Controls select
all seven action kinds; reduced-motion setup is unnecessary for this static control.
Automated suites have been removed; existing test IDs remain for future tests.
Manually check upper/lower edge taps, single activation, disabled suppression,
icon changes, rapid actions, focus, keyboard visibility and route changes on both
platforms, plus light/dark colors and RTL. Historical artwork checks do not verify
the current native circle. Run lint, typecheck, edited-file formatting and
`npm run storybook:generate` when stories change. Report native execution separately.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/floating-action/](../../../src/components/ui/floating-action/).
