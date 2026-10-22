---
name: foodiya-ui-checkbox
description: Compose or maintain Foodiya Checkbox choices with controlled booleans, translated labels, disabled guards and native Host styling. Use for checkbox usage and the in-app showcase.
---

# Checkbox

Use `Checkbox` from `@components/ui` inside an existing `PageScreen` or
`UniversalHost`. Follow [Foodiya implementation](../foodiya-implementation/SKILL.md)
and [mobile UI requirements](../expo-mobile-ui-only/SKILL.md).

## Contract

Read the [wrapper](../../../src/components/ui/checkbox/checkbox.tsx) and
[installed props](../../../node_modules/@expo/ui/src/universal/Checkbox/types.ts).
Required props are `value: boolean` and `onValueChange(next: boolean)`.
Optional props are `label`, `disabled`, `testID` and native `modifiers`.

```tsx
<Checkbox
  label={t('showcase.savePreference')}
  value={checked}
  onValueChange={setChecked}
  testID="recipe-save-choice"
/>
```

The caller owns `checked` and its setter. Use the callback's next value rather
than toggling captured state. Keep independent choices independent; this control
does not implement a radio group, mixed/indeterminate state or form validation.
There are no `checked`, `onChange`, `style`, `color` or children props.

## Composition

- Supply a translated label. Do not nest the checkbox inside another clickable
  button/row; retain its native semantics and touch target.
- Set `disabled` for unavailable choices. The wrapper guards callbacks as well
  as disabling the native control. A disabled selected value remains selected;
  disabling does not clear state or persist a preference.
- Appearance and tint come from the owning Host. Do not add another Host for an
  ordinary field, emulate native glass, or introduce custom checkbox artwork.
- Keep persistence and validation in the feature or existing form adapter.
  Changing a demo choice must not silently update stored app preferences.

## Showcase

[UI showcase → Checkbox](../../../src/features/ui-showcase/checkbox-screen.tsx),
route `/ui-component/checkbox`, covers independent choices, a wrapping label,
reset, change counts and disabled checked/unchecked states. Check label/control
activation, disabled suppression, RTL and large text on native devices.
Static checks do not prove native appearance or accessibility.

API reference checked for Expo SDK 57 / `@expo/ui` 57.0.21:
[Checkbox](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/checkbox/).
Recheck the installed version before changing native APIs.
