# App Settings and appearance

The selected brand's `presentation.palette` chooses UX Template (`ux`) or
Instagram (`instagram`), each in light and dark appearance. Both current brand
manifests select `ux`. Palette colors and semantic tokens stay in
`src/constants/themes/`; Instagram's palette is bundled static JSON. Register new
palettes in that registry and the config resolver's supported palette IDs, then
select the ID in the brand manifest. See [brand setup](development.md#brand-and-environment-configuration).

Settings offers system/light/dark appearance, header effect, Reduce Motion,
language, Account/sign-in navigation, the component catalog and app version.
Placeholder account, notification, support and legal controls have been removed.

Settings owns its [header-effect picker](../src/features/settings/header-motion-picker.tsx). The
shared [color-scheme control](../src/components/ui/appearance/color-scheme-control.tsx)
serves Settings and login.

The configured root palette stays fixed. A user chooses appearance, not another
client's identity or demo palette. The Text showcase at `/ui-component/text` has
an isolated [theme picker](../src/features/ui-showcase/theme-picker.tsx) and
appearance control; these changes stay in memory and leave saved app preferences
untouched. Leaving and reopening that page starts from the app's current choices.
The color-sample area has its own explicit-scheme Host after the RN bridge;
page chrome and the other text examples keep the app appearance. The retained
native Storybook controls also operate on isolated providers.

## Saved appearance

The app root opts into `persistAppearance` on the existing theme provider. It
restores `appColorScheme` as `system`, `light` or `dark`. System is the default;
it follows live device appearance. Fixed Light/Dark choices last until the user
selects another option, including across app restarts after a successful save.
Selecting System again clears the app's fixed native appearance override.

Missing/invalid saved values and read failures keep the initial System choice.
Selections update the current session immediately; writes are serialized with
the existing header/motion writes. If saving fails, the session keeps its new
appearance and the next launch reads the last successfully saved value. Pickers
and callbacks wait for restoration, preventing a late read from replacing a new
selection. A remounted root reads after earlier queued writes have finished.

The root waits for appearance restoration before mounting its custom launch
overlay. That overlay's first native layout hides the native splash; language,
header/motion, session resolution and the initial page frame's native layout
govern its exit. This gates the first
app presentation; the OS's initial native splash appearance remains native.
Explicit component and Host scheme overrides retain their existing priority.

Language uses its existing saved provider. Header effect and the explicit motion
choice still restore before launch completion. Header choices include Default,
Dunes, Ribbon and Rain; unsupported saved values retain the manifest's initial
style (currently Dunes). Default avoids mounting the wave/canvas/mask while
retaining the rectangular native header. Existing animated choices and saved
values are preserved. Persistence remains opt-in; preview providers use neither
storage flag. The palette itself is never saved as a user preference.

The [launch contract](../.agents/skills/foodiya-ui-launch-screen/SKILL.md) defines
minimal/branded presentation, optional-font fallback, foreground timing and the
separate successful `app-ready` and failed-restoration `app-recovery` selectors.
Recovery skips the branding delay. Source checks do not establish native startup
timing or frame rates.

## Text foregrounds and verification

Primary text uses the foreground accent `tint`. Filled primary buttons still use
`primary`/`onPrimary`; the UX palette intentionally keeps a black fill and white
label in both appearances. An explicit appearance color overrides a text tone,
and final `textStyle.color` overrides both.

The 2026-10-23 palette audit calculated contrast for all eight text tones against
`background`, `surface` and `surfaceRaised`. Minimum ratios across those 24 pairs:

| Palette     | Light  | Dark   |
| ----------- | ------ | ------ |
| UX Template | 4.93:1 | 6.83:1 |
| Instagram   | 4.56:1 | 4.76:1 |

The UX dark primary-text/background pair changes from 1.11:1 to 18.88:1; its
primary button pair remains 21:1. These calculations use the explicit opaque
palette values and the [W3C contrast formula](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
They do not establish rendered contrast on native glass, arbitrary caller colors,
feedback containers or artwork. No palette colors were changed for this repair.

The Text page and retained `Components/Text/ThemeComparison` composition show all
three surfaces, both palettes/appearances, explicit overrides and a counted
primary button. Existing text selectors remain; new preview controls and samples
have stable selectors. No automated suite was added.

On both native platforms, check saved Light/Dark after restart, live System
changes, invalid/unavailable storage fallback, rapid appearance changes, first
reveal, local preview isolation and unchanged action counts. These device checks
remain pending; static checks and Hermes exports do not verify them.

The canonical control and persistence contract lives in the
[appearance skill](../.agents/skills/foodiya-ui-appearance/SKILL.md).
Native styles, hit areas, contrast, RTL, large text and live preference changes
still require device verification. Earlier brand/theme reports describe history.
