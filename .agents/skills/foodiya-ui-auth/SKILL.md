---
name: foodiya-ui-auth
description: 'Compose Foodiya native authentication frames and login preference controls using their existing Host.'
---

# Authentication frame

Shared export: `AuthScreenFrame`.
[LoginPreferences](../../../src/features/auth/login-preferences.tsx)
belongs to the auth feature and is imported locally by Login.

`auth-screen-frame.tsx` owns keyboard/safe-area layout, the full-width native
Host and scrolling. The screen adds only device safe areas; an inner
`PageSection` owns symmetric 16-point content padding without a maximum width. The
Host's actual keyboard-adjusted height supplies a native minimum content height:
short forms center vertically; longer forms grow and scroll from the top. This
uses the available layout, without device detection or breakpoints. Native
SwiftUI/Compose modifiers center the padded content without fixing its height.
Its optional `topBar` slot renders outside the scrolling
form, below the frame's top safe area. Read shared colors with `useThemeColors`
and the owning `useHostColorScheme`; use `useAppTheme` when both scheme and colors
are needed. Consumers select input symbols directly with `Icon.select`.

`grouped` selects a native `FieldGroup` instead of the regular refreshable scroll
container. Registration supplies sections directly to this mode and shares the
frame's heading, width, keyboard and safe-area handling. Keep this full-height
grouped form out of another scroll container; its long content scrolls normally.
FieldGroup owns the grouped form's horizontal gutters; the auth frame adds only
side safe-area insets. Expo's universal FieldGroup owns the native form
section row colors and scroll indicators. Like Settings, the grouped form hides
its system canvas so the page's theme background remains visible between groups.

Compose `UniversalTextContent` and `UniversalButtonContent` inside the frame.
Buttons use the shared theme tokens and still require an explicit `variant`.

Keep session operations, validation and form state in the auth feature.

The wordmark comes from `getAppBrand().name`, uppercased for this frame.
`getBrandHeadingFont` selects the configured platform family for the current
language; the system-font selection and Arabic use native fallback. The root
loads the selected font map. Keep font/asset setup with the
[configuration owner](../foodiya-implementation/references/configuration.md).
The wordmark and title selectors are `${testID}-brand` and `${testID}-title`.
Keyboard and safe-area layout stay in the same frame.

Login supplies `LoginPreferences` in the top bar: a labeled language button on
the physical left and the shared System/Light Mode/Dark Mode native picker on
the physical right. The top-bar Host explicitly
uses LTR to preserve these positions in Arabic. The language sheet is outside
that Host and uses Expo UI's own native hosting. Choosing French,
English or Arabic updates the existing language provider and closes the sheet.
The shared sheet uses Expo UI's native defaults with the iOS drag indicator
hidden. Native light/dark appearance follows the app preference; the sheet adds
no styling, sizing, padding, colors or content Host.
The picker shows the existing app color-scheme preference. System follows live
device appearance; Light Mode and Dark Mode stay fixed until another choice is
selected. Choosing System again resumes automatic detection. The app root saves
this preference; the picker disables until appearance restoration is ready.
The configured brand palette stays fixed. Demo palette controls belong only to
isolated component previews. Follow the
[appearance contract](../foodiya-ui-appearance/SKILL.md) for persistence and reveal
readiness.

The language action uses the shared `UniversalButtonContent` with `variant="link"`
and a translated label. It reuses the owning Host and disables activation until
language restoration is ready.

`Forms/Login Form` covers the native frame, grouped forms, pending state and
an editable draft. `HostSchemeOverride` gives the form a dark Host while app
preferences stay light; fields and feedback must inherit that Host.
Automated suites have been removed. Check saved language, all three
appearance choices, live device changes, translated options, draft retention, placement and
dismissal manually. Touch targets, keyboard layout and sheet accessibility require
device checks. Existing test IDs are retained for future tests.

Existing composition story: [auth-screen.stories.tsx](../../../.rnstorybook/stories/forms/auth-screen.stories.tsx).
The `viewportHeight` Control exercises overflow in a 360-point/dp viewport;
`GroupedForm` exercises the registration container. Appearance and helper text
Controls exercise the same centered frame. The configured build brand supplies
the wordmark and heading font; fixture registration does not verify either
platform's font rendering.

Manual iPad Pro 13-inch / iPadOS 27 checks verified centered Login and Register's
scrolling through to both actions. Full software-keyboard, narrow-window and
Android behavior remain unverified. Run lint and typecheck; source checks do not
establish native geometry.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/auth/](../../../src/components/ui/auth/).
