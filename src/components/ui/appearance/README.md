# Appearance and language

Exports: `PageAppearanceControls`, `PageAppearanceFooter`,
`ColorSchemeControl`, `LayoutDirectionControl`, `LanguagePicker` and `ThemePicker`.

The page controls compose theme, color scheme, direction and language selectors.
Their small implementations share this folder because they form the same footer.
Preferences stay in the root providers across navigation.

`LanguagePicker` accepts an optional `testID`, shows dictionary autonyms for
French, English and Arabic, and enables after preference restoration. Language
changes update the existing RTL context without remounting forms.

See [localization](../../../../docs/localization.md),
[appearance themes](../../../../docs/appearance-themes.md) and
[live LTR/RTL](../../../../docs/layout-direction.md).

Existing composition story: [page-appearance.stories.tsx](../../../../.rnstorybook/stories/pages/page-appearance.stories.tsx).

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
