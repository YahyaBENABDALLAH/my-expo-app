---
name: foodiya-ui-appearance
description: Compose the starter theme, language, color scheme, header and reduced-motion preferences.
---

# Appearance and language

Use `ThemePicker`, `ColorSchemeControl`, `LanguagePicker`, `LayoutDirectionControl`
and `HeaderMotionPicker` from `@components/ui`. These controls reuse the owning
Host. Settings uses the native FieldGroup and a separate language-sheet Host so
closed presentation does not cover form controls.

Only UX Template (`ux`, the default) and Instagram (`instagram`) are supported,
both in light and dark appearance. Color scheme offers System, Light and Dark.
Theme and color-scheme choices remain session preferences. Language restores
through the existing provider; French, English and Arabic use dictionary autonyms
and Arabic changes live RTL without remounting forms.

HeaderMotionPicker offers Dunes, Ribbon and Rain. The root provider's
`persistHeaderMotion` also opts into saving the Reduce Motion boolean. Header
motion uses `appHeaderMotion`; reduction uses `appReducedMotion`. Restoration
joins launch readiness, validates stored values and defaults removed effects to
Dunes. Writes are serialized. Local Storybook providers remain in memory.

Settings has a labeled native `Switch` with selector `app-settings-reduce-motion`.
On freezes custom header, Lottie, floating-action, skeleton and OTP artwork and
disables stack motion; Off enables custom animation. Until explicitly selected,
the system setting is observed live. `useAppReducedMotion` and `useMotionEnabled`
are the shared readers; activity/visibility checks remain in force. Root config
aligns Reanimated with this preference. The two-second launch hold is retained
even when reduction skips the slide.

Settings contains real Account/sign-in navigation, appearance, language, showcase
navigation and app version. Placeholder notification/account/legal rows are gone.
The FieldGroup component showcase may still demonstrate local draft controls.

Native `Components/Page Header` Settings compositions cover both appearances;
`Components/Launch Screen` and `Components/Floating Action` cover reduced motion.
See [theme ownership](../../../docs/appearance-themes.md) and the
[implementation pattern](../foodiya-implementation/SKILL.md). Verify live settings,
sheet hit-testing, RTL and saved motion on both native platforms.
