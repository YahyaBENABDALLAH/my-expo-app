# Checkbox

`checkbox.tsx` uses the universal Expo UI control and guards disabled callbacks. Checked, unchecked, label, and disabled colors come from the owning Host. iOS uses a native toggle with its system glass feedback on supported OS versions.

Import from `@components/ui` and compose inside `UniversalHost`. The Host uses the shared light/dark scheme and theme tint; Host seedColor overrides remain available; use native modifiers only where exposed by the component API. No custom glass layer or Android glass imitation is added.

Native story: [expo-ui/checkbox.stories.tsx](../../../../.rnstorybook/stories/expo-ui/checkbox.stories.tsx). Light/dark and interaction fixtures remain available. JS checks cover public behavior and native module resolution; device appearance, glass and touch behavior still need iOS/Android verification.

See [native control themes](../../../../docs/control-theme.md) and [UI guide](../README.md).
