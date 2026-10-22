---
name: foodiya-ui-appearance
description: 'Compose or maintain Foodiya theme, appearance, language, direction and header-motion preference controls.'
---

# Appearance and language

Exports: `ColorSchemeControl`, `LayoutDirectionControl`, `LanguagePicker` and `ThemePicker`.

`ThemePicker` and `ColorSchemeControl` render inside App Settings (`/settings`),
using the `app-settings-theme-picker` and `app-settings-color-scheme-picker`
selectors, inside the Appearance FieldGroup section. Preference sheets use the
app background color. The settings viewport is transparent; Expo's universal
FieldGroup owns its native form and row surfaces.
The theme menu includes **UX Template**, with black primary fills, white labels,
and neutral foundations with restrained danger, success and warning accents in both appearances.
It uses the stable `ux` ID and the same session
preferences as the four brands. `Pages/App Settings` and `Expo UI/Theme Tokens`
preview this theme by default; their themeId controls select the other brands.
The language row (`app-settings-language`) opens a native bottom sheet with French, English and
Arabic autonyms. Actionable language rows use native buttons. The form and sheet
presentation have separate Hosts so the sheet's native hosting boundary cannot
overlay the form's touch targets while closed. Selection uses the existing language provider and dismisses the
sheet; closing without selection preserves the current language. Account,
notification and about options are placeholders with disabled switches and
Coming soon footers. Preferences stay in the root providers across navigation. The removed
page footer is no longer part of the public UI API.

`ColorSchemeControl` is a native menu picker with System, Light Mode and Dark Mode
options, translated in all three languages. It displays the preference rather
than the resolved device appearance. System is the default and follows live OS
changes through the existing `useColorScheme` hook; explicit modes override it.
Choosing System again clears the native override through the root layout's
existing `Appearance.setColorScheme('unspecified')` synchronization. Preferences
are session-only, as before.
Login reuses the same control with `testID="auth-login-color-scheme"` in its
fixed top bar. The optional `testID` prop defaults to the App Settings selector.

`LanguagePicker` accepts an optional `testID`, shows dictionary autonyms for
French, English and Arabic, and enables after preference restoration. Language
changes update the existing RTL context without remounting forms. Production
uses it in More's profile preferences. `LayoutDirectionControl` is retained for
native Storybook previews.

See [localization](../../../docs/localization.md),
[appearance themes](../../../docs/appearance-themes.md) and
[live LTR/RTL](../../../docs/layout-direction.md).

Composition stories: App Settings (retired fixture)
and Localization (retired fixture).
Theme controls use the native picker wrapper and inherit their Host's
semantic palette. Native menu geometry and touch targets require device checks.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../docs/ui.md).

`HeaderMotionPicker` renders in Settings → Appearance and offers Waves, Ribbon,
Dunes, Smoke, Water and Rain with translated labels. It updates the shared header
immediately. The root ThemePreferencesProvider opts into saved header preferences;
restoration disables selection until ready, validates stored values and falls back
to smoke on storage failure. Writes are serialized. Local Storybook providers
keep selection in memory and never modify the saved app effect. The Page Header
AppSettings story covers this control and previews its local header.

Follow the [implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). Local filenames in
this guide refer to [src/components/ui/appearance/](../../../src/components/ui/appearance/).
