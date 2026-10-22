---
name: foodiya-ui-form
description: 'Connect Foodiya FormTextInput and FormSubmit to React Hook Form, validation and submission state.'
---

# Form fields and submission

Exports: `FormTextInput` and `FormSubmit`. Ordinary fields use `TextInput` from
`@components/ui` with a string `value` and `onChangeText`.

`FormTextInput` binds `control` and `name` from React Hook Form to that same
`TextInput`. The shared input owns native value synchronization, including
external form resets. The adapter handles translated errors, helper text,
password visibility and validation feedback. `FormSubmit` composes submission
feedback.

```tsx
<FormTextInput control={form.control} name="email" label="Email" />
```

Compose inside an existing Host. Keep schemas, pending state,
duplicate-submission guards and API operations in the owning feature.

Non-password fields retain caller-supplied secure-entry and trailing-icon props.
Password toggles preserve the native value, ref and validation lifecycle.
Error messages take priority over helpers and render only when present. Messages
wrap naturally without reserving empty space. Selectors retain the supplied field
ID with `-error` or `-helper` suffixes.

Existing [auth stories](../../../.rnstorybook/stories/forms/auth-screen.stories.tsx)
cover FormTextInput/FormSubmit; page stories (retired fixture)
cover ordinary string inputs. See the [input guide](../foodiya-ui-text-input/SKILL.md) and
[UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/form/](../../../src/components/ui/form/).
