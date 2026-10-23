---
name: foodiya-ui-appearance
description: Compose configured brand palettes, saved app appearance, isolated theme previews, language, header and reduced-motion preferences.
---

# Appearance and language

Use the shared `ColorSchemeControl` from `@components/ui` in Settings and login.
Settings owns its local [HeaderMotionPicker](../../../src/features/settings/header-motion-picker.tsx).
The [ThemePicker](../../../src/features/ui-showcase/theme-picker.tsx) belongs only
to the Text component preview. Neither is a public UI export. These controls
reuse the owning Host. Settings
and login own their language sheets; the language provider updates layout direction.
Settings uses the native FieldGroup and a separate language-sheet Host so closed
presentation does not cover form controls.

The brand manifest's `presentation.palette` selects UX Template (`ux`) or
Instagram (`instagram`), both with light/dark tokens. The root supplies this as
`initialTheme`; its palette cannot be changed through `setThemeId`. Do not add a
palette/brand picker to ordinary Settings. `allowThemeSelection` is an explicit
provider opt-in for isolated component previews. Palette choices are not saved.

Color scheme offers System, Light and Dark. Only the root opts into
`persistAppearance`. It restores `appColorScheme`, accepts those three stored
values and exposes `appearanceReady`; the shared picker disables until ready,
and its setter also guards callbacks. Missing/invalid values and failed reads
retain the initial preference (System at the root). A selection updates the
current session immediately and queues its write with the existing header/motion
writes. A failed write leaves the session usable; the next launch reads the last
successfully stored value. The root waits for appearance before mounting its
launch overlay, whose first native layout then hides the native splash. Retain
language/header/session readiness in the exit condition.

Explicit Host/component scheme overrides keep their existing precedence. System
resumes live native appearance after a fixed choice. Language restores
through the existing provider; French, English and Arabic use dictionary autonyms
and Arabic changes live RTL without remounting forms.

HeaderMotionPicker offers Dunes, Ribbon and Rain. The root provider's
`persistHeaderMotion` also opts into saving the Reduce Motion boolean. Header
motion uses `appHeaderMotion`; reduction uses `appReducedMotion`. Restoration
joins launch readiness, validates stored values and defaults removed effects to
Dunes. Writes are serialized. Persistence flags default to false; local Storybook
and Text preview providers remain in memory and must not write app preferences.

Settings has a labeled native `Switch` with selector `app-settings-reduce-motion`.
On freezes custom header, Lottie, skeleton and OTP artwork and
disables stack motion; Off enables custom animation. Until explicitly selected,
the system setting is observed live. `useAppReducedMotion` and `useMotionEnabled`
are the shared readers; activity/visibility checks remain in force. Root config
aligns Reanimated with this preference. The two-second launch hold is retained
even when reduction skips the slide.

Settings contains real Account/sign-in navigation, appearance, language, showcase
navigation and app version. Placeholder notification/account/legal rows are gone.
The FieldGroup component showcase may still demonstrate local draft controls.

Native `Components/Page Header` Settings compositions cover both appearances;
`Components/Launch Screen` covers reduced motion. Floating actions are static
native circles and do not depend on the motion preference.
`Components/Text/ThemeComparison` and `/ui-component/text` compare both palettes
locally. The latter's `demo-text-theme-picker` and `demo-text-color-scheme` change
only that preview and preserve its action count. They never change the root
brand or saved appearance. Native restart, failed-storage recovery, live System
changes, override propagation and first reveal still need device verification;
registration and exports do not establish those behaviors.
See [theme ownership](../../../docs/appearance-themes.md) and the
[implementation pattern](../foodiya-implementation/SKILL.md). Verify live settings,
sheet hit-testing, RTL and saved motion on both native platforms.
