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

Single-line fields reserve a stable height from the font scale, text line height,
resolved vertical padding and border. Right actions retain room for their native
tap target. Password reveal/hide, focus, editing and clearing use the same field
height; `style.height` overrides it. Multiline fields still grow naturally.

`PasswordVisibility` and `PasswordVisibilityLargeText` stories expose a recorded
height baseline and the largest subsequent change. The password visibility
Maestro flow checks that this stays zero while toggling and editing.

Existing composition story: [text-input.stories.tsx](../../../../.rnstorybook/stories/expo-ui/text-input.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
