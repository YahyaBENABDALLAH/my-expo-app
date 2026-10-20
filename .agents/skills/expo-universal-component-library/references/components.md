# Universal component catalog

## Android floating-action repair (2026-10-19)

The Android button now passes `Shape.Circle({ radius: 1 })`. The installed native
ShapeRecord defaults its radius to zero, clipping the icon and hit shape down to
the center even though accessibility reports a full-size button. The existing
76-point control, Box/ZStack artwork composition, 28-point symbols, native styles,
labels and disabled behavior remain. `ReferenceTabBar` enables motion on Android
as well as iOS while focused; app activity, reduced motion, disabled and Static
guards remain.

Repeated-action follow-up: `ReferenceTabBar` no longer drops activations inside a
shared 800 ms window. Each native press reaches its current action; recipe
publishing retains its own submitting/pending guard. The JS fixture now exercises
the real action provider, registration and dispatcher with time held constant,
including rapid taps, tab changes and changing Continue/Submit callbacks. The
floating-action story also registers a production Storybook-tab action and shows
a separate counter. Its Maestro flow repeats production taps 100 ms apart and
checks disabled suppression and re-enabling.

`Components/FloatingAction/Interaction` in
`.rnstorybook/stories/components/floating-action.stories.tsx` replaces the deleted
page stories for this component. Controls expose theme, all seven action kinds,
disabled and animated states; local toggles and a press count exercise the actual
navigation composition. `.maestro/components/floating-action.yaml` checks upper
and lower action edges, disabled suppression, icon changes, static-mode activation
and destination selection. `tests/components/floating-action.test.mjs` checks
focus-driven animation and keyboard visibility on both platforms. Device execution
and remaining native limitations are recorded in `docs/navbar-wave-verification.md`.

## Current Storybook and test scope

The catalog intentionally contains only **Components** and **Forms**. Use Controls for theme, appearance, disabled states and minor prop variations. The current scope is in [Storybook](../../../../.rnstorybook/README.md); JS suites are in [tests](../../../../tests/README.md). Full-page, onboarding, recipe showcase, motion and theme-token demos were removed. Dated entries below record historical implementation details and may reference retired fixtures; they are not a requirement to restore those stories or test suites.

## Two input APIs (2026-10-19)

`TextInput` accepts ordinary string `value`/`onChangeText` props and owns the
native observable plus external reset synchronization. `FormTextInput` binds
React Hook Form to that same component, adding validation/password behavior.
Both compose inside the existing Host; standalone story previews supply a Host.
`NativeField` and the UniversalTextInput/Content exports were removed and all
callers migrated. Existing theme roles, native geometry, refs, focus guards and
password behavior remain. `text-input.stories.tsx` now exercises controlled strings
with external update/reset, and its Maestro flow targets `Controlled`. Portable
checks cover reset/value/field retention and existing auth/recipe integrations;
native keyboard, selection and visual behavior require device verification.
See the [input guide](../../../../src/components/ui/text-input/README.md).

## Universal FieldGroup (2026-10-19)

FieldGroup now directly re-exports `@expo/ui` on both platforms. The iOS adapter
and its row/background/scroll-indicator overrides are removed. The existing
Section/Header/Footer API and bounded Host composition remain. Native themes
own the form surfaces and row colors. Existing Field Group stories cover
preferences, custom headers, disabled controls and light/dark appearance;
layout checks cover slots and shared Metro resolution. Native appearance needs
device verification after this change.

## Button renderer simplification (2026-10-19)

Standalone and hosted buttons resolve their existing native/UX color policy once
and share the platform renderer. The public API, native geometry, glass fallback,
disabled guards and semantic token roles remain unchanged. The internal renderer
is excluded from the public UI barrel. The existing button stories now expose
padding and color controls and preserve partial caller overrides. SDK 57's root
Button still lacks the native color, padding, shape and destructive-role props
needed here, so the platform adapters remain. See the
[button guide](../../../../src/components/ui/button/README.md) for supported props
and verification limits.

## Native sheet height and geometry merge (2026-10-19)

The stash-conflict resolution preserves the current minimal native BottomSheet
and button APIs, including glass, UX colors and standalone corner shapes. It does
not restore the obsolete sheet width context or RN/Host measurement bridge.
Optional `BottomSheet.contentHeight` bounds a caller's known viewport in a native
Column before presentation; Home shares its existing `min(420, screenHeight * 0.6)`
value with the inner ScrollView. Outer sheet height and detents remain native.
The sheet uses the owning Host's theme `surface` for `containerColor` and `text`
for Android's `contentColor`. This colors the full native sheet, including its
safe-area background, with no extra wrapper, public prop or dependency.
The bottom-sheet `Light` and `Dark` stories preview the selected theme colors.
`FixedContentHeight` covers this in the bottom-sheet stories. `GeometryLight` and
`GeometryDark` retain native/default, rounded, square and disabled button checks.
Portable checks verify independent radius/padding overrides and first-render
height through reopen/resize. Device frame timing must be checked separately.

## Color UI theme (2026-10-15)

The stable `ux` theme is now labeled UI: blue primary, violet secondary, shared
colored success/warning/error/info roles, pale light surfaces and navy dark
surfaces. It uses createBrandTheme; the theme ID and public token contract stay
stable. Theme Tokens and App Settings preview it by default, with the other
brands available in Controls. Aurora uses the same chromatic palette/motion rules
as other themes. Token contrast and live scheme/theme retention remain covered
by page-appearance tests; shader tests check palette forwarding and canvas reuse.
Manual iOS checks confirmed green success and blue/violet navigation accents;
Android appearance remains a native verification task.

## Focused Storybook catalog (2026-10-15)

The current catalog has 190 stories across 38 component/page families. Keep
meaningful state and composition examples; use Controls for smaller prop, seed,
brand, width and theme variations. Older dated story lists below describe earlier
coverage and may include removed duplicate fixtures. Existing Maestro deep links
are checked by `tests/architecture/storybook-links.test.mjs`.

Buttons retain primary, secondary, link, success, warning, destructive and glass,
plus disabled, light appearance, rounded, both diagonal corner shapes and observable
interaction. Fixtures pass shared semantic tokens and paired foregrounds, resolved
for the selected theme and scheme. Standalone `UniversalButton.cornerRadii` accepts
physical topLeft/topRight/bottomLeft/bottomRight radii; omitted corners are square
and this overrides uniform borderRadius. Its existing RN Host clips the square
native surface because SwiftUI only exposes uniform native button rounding.
`UniversalButtonContent` keeps its existing uniform radius contract. No theme roles
or dependencies are added. See the [button guide](../../../../src/components/ui/button/README.md).
Manual iOS 27 / iPhone 18 Pro checks verified both diagonals and upper/lower edge
activation. Android geometry and automated Maestro execution remain pending.

Skeleton AnimationControls uses the existing standalone CSS pulse; ReferenceCard
keeps compound native content coverage. OTP feedback uses Reanimated CSS keyframes,
without an animation effect or JS timer, and retains motion lifecycle guards.
Portable tests cover hidden/reduced-motion feedback and native button forwarding;
they do not prove native animation timing or geometry.

## Adaptive auth frame (2026-10-15)

`AuthScreenFrame` owns one Host that fills the available width with safe
gutters, keyboard avoidance and a shared heading. Short forms center vertically
using the Host's available height and native minimum-height modifiers; long
content remains scrollable. `grouped` keeps registration in a single native
`FieldGroup` with no enclosing scroll view. Existing text/tint/muted roles apply.
`Expo UI/Auth Screen` adds `CompactViewport` and `GroupedForm` composition stories
alongside light/dark, validation, pending and helper-text fixtures. Manual checks
on the iPad Pro 13-inch / iPadOS 27 simulator verified centered Login and Register
scrolling to its submit and Login actions. Full software-keyboard, narrow-window
and Android checks remain pending; Node tests only verify contracts.

## Storybook runtime and dependency repair (2026-10-15)

Native Storybook and its on-device addons now use `10.7.0`, with core `10.6.2`.
Use `npm ci` and the npm lockfile/overrides; the stale Yarn Classic lockfile
installed incompatible Storybook UI packages and a duplicate safe-area module.
The installed dependency graph now shares the app's `react-native-safe-area-context`
`5.7.0`. Architecture tests guard shared native module resolution. Restart Metro
with `npm run storybook` after installing. The earlier duplicate-provider blocker
below is resolved. The Router seeds direct links before native listeners mount;
the custom canvas preserves native targets, safe areas and story-theme backgrounds.
The shared story frame supplies a measured, finite RN bridge width so native Host
labels and values do not collapse. Button interaction fixtures honor theme controls.
Manual iOS 27 checks cover startup, search, Actions/Controls, direct links, button
activation/disabled/reset, checkbox state and empty-input editing. Android native
interactions and the complete Maestro suite remain pending. See
[the native verification notes](../../../../docs/native-ui-tests.md).

## Text input simplification (2026-10-14)

`UniversalTextInput` and its content retain their universal props, labels,
helper/status roles, explicit palette/native color overrides and accessible icon
actions. Native hosting now supplies width immediately without onLayout state;
focus updates the shared border to the theme/palette tint and guards duplicate
notifications. Blur restores the border; validation colors and explicit style
overrides retain priority, and disabled fields keep their resting border. Default
typography/tint remain native, with shared text/surface/border/status colors. iOS secure/plain modes both
use plain field styling, no editable-text vertical padding and a 48-point minimum
surface matching the eye action. Native content can grow for larger fonts or
multiline input; caller dimensions/padding remain supported. Observable values,
refs, RTL slots and disabled actions remain intact.

The text-input stories add empty, disabled and light password visibility fixtures;
all visibility fixtures expose measured native layout status and toggle counts.
The measurement is development-only. The input icon Maestro flow asserts stable
height, visibility/value retention and disabled suppression. Portable tests cover
field/value retention, native overrides, focus guards, immediate mounting,
resizing and module resolution. Empty/filled registration toggles were manually
checked on the iOS 27 iPhone 18 Pro simulator with unchanged visible surface
height and retained filled values. Full Storybook/large-text execution is blocked
by its installed duplicate RNCSafeAreaProvider; Android native checks are pending.
See [the input guide](../../../../src/components/ui/text-input/README.md).

`Focused` and `FocusedLight` expose focus/blur actions and observable focus status.
`.maestro/storybook/text-input-focus.yaml` exercises autofocus, typing, blur and
refocus. Portable render checks verify border-color transitions and field retention
on both platform adapters; they do not establish native appearance.
Manual iOS 27 / iPhone 18 Pro registration checks confirmed the tinted focus
border, focus transfer and the blurred required field's validation border.
Android appearance and the Maestro focus flow remain pending.

## Native defaults follow-up (2026-10-14)

