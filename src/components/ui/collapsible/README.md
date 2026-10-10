# Collapsible

Export: `Collapsible`.

The iOS/Android implementations keep disclosure behavior and native theme
mapping together. `collapsible.d.ts` declares the common contract.

Compose inside a Host and supply the header/content through the existing native
API. Expansion state and disabled behavior remain native.

Existing composition story: [collapsible.stories.tsx](../../../../.rnstorybook/stories/expo-ui/collapsible.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
