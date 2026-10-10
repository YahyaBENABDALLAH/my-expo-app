# Authentication frame

Exports: `AuthScreenFrame`, `authInputIcons` and the existing auth theme helpers.

`auth-screen-frame.tsx` owns keyboard/safe-area layout, the constrained native
Host, scrolling and the appearance footer. `auth-theme.ts` supplies the shared
palette; `auth-input-icons.ts` holds native symbol choices.

Compose `AuthText` and `UniversalButtonContent` inside the frame. `AuthText`
aliases `UniversalTextContent`; buttons inherit the frame's auth palette and
still require an explicit `variant`.

Keep session operations, validation and form state in the auth feature.

Existing composition story: [auth-screen.stories.tsx](../../../../.rnstorybook/stories/expo-ui/auth-screen.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
