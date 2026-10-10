# List item

Exports: `ListItem` and `UniversalListItem` (the same component).

The iOS/Android adapters preserve Leading, Supporting and Trailing slots and map
the owning Host's theme. `list-item.d.ts` declares the compound contract.
The public barrel exports the compatibility alias directly, without another file
or rendering wrapper.

Compose inside a native List/Host. Keep selection state in the caller.

Existing composition story: [list.stories.tsx](../../../../.rnstorybook/stories/expo-ui/list.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
