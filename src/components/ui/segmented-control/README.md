# Segmented control

The small platform adapters render a SwiftUI segmented Picker or Material SingleChoiceSegmentedButtonRow. The caller owns selection. The Host supplies appearance and tint; native selected surfaces, borders and feedback retain their defaults. Supported iOS segmented pickers receive system glass feedback without another surface layer.

Import from `@components/ui` and compose inside `UniversalHost`. The Host uses the shared light/dark scheme and theme tint; Host seedColor overrides remain available; use native modifiers only where exposed by the component API. No custom glass layer or Android glass imitation is added.

Native story: [pages/segmented-navigation.stories.tsx](../../../../.rnstorybook/stories/pages/segmented-navigation.stories.tsx). Light/dark and interaction fixtures remain available. JS checks cover public behavior and native module resolution; device appearance, glass and touch behavior still need iOS/Android verification.

See [native control themes](../../../../docs/control-theme.md) and [UI guide](../README.md).
