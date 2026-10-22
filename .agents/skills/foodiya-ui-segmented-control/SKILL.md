---
name: foodiya-ui-segmented-control
description: 'Use or maintain Foodiya typed native segmented controls, controlled selection and selectors.'
---

# Segmented control

The small platform adapters render a SwiftUI segmented Picker or Material SingleChoiceSegmentedButtonRow. The caller owns selection. The Host supplies appearance and tint; native selected surfaces, borders and feedback retain their defaults. Supported iOS segmented pickers receive system glass feedback without another surface layer.

Keep three files: the iOS and Android implementations and the
[public declaration and props](../../../src/components/ui/segmented-control/segmented-control.d.ts).
The declaration owns `SegmentedControlProps`; both adapters import that type
directly. No separate types file or shared runtime wrapper is needed.

Import from `@components/ui` and compose inside `UniversalHost`. The Host uses the shared light/dark scheme and theme tint; Host seedColor overrides remain available; use native modifiers only where exposed by the component API. No custom glass layer or Android glass imitation is added.

Options are readonly `{ value: string; label: string; testID: string }` records.
Keep values and selectors stable and translate labels. `selectedValue` is a
string or `null`; `onValueChange` receives a string value directly. iOS ignores
null selection events. Optional `label` names the iOS picker and otherwise
defaults to translated `common.options`; Android displays the option labels.
There is no disabled, color, style or modifiers prop in this contract.

The [native showcase](../../../src/features/ui-showcase/segments-screen.tsx),
route `/ui-component/segments`, exercises two choices and the selected value.
The former segmented-navigation Storybook fixture is retired. Check selection,
labels/selectors, light/dark, RTL, large text and native touch behavior on both
platforms. Run lint, typecheck and edited-file formatting; static checks do not
establish native appearance or interaction.

See [native control themes](../../../docs/control-theme.md) and [UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/segmented-control/](../../../src/components/ui/segmented-control/).
