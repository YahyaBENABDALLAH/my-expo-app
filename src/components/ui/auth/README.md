# Authentication frame

Exports: `AuthScreenFrame`, `LoginPreferences`, `authInputIcons` and the existing auth theme helpers.

`auth-screen-frame.tsx` owns keyboard/safe-area layout, the constrained native
Host and scrolling. Its optional `topBar` slot renders outside the scrolling
form and its width constraint, below the frame's top safe area. `auth-theme.ts` supplies the shared
palette; `auth-input-icons.ts` holds native symbol choices.

Compose `AuthText` and `UniversalButtonContent` inside the frame. `AuthText`
aliases `UniversalTextContent`; buttons inherit the frame's auth palette and
still require an explicit `variant`.

Keep session operations, validation and form state in the auth feature.

Heading font selection preserves the native Android/iOS font names and leaves
Arabic to its existing font fallback. Keyboard and safe-area layout stay in the
same frame.

Login supplies `LoginPreferences` in the top bar: a globe icon on the physical
left and a sun/moon button on the physical right. The top-bar Host explicitly
uses LTR to preserve these positions in Arabic. The language sheet is outside
that Host, so its content follows the app's language direction. Choosing French,
English or Arabic updates the existing language provider and closes the sheet.
The theme button uses the existing app color-scheme preference; moon selects
dark mode and sun selects light mode. Brand selection stays in App Settings.

The private `auth-icon-button.*` adapters use a native 48-point plain SwiftUI
button or Material IconButton with translated accessibility labels. Icon/tint
colors follow the auth palette. Disabled language controls suppress activation
until language restoration is ready. No new UI dependency is needed.

`Pages/Login preferences` exposes light/dark fixtures and an editable draft.
`tests/auth/login-preferences.test.mjs` checks provider updates, saved language,
draft retention, physical placement, readiness and dismissal with native views
mocked. `.maestro/storybook/login-preferences.yaml` covers native interaction;
touch targets, keyboard layout and sheet accessibility require device checks.

Existing composition story: [auth-screen.stories.tsx](../../../../.rnstorybook/stories/expo-ui/auth-screen.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