Universal controls now inherit `UniversalHost` appearance and theme tint. Switch,
Checkbox and Slider have small shared `.tsx` wrappers that guard disabled
callbacks; Expo owns their native color states, geometry and step behavior.
Collapsible and Android FieldGroup use direct Expo exports. FieldGroup's small
iOS adapter honors an explicit background, including transparent Settings forms;
native sections own slots, grouping and separators. List uses a shared wrapper
only to coordinate pending refreshes. ListItem retains its compound props and
only adds the Android selector missing upstream. Picker and SegmentedControl
retain the necessary platform selection APIs, disabled guards and selectors,
with native Host colors instead of per-state token painting.

iOS menu picker triggers select native `buttonStyle('glass')` on iOS 26+ and
automatic style on older systems. SwiftUI sliders, toggles, segmented pickers,
menus and sheets retain supported system glass appearance/interaction. Android
keeps Material controls. There is no custom glass layer on ordinary text,
forms, lists or layout. Text keeps shared text colors and explicit variants;
omitting font/variant props preserves native typography without a calculated
line height. TextInput retains the app's labels, status colors, focus guards,
observable value, password actions and RTL/resize behavior.

The existing native light/dark and interaction stories remain discoverable.
Checkbox, Switch, Slider, Picker, Collapsible, List and FieldGroup add
`NativeTheme` seed fixtures; Text adds `NativeDefault`; Theme Tokens documents
the native appearance. Portable tests check live theme state retention,
disabled suppression, slots, selectors, refresh coordination and native Metro
resolution. Native iOS/Android rendering, glass and touch behavior are pending.
See [control theme contract](../../../../docs/control-theme.md) for the current
inventory; older dated notes below describe historical implementation.

2026-10-11 header/navigation spacing follow-up: `PageHeader` keeps its existing
props, title layout and title/text tokens. iOS vertical padding is 4 points;
Android remains 8. `PageFrame` applies the status-bar inset once and the header
Host ignores automatic safe areas. `ReferenceNavigationBar` retains its existing
props and theme roles, adds 20-point rounded top corners to the dock/glass/tab
feedback, and reserves only the 56-point dock plus the actual bottom inset.
`Pages/Navigation shell` / `NotchedPhone`, `HeaderWithBackArrow`,
and `DarkHeaderWithBackArrow`, together with
`Pages/Reference navigation` / `SafeArea` and `PageOverlap`, cover the compositions.
Native safe-area spacing, glass clipping and corner
taps still require iOS/Android device inspection.

`PageFrame` supports `headerOverlay` for full-height specialized content beneath a
transparent, safe-area-protected title. Cartes uses it while retaining the root
animated wave and native map control insets. Title-only overlays pass touches to
the content. `Pages/Navigation shell` / `TransparentHeader` covers a simulated notch;
native map gestures and layering still require device verification. Existing
surface/text theme roles are unchanged.

2026-10-11 duplication cleanup: Facebook, Instagram and TikTok color data lives
in `src/constants/themes/brand-palettes.json`. The existing theme exports use
the typed `createBrandTheme` factory to combine feedback defaults and derived
roles once. All 544 resolved token values across the four themes and eight
appearances matched the pre-refactor baseline. No component props, semantic
roles or native theme mappings change. Theme and App Settings stories remain
applicable, with selection/appearance regression checks in
`tests/layout/page-appearance.test.mjs`; native rendering remains a device check.

2026-10-11 MEDIUM-impact SonarQube maintenance: native button types/styles, form
message selectors, Host sizing, auth font fallback and page wave opacity use
separate decisions with the same public props and theme roles. The stepper's
private `renderArtwork(width)` contract explicitly identifies its render callback;
native geometry, motion guards and accessible labels remain covered by the existing
RecipeStepper stories and geometry/render tests. Existing Button, AuthScreen,
PageScreen and Theme compositions remain applicable. LoadingState and TextInput
use `ErrorState` exports, and TextInput uses `Numeric`; display names are unchanged,
story IDs follow the new exports, and the loading Maestro selector is updated.
Storybook safe-area values retain identity until their content edges change.
Native geometry, focus, keyboard and accessibility still require device checks.

