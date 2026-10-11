# Form fields and submission

Exports: `FormTextInput`, `NativeField` and `FormSubmit`.

`form-text-input.tsx` connects React Hook Form to the shared native input.
`native-field.tsx` bridges a caller-owned string to Expo UI's observable value
and synchronizes external resets. `form-submit.tsx` composes submission feedback.

These helpers compose inside an existing Host. Keep schemas, pending state,
duplicate-submission guards and API operations in the owning feature.

Password-mode overrides are resolved separately from the field composition.
Non-password fields retain caller-supplied secure-entry and trailing-icon props;
password toggles keep the same observable value, ref, and validation lifecycle.

`FormTextInput` renders an error or helper message only when one is present.
Messages use their natural height and wrap to the field width without a line
limit, so empty fields reserve no message space and long errors remain readable.
Validation adds space to the form while the message is shown. Error messages
take priority over helper text; clearing an error restores the helper, if supplied.
Message selectors retain the supplied field ID with `-error` or `-helper` suffixes.

Existing compositions: [auth-screen.stories.tsx](../../../../.rnstorybook/stories/expo-ui/auth-screen.stories.tsx)
covers FormTextInput/FormSubmit; [page-screen.stories.tsx](../../../../.rnstorybook/stories/pages/page-screen.stories.tsx)
covers NativeField.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
