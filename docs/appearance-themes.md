# Page footers and appearance themes

The bottom of every page's content contains an RTL switch (off = LTR), a Dark
switch (off = light), and a native theme picker for WhatsApp, Facebook, Instagram
and TikTok. Titles and back actions stay at the top.

`PageAppearanceControls` is appended after all content and actions inside the
existing native scroll view in `PageScreen`, `AuthScreenFrame` and screen error
recovery. It scrolls with the page; it is never pinned above that content. Map,
Skia, Storybook and session recovery use `PageFrame` to append a native footer
below their main view. Its footer consumes the unowned bottom safe area; tabs
leave that edge to the tab bar. There is no global preference toolbar.

The UI showcase at `/ui` lists separate component pages at
`/ui-component/[name]`: Switch, Buttons, Text input, Checkbox, Slider, Picker,
Segmented control, Collapsible, List rows and Theme tokens. Each demo lives in its
own feature module and uses the same appearance footer. The tokens page lists every role
for the currently selected brand and appearance.

`ThemePreferencesProvider` stores the selected brand and appearance for the
current app session, alongside `LayoutDirectionProvider`. It initially follows
device appearance and defaults to WhatsApp. Page controls update these providers
without replacing navigation, forms, query caches or open sheets. Settings
survive navigation; restarting the app restores the defaults.

## Token sources

Each brand has its own complete light/dark palette:

| Theme     | Source                              | Identity                             |
| --------- | ----------------------------------- | ------------------------------------ |
| WhatsApp  | `src/constants/themes/whatsapp.ts`  | Green and teal                       |
| Facebook  | `src/constants/themes/facebook.ts`  | Blue and cool neutral surfaces       |
| Instagram | `src/constants/themes/instagram.ts` | Pink, purple and warm accents        |
| TikTok    | `src/constants/themes/tiktok.ts`    | Cyan, pink and dark neutral surfaces |

These are brand-inspired project themes. `tokens.ts` defines the common semantic
contract and derives navigation, switch and native control roles. Foregrounds for
primary, secondary and feedback fills are explicit; light themes use darker
interaction tints where a bright brand color would be hard to read on white.

Runtime components use `useThemeColors(scheme)` or `useAppTheme()`.
`UniversalHost` passes an explicit native scheme and active tint; descendants
use `useHostColorScheme()` before selecting colors. Explicit component schemes,
button/field palettes and Host seeds remain supported. `colors.ts`, `authColors`
and static navigation themes retain WhatsApp defaults for deterministic fixtures.
Navigation and Skia artwork select the active palette at runtime. Map tiles and
illustrative flame artwork keep their own rendering.

SwiftUI owns switch off-track/thumb/disabled styling; its active tint uses the
switch token. Compose maps all switch states explicitly. Both keep native shape,
interaction feedback and accessibility. Native picker adapters consume the
active control tokens.

## Verification

`Pages/Appearance footer` has light, dark, RTL and brand fixtures with an editable
draft. `Expo UI/Theme Tokens` has all eight brand/appearance combinations and
displays every role plus native controls. JS fixture tests exercise live changes,
draft preservation, preferences across pages, safe-area ownership and text/action
contrast. The Maestro appearance-footer flow checks controls and navigation.
Native menu appearance, focus, switch touch targets and cutouts still require
iOS/Android device verification.

Selectors: `page-appearance-footer`, `page-layout-direction-switch`,
`page-color-scheme-switch`, `page-theme-picker`.
