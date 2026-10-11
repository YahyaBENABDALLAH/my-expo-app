# Appearance and language

Exports: `ColorSchemeControl`, `LayoutDirectionControl`, `LanguagePicker` and `ThemePicker`.

`ThemePicker` and `ColorSchemeControl` render inside App Settings (`/settings`),
using the `app-settings-theme-picker` and `app-settings-color-scheme-switch`
selectors. Preferences stay in the root providers across navigation. The removed
page footer is no longer part of the public UI API.

`LanguagePicker` accepts an optional `testID`, shows dictionary autonyms for
French, English and Arabic, and enables after preference restoration. Language
changes update the existing RTL context without remounting forms. Production
uses it in More's profile preferences. `LayoutDirectionControl` is retained for
native Storybook previews.

See [localization](../../../../docs/localization.md),
[appearance themes](../../../../docs/appearance-themes.md) and
[live LTR/RTL](../../../../docs/layout-direction.md).

Composition stories: [App Settings](../../../../.rnstorybook/stories/pages/app-settings.stories.tsx)
and [Localization](../../../../.rnstorybook/stories/pages/localization.stories.tsx).
Theme controls use the native picker/switch wrappers and inherit their Host's
semantic palette. Native menu geometry and touch targets require device checks.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
