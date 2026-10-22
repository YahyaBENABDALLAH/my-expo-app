---
name: foodiya-ui-switch
description: Compose or maintain Foodiya Switch settings with controlled boolean values, native labels, disabled guards and inherited Host appearance. Use for switch usage and its in-app showcase.
---

# Switch

Import `Switch` from `@components/ui`. Reuse the existing `PageScreen`,
auth frame or `UniversalHost`; do not add a Host for each native setting.
Follow [Foodiya implementation](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md).

## Contract

Read the [wrapper and public type export](../../../src/components/ui/switch/switch.tsx) and
[installed props](../../../node_modules/@expo/ui/src/universal/Switch/types.ts).
Required: `value: boolean`, `onValueChange(next: boolean)`.
Optional: translated `label`, `disabled`, `testID` and native `modifiers`.

Keep this family in `switch.tsx`: it re-exports Expo's `SwitchProps` and adds
only the disabled callback guard. It does not need a separate types file or
platform adapters.

```tsx
<Switch
  label={t('showcase.notifications')}
  value={enabled}
  onValueChange={setEnabled}
  testID="notification-preference"
/>
```

The caller owns `enabled`; use the next boolean from the callback. There is no
`checked`, `onChange`, `style`, `color`, `loading` or children API here.

## Behavior and ownership

Use a switch for a boolean setting that takes effect in the current workflow.
Checkboxes express selection/choices. Neither control supplies persistence or
validation; connect existing preference/form owners rather than introducing a
second saved setting. A showcase changes local state only.

`disabled` keeps the value visible, disables native editing and suppresses
callbacks in the wrapper. Keep a disabled on value on; do not clear state as a
side effect of disabling. Express pending availability through the owning
workflow and its duplicate-action guard, not opacity alone.

Supply a clear translated label, preserve the native hit area and avoid nesting
inside another clickable row. Host/platform colors and native feedback remain
the defaults, including supported iOS treatments. Do not add imitation glass
or replace the native control to match screenshots across platforms.

## Showcase

[UI showcase → Switch](../../../src/features/ui-showcase/switch-screen.tsx),
route `/ui-component/switch`, covers two independent settings, change counts,
reset and disabled on/off states. Check label activation, disabled suppression,
native accessibility state, light/dark, RTL and large text on iOS/Android.

Checked for SDK 57 / `@expo/ui` 57.0.21:
[Switch](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/switch/).
