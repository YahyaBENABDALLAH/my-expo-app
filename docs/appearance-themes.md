# App Settings and appearance

The starter supports UX Template (`ux`, the default) and Instagram (`instagram`),
each in light and dark appearance. The native controls share semantic tokens in
`src/constants/themes/`; Instagram's palette is bundled static JSON.

Settings offers theme, system/light/dark appearance, header effect, Reduce Motion,
language, Account/sign-in navigation, the component catalog and app version.
Placeholder account, notification, support and legal controls have been removed.

Theme and color-scheme choices remain session preferences. Language uses its
existing saved provider. Header effect and the explicit motion choice restore
before launch completion. Unsupported saved header effects fall back to Dunes.

The canonical control and persistence contract lives in the
[appearance skill](../.agents/skills/foodiya-ui-appearance/SKILL.md).
Native styles, hit areas, contrast, RTL, large text and live preference changes
still require device verification. Earlier brand/theme reports describe history.
