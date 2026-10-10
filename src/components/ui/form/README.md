# Form fields and submission

Exports: `FormTextInput`, `NativeField` and `FormSubmit`.

`form-text-input.tsx` connects React Hook Form to the shared native input.
`native-field.tsx` bridges a caller-owned string to Expo UI's observable value
and synchronizes external resets. `form-submit.tsx` composes submission feedback.

These helpers compose inside an existing Host. Keep schemas, pending state,
duplicate-submission guards and API operations in the owning feature.

Existing compositions: [auth-screen.stories.tsx](../../../../.rnstorybook/stories/expo-ui/auth-screen.stories.tsx)
covers FormTextInput/FormSubmit; [page-screen.stories.tsx](../../../../.rnstorybook/stories/pages/page-screen.stories.tsx)
covers NativeField.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
