# Picker

Export: `Picker`, including `Picker.Item`.

The iOS/Android files keep native selection and Host theme mapping together.
`picker-items.ts` privately extracts compound items.
`picker.d.ts` declares the generic shared contract.

Compose inside a Host. The caller owns the selected value and updates it through
the callback. Preserve native menu/wheel behavior and disabled selection.

Existing composition story: [picker.stories.tsx](../../../../.rnstorybook/stories/expo-ui/picker.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
