# Slider

`slider.tsx` uses the universal Expo UI control and guards disabled callbacks. Expo handles ranges, steps, native drag feedback and selectors. Colors inherit the Host. Supported iOS sliders retain native glass feedback during interaction; Android uses Material.

Import from `@components/ui` and compose inside `UniversalHost`. The Host uses the shared light/dark scheme and theme tint; Host seedColor overrides remain available; use native modifiers only where exposed by the component API. No custom glass layer or Android glass imitation is added.

Native story: [expo-ui/slider.stories.tsx](../../../../.rnstorybook/stories/expo-ui/slider.stories.tsx). Light/dark and interaction fixtures remain available. JS checks cover public behavior and native module resolution; device appearance, glass and touch behavior still need iOS/Android verification.

See [native control themes](../../../../docs/control-theme.md) and [UI guide](../README.md).
