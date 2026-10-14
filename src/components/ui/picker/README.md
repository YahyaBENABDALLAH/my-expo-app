# Picker

The caller owns selectedValue and onValueChange and supplies Picker.Item children. Small platform adapters retain disabled selection guards, typed string/number values, fragment handling and Android anchor/option selectors. Android updates the selected label through native observable state and closes an open dropdown when disabled. Colors come from the Host. iOS menu triggers use native glass button style on iOS 26+ and automatic style on older versions; wheels retain their native style. Android always uses Material dropdowns.

Import from `@components/ui` and compose inside `UniversalHost`. The Host uses the shared light/dark scheme and theme tint; Host seedColor overrides remain available; use native modifiers only where exposed by the component API. No custom glass layer or Android glass imitation is added.

Native story: [expo-ui/picker.stories.tsx](../../../../.rnstorybook/stories/expo-ui/picker.stories.tsx). Light/dark and interaction fixtures remain available. JS checks cover public behavior and native module resolution; device appearance, glass and touch behavior still need iOS/Android verification.

See [native control themes](../../../../docs/control-theme.md) and [UI guide](../README.md).
