# Native list

Export: `List`.

The iOS/Android adapters apply Host theme colors to grouped native lists.
`list.d.ts` declares the shared contract. Compose with `ListItem` inside a Host.

This is a native grouped-row control. Keep large dataset rendering decisions
in the owning feature rather than expanding this wrapper.

Existing composition story: [list.stories.tsx](../../../../.rnstorybook/stories/expo-ui/list.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
