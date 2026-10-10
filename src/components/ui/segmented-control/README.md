# Segmented control

Exports: `SegmentedControl` and `SegmentedControlProps`.

The platform adapters render native segments and apply the Host theme.
The shared props and TypeScript declaration stay here.

Compose inside a Host. The caller owns selection; keep native disabled behavior
and platform selection surfaces in the adapters.

Existing composition story: [segmented-navigation.stories.tsx](../../../../.rnstorybook/stories/pages/segmented-navigation.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
