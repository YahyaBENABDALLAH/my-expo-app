# Field group

Export: `FieldGroup`, including its Section, SectionHeader and SectionFooter slots.

The platform adapters apply Host theme tokens. `field-group-slots.tsx` keeps
slot extraction and implicit section grouping beside the component.
`field-group.d.ts` preserves the compound API for TypeScript.

Compose native fields inside a Host. Keep validation and form state in the
owning feature.

Existing composition story: [field-group.stories.tsx](../../../../.rnstorybook/stories/expo-ui/field-group.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
