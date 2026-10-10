# Checkbox

Export: `Checkbox`.

`checkbox.ios.tsx` and `checkbox.android.tsx` adapt the native control to the
Host theme and shared control tokens. `checkbox.d.ts` declares the common
contract; it is not a runtime fallback.

Compose inside a Host. The caller owns checked state and updates it through the
native callback. Keep disabled behavior and native feedback in the adapters.

Existing composition story: [checkbox.stories.tsx](../../../../.rnstorybook/stories/expo-ui/checkbox.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