2026-10-11 geometry follow-up: the input RN bridge, both bottom sheets and both
stepper layout adapters share a guarded width hook. Duplicate/invalid reports
skip React setters; real widths still update. Aurora resolution uses only actual
layout through a shared value and no window subscription. The page/splash wave
reuses two immutable parsed paths. Existing input/sheet/stepper/page-motion/Aurora
composition stories remain applicable; JS geometry tests cover duplicate reports,
real resizing, shader writes and path reuse. Native first paint, live geometry and
frame timing remain unverified. Home card composition caches translated examples
and collections by actual width; its existing horizontal/vertical stories cover
preview, resizing and locale changes. See the layout follow-up in the
[render audit](../../../../docs/render-performance-audit.md#layout-calculation-follow-up).

2026-10-11 render review: the compact `RecipeCard` now has default React memoization
and `.rnstorybook/stories/pages/recipe-card.stories.tsx` covering light/dark,
embedded/missing images, long titles, unrelated parent updates and changed likes.
Its `recipe` prop accepts `RecipeCardData`; it inherits Host/theme/language and
requires `onPress(recipeUuid)`. Recipe screens pass their stable feature navigation
action; the Storybook callback increments a visible count and logs the UUID without
leaving the fixture. Keep both data and callback stable for memoization. It shares
existing surface/text tokens and adds no theme roles. Activation/current-callback
checks accompany the render tests; `.maestro/storybook/recipe-card.yaml` covers
native presses when a device is available.
`RecipeStepper` uses default memo comparison for current/validity/animation/theme
props while retaining its native geometry and shared-value motion. Its existing
step/validity/static/light/dark composition stories remain applicable.
`PageFrame` preserves adjusted safe-area context identity until content edges
change, and auth button palettes remain stable until semantic colors change.
`tests/layout/render-stability.test.mjs` checks skipped unchanged render work and
real data/theme/locale/inset updates; native layout, press handling and frame
timing remain unverified in this pass. See
[render audit](../../../../docs/render-performance-audit.md).

2026-10-10 product cleanup: local recipe card fixtures and control examples are
colocated under `src/features/ui-showcase/` and reachable through Recipe UI examples.
LaunchScreen's Ready/Waiting stories use one animation: a two-second delay after
readiness, then a two-second upward slide. Reduced motion completes immediately.
Root fixtures verify readiness gates; native rendering and timing require device checks.

SDK/package versions refreshed 2026-10-10: Expo `~57.0.27` and installed `@expo/ui` `57.0.21` (exact manifest pin). Expo UI `57.0.22` crashes on Android numeric widths; the pin and scoped dependency-validation exclusion are documented in `docs/build-verification.md`. The component inventory uses [SDK 57 universal documentation](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/); resolve actual installed versions before future edits. Packages are installed without project patches.

Authoritative local export inventory: `node_modules/@expo/ui/src/universal/index.ts`. Read component `types.ts` and native implementations alongside the linked API page. This catalog records availability and proposed verification, not proof that all behavior has passed.

## All 19 components

App Settings (`/settings`) uses the existing `ThemePicker` and
`ColorSchemeControl` wrappers with `app-settings-theme-picker` and
`app-settings-color-scheme-switch` selectors. `Pages/App Settings` covers light,
dark, RTL and all brands. `tests/layout/page-appearance.test.mjs` checks live
preference changes, draft retention, navigation retention and footer removal
across page/auth/error/specialized shells. The native flow is
`.maestro/pages/app-settings.yaml`; menu layout and switch hit areas remain
unverified without a connected device. Controls inherit native Host palette
roles. Language remains in profile preferences; manual direction is a Storybook
preview control. `PageAppearanceControls` and `PageAppearanceFooter` are removed.

Application wrapper names below refer to `src/components/ui/`. The hosted showcase
wrappers for Checkbox, Collapsible, Column, FieldGroup, Icon, List,
Picker, ScrollView, Slider and Switch live in `.rnstorybook/components/showcase/`;
they have no application consumers. The public `@components/ui` API combines
the application adapters below with direct Expo UI layout/icon exports.
Story names refer to `.rnstorybook/stories/expo-ui/`.
Existing stories are recorded without implying full behavioral coverage.

`OtpBottomSheet` composes the native [BottomSheet](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/bottomsheet/) and [TextInput](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/textinput/) with six visible digit slots. Its public props control presentation, recipient, verification/resend callbacks, cooldown, helper copy, theme and selector prefix. Platform overlay stacks keep a single transparent native input above the slots; an explicit-width direction bridge keeps digits LTR in Arabic. Slots use equal measured widths, explicit font-scale-aware heights and inset rounded fills; the iOS input uses plain field styling. A finite scroll viewport (70% of window height, at most 620 points/dp) prevents unbounded Compose measurement; its iOS frame preserves that height. Shared text/surface/tint/selection/border and success/error roles style the form. A fixed-size Reanimated boundary animates only the native shield and respects reduced motion. `otp-bottom-sheet.stories.tsx` covers both themes, cooldown, request failures and a long recipient using isolated English copy; `.maestro/storybook/otp-bottom-sheet.yaml` covers opening/dismissal, rejection, backspace, success, incomplete input, resend and reopening. Portable checks cover paste/numeric scripts, finite viewport sizing and the installed iOS style translation for narrow rows and larger text. Native keyboard/autofill, accessibility, hit areas, large fonts and constrained geometry remain unverified without devices. See [component guide](../../../../src/components/ui/otp-bottom-sheet/README.md).

OTP measures its own native input section. The shared sheet adds no measurement,
width context or padding, uses the shared surface/text colors and hides the iOS drag indicator. Reopening resets
form state without a forced keyed remount. Resend countdown state is isolated
to its button and its timer stops at expiry or dismissal; hidden feedback does
not allocate animation hooks. The existing OTP stories and Maestro flow cover
this composition. Portable checks assert input readiness before measurement,
width corrections without losing input state, and unchanged form render counts
during countdown ticks. Release-build latency and frame rate still require
native performance measurement.

Each component family has a folder and README. Keep its implementation,
platform adapters, types and private helpers together. The root public barrel
retains existing imports; implementations import concrete files directly.
See the [folder guide](../../../../src/components/ui/README.md).

| Component / official SDK 57 API                                                     | Local wrapper                                                                           | Existing story                                      | Scenarios to document and verify                                                                                     |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [Host](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/)               | `host/universal-host.tsx`                                                               | Used by stories; dedicated coverage pending         | Light/dark, seed color, intrinsic versus constrained sizing, direction, nested content visibility                    |
| [Column](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/column/)           | Direct Expo UI export; Storybook showcase                                               | `column.stories.tsx`                                | Spacing/alignment, long text, nested rows, narrow screens                                                            |
| [Row](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/row/)                 | Direct Expo UI export                                                                   | Dedicated coverage pending                          | Alignment/spacing, RTL, fitting text and controls without clipping                                                   |
| [Text](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/text/)               | `text/universal-text.tsx`                                                               | `text.stories.tsx`                                  | Theme roles, long content, font scaling, supported typography                                                        |
| [Button](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/button/)           | `button/universal-button.tsx`, `button/universal-button-content.<platform>.tsx`         | `button.stories.tsx`                                | Required intent variants, disabled suppresses actions, one press produces one action, full visible surface responds  |
| [ScrollView](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/scrollview/)   | Direct Expo UI export; `refreshable-scroll-view/refreshable-scroll-view.<platform>.tsx` | `scroll-view.stories.tsx`; Pages/Navigation shell   | Scrolling, keyboard, short/tall content; refresh completion, repeated gestures, errors and recovery                  |
| [Switch](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/switch/)           | `switch/switch.tsx`                                                                     | `switch.stories.tsx`                                | On/off, disabled, callback updates visible state, reset                                                              |
| [Slider](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/slider/)           | `slider/slider.tsx`                                                                     | `slider.stories.tsx`; NativeTheme                   | Minimum/maximum, step, disabled, value updates, drag interaction; native Host seed and glass feedback when supported |
| [Checkbox](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/checkbox/)       | `checkbox/checkbox.tsx`                                                                 | `checkbox.stories.tsx`                              | Checked/unchecked, disabled, state change and reset                                                                  |
| [BottomSheet](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/bottomsheet/) | `bottom-sheet/bottom-sheet.tsx`                                                         | `bottom-sheet.stories.tsx`                          | Native defaults, hidden iOS handle, light/dark appearance, open/close, dismissal, reopen, tall content               |
| [Collapsible](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/collapsible/) | `collapsible/collapsible.tsx`                                                           | `collapsible.stories.tsx`                           | Expand/collapse reveals and hides content, long header/content                                                       |
| [FieldGroup](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/fieldgroup/)   | Direct Expo UI export via `field-group/field-group.tsx`                                 | `field-group.stories.tsx`                           | Labels/supporting text, grouped fields, empty/error composition, keyboard                                            |
| [Icon](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/icon/)               | Direct Expo UI export; Storybook showcase                                               | `icon.stories.tsx`                                  | Valid symbols on both platforms, size/tint, meaning conveyed by adjacent text                                        |
| [List](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/list/)               | `list/list.tsx`                                                                         | `list.stories.tsx`                                  | Empty/short groups, row selection, refresh if exposed, scroll behavior                                               |
| [ListItem](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/list/)           | `list-item/list-item.tsx`; direct `UniversalListItem` alias                             | Within `list.stories.tsx`; focused coverage pending | Leading/supporting/trailing slots, press/disabled, long text, accessory alignment                                    |
| [Picker](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/picker/)           | `picker/picker.<platform>.tsx`                                                          | `picker.stories.tsx`                                | Menu/wheel differences, selected value, disabled, value callback, long option labels                                 |
| [RNHostView](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/rnhostview/)   | Direct Expo UI export                                                                   | Shared story frame composition                      | Necessary RN infrastructure inside native trees, intrinsic sizing and interaction; no substitute RN controls         |
| [Spacer](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/spacer/)           | Direct Expo UI export                                                                   | `spacer.stories.tsx`                                | Horizontal/vertical expansion in constrained layouts                                                                 |
| [TextInput](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/textinput/)     | `text-input/text-input.tsx`; `form/form-text-input.tsx`                                 | `text-input.stories.tsx`; `auth-screen.stories.tsx` | String editing/reset, form validation, password, editable/read-only, focus/blur, keyboard, multiline                 |

## Compound exports and helpers

`OnboardingPage` (`onboarding/onboarding-page.tsx`) renders one persistent
introduction screen with a native content carousel. It accepts ordered `pages`
(id, photo, category/title/description), `initialStep`, completion/skip callbacks,
saving/error state, and an optional scheme. Fixed header/footer Hosts retain the
wordmark, progress and actions. SwiftUI TabView (iOS 16.4+) and Compose
HorizontalPager slide only the middle content, inherit Host RTL, and honor reduced
motion for programmatic changes. Each slide scrolls vertically for large text.
Android hardware Back selects the previous slide. Shared background, text, muted,
border and tint roles supply colors. `Pages/Onboarding` covers all three slides,
light/dark, saving, failure and completion/replay. JS checks cover persistent
screen/Host/pager identity, swipe selection, disabled input, Android Back and
persistence recovery. The first-launch Maestro flow covers native paging and
completion. iPhone 18 Pro / iOS 27 verification covered French/light, all slides,
fixed chrome, Previous/Next (both primary-button vertical edges), readable final
copy and completion returning to sign-in. Desktop gesture automation could not
confirm native swiping. Android, RTL, dark mode and enlarged text remain unverified
on device. Storybook has a duplicate RNCSafeAreaProvider registration error; the
production first-launch route was used for these iOS checks.

### Settings and OTP layouts (2026-10-12)

`FieldGroup` keeps its Section/Header/Footer API and now connects Android rows
with rounded outer corners and thin `divider` separators. It retains Host theme
roles (`background`, `controlSurface`, `text`, `muted`, `divider`) and native iOS
Form grouping. `Pages/App Settings` exercises the production groups in light,
dark, RTL and brand fixtures, with isolated language choices. `ColorSchemeControl`
uses the native menu Picker for System, Light Mode and Dark Mode, with the stored
preference as its selected value. System is the app default and follows live
device changes; explicit modes override it until System is selected again.
The control inherits Host tint and appearance, adding no color tokens or native
geometry. `Pages/App Settings/System` exercises automatic appearance; JS fixtures
cover live changes, manual overrides, restoring System and draft preservation.
The Maestro settings flow covers all three choices and reopening; native OS
theme changes and picker geometry still require device verification.
Language opens a native sheet. Other sections are
placeholders. The settings viewport and FieldGroup reveal the shared app Aurora
background; settings language and profile preference sheets use the app
`background` token. The settings stories render the same static Aurora backdrop
within their theme fixture. `tests/layout/page-appearance.test.mjs` checks readiness, selection,
dismissal, direction and disabled notification switches alongside existing theme
checks. `.maestro/pages/app-settings.yaml` covers native selection and reopening.

`OtpBottomSheet` retains its controlled presentation, recipient, verify/resend
callbacks, cooldown, hint, scheme and selector props. Its heading follows the
locale's leading edge, and neutral rounded digit boxes have a text-colored focus
outline. It uses the shared sheet's `surface`, `surfaceVariant`, `text`, `muted`, `border` and
feedback tokens, plus the unchanged shared buttons. The existing OTP stories now
include a masked-recipient dark fixture with a resend countdown. Portable checks
cover verification, failures, resend, stale requests, normalization and sizing;
the existing OTP Maestro flow covers entry and recovery. Device rendering,
keyboard/autofill, large text and row hit areas remain unverified.

### Shared UI cleanup (2026-10-11)

`list-item/list-item.tsx` now owns the common root ListItem composition, Host theme
lookup, compound slot exports and public type. Private
`list-item-appearance.<platform>.tsx` helpers retain the existing native row colors,
iOS slot foregrounds/background/separators and Android selector/color overrides.
No palette or touch behavior is replaced with native defaults. The obsolete
public declaration and component adapters are removed; Metro resolution checks
cover the shared runtime and native appearance helpers on both platforms.

`navigation-tab-icons.ts` and `floating-action-icons.ts` centralize the current
symbols through root `Icon.select`. Existing native controls, dimensions, selected
traits/tab roles, transparency, zero action padding and labels are retained.
The selected Home symbol still changes only on iOS; profile glyphs retain their
existing platform difference. Native action tests exercise installed universal
Icon dispatch with mocked native views.

`refreshable-scroll-view/use-pending-refresh.ts` shares promise deduplication and
completion after rejection. Android supplies its existing spinner setter; iOS
gains no JS spinner state. Native indicators, colors and disabled/hidden guards
remain in the adapters. Render fixtures verify pending callback changes,
success/failure/retry and content identity.

`Expo UI/Universal List` adds CompoundSlots and CompoundSlotsLight for nested
slot precedence, numeric zero and observable row activation. Its Maestro flow
also checks a row without an action. Existing Reference navigation and Navigation
shell stories cover icon controls and refresh. No Android device was connected
for this cleanup; native visual/gesture/accessibility verification remains pending.
See the [audit follow-up](../../../../docs/universal-components-audit.md#implemented-follow-up).

`AuthScreenFrame` has an optional `topBar` ReactNode slot outside its scrolling
form. Login uses `LoginPreferences` there: a native 48-point language icon (left)
and the shared `ColorSchemeControl` menu picker (right), offering System, Light
Mode and Dark Mode with translated labels. The picker accepts an optional
`testID` (App Settings by default; Login uses `auth-login-color-scheme`). Existing
app preference providers and Host/auth tint tokens supply appearance; no new
palette or geometry is added. System follows live device changes and can be
restored after a manual choice. Its Host fixes physical
placement in RTL while the separate native language sheet uses Expo UI's own
hosting. The shared sheet adds no styling, padding, dimensions, colors or
theme/direction bridge. Its iOS drag indicator is hidden; native light/dark mode
follows the app appearance preference.
Private `auth-icon-button.<platform>.tsx` adapters preserve native
feedback and disabled suppression. `Pages/Login preferences` has System/light/dark
draft fixtures; `tests/auth/login-preferences.test.mjs` checks readiness,
provider updates, all three appearance choices, live system changes, translated
options, draft retention and dismissal. The native flow is
`.maestro/storybook/login-preferences.yaml`; native touch geometry, keyboard and
accessibility remain unverified without a device.

### Public UI entry point (2026-10-04)

`@components/ui` resolves to `src/components/ui/index.ts`. Screens import their
shared controls, text, layouts and states through this entry point. UI
implementations use sibling imports. Shared presentation now includes
`AuthScreenFrame`, `AuthText`, `FormTextInput`, `FormSubmit`, `NativeField`,
`PageScreen`, `QueryContent`, `RecipeCard`, `ReferenceNavigationBar`, `ScreenError`,
`ToastHost`, `AuroraBackground` and `LaunchScreen`. Feature modules retain
workflow state and the tab navigation controller.

`AuthButton` has been removed. All auth actions use `UniversalButtonContent` with
native colors and appearance inherited from their existing Host. Optional `color`
and `contentColor` pass directly to native controls. There is no Host button palette
or button theme hook. Auth screen stories have explicit light/dark schemes; button
stories cover native defaults and direct color overrides. `MonoText`, its story and the
unused SpaceMono font were removed. Eleven hosted showcase wrappers were moved
into `.rnstorybook/components/showcase/`; native control stories remain available
without exporting their development fixtures from the app library.

`tests/layout/universal-button.test.mjs` exercises the button adapters with mocked
native boundaries: native defaults in light/dark Hosts, direct color overrides,
variant styles, standalone forwarding, disabled suppression and custom/full-width
content. These checks establish JS behavior; native rendering still requires devices.

### Shared page motion

`PageMotionOverlay.variant` defaults to `overlay` for the page header. Its `splash`
variant reuses the same drifting paths and crest in normal flow with opaque theme
fills, replacing the launch screen's fixed bottom curves. Both placements use
`PAGE_WAVE_HEIGHT` (180) and the existing activity/reduced-motion guards. The
replayable Animated splash story covers this moving edge during the two-second exit;
actual native wave continuity remains unverified.

The current default is the full-screen `AuroraBackground`, mounted behind root
navigation. Stack/tab scenes, page frames, headers, auth forms, loading and recovery
boundaries reveal the theme-aware shader through transparent containers. It supports
`animate`, `colorScheme`, optional shared `hue` and RN boundary `style`; native layout
sets resolution. Its UI-thread clock stops during static mode, inactive app state and
live Reduce Motion changes. Root artwork animates on Android and iOS after launch;
Android's shader updates at 30 Hz while preserving elapsed motion time, and iOS
follows the display refresh rate. Resuming establishes a fresh timestamp so paused
time cannot advance the shader. `tests/layout/geometry-stability.test.mjs` exercises
60/120-Hz callbacks, update counts, pause/resume and unmount cleanup with native
boundaries mocked. Decoration ignores touches and accessibility.
`aurora-background.stories.tsx` covers Light, Dark, Static and NarrowPhone with page
content, native buttons, press counts and pause/resume. The corresponding Maestro
flow is `aurora-background.yaml`; native execution remains pending.

`LaunchScreen` now reports native layout with optional `onReady`. The root hides the
native splash at that point. When startup is ready, a single Reanimated animation
waits two seconds and slides upward over two seconds. No timer or extra React state
is used. Reduced motion completes immediately. `launch-screen.stories.tsx` provides
replayable Ready/Waiting previews. Root fixtures cover readiness gates; actual native
rendering and timing still require device verification.

The following top-edge wave is mounted above root navigation alongside the full-screen
aurora behind navigation. Both layers pause while the splash covers them. The aurora
composition stories also include the header wave; focused wave stories remain available:

`PageMotionOverlay` (`src/components/ui/page/page-motion-overlay.tsx`) provides a single 180-point-tall Skia canvas above the root navigation tree, with flatter curves with half the previous vertical depth shared by the artwork and blur masks. It covers all routed pages, including authentication, details, and utility screens, without modifying their native control trees. `animate` defaults to true; optional `colorScheme` supplies deterministic light/dark previews. It consumes existing `tint` and `tabIconSelected` colors. Two oversized paths drift in opposite directions on the current 8-second UI-thread loop, with horizontal travel of 40 / 50 design units and vertical travel of 2 / 3 points. The current layout direction reverses horizontal motion in RTL without resetting phase. Width follows the wrapper's `onLayout` event, with no per-frame measurement or React updates. `useMotionEnabled` pauses motion during background/inactive states, live Reduce Motion changes, and explicit static mode. The root keeps it static beneath the launch screen.

Both wrapper and canvas ignore touches, and the decorative wrapper is hidden from accessibility. `AnimatedLtr` and `AnimatedRtl` in `.rnstorybook/stories/components/page-header.stories.tsx` preview the taller waves above scrolling content with a counted back action. `tests/components/page-wave-motion.test.mjs` checks 60/120-Hz timing, mirrored direction, phase retention and pause/resume using mocked native boundaries. These fixtures do not prove native stacking, screen-reader behavior, rotation, or device performance; see [shared motion verification](../../../../docs/shared-skia-motion.md).

### Navigation page composition

`src/components/ui/page/page-screen.tsx` composes existing Host, RefreshableScrollView, Column, themed Text, and Button wrappers for inventory route shells. It accepts a title, description, typed navigation actions, children, a tab flag for safe-area layout, and an optional async `onRefresh`. `AuthScreenFrame` shares the same scroll wrapper. It adds no theme token. Selectors: `page-scroll`, `page-title`, `page-back`, and `page-action-<label>` (lowercase, spaces replaced by hyphens). `.maestro/pages/` covers action destinations, Back, and detail entry.

The host-free `RefreshableScrollView` preserves universal ScrollView props for vertical scrolling. SDK 57's universal ScrollView lacks `onRefresh`, so platform files use the [SwiftUI refreshable modifier](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/modifiers/) and [Compose PullToRefreshBox](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/pulltorefreshbox/). An async callback owns the work/error feedback; the wrapper waits for completion, releases the native indicator after failure, and deduplicates pending gestures. No callback or a disabled scroll view produces ordinary scrolling. Query screens use `useScreenRefresh` with exact displayed keys; see the [API guide](../../../../docs/api-services.md).

`.rnstorybook/stories/pages/page-screen.stories.tsx` covers safe-area contracts, long content, and deterministic short/tall refresh harnesses. Refresh selectors: `page-refresh-content`, `page-refresh-requests`, `page-refresh-status`, `page-refresh-complete`, `page-refresh-fail`. `.maestro/storybook/pull-to-refresh.yaml` checks pending duplicates, completion, cached content after failure, and recovery. Node tests exercise the query lifecycle and Metro's iOS/Android resolution. Native gestures, indicator placement, selectors, short-content bounce, safe areas and navigation still require iOS/Android execution.

- `Picker.Item` declares options; exercise it through Picker stories rather than render it alone.
- `ListItem.Leading`, `ListItem.Supporting`, and `ListItem.Trailing` compose row slots; cover each in ListItem compositions.
- `useNativeState` and `ObservableState` are state APIs, not additional UI components. `TextInput.value` expects `ObservableState<string>` in the installed version, not a React Native string value. Native state writes do not trigger a React render and may be applied asynchronously; observe events or eventual native output rather than reading immediately after writing.
- Exported prop/style/alignment/ref types are not rendered components. `UniversalStyle` is a supported subset, not all React Native styles. Read `src/universal/types.ts` before adding styling.
- `Menu` is not exported by this installed universal root. Do not copy an unverified universal Menu example from another skill or SDK. Consult platform APIs only if needed. Community adapters and platform-only components are outside this universal inventory.

## Native caveats

### Home recipe cards (2026-10-06)

`HomeRecipeCard` (`src/components/ui/home-recipe-card/home-recipe-card.tsx`) adapts Reference's
popular and editorial home cards. Props: display-only `recipe` data (image, title,
description, duration, category, chef, likes, secondaryMeta), `variant`
(`popular` / `editorial`), explicit content `width`, required `onPress`, and optional
`testID`. It inherits Host light/dark colors, uses semantic surfaceRaised,
surfaceVariant, text, muted, tint and error roles, and retains native link-button
feedback. The shared button accepts optional `borderRadius` and `contentPadding`
geometry overrides; cards explicitly pass zero for both to prevent Android
TextButton pill clipping. Omitted overrides retain normal native button shapes.
Card images and editorial surfaces use Reference's small 14-point corners.
Popular titles truncate after two lines; editorial prose wraps.
`home-recipe-card-image` uses native Compose Box / SwiftUI ZStack overlays above
passive hosted expo-image content. Static local images use fixed sizes and no
transition, extra Host, blur, shadow, or continuous animation.

Recipe UI examples render four popular samples horizontally and the same four
editorial samples vertically outside API query content. The editorial section
uses a native ScrollView with a fixed 300-point/dp height. The finite lists render
eagerly and reuse three local
images. Taps open a local native preview sheet; fake identifiers never reach
recipe routes. English/French/Arabic copy and three bundled 800-pixel JPEGs
require no runtime fetch. `pages/home-recipe-card.stories.tsx` covers both variants
in light/dark themes, long titles, a visible press counter, and complete sample lists.
`tests/recipes/home-cards.test.mjs` checks sample selection, both dismissal paths,
matching sample lists and last-card selection, compact widths, no fetching/interval
clocks, and live preview translation.
Metro resolution checks cover both image adapters. Native stacking/touch
coverage, RTL, large type and release smoothness require device verification.
See `docs/home-recipe-card-examples.md` for implementation and limitations.

2026-10-13: `HomeCatalogCard` adds `hero`, `landscape`, `artwork`, `compact`
and `giveaway` compositions for the supplied store reference. Its display item
contains id/image/title/duration/category/description/chef; required props are
`variant`, `width`, `actionLabel` and `onPress`. Optional `saved`, `saveLabel`,
`onSave` and `ribbon` support the hero and giveaway. Artwork renders passive
`expo-image` content inside Expo UI `RNHostView`, with explicit sizes, cover
cropping, corners and memory/disk caching. Native Columns and controls retain
layout and interaction. Colors inherit Host appearance
and use warningContainer, surfaceVariant, text, muted, tint, info and onInfo.
The existing Button implementation and native interaction defaults are retained.
Home uses one vertical ScrollView with horizontal card rails, four-row columns,
and a final inline catalog. Items reuse translated sample copy with random Picsum
photos seeded once per Home mount, shared by artwork and thumbnails, and stable
across state/locale changes. Recipe API data is not requested.
`pages/home-catalog.stories.tsx` uses bundled images and covers light/dark compositions,
local save toggling and preview dismissal. See `docs/home-catalog-layout.md`
for current testing and native verification limits.

`tests/recipes/home-catalog.test.mjs` covers page
scroll ownership, preview continuity, selection, save toggling, navigation, compact
resizing, live translations and photo-source stability. The selected preview retains its ID rather than
stale translated data. `tests/layout/layout-direction.test.mjs` covers native
sheet visibility, dismissal callbacks and content continuity. The Maestro
flow is `.maestro/storybook/home-catalog.yaml`, exposed as `npm run test:e2e:home`
and discovered by the existing Storybook suite. See the layout guide for execution
results and native verification limits; JS fixtures do not prove absence of flicker.

### Skeleton placeholders (2026-10-04)

`Skeleton` / `SkeletonContent` (`src/components/ui/skeleton/skeleton.tsx`) adapt Reference's
placeholder using universal Expo UI `Column`. The standalone component owns
a Host at an RN boundary; content inherits the owning Host's scheme with an optional
`colorScheme` override. Both accept `testID`, `colorScheme`, and `style` with numeric width/
height, borderRadius, backgroundColor and opacity. Omitted width or `'100%'` fills a
constrained parent. Defaults: height 16, radius 12, opacity 0.72, semantic `border`
fill. No interaction, children, flex styles, style arrays or arbitrary
percentage sizes. Sizing/background/clip order is isolated in native modifier
adapters; SwiftUI requires separate fixed-height and flexible-width frames. Android
applies opacity to the fill color itself, preserving an existing color alpha and
avoiding a separate compositing layer for each placeholder.

Only standalone `Skeleton` accepts `animate` (default true). `SkeletonContentProps`
omits animation: hosted content is always static.
The standalone pulse fades between the requested opacity and 45% of it in 900 ms per direction.
Standalone `Skeleton` uses Reanimated CSS keyframes on its existing RN Host, with no
endpoint timer, additional view layer, or periodic React renders. Its shape stays
in Expo UI. `SkeletonContent` stays static at its configured opacity, with no
animation timer, motion subscriptions, or nested Host. CSS cannot directly target
its SwiftUI/Compose modifier tree; the installed native adapters do not expose an
infinite pulse on both platforms. The old shared endpoint clock was removed.
Standalone animation consumers share lifecycle/accessibility subscriptions through
`useMotionEnabled`. No frame-by-frame React renders, layout measurements, or dependencies.
For standalone `Skeleton`, `animate={false}`, live reduced motion, and inactive app
state stop motion and restore the configured opacity. Static shapes bypass motion
subscriptions entirely. The development Home
examples use this static path and unmount the complete preview ten seconds after mounting;
refreshing or switching tabs does not restart that preview.

`.rnstorybook/stories/expo-ui/skeleton.stories.tsx` covers Light/Dark, image, circle,
pill, custom appearance, static mode, standalone CSS pause/resume in
AnimationControls, opacity 0/0.35/1 and static Reference search-card compositions with inherited
scheme and narrow/full-width layout. Verify native size/fill, clipping, Host theme
inheritance, explicit overrides and screen-reader traversal on both platforms.
Android Maestro preview flows passed for reference cards in dark, light and narrow
layouts and the opacity comparison. Native screenshots were manually inspected;
these are not automated visual regression tests. Lint/typecheck and all 26 existing
layout tests pass. Story registration was regenerated. iOS geometry and assistive
technology traversal on both platforms remain unverified. No dependency or app
configuration changes are needed.

Animation verification: `.maestro/storybook/skeleton.yaml` passed the native
pause/resume interaction on the Android development emulator. Eight sampled
frames showed changing intermediate fill values across multiple cycles. Live
reduced motion restored the full configured opacity and held it steady across
three later samples; restoring the system setting resumed the pulse. The original
system setting was restored. These checks do not establish release performance,
iOS animation behavior, or screen-reader traversal.
Home's native visibility check also passed for the avatar, heading, image and
full-width placeholders; sampled Home frames confirmed the fill changes there.
Those Home animation checks describe the earlier pulsing preview. The 2026-10-06
static/timed follow-up passes four lifecycle regressions in
`tests/recipes/home-skeleton.test.mjs`; native timed disappearance, layout shift
and release smoothness have not been checked on a device.

Home follow-up (2026-10-11): the shared food samples now live in
`src/features/recipes/home-card-examples.tsx` and render on Home as a horizontal
popular row plus editorial cards in the page's existing vertical scroll. Showcase
compositions retain their optional bounded viewport. Home also renders two cards
of `SkeletonContent` during a focused uncached recipe fetch; idle/offline states
and cached refreshes do not animate placeholders. The existing native query
feedback and retry controls remain. `HomeSections`/`HomeSectionsDark` stories and
recipe fixtures cover the composition, sample preview taps and skeleton lifecycle;
native scroll handoff and artwork still require device checks.

- Auth screens use one Host per AuthScreenFrame, including account, and native ScrollView/Column children. AuthText and UniversalButtonContent are host-free; FormTextInput uses UniversalTextInputContent. Do not insert RN View/RNHostView between these native controls and their Host. The session-restoration panel owns a separate Host.
- UniversalTextContent and UniversalTextInputContent are native composition exports alongside the existing RN-layout adapters. They preserve text palette roles and field text/muted/tint/surface/border/status roles; field refs, observable value, focus/blur, editable/read-only, and password props remain available. Input content does not expose the adapter's RN touch observer (`onPress`) or measure layout in JS. Use numeric widths or the platform native-fill-width modifiers, not percentage universal widths.
- TextInput supports `leftIcon` and `rightIcon` (Expo UI `Icon` names; prefer `Icon.select`), `onRightIconPress`, and `rightIconAccessibilityLabel`. SDK 57 has no universal input icon slots, so native Row/Icon/Button surround the same TextInput inside one field surface. Android weights the input; iOS expands it with a frame. Icons use muted/tint roles; the right action keeps native Button feedback and padding. Omit the callback for a decorative right icon. `disabled` blocks the action; readOnly/editable affect editing only. Style applies to the whole field with icons; textStyle and modifiers still target the input. The existing adapter onPress touch observer also observes icon touches. `text-input.stories.tsx` includes left/right, clickable light/dark, and disabled examples with a visible action count. `.maestro/storybook/text-input-icons.yaml` checks clear, typing, one callback per tap, and disabled suppression; native execution, narrow widths, multiline, font scaling, and accessibility remain unverified until run on devices.
- Disabled TextInput styling dims only the input text/placeholder and icons. The shared native Row owns the border and surface for fields with or without icons, so submission does not fade their colors or the label/helper text. Editing and right-icon actions remain disabled; focus and status still select the usual border color. Disabled and DisabledIcons stories expose this treatment; the existing icon flow checks action suppression. Native appearance requires device inspection.
- On iOS, TextInput uses `strokeBorder` with a rounded rectangle matching the numeric `style.borderRadius` and `style.borderWidth`. This avoids SDK 57's universal style conversion clipping a rectangular border at the rounded corners. The surface retains its rounded clip; the inset border uses the resolved focus/status/palette color and supports a zero width. Android retains its native style border. `RoundedBorder` and `RoundedBorderLight` stories expose a thicker semantic border for checking every corner, alongside existing Focused, DisabledIcons and Multiline stories. Native iOS appearance remains unverified without a device or simulator.
- `auth-screen.stories.tsx` covers the actual frame, text, fields, and native buttons in one Host, with local validation and pending state. `.maestro/storybook/auth-screen.yaml` checks editing, validation, visibility, submit count, and pending suppression. Native iOS/Android rendering, keyboard/scroll behavior, light/dark appearance, and selectors require a connected device; static checks and story registration do not prove them.
- FormTextInput renders error/helper text only when a message exists, with natural height, native full-width wrapping and no line limit. Empty fields reserve no message space; validation expands the form while visible and overrides helper text until resolved. Message selectors use the field's testID with `-error`/`-helper` suffixes. Auth Screen's SharedHost and LongHelperText stories exercise empty, error and wrapping states; the auth-screen Maestro flow checks error appearance/clearing and hint restoration. Error feedback uses Android Reject / iOS Error haptics on the valid-to-invalid transition; a 250 ms shared gate coalesces simultaneous field errors. Color feedback remains immediate. Native layout, font scaling and physical haptics still require device verification.
- FormTextInput supports `passwordToggle="icon"` to toggle password masking through the universal input's right eye icon; the default remains the text button. Login/register fields use shared person/mail/lock icons, including an independent eye toggle for registration confirmation. Colors follow the auth palette, with muted leading glyphs and tint for the action; pending disables it. Auth Screen stories PasswordIcons/PendingPasswordIcons cover composition; auth login/register Maestro flows assert reveal and masking. Native layout, keyboard/focus across SecureField/TextField swaps, and screen-reader behavior remain device checks.
- Right-icon spacing refinement: `text-input-icon-button.android.tsx` uses Expo UI's native Compose IconButton instead of a text Button with Material text-button padding. Both platforms use a fixed 48-point/dp action target; iOS uses a plain button. The field places vertical padding on the editable text only and reduces right inset to 2, avoiding button height plus two outer padding layers. Existing ClickableRightIcon/light/disabled and PasswordIcons stories exercise this shared composition; existing icon/auth Maestro flows retain their selectors. Device geometry remains unverified.
- Native icon button resolution: shared declarations live in `text-input-icon-button.d.ts`, never a declaration-only `.ts` beside `.ios.tsx`/`.android.tsx`. Metro checks source extensions in order, so a plain `.ts` can shadow native `.tsx` implementations and produce an undefined component. `tests/layout/native-input-resolution.test.mjs` checks both platforms with the installed Metro resolver and Expo extension ordering; native interaction still requires devices.
- TextInput maintenance review: Context7 examples were cross-checked with SDK 57 docs and installed source because search results included newer versions. All icon fields now apply resolved vertical padding to the text once; explicit shorthand/directional padding is respected without padding the native action twice. The private icon button uses a narrow shared props interface, avoiding unsupported Button props on Android. FormTextInput shares its visibility callback/label and preserves an explicitly supplied secureTextEntry for non-password-mode callers. CustomPaddingIcons and ReadOnlyIcons stories cover the changed contract; the icon Maestro flow also covers a read-only field's separate action. Observable values, caller refs, native Host ownership, and isolated platform modifiers remain the intended design. React Hook Form validation still runs on JS; no per-keystroke wrapper state was added. Native focus/cursor across iOS secure/nonsecure swaps, screen-reader labels, font scaling, and geometry require devices.
- TextInput icon sizing: every leading/trailing icon uses a fixed 20 × 20 frame, including both password eye symbols. The action target is 48 × 48 on iOS and Android. Field height uses native layout without font-scale calculations. `PasswordVisibility` and `PasswordVisibilityLargeText` stories exercise reveal/hide; `.maestro/storybook/text-input-icons.yaml` includes password visibility checks. Native geometry, font scaling and focus across secure-field swaps remain unverified without devices.

- HIGH-impact SonarQube maintenance: button palette roles use a fixed intent table; FormTextInput isolates password overrides; TextInput isolates appearance and trailing-icon selection; QueryContent isolates resolved/empty content selection. Public props, theme roles, native hierarchy and selectors remain the same. Existing Button, TextInput, AuthScreen and LoadingState stories cover these contracts; the full Node regression suite checks adapter actions, password masking/reset, query states and render stability. Native touch geometry and accessibility remain device checks.

- Root imports select SwiftUI on iOS and Compose on Android. Ordinary native trees need Host. BottomSheet in this installed version creates its own internal native Host; follow its implementation and existing wrapper rather than blindly nesting another host.
- BottomSheet uses `isPresented` and `onDismiss`. Android Material sheet states do not guarantee exact parity with iOS fractional/height detents; document and verify each supported platform behavior.
- Home keeps its preview sheet mounted and retains selected content during native dismissal. `Recipes/Home catalog` exercises this composition, with lifecycle checks in the Home catalog tests. It no longer supplies a calculated sheet width. See the Home layout guide for native Maestro results and flicker verification limits.
- The shared BottomSheet is a minimal adapter over Expo UI's native sheet. Its only props are children, isPresented, onDismiss and testID. It adds no styling, padding, colors, corner radius, dimensions, detents, measured width, custom handle or nested Host. The iOS drag indicator is hidden; Android keeps its native default. Native app appearance follows the existing light/dark/system preference through Appearance.setColorScheme in the root layout. Callers own content composition and specialized boundaries; OTP measures its own input section. The bottom-sheet stories cover opening, closing, long content and native appearance; Login preferences covers language selection and drafts. JS checks establish state/callback contracts only; native appearance and gestures require device verification.
- Picker wheel appearance is iOS-specific; Android uses its dropdown behavior.
- List is for short native groups, not a virtualization solution for unbounded feeds. Do not silently replace it with a disallowed UI control or render huge data trees. Raise the requirement and resolve an approved approach if needed.
- Existing wrappers and stories can contain styling or RN content that predates the mobile-only skill. Their presence is not an exception for new work. Correct only the touched scope and document remaining drift.

## Toast notifications

`toast.android.tsx` uses a rounded [Compose Surface](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/surface/) and native IconButton; `toast.ios.tsx` uses SwiftUI background/shadow and a native Button. Both compose universal Row/Column/Icon and hosted text inside UniversalHost. Required props are `variant` (`error`, `success`, `warning`), `message`, and `onDismiss`; optional props are `title` and `colorScheme`. All variants share a localized heading, wrapping message, badge and close control (44pt iOS, 48dp Android). Success uses a green checkmark, warning an amber triangle and error a red alert. Colors consume `surfaceRaised`, `text`, `muted`, the variant's semantic accent/container and iOS `shadow`. Appearance and layout direction inherit from the owning Host. Mount a new keyed instance per notification. The lifetime hook dismisses after six seconds, respects Android's recommended accessibility timeout, announces the heading/message, and holds while VoiceOver/TalkBack is enabled. See [Toast README](../../../../src/components/ui/toast/README.md).

`ToastHost` provides a safe-area top overlay above navigation, queue retention before mounting, and stable dismissal IDs. `showToast({ variant, message, title? })` from `src/lib/toasts.ts` queues all variants, coalescing identical variant/message/title combinations. Shared query/mutation cache callbacks and imperative auth failures keep reporting through `reportErrorToast` in `src/lib/error-toasts.ts`, preserving cancellation/session filters and friendly translations. `ErrorToast` and `ErrorToastHost` remain compatibility exports. Client-side field validation and retry buttons stay on screens. `FormTextInput.onEdited` remains optional for local feedback.

`toast.stories.tsx` covers error/success/warning in light/dark, custom headings, long text, multiline validation messages, right-to-left content, dismissal count, and reopening. `.maestro/storybook/error-toast.yaml` exercises headings, visible text and close/dismissal for all three variants, plus reopening. Real Axios/TanStack tests cover API error messages, retries, callbacks, canceled reads and session changes; `toasts.test.mjs` checks mixed queues, coalescing by variant/title, stale dismissals, blank input and reshowing feedback. Metro-resolution checks cover both native implementations and compatibility adapters. Native appearance, font scaling, narrow screens, VoiceOver/TalkBack, overlay stacking, keyboard visibility, and dismiss selectors require devices; no native execution is claimed.

## Maintain this inventory

After upgrades, compare root exports and compound exports with this table, then re-open matching versioned API pages. Record added/removed components, public API differences, wrappers, stories, and pending native checks. Preserve the distinction between available components, documented stories, and tests actually run.

## Segmented navigation

`segmented-control.ios.tsx` uses the [SwiftUI Picker](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/picker/) with `pickerStyle('segmented')`; `segmented-control.android.tsx` uses [Compose SingleChoiceSegmentedButtonRow and SegmentedButton](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/segmentedbutton/). The shared contract exposes options (value, label, testID), selectedValue (nullable for hidden destinations), and onValueChange. Both implementations render inside UniversalHost and retain native theme, geometry, selected feedback, and accessibility behavior. The surrounding bar uses the surface token and bottom safe area. This platform adaptation is intentional: the universal Picker does not provide segmented appearance.

`segmented-navigation.stories.tsx` has interactive light/dark examples with `segment-selection` output. The main tab bar derives selection from Expo Router, emits cancellable tabPress, and preserves each route's navigation state. Existing `.maestro/pages/tabs-and-collections.yaml` exercises all five `tab-*` selectors and resulting screens. Verify native selected state after direct entry, narrow phone widths, large text, bottom safe area, VoiceOver/TalkBack, and iOS segment selector exposure on device. Stories and static checks do not establish native rendering correctness.

## Reference tab implementation (2026-10-03)

The main routes now import functional native screen compositions from `src/features/recipes/` instead of the earlier placeholder exports. Home loads categories and recipes, Search supports route filters and paging, Create has a validated four-step draft, Recipes opens account-scoped saved/history/creation lists, and More provides account/profile/theme/sign-out controls. Supporting recipe, category, ingredient, and chef-registration routes have data-backed content. API writes require explicit user interaction in the app.

The custom Expo Router tab bar retains Expo UI segmented controls and adds the Reference context action (create/continue/submit, filters, liked/favorites, profile). `floating-action.tsx` paints its gradient and liquid wave in Skia under a 76-point native circular button; the canvas ignores input and accessibility while the real button supplies its label, disabled state, and native feedback. `recipe-stepper.tsx` supplies liquid step indicators. The Home flame component and its Storybook example were deleted on 2026-10-06 to remove their continuous drawing work. Artwork consumes the existing theme roles and shared `navigationActionColors`; native controls and all text remain Expo UI. Reanimated values drive Skia directly, with no per-frame React state. Motion is static when reduced motion is enabled, the app is backgrounded, or the owning screen is unfocused. Tab scenes use `animation: 'none'`.

`reference-motion.stories.tsx` covers interactive action counts, step changes, light/dark canvases, and static artwork. `.maestro/pages/context-actions.yaml` covers actual context-action destinations and invalid-form gating. `tests/validation/recipe-draft.test.mjs`, `tests/recipes/collections.test.mjs`, and auth tests verify payload validation/normalization, storage isolation and serialization, cancellation forwarding, and metadata updates without clobbering rotated tokens. Native drawing, clipping, segment/button hit coverage, large text, keyboard behavior, and accessibility remain device checks.

### Screen safe areas

`PageHeader` titles align to the leading edge on iOS and Android (left in LTR,
right in RTL), using a leading full-width iOS frame and the existing Android
weighted column. Its `title`, `onBack` and `colorScheme` props and `text` theme
role are unchanged. Existing `Components/Page Header` stories cover titles and
counted back actions; native alignment requires visual verification on both platforms.

Every titled `PageFrame` now blurs by default, including Settings, maps, tools
and recovery screens. `headerBlur={false}` opts out. Default frames reserve the
measured title height; `PageScreen`, Home and Settings use `scrollsBehindHeader` with
`usePageHeaderInset()` inside their scrolling content. Blur stays inside the two
wave shapes, below the sharp title and back button.
`PageMotionOverlay` wraps root navigation and supplies cached paths and shared
UI-thread transforms through `PageWaveContext` to the platform mask; artwork
and mask use one motion loop. Its `children` slot supports local compositions and
`visible` hides the artwork/mask without remounting navigation. The iOS surface
uses native SwiftUI `ultraThin` material and an SVG-backed SwiftUI mask, avoiding
the UIKit visual-effect ancestor masking restriction and Metal mask compositing.
Android retains Expo UI `MaskedView` with Skia and `expo-blur`. Private
`page-wave-surface.ios.tsx` / `.android.tsx` adapters share the same props; Metro
resolution and platform rendering contracts are checked by the layout tests.
Splash waves keep
their existing opaque treatment. `usePageHeaderInset()` reserves the measured header height
inside the scroll, including the top safe area and dynamic text/back-button
height. `BlurTargetView` supplies the Android source; Android 12+ uses native blur
and older Android uses a translucent fallback. The Android `extraLight` / `dark` tinted
backdrop avoids Android's gray thin-material overlay, ignores touches, uses
intensity 40, and follows Reduce Transparency with
the theme's `background` token. Title and back button retain the `text` role and
native controls. The header is clear outside the wave silhouettes. Fixed headers
stay in normal layout above their full-frame blur source and reserve their measured
content space. Settings puts the measured inset inside its first section header,
so its single native FieldGroup scrolls behind the wave blur. The iOS-only
`scrollContentBackground('hidden')` modifier removes the system Form canvas;
Android keeps the existing transparent form. Its full-frame viewport remains
bounded and the title/back control stay above the blur. `headerOverlay` maps retain their top device inset.
When waves are unavailable, a rectangular native blur covers the measured header
and honors Reduce Transparency. `Components/Page Header` in
`page-header.stories.tsx` covers light/dark, scrolling, full-height overlays and
the no-wave fallback with a counted back action; `AppSettings` and `DarkAppSettings`
exercise the actual grouped settings form and back action. `tests/components/page-frame.test.mjs`
covers spacing, draft retention, map insets and accessibility changes.
Native blur appearance and interaction require a connected device.

The wave's single UI-thread frame callback retains its phase through page-mask
replacement, background/inactive states, live Reduce Motion, explicit pause and
visibility changes. Resume excludes paused time; delayed frames advance by at most
64 ms. `Pages/Shared Skia motion/NavigationContinuity` and the page-motion Maestro
flow exercise page replacement, back actions and retained pause state. Geometry
tests check continuous drift at 60/120 Hz for both platform adapters; native visual
continuity and performance still require a device. This supersedes the earlier
cancel/reset behavior in the motion catalog entry above.

`PageScreen` owns top/side insets on all pages; the normal-flow custom tab bar owns the bottom inset for tabs, and standalone pages own their bottom inset. Root native stack headers are hidden. The title keeps the Home 26-point semibold typography and app background; standalone pages add a native back arrow in the same content header and remove the duplicate toolbar and bottom Back link. `onBack` optionally overrides the default Expo Router back/Home fallback for controlled compositions. Page Hosts ignore SwiftUI automatic insets to avoid duplication. Both `PageScreen` and `AuthScreenFrame` use RN keyboard padding on iOS and Android, keeping the native scroll viewport above the keyboard; both tab and detail pages have no native-header keyboard offset. Page system insets sit outside keyboard padding so it cannot overwrite the bottom safe area. `AuthScreenFrame.tab` selects bottom ownership for the account tab. No fixed tab-bar height is added to content. `page-screen.stories.tsx` includes notched, asymmetric side-cutout, light/dark headers with and without a back arrow, long-content, and KeyboardAccess cases. The back-arrow fixtures count native activations; `.maestro/storybook/page-header.yaml` checks repeated taps and arrow absence on tab headers. The private `PageBackButton` adapters use a Compose IconButton with an auto-mirrored Material arrow and a plain SwiftUI Button with `arrow.backward`, 48-point hit bounds, the `text` token and a Go back accessibility label. `.maestro/storybook/keyboard-access.yaml` types and submits in the auth frame and saves a multiline page field twice, scrolling to each action without first dismissing the keyboard. Four tests in `tests/layout/screen-insets.test.mjs` check the shared inset contract. Native geometry, keyboard, sheets, and resize behavior still require devices. See [safe-area handling](../../../../docs/safe-area-handling.md) for the edge ownership table and documentation sources.

### Reference navigation bar

The main navbar now uses `src/features/pages/reference-tab-bar.tsx`, not SegmentedControl. Four `navigation-tab.ios.tsx`/`.android.tsx` native controls expose name, label, selected, color, testID, and onPress. SwiftUI uses a plain Button with an icon/label column; Compose uses a selectable Column with a tab role and native ripple. The universal Button cannot express the selected tab semantics and precise zero-padding geometry needed here. All native trees are hosted with an explicit scheme. Theme roles: tabBarBackground, tabBarActive, tabBarInactive, tabBarShadow. Geometry and glyphs follow Reference; no Create label appears in the row. The bottom bar keeps Reference's fixed 76-point geometry and side-cutout protection.

`floating-action.tsx` now draws only Reference's static vertical gradient, using the copied pure palette calculation in `navigation-action-theme.ts`. Its shared native contract adds continue and active-filters states plus an optional colorScheme. Continue uses plus, submit uses check, profile uses Reference's chef glyph. Light/dark, selected state, each action palette, disabled behavior, native feedback and hit coverage are covered for manual inspection by `.rnstorybook/stories/pages/reference-navigation.stories.tsx`; production action routing is covered by `.maestro/pages/context-actions.yaml` and `tabs-and-collections.yaml`. These flows and visual geometry still require execution on devices. Earlier catalog statements about segmented main navigation, added floating waves, or bottom inset expansion are superseded; segmented controls remain available for other UI.

Middle-button follow-up: the user requested keeping the Skia wave animation. `floating-action.tsx` now overlays the original translucent wave, clipped to its 76-point circle, on the Reference gradient palette. Reanimated shared values drive the wave without per-frame React renders; motion pauses when disabled, reduced motion is enabled, the app is backgrounded, or the navigator is unfocused. `ReferenceNavigationBar.animate` allows deterministic static inspection; `reference-navigation.stories.tsx` includes animated and Static modes. This supersedes the static-only floating-action description above. Device animation verification remains pending.

Depth/optimization follow-up: `floating-action.tsx` now builds one periodic path at module load and drives only its translation on the UI thread. Static radial highlights, lower shading, and a lit rim add depth without blur filters or additional animation loops. Four production-artwork Skia offscreen frames verified circular clipping, visible movement, and identical loop endpoints. See `docs/navbar-wave-verification.md` for evidence and native-device limits. Existing light/dark, state, disabled, animated, and Static stories cover the changed composition.

Press feedback follow-up: FloatingAction now uses a scoped GestureHandlerRootView and Native gesture observer around the existing Expo UI button. Touch-down scales the whole control to 97%, increases wave amplitude to 1.7x, and increases speed to 2.8x; release/cancellation restores scale and settles the wave. The prebuilt path is retained, with one UI-thread frame callback integrating phase continuously. Static/reduced-motion/disabled/background/unfocused states suppress or reset the response. `reference-navigation.stories.tsx` adds PressFeedback and an explicit animate control. Native holds, cancellation, drag-out behavior, accessibility activation, and single-action delivery remain manual device checks.

Click refinement: the middle-button dip is now 92% and native activation triggers a complete size pulse and wave burst, making short taps perceptible. Actions run immediately; disabled/static/reduced-motion behavior remains intact. iOS uses Medium impact, Android uses native Context_Click haptics. The existing PressFeedback story covers taps and holds. Earlier 97% values are superseded.

Current user preference: calm breathing replaces custom press shrink and agitation. FloatingAction uses one four-second cosine inhale/exhale, expanding from 100% to 103.5% and back; the slower wave varies gently with the same clock. Gesture observer/root wrappers and click pulse sequences are removed. Native Expo UI buttons retain activation/feedback and haptics. Static/reduced-motion/disabled/background/unfocused states stop and reset visual motion. `reference-navigation.stories.tsx` now exposes Breathing in place of PressFeedback. Earlier press-motion descriptions are historical and superseded; native feel remains unverified.

### Navbar enhancement (2026-10-04)

`ReferenceNavigationBar` accepts `bottomInset` alongside `leftInset`, `rightInset`, and `animate`. The production tab bar passes all three navigator insets. Following the requests to reduce padding, the outer frame uses only `bottomInset` below the bar and 6-point side margins plus actual side insets; the tab row has 2-point inner horizontal padding. Its 56-point rounded dock matches the native tab height, with no extra vertical padding around the tabs. The fixed 84-point center slot keeps the 76-point native action and its 4-point surround centered. Tab scenes still switch immediately. Colors add `tabBarSelectedBackground` and `tabBarBorder`; `tabBarShadow` is black in dark mode. Existing Light, Dark, SafeArea, SideCutouts, NarrowPhone, and Static stories use this compact layout; native spacing and edge taps remain device checks.

`NavigationTabProps.selectedBackgroundColor` is required. Both native implementations draw a 44-by-28 capsule behind the selected icon within the existing full-width 56-point native touch target. SwiftUI also fills the selected Home symbol; Compose retains selectable tab semantics and native feedback. No animation is added to destination selection.

Android tab press feedback clips each 56-point control to 14-point rounded corners before applying `selectable`, so its native ripple has rounded edges. The complete tab row also uses the dock's 28-point radius and `overflow: 'hidden'`, confining native feedback to the dock's curved ends. Per-tab rounding alone did not match the dock outline after its vertical padding was removed. The selected icon capsule remains separate. The shared name, label, selected, color, selectedBackgroundColor, testID, and onPress contract and existing theme roles are unchanged. The Light, Dark, ContextSwitching, NarrowPhone, and DockFeedback compositions in `reference-navigation.stories.tsx` cover appearance, repeated taps, and label fit; `.maestro/storybook/reference-navigation.yaml` covers selection outcomes and raised-action edge taps. Native ripple clipping, large-text labels, and edge touch delivery still require device inspection. See the [SDK 57 clip modifier](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/modifiers/#clipshape) and [React Native rounded clipping](https://reactnative.dev/docs/0.86/view-style-props#borderradius).

The 84-point outer frame contains a bottom-aligned 56-point clipped tab row with an 84-point center spacer. The raised action is a sibling overlay centered within the full outer frame, with its 84-point surround above the tab row in z-order and Android elevation. It remains inside every ancestor's measured bounds while its top and pulse stay outside the tab row's clip. The decorative dock starts 28 points below the frame's top and ends at its bottom. The iOS glass surface fills the dock's available height instead of imposing its previous 76-point height. Native top-edge tapping remains a device check.

`FloatingAction` retains its public contract and four-second breathing cycle. Two liquid layers reuse one smooth cubic path, move in opposite directions, and vary amplitude with the breath. A fine crest, breathing highlight, lit rim, and soft shadow add depth. Both waves extend below the circular clip so scaling cannot expose a gap at the bottom. All motion still uses one UI-thread frame callback. `useMotionEnabled` now observes live `reduceMotionChanged` events and reads the current setting on mount, with cleanup and protection against a late initial read overwriting a newer event.

`reference-navigation.stories.tsx` adds ContextSwitching, SafeArea, SideCutouts, NarrowPhone, and CreationRoute fixtures to its light/dark, static, disabled, active-filter, creation, and breathing examples. `reference-motion.stories.tsx` now forwards its explicit color scheme to FloatingAction. `.maestro/storybook/reference-navigation.yaml` checks destination selection, changing context-action labels, one activation per enabled tap, and suppression while disabled. Native layout, touch/ripple delivery, large text, haptics, and live accessibility/lifecycle behavior require device verification. See [navbar verification](../../../../docs/navbar-wave-verification.md) for executed checks and their limits.

### Recipe stepper canvas sizing (2026-10-04)

`RecipeStepper` updates its canvas size shared value from the non-collapsible React Native wrapper's `onLayout` event. It no longer passes Skia's `onSize`, which in the installed Skia 2.6.2 calls Reanimated `measure()` every frame and can warn about unavailable `LayoutMetrics` while the native-hosted canvas is not laid out or is detached. The host-size correction documented below additionally stores the native row's width to supply concrete canvas bounds. Width changes update the four circle positions without per-frame measurement. Native motion stories cover step changes, light/dark, and static mode; resize, reopening Create, switching away, and hiding/showing the hosted content remain native checks.

### Reference recipe stepper (2026-10-04)

`RecipeStepper` accepts `current` (clamped to 0–3), `isCurrentValid`, `animate`, and `colorScheme`, and composes inside an existing Expo UI Host. It adapts Reference's numbered liquid circles, larger breathing active circle, pulse ring, and flowing connecting track. The form supplies validity from the same `recipeStepSchemas` used by Continue: an incomplete current step has a low fill, a valid one fills to roughly three quarters, earlier circles fill completely, and future circles remain empty. Native Expo UI numbers and centered labels occupy the same equal-width columns as the canvas. Each step exposes its current/completed/upcoming state to accessibility; indicators do not bypass validation or navigate.

Theme roles: `tabBarActive`, `tabIconSelected`, `surface`, `border`, `text`, and `muted`. One 2-second UI-thread clock drives the wave, breath, pulse, and gradient; 300-ms springs settle step and validity changes. Static wave/clip paths avoid per-frame path construction. The private `recipe-stepper-layout.ios.tsx` and `.android.tsx` adapters use SwiftUI ZStack/HStack and Compose Box/weighted Row: the universal layer lacks an overlapping stack. They measure the native text row with `onGeometryChange`/`onSizeChanged`, retain only its width, and pass concrete width/80-point height to the RN artwork and Canvas inside `RNHostView matchContents`. Parent-sized hosting made the entire artwork disappear in the Android native scroll container; percentage widths collapse to zero when matching content. Measurements run on native layout changes, never per animation frame. Label height follows native text sizing, with no nested Hosts. Motion respects live reduced-motion settings, app activity, and the screen's focus flag. No dependency or native config changes are needed.

`recipe-stepper.stories.tsx` covers light/dark, validity, all four steps, a 260-point width, and static mode with Previous, Next, Reset, and validity controls. `.maestro/storybook/recipe-stepper.yaml` passes on the Android emulator: forward/backward/reset, validity feedback, bounds, and static-mode progression. The story-opening helper enters development guest mode when the login screen is present, allowing isolated fixtures to run without an account. Typecheck, lint, formatting, and the five existing recipe-validation tests pass. Story registration was regenerated. Android inspection in the existing SDK 57 development build reproduces the missing artwork before the fix and confirms visible borders, connecting track, and the rise to blue fill when the recipe title becomes valid. Light, dark, completed-step, and 260-point story screenshots were inspected. These screenshots are manual verification, not automated visual comparisons. iOS rendering, dynamic type, screen-reader grouping, focus/background pausing, and motion smoothness remain unverified.

### Navbar glass and tap response (2026-10-04)

The latest user request adds a glass finish and an activation pulse to the existing navbar geometry. This supersedes the earlier calm-only preference. `NavigationGlassSurface` is a decorative native platform adaptation with one required prop, `colorScheme`. The parent hides it from accessibility and touch handling; the native destination and action controls remain above it.

On iOS 26+, the surface uses the installed Expo UI `glassEffect` modifier with regular glass and a rounded rectangle. Earlier iOS uses the native thin material background. Android uses SDK 57's `BlurTargetView` and `BlurView` with `dimezisBlurViewSdk31Plus`: Android 12+ blurs a local tonal gradient, while earlier versions retain the tinted fallback. The target excludes the blur and controls to avoid feedback. The navbar stays in normal layout, so this is a glass dock finish, not a blur of scrolling screen content. Rounded clipping, a subtle diagonal glint, and the existing shadow complete the surface. See the official [SwiftUI modifiers](https://docs.expo.dev/versions/v57.0.0/sdk/ui/swift-ui/modifiers/) and [BlurView](https://docs.expo.dev/versions/v57.0.0/sdk/blur-view/) APIs. Shared scalar theme roles are `tabBarGlassTint`, `tabBarGlassBorder`, `tabBarGlassBackdrop`, `tabBarGlassHighlight`, `tabBarGlassMidHighlight`, and `tabBarGlassClear`.

`FloatingAction` starts feedback on touch-down through a non-cancelling `Gesture.Native()` observer and scoped `GestureHandlerRootView`. It observes touches on the non-collapsible artwork/control container without taking over native activation. Native activation schedules feedback only when no burst is running, covering accessibility and keyboard input while finger release continues an existing response without restarting it. The latest user preference slows the 105.5%/94%/100% size sequence to 600 ms (160/200/240 ms), with ease-in-out curves for soft turnarounds. A simultaneous one-second burst ramps up over 180 ms and settles over 820 ms, with peak wave speed reduced to 2.4x. It increases both wave amplitudes and briefly shifts/intensifies the lighting and rim. Independent breathing phase keeps the four-second inhale/exhale steady while the liquid accelerates. Combined growth reaches approximately 83 points inside the 84-point surround. New touches restart the response; cancelled touches settle within 120 ms. The native action callback runs immediately and remains the only action source. Static, disabled, reduced-motion, background, and unfocused states cancel and reset custom motion.

Composition stories `GlassAndTap` and `DarkGlassAndTap` cover the new surface and pulse; existing Static, Disabled, ContextSwitching, and safe-area fixtures remain applicable. The Maestro navigation flow checks repeated enabled activations. Offscreen production Skia drawings verify 112 resting/burst frames across both themes and all action palettes, including clipping, filled center/base, seamless periods, and visible burst changes. An interaction harness exercises production callbacks with installed Reanimated numeric animation algorithms, checking touch-down before action, continuation without restarting on release, growth/dip/settling, context updates, cancellation, single action delivery, and motion guards. Latest lint and typecheck pass. Native event delivery is mocked; native touch handling, material rendering, timing, haptics, cancellation on background/reduced-motion changes, and device performance remain unverified without a connected device. See [navbar verification](../../../../docs/navbar-wave-verification.md).

## Expo UI production conventions (2026-10-04)

2026-10-14 button glass variant: `UniversalButton` and `UniversalButtonContent`
accept `variant="glass"` with the existing optional colors, padding, radius, full
width, custom children and disabled state. iOS uses Expo UI's native
`buttonStyle('glass')` on iOS 26+; the installed native modifier falls back to
automatic style on older iOS. Android maps glass to `OutlinedButton`, including
outlined foreground-color overrides. Colors remain native defaults or direct
caller overrides; no theme roles or dependencies are added.
`button.stories.tsx` provides Glass, GlassDark, GlassDisabled, GlassFullWidth and
GlassInteraction. The existing `.maestro/storybook/button.yaml` flow accepts
`BUTTON_STORY_ID=expo-ui-universal-button--glass-interaction` for single/repeated
actions, disabled suppression and reset. JS adapter checks cover the platform
style contract; native appearance, feedback, accessibility and press bounds still
require device verification.

Button simplification (2026-10-14): `button-colors.ts` and all button theme hooks are removed. Native adapters use native colors by default and pass optional `color` and `contentColor` directly to native controls. Status actions supply their existing semantic colors explicitly at the call site. The Host button-palette context, palette hook, auth palette copies and fallback chains are removed. The standalone button uses a plain Expo UI Host with an optional light/dark override; content buttons inherit native Host appearance. The public controls retain required variant, optional native padding/radius and full-width native modifiers. No measurement, generated colors or dimension calculations are added. CustomColorsLight, CustomColorsDark, CustomPadding and Interaction cover the simpler contract; JS checks cover native defaults, direct overrides and enabled/disabled actions. iOS production language-button selection and sheet dismissal were inspected manually. The Storybook interaction fixture is blocked by duplicate RNCSafeAreaProvider registration; custom geometry and Android appearance remain unverified.

UniversalButton and UniversalButtonContent require a variant: primary, secondary, link, success, warning or destructive. Legacy size, rounded and semanticVariant props are removed. The standalone wrapper owns a plain Expo UI Host; the content component uses native Compose Button/OutlinedButton/TextButton or SwiftUI Button inside its existing Host. Optional colors pass directly to native controls; omitted colors preserve native defaults. Full-width iOS labels expand inside the button surface. Optional borderRadius sets corners in iOS points / Android dp; zero is square and omission retains native defaults. iOS uses buttonBorderShape roundedRectangle for the styled surface and clipShape for custom content; filled variants use borderedProminent, secondary uses bordered, and links remain plain with no filled surface. Optional contentPadding is applied only when supplied. Callers supply semantic status accents and foregrounds explicitly. button.stories.tsx includes CustomRadius with a numeric control, Square, and light/dark variants. The Interaction story uses custom-radius enabled/disabled buttons, an observable count and reset; its Maestro flow is .maestro/storybook/button.yaml. tests/layout/universal-button.test.mjs checks zero/omitted/custom geometry, variant styles, native color defaults, direct colors and actions on both adapters; these JS checks do not prove native appearance or touch geometry.

UniversalHost provides its resolved scheme to content through useHostColorScheme. Ordinary composition uses Row/Column/Spacer, with nativeFillWidth/nativeFillSize/nativeRowWeight where the native APIs differ. Spacer is imported directly; its redundant wrapper is removed. The navbar shares one Host and a weighted native row, keeping its RN absolute geometry only for the raised action. Context action appearance follows an explicit kind, not its translated label.

LoadingIndicator is a host-free platform adapter using SwiftUI ProgressView or Compose CircularProgressIndicator. LoadingContent composes a native row with an indicator and text; LoadingScreen owns a full-screen Host for route/Suspense boundaries. loading-state.stories.tsx exercises fetching, disabled, offline, persistent error, successful empty, cached refresh and refresh failure, plus full-screen and light/dark compositions. .maestro/storybook/loading-state.yaml checks observable state transitions. JS render tests establish query state selection; native layout/interaction verification is recorded in docs/production-fixes-plan.md.

Screen recovery, launch text, maps/Skia captions and controls now use Expo UI. RN boundaries remain for native maps, canvas/Lottie artwork, keyboard/safe areas, navigation and absolute overlays. Launch waits for font/session readiness, then uses one animation with a two-second delay and two-second upward slide; reduced motion completes immediately. Native-only no-op loaders and unused web branches were removed. The selected redundancy cleanup on 2026-10-05 also removed the web CanvasKit copy script, WASM asset and favicon; the 2026-10-10 cleanup removes the remaining Expo UI postinstall patch.

### Floating-action native verification follow-up

FloatingActionLayout is a host-free Box/ZStack platform adapter for stacking RN artwork and the native control in one hosting tree. Android gives the control layer a native zIndex. FloatingAction uses passive touch observation to schedule feedback and leaves action delivery with its native button; earlier Gesture.Native descriptions are historical. NativeControl isolates the underlying button in the navigation story. Updated native Metro resolution checks and the numeric/offscreen harnesses pass; final composed native activation is unverified after an ADB driver connection closed. See [current verification](../../../../docs/navbar-wave-verification.md).

### Light navigation dock shadow correction (2026-10-04)

ReferenceNavigationBar disables shadowOpacity and all three RN elevation layers in light mode. Android elevation independently casts a shadow, so lowering shadowOpacity alone would retain the grey halo. Existing zIndex values keep the controls and raised action above the decorative glass. Dark-mode elevations, glass adapters, dock geometry, native tab feedback and action motion are retained. The existing Light/Dark and GlassAndTap/DarkGlassAndTap stories cover appearance; actual blur, stacking and edge taps require native verification.

### Navigation edge spacing (2026-10-11)

`ReferenceNavigationBar` now renders a borderless rectangular dock flush with the screen edges. Its existing `leftInset` and `rightInset` protect only native destination controls; `bottomInset` extends the glass to the bottom edge beneath the system gesture area. The 84-point action touch frame has a negative 28-point top margin and transparent `box-none` handling, reserving only the 56-point dock plus the bottom inset while allowing page content and touches beside the raised action. Floating-action appearance and motion are unchanged. `PageOverlap` in `reference-navigation.stories.tsx` exposes a page press count beside the action; `.maestro/storybook/reference-navigation.yaml` exercises this page control and the action's upper edge. Native iOS/Android overlap, hit delivery, glass and safe-area appearance require device verification.

## UX wireframe button colors (2026-10-16)

The user's UX Template requirement overrides native button color defaults only
for theme `ux`: omitted color/contentColor resolve to existing grayscale semantic
pairs. Primary remains #000000 with #FFFFFF labels in light and dark. The shared
private semantic helper is reused by Storybook; the private hook respects the
owning Host scheme and standalone colorScheme. Supplying either color prop
preserves direct override behavior. Other brand themes retain native defaults.
No geometry, per-state palette, provider or dependency is added.

`Expo UI/Universal Button/WireframeLight` and `WireframeDark` expose count,
disabled and reset behavior without supplying button colors. The Theme Tokens
light/dark stories also exercise UX defaults.
`tests/layout/universal-button.test.mjs` covers both platform adapters, exact
black/white primary pairs, feedback grayscale, scheme overrides, caller colors
and disabled suppression. `.maestro/storybook/wireframe-buttons.yaml` reuses
the existing button interaction flow in both appearances.

Manual iOS 27 / iPhone 18 Pro checks confirmed grayscale light/dark rendering
and production dark-mode button labels after fixing a white-on-white native
fill. One enabled press incremented the production counter once; a disabled
press left it unchanged. Native Android and Maestro execution remain pending.

## UX semantic feedback refinement (2026-10-16)

The user requested colored danger, success and warning within the neutral UX
theme. `ux.ts` now defines brick red, forest green and amber feedback accents
with matching light/dark containers and explicit label colors. Primary remains
#000000/#FFFFFF; foundations, ordinary actions, navigation and info stay neutral.
The existing button semantic mapping propagates these roles without new props
or component changes. Theme Tokens light/dark stories preview the status buttons.

Appearance tests preserve neutral-role and black-primary invariants, check red/
green/amber identities and require 4.5:1 status contrast on page, surface and
container backgrounds. Native button adapter tests verify semantic fill/label
pairs on iOS/Android and retain disabled-action guards.

## Registration grouped-form spacing (2026-10-16)

Grouped AuthScreenFrame leaves horizontal gutters to native FieldGroup, retaining
only side safe-area insets and a transparent form canvas for the page background.
The iOS adapter hides scroll indicators and gives section rows the owning Host
surface token; caller modifiers can override it. No new props or dependencies.
`GroupedFormLight` previews light-mode groups. Manual iPhone checks confirmed
gray UX light section cards on the original white page, reduced side padding
and scrolling without an indicator.
The existing auth/layout tests pass; native Android inspection remains pending.
