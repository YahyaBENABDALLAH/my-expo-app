# App Settings and appearance themes

Open **More → App Settings** (`/settings`) to choose WhatsApp, Facebook,
Instagram, TikTok or **UX Template** and choose **System**, **Light Mode** or **Dark Mode** under
**Color mode**. System is the default: it follows device appearance and updates
while the app is running, including scheduled OS changes. Manual modes stay fixed
until another option is selected; choosing System resumes automatic detection.
Appearance also has a
language row that opens a native bottom sheet with French, English and Arabic.
The settings viewport and FieldGroup reveal the owning scene's opaque theme background;
settings language and profile preference sheets use the app `background` token.
Account, social notifications, account notifications and about sections follow
the grouped reference layout; their unfinished options are visible placeholders.
The settings route
shares the authenticated/development-guest guard with the app's other pages.

Login also offers the same System/Light Mode/Dark Mode native picker at the top
right and a language icon at the top left. These controls are fixed above the
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

| Theme       | Source                              | Identity                                            |
| ----------- | ----------------------------------- | --------------------------------------------------- |
| WhatsApp    | `src/constants/themes/whatsapp.ts`  | Green and teal                                      |
| Facebook    | `src/constants/themes/facebook.ts`  | Blue and cool neutral surfaces                      |
| Instagram   | `src/constants/themes/instagram.ts` | Pink, purple and warm accents                       |
| TikTok      | `src/constants/themes/tiktok.ts`    | Cyan, pink and dark neutral surfaces                |
| UX Template | `src/constants/themes/ux.ts`        | Neutral wireframe with restrained semantic feedback |

These are brand-inspired project themes. `tokens.ts` defines the common semantic
contract and derives navigation, switch and native control roles. Foregrounds for
primary, secondary and feedback fills are explicit; light themes use darker
interaction tints where a bright brand color would be hard to read on white.

UX Template keeps the existing `ux` ID and uses `#000000` primary fills with
`#FFFFFF` labels in both appearances. Foundations and ordinary actions use only
black, white or neutral gray. Danger uses brick red, success uses forest green
and warning uses amber, with softer accents in dark mode and matching containers.
Info stays neutral. Light surfaces use white/light gray;
dark surfaces use dark gray with a white tint for readable links. The primary
fill stays black in dark mode. `createColorTokens` derives roles from explicit
feedback colors. Text/action foreground pairs meet the existing 4.5:1 token
contrast checks. Aurora is flat with its animation paused. Selection follows the
same session-only preferences as the brands.

Runtime components use `useThemeColors(scheme)` or `useAppTheme()`.
`UniversalHost` passes an explicit native scheme and active tint; descendants
use `useHostColorScheme()` before selecting colors. Explicit component schemes,
button/field palettes and Host seeds remain supported. `colors.ts`, `authColors`
and static navigation themes retain WhatsApp defaults for deterministic fixtures.
Navigation and Skia artwork select the active palette at runtime. Map tiles and
illustrative flame artwork keep their own rendering.

Native controls inherit Host appearance and tint and retain native shape,
interaction feedback and accessibility. Android Host derives a Material
`SchemeTonalSpot` palette from its seed, so native shades can differ from the
explicit app tokens. UX buttons use explicit semantic pairs even without caller
overrides, keeping primary fills black with white labels in both appearances.
Other standalone controls and system UI keep their defaults;
photos, maps and illustrative artwork keep their own rendering.

## Verification

The UX danger/success/warning refinement was manually inspected in the Theme
Tokens light/dark fixtures on iOS 27 / iPhone 18 Pro. Status fills and labels
were visible alongside the black primary action. Token checks cover 4.5:1
contrast on filled actions, page surfaces and matching feedback containers;
199 layout/adapter tests pass. Native Android color inspection remains pending.

`Pages/App Settings` renders the production settings screen in System, light, dark
and RTL fixtures. `Expo UI/Theme Tokens` displays semantic buttons, native controls
and 13 core semantic color roles in light/dark fixtures. Both default to UX Template;
all native stories now share themeId and colorScheme Controls through one isolated
preview provider. See [native Storybook](../.rnstorybook/README.md). JS fixture tests exercise live changes,
draft preservation, preferences across pages, safe-area ownership and text/action
contrast. The Maestro `pages/app-settings.yaml` flow checks theme selection,
including UX Template retained across navigation,
mode changes (including returning to System), language sheet selection/dismissal and preferences retained after leaving and reopening settings.
JS tests cover live device changes, manual overrides, returning to System and
the light fallback when native appearance is unavailable. Native OS appearance
changes, menu appearance, focus, touch targets and cutouts still require
iOS/Android device verification.

Selectors: `page-action-app-settings`, `app-settings-appearance`,
`app-settings-color-scheme-picker`, `app-settings-theme-picker`, `app-settings-language`,
`app-settings-language-sheet`, `app-settings-language-fr`, `app-settings-language-en`,
`app-settings-language-ar`.
