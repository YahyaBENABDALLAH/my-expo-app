---
name: foodiya-ui-text-input
description: 'Use or maintain Foodiya native text inputs, validation state, icon actions and controlled values.'
---

# Text input

Use `TextInput` for ordinary fields and `FormTextInput` for React Hook Form.
Both render the same Expo UI control. Import them from `@components/ui` and
compose inside an existing `UniversalHost` or `PageScreen`.

```tsx
<TextInput label="Search" value={query} onChangeText={setQuery} testID="recipe-search" />
```

`value` is a normal string. The input owns the native observable and synchronizes
external edits and resets without replacing the field. For uncontrolled editing,
omit `value` and supply an optional `defaultValue`; later default changes do not
replace native edits. Use `keyboardType="decimal-pad"` for numeric fields.

The public API keeps native keyboard, selection, focus, ref, multiline and secure
entry props, plus labels, helper text, status colors and optional icons. There
are no separate NativeField or UniversalTextInput/Content exports. At a React
Native boundary, supply a `UniversalHost` explicitly; ordinary native composition
reuses its existing Host. `FormTextInput` adds form binding, translated validation,
password toggles and validation feedback. See the [form guide](../foodiya-ui-form/SKILL.md).

The owning Host supplies appearance and tint. The input uses shared text,
surface, border, muted and status colors, with caller overrides. Focus changes
only the border color; error/success/warning colors take priority. Disabled fields
retain their surface and suppress editing and icon actions. Read-only editing
and a separate icon action remain independent. Icon actions require an accessible
label.

The iOS icon action uses a plain SwiftUI Button with a fixed 48-point label and
content shape. Its label retains its size next to the flexible editable field.
Android uses the native 48dp Compose IconButton. Both suppress disabled actions.

Native layout owns sizing. iOS uses plain TextField/SecureField styling and a
48-point minimum surface; Android keeps its native minimum size. Password mode
changes retain the same observable and ref. There is no width measurement,
delayed rendering or remount to synchronize values.

[Native stories](../../../.rnstorybook/stories/components/text-input.stories.tsx)
cover controlled strings, external updates/reset, default values, icons, focus,
passwords, disabled/read-only states, themes and geometry. Standalone story
previews supply a Host; the production input itself adds none. Check editing,
reset, selection, focus and password actions manually. Automated suites have been
removed; existing test IDs remain for future tests. `Controlled` uses the same
string API as app callers.

JS checks verify value/reset synchronization, native field retention, focus
colors/guards, disabled actions, refs, geometry and theme inheritance. They mock
native views; current iOS/Android keyboard, touch, selection and visual behavior
still require device verification. Earlier manual checks do not verify this API
migration.

API reference: [Expo SDK 57 TextInput](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/textinput/).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/text-input/](../../../src/components/ui/text-input/).
