# Field group

Export: `FieldGroup`, including its Section, SectionHeader and SectionFooter slots.

The platform adapters apply Host theme tokens. `field-group-slots.tsx` keeps
slot extraction and implicit section grouping beside the component.
`field-group.d.ts` preserves the compound API for TypeScript.

Android sections use connected rows with rounded outer corners, thin `divider`
separators and compact muted section headings. iOS retains its native Form
grouping. Both consume `background`, `controlSurface`, `text`, `muted` and
`divider` tokens. Keep the FieldGroup in a bounded Host as the screen's scroll
container; do not nest it in another vertical scroll view.

Compose native fields inside a Host. Keep validation and form state in the
owning feature.

Existing composition story: [field-group.stories.tsx](../../../../.rnstorybook/stories/expo-ui/field-group.stories.tsx).
The grouped settings composition is covered by
[app-settings.stories.tsx](../../../../.rnstorybook/stories/pages/app-settings.stories.tsx)
in light, dark, RTL and brand fixtures. Native geometry still requires device verification.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
