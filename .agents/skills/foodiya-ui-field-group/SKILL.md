---
name: foodiya-ui-field-group
description: 'Compose Foodiya native grouped fields and section slots with the existing FieldGroup contract.'
---

# Field group

`FieldGroup` and `FieldGroupProps` are direct re-exports from `@expo/ui` on iOS
and Android, including `Section`, `SectionHeader` and `SectionFooter`.
Expo owns form backgrounds, row colors, grouping, separators and scroll indicators.

Import from `@components/ui` and compose inside a bounded `UniversalHost`.
The Host supplies appearance and theme tint. Pass the universal component's
supported props and modifiers directly; avoid nesting it in another vertical
scroll container. The local export adds no styling, theme hooks or platform adapter.

Native story: [expo-ui/field-group.stories.tsx](../../../.rnstorybook/stories/forms/field-group.stories.tsx). Light/dark and interaction fixtures remain available. JS checks cover public behavior and native module resolution; device appearance, glass and touch behavior still need iOS/Android verification.

See [native control themes](../../../docs/control-theme.md) and [UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/field-group/](../../../src/components/ui/field-group/).
