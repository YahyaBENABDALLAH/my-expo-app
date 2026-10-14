# List item

`list-item.tsx` forwards the universal Expo UI props and Leading, Supporting and Trailing slots. UniversalListItem is a direct compatibility alias. Native row colors and supporting/accessory typography inherit the Host. Caller colors/modifiers pass through. The only platform adaptation adds the actual Android row testID missing in the installed universal implementation. iOS props pass through unchanged.

Import from `@components/ui` and compose inside `UniversalHost`. The Host uses the shared light/dark scheme and theme tint; Host seedColor overrides remain available; use native modifiers only where exposed by the component API. No custom glass layer or Android glass imitation is added.

Native story: [expo-ui/list.stories.tsx](../../../../.rnstorybook/stories/expo-ui/list.stories.tsx). Light/dark and interaction fixtures remain available. JS checks cover public behavior and native module resolution; device appearance, glass and touch behavior still need iOS/Android verification.

See [native control themes](../../../../docs/control-theme.md) and [UI guide](../README.md).
