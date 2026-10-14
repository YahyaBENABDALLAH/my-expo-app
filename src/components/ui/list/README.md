# Native list

`list.tsx` delegates rows, scrolling, refresh indicator and appearance to the universal Expo UI List. It adds only shared promise coordination to coalesce pending refreshes and safely finish failures. The caller displays error feedback. Compose with ListItem inside a bounded Host; use the feature’s virtualized data list for large datasets.

Import from `@components/ui` and compose inside `UniversalHost`. The Host uses the shared light/dark scheme and theme tint; Host seedColor overrides remain available; use native modifiers only where exposed by the component API. No custom glass layer or Android glass imitation is added.

Native story: [expo-ui/list.stories.tsx](../../../../.rnstorybook/stories/expo-ui/list.stories.tsx). Light/dark and interaction fixtures remain available. JS checks cover public behavior and native module resolution; device appearance, glass and touch behavior still need iOS/Android verification.

See [native control themes](../../../../docs/control-theme.md) and [UI guide](../README.md).
