# Text input

Exports: `UniversalTextInput`, `UniversalTextInputContent`, their props and
`InputStatus`.

`universal-text-input.tsx` owns native input composition.
`text-input-modifiers.*` handles native row sizing, field appearance and labels.
`text-input-icon-button.*` handles the private trailing action and its contract.

Use the standalone component at an RN boundary and content inside a Host.
The native `value` uses Expo UI's supported observable API, including external
resets and password toggles. Use `FormTextInput` or `NativeField` to bridge
caller form/string state. Keep validation and submission in the feature.

Read the installed APIs before changing platform appearance, focus, keyboard
or icon behavior.

Existing composition story: [text-input.stories.tsx](../../../../.rnstorybook/stories/expo-ui/text-input.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
