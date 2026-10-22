---
name: foodiya-ui-slider
description: Compose or maintain Foodiya Slider controls with continuous or stepped numeric ranges, controlled updates and disabled guards. Use for slider sizing, value feedback and its in-app showcase.
---

# Slider

Use `Slider` from `@components/ui` inside the existing Host. Follow
[Foodiya implementation](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md).
Read the [wrapper](../../../src/components/ui/slider/slider.tsx) and
[installed props](../../../node_modules/@expo/ui/src/universal/Slider/types.ts).

## Contract

Required: numeric `value` and `onValueChange(next: number)`.
Optional: `min` (default 0), `max` (default 1), `step`, `disabled`,
`testID` and native `modifiers`.

```tsx
<Slider
  min={0}
  max={100}
  step={10}
  value={amount}
  onValueChange={setAmount}
  modifiers={nativeFillWidth}
  testID="recipe-amount"
/>
```

The caller owns `amount`. Supply finite values, a range with `min < max`,
and an in-range value. Omit step for a continuous range; use a positive step
for discrete values and align the chosen value/endpoints deliberately.
Do not rely on the native control to repair NaN or an invalid domain range.

## Interaction and composition

Show a nearby translated description/value with the appropriate unit.
Give the control actual available width through its native parent/modifiers.
There is no slider `label`, RN `style`, `minimumValue`, `maximumValue`,
`onSlidingComplete`, track-color or children API in this wrapper.

`onValueChange` can fire many times while dragging. Update local preview state;
do not write storage or fire a request on every tick. Reuse the owning feature's
existing commit/debounce policy when persistence is requested. Format displayed
precision separately instead of rounding every incoming value needlessly.

`disabled` disables the native control and the wrapper guards its callback.
It does not reset the value. Native thumb, track, colors and feedback follow
the Host/platform; do not paint an imitation slider or glass layer.

## Showcase

[UI showcase → Slider](../../../src/features/ui-showcase/slider-screen.tsx),
route `/ui-component/slider`, compares a 0–100 stepped range, a continuous
0–1 range, reset and a disabled control with a change counter. Check endpoints,
steps, native accessibility adjustment, disabled suppression and RTL on devices.
A nearby text label alone does not establish a screen-reader association.

Checked for SDK 57 / `@expo/ui` 57.0.21:
[Slider](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/slider/).
