# App Settings and appearance themes

Open **More → App Settings** (`/settings`) to choose WhatsApp, Facebook,
Instagram or TikTok and switch between light and dark mode. Appearance also has a
language row that opens a native bottom sheet with French, English and Arabic.
The settings viewport and FieldGroup reveal the shared app Aurora background;
settings language and profile preference sheets use the app `background` token.
Account, social notifications, account notifications and about sections follow
the grouped reference layout; their unfinished options are visible placeholders.
The settings route
shares the authenticated/development-guest guard with the app's other pages.

Login also offers a sun/moon button at the top right for light/dark mode and a
language icon at the top left. These compact controls are fixed above the
scrolling form; they use the same providers and preserve drafts. The language
sheet follows the app direction while the top bar keeps its physical positions.

The shared RTL/LTR, language and theme footer has been removed from all page
shells, including authentication, error recovery, maps, Skia and Storybook.
`PageFrame` owns the header's top safe area; its content retains the bottom and
side insets. Native scroll pages handle those remaining edges, and tabs leave
the bottom edge to the tab bar. Language selection remains in More's profile
preferences and App Settings, where Arabic also selects RTL automatically.

The UI showcase at `/ui` lists separate component pages at
`/ui-component/[name]`: Switch, Buttons, Text input, Checkbox, Slider, Picker,
Segmented control, Collapsible, List rows and Theme tokens. Each demo lives in its
own feature module. The tokens page lists every role
for the currently selected brand and appearance.

`ThemePreferencesProvider` stores the selected brand and appearance for the
current app session, alongside `LayoutDirectionProvider`. It initially follows
device appearance and defaults to WhatsApp. App Settings updates these providers
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

`Pages/App Settings` renders the production settings screen in light, dark, RTL
and brand fixtures. `Expo UI/Theme Tokens` has all eight brand/appearance combinations and
displays every role plus native controls. JS fixture tests exercise live changes,
draft preservation, preferences across pages, safe-area ownership and text/action
contrast. The Maestro `pages/app-settings.yaml` flow checks theme selection,
mode changes, language sheet selection/dismissal and preferences retained after leaving and reopening settings.
Native menu appearance, focus, switch touch targets and cutouts still require
iOS/Android device verification.

Selectors: `page-action-app-settings`, `app-settings-appearance`,
`app-settings-color-scheme-switch`, `app-settings-theme-picker`, `app-settings-language`,
`app-settings-language-sheet`, `app-settings-language-fr`, `app-settings-language-en`,
`app-settings-language-ar`.
