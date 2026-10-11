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

The RN boundary measures and rounds its container width only on layout events.
It filters equal/invalid widths before updating React, so position-only or
equivalent rounded reports do not rerun input composition. Actual resize keeps
the same native field instance; hosted content needs no measurement state.

Read the installed APIs before changing platform appearance, focus, keyboard
or icon behavior.

All input icons have a fixed 20 × 20 frame. Right icon buttons use a fixed
48 × 48 tap target on both platforms, including password reveal/hide.
`PasswordVisibility` and `PasswordVisibilityLargeText` stories exercise the toggle;
the icon Maestro flow checks revealing and hiding the password.

Existing composition story: [text-input.stories.tsx](../../../../.rnstorybook/stories/expo-ui/text-input.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
