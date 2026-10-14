# Collapsible

This is the direct universal Expo UI export. The caller owns isOpen and onOpenChange; Expo owns disclosure layout, native animation, slot content and Host colors. There is no dedicated glass style for this control.

Import from `@components/ui` and compose inside `UniversalHost`. The Host uses the shared light/dark scheme and theme tint; Host seedColor overrides remain available; use native modifiers only where exposed by the component API. No custom glass layer or Android glass imitation is added.

Native story: [expo-ui/collapsible.stories.tsx](../../../../.rnstorybook/stories/expo-ui/collapsible.stories.tsx). Light/dark and interaction fixtures remain available. JS checks cover public behavior and native module resolution; device appearance, glass and touch behavior still need iOS/Android verification.

See [native control themes](../../../../docs/control-theme.md) and [UI guide](../README.md).
