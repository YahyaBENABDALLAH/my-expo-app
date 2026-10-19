# Authentication frame

Exports: `AuthScreenFrame`, `LoginPreferences`, `authInputIcons` and the existing auth theme helpers.

`auth-screen-frame.tsx` owns keyboard/safe-area layout, the full-width native
Host and scrolling. Forms automatically fill the available window width with
safe horizontal gutters, without a maximum width. The
Host's actual keyboard-adjusted height supplies a native minimum content height:
short forms center vertically; longer forms grow and scroll from the top. This
uses the available layout, without device detection or breakpoints. Native
SwiftUI/Compose modifiers center the padded content without fixing its height.
Its optional `topBar` slot renders outside the scrolling
form, below the frame's top safe area. `auth-theme.ts` supplies the shared
palette; `auth-input-icons.ts` holds native symbol choices.

`grouped` selects a native `FieldGroup` instead of the regular refreshable scroll
container. Registration supplies sections directly to this mode and shares the
frame's heading, width, keyboard and safe-area handling. Keep this full-height
grouped form out of another scroll container; its long content scrolls normally.
FieldGroup owns the grouped form's horizontal gutters; the auth frame adds only
side safe-area insets. Expo's universal FieldGroup owns the native form
background, section row colors and scroll indicators.

Compose `AuthText` and `UniversalButtonContent` inside the frame. `AuthText`
aliases `UniversalTextContent`; buttons use the shared theme tokens and
still require an explicit `variant`.

Keep session operations, validation and form state in the auth feature.

Heading font selection preserves the native Android/iOS font names and leaves
Arabic to its existing font fallback. Keyboard and safe-area layout stay in the
same frame.

Login supplies `LoginPreferences` in the top bar: a globe icon on the physical
left and the shared System/Light Mode/Dark Mode native picker on the physical
right. The top-bar Host explicitly
uses LTR to preserve these positions in Arabic. The language sheet is outside
that Host and uses Expo UI's own native hosting. Choosing French,
English or Arabic updates the existing language provider and closes the sheet.
The shared sheet uses Expo UI's native defaults with the iOS drag indicator
hidden. Native light/dark appearance follows the app preference; the sheet adds
no styling, sizing, padding, colors or content Host.
The picker shows the existing app color-scheme preference. System follows live
device appearance; Light Mode and Dark Mode stay fixed until another choice is
selected. Choosing System again resumes automatic detection. Brand selection
stays in App Settings.

The private `auth-icon-button.*` adapters use a native 48-point plain SwiftUI
button or Material IconButton with translated accessibility labels. Icon/tint
colors follow the auth palette. Disabled language controls suppress activation
until language restoration is ready. No new UI dependency is needed.

`Pages/Login preferences` exposes System/light/dark fixtures and an editable draft.
`tests/auth/login-preferences.test.mjs` checks provider updates, saved language,
all three appearance choices, live device changes, translated options, draft
retention, physical placement, readiness and dismissal with native views
mocked. `.maestro/storybook/login-preferences.yaml` covers native interaction;
touch targets, keyboard layout and sheet accessibility require device checks.

Existing composition story: [auth-screen.stories.tsx](../../../../.rnstorybook/stories/expo-ui/auth-screen.stories.tsx).
`CompactViewport` exercises overflow in a 360-point/dp viewport; `GroupedForm`
exercises the registration container. Existing light/dark and helper/error
fixtures exercise the same centered frame.

Manual iPad Pro 13-inch / iPadOS 27 checks verified centered Login and Register's
scrolling through to both actions. Full software-keyboard, narrow-window and
Android behavior remain unverified. Lint, typecheck and the auth/layout suites
pass; these source checks do not establish native geometry.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
