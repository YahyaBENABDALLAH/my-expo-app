# Field group

Use Expo UI FieldGroup directly, including Section, SectionHeader and SectionFooter. Native Form/Material grouping owns row shapes, separators, slots and theme colors. The small iOS adapter hides the scroll background only when the caller supplies a background, preserving transparent Settings screens. Keep the form in a bounded Host and avoid nested vertical scrolling.

Import from `@components/ui` and compose inside `UniversalHost`. The Host uses the shared light/dark scheme and theme tint; Host seedColor overrides remain available; use native modifiers only where exposed by the component API. No custom glass layer or Android glass imitation is added.

Native story: [expo-ui/field-group.stories.tsx](../../../../.rnstorybook/stories/expo-ui/field-group.stories.tsx). Light/dark and interaction fixtures remain available. JS checks cover public behavior and native module resolution; device appearance, glass and touch behavior still need iOS/Android verification.

See [native control themes](../../../../docs/control-theme.md) and [UI guide](../README.md).
