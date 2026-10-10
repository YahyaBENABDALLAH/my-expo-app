# Switch

Exports: `Switch` and `SwitchProps`.

The iOS/Android implementations and their shared contract stay together.
Compose inside a Host; value, callback, label, disabled, testID and modifiers
retain Expo UI's API.

Android maps shared on/off track/thumb/border and disabled tokens.
iOS applies the on-track tint; SwiftUI owns thumb, off-track and disabled
appearance. Both adapters inherit the Host scheme and suppress disabled changes.
Caller modifiers remain available as overrides.

See [control theme coverage](../../../../docs/control-theme.md).

Existing composition story: [switch.stories.tsx](../../../../.rnstorybook/stories/expo-ui/switch.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
