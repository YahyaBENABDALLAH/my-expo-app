---
name: foodiya-ui-segmented-control
description: 'Use or maintain Foodiya typed native segmented controls, controlled selection and selectors.'
---

# Segmented control

The small platform adapters render a SwiftUI segmented Picker or Material SingleChoiceSegmentedButtonRow. The caller owns selection. The Host supplies appearance and tint; native selected surfaces, borders and feedback retain their defaults. Supported iOS segmented pickers receive system glass feedback without another surface layer.

Import from `@components/ui` and compose inside `UniversalHost`. The Host uses the shared light/dark scheme and theme tint; Host seedColor overrides remain available; use native modifiers only where exposed by the component API. No custom glass layer or Android glass imitation is added.

Native story: pages/segmented-navigation.stories.tsx (retired fixture). Light/dark and interaction fixtures remain available. JS checks cover public behavior and native module resolution; device appearance, glass and touch behavior still need iOS/Android verification.

See [native control themes](../../../docs/control-theme.md) and [UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/segmented-control/](../../../src/components/ui/segmented-control/).
