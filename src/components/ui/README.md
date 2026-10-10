# Shared native UI

Screens import reusable presentation from `@components/ui`. This alias points to
[`index.ts`](index.ts). Implementations in this folder import siblings directly.
Feature screens retain queries, mutations, form state and workflow hooks.

Native input `value` uses Expo UI's supported observable API, including form
resets and password toggles. Dependencies are installed without project patches.
Check the SDK 57 documentation and installed types before updating `@expo/ui`.
Expo UI is pinned to unmodified `57.0.21`, with compatible Router `57.0.24`; see the
[native version decision](../../../docs/build-verification.md#expo-ui-version)
before changing that pin. Auth layout constrains the native Host through the
existing keyboard/safe-area boundary, with full-width native content.

| Need                     | Components / source                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| Actions                  | `UniversalButton`, `UniversalButtonContent` — `universal-button*`                               |
| Floating actions         | `FloatingAction` — `floating-action*`                                                           |
| Toasts                   | `ErrorToast`, `ErrorToastHost` — `error-toast*`                                                 |
| Loading and query states | `LoadingContent`, `LoadingScreen`, `QueryContent`                                               |
| Content placeholders     | `Skeleton`, `SkeletonContent` — `skeleton/`                                                     |
| Screen layout            | `PageScreen`, `AuthScreenFrame`, `ScreenError`                                                  |
| Fields and submission    | `UniversalTextInput`, `UniversalTextInputContent`, `FormTextInput`, `NativeField`, `FormSubmit` |
| Toggles                  | `Switch` — `switch.<platform>.tsx`, inherits Host light/dark switch tokens                      |
| Typography               | `UniversalText`, `UniversalTextContent`, `AuthText`                                             |
| Navigation presentation  | `ReferenceNavigationBar`, `SegmentedControl`, `RecipeStepper`                                   |
| Recipe presentation      | `RecipeCard`, `HomeRecipeCard`                                                                  |
| Native composition       | `UniversalHost`, `Column`, `Row`, `Spacer`, `RNHostView`, `nativeFillWidth`                     |
| Specialized artwork      | `AuroraBackground`, `PageMotionOverlay`, `LaunchScreen`                                         |

`AuthText` directly aliases `UniversalTextContent` in the public entry point.
`UniversalListItem` directly aliases the themed `ListItem` platform adapter,
including its Leading, Supporting and Trailing slots. The compatibility names
share the same components and add no rendering wrappers.

## Localization

`LanguagePicker` renders the native French, English and Arabic menu. It accepts an
optional `testID`, uses dictionary autonyms, and is enabled when `LanguageProvider`
has restored the preference. `PageAppearanceControls` includes it on every page;
the profile sheet also exposes it. The provider updates the existing RTL context
without remounting forms or navigation. See [localization](../../../docs/localization.md)
and the native `Pages/Localization` story for behavior and verification limits.

Translate component labels in the caller with `useTranslation().t()`. Shared
loading, query, validation and accessibility messages use the same dictionaries.
`PageScreen` actions accept a stable `testID` so selectors and React identity stay
independent of translated labels.

## Buttons and Hosts

The shared [light/dark themes](../../../docs/appearance-themes.md) live in
`src/constants/themes/`, with one palette per brand. Runtime UI and authentication
use `useThemeColors` to select the active palette. Primary fills
use `primary` / `onPrimary`, secondary actions use `secondary`, and links use
`tint`. Filled feedback actions use their matching foreground token. Native
Storybook's `Expo UI/Theme Tokens` shows every token for all four brands in both modes, and existing
control stories share these values. `AuroraBackground` accepts an optional
`colorScheme` and otherwise inherits its Host/device appearance.

Use `UniversalButtonContent` inside an existing `UniversalHost`, `PageScreen`, or
`AuthScreenFrame`. Use `UniversalButton` at a React Native boundary; it owns its Host.
Every button requires `variant`: `primary`, `secondary`, `link`, `success`, `warning`,
or `destructive`.

`borderRadius` and `contentPadding` optionally override native geometry for custom
button content. Recipe cards pass zero for both, so Android's default pill shape
cannot clip their image and text. Ordinary buttons omit these props and retain
native defaults. Card image/surface corners are independently set to 14 points.

```tsx
import { PageScreen, UniversalButtonContent } from '@components/ui';

<PageScreen title="Recipes" description="Your saved recipes.">
  <UniversalButtonContent variant="primary" label="Save" onPress={save} disabled={pending} />
</PageScreen>;
```

The Host supplies its scheme and optional `buttonPalette`. `AuthScreenFrame` supplies
the auth palette automatically. A button's explicit `colorScheme` or `palette`
overrides inheritance. Pending actions use `disabled`; native control feedback,
disabled treatment and clickable surfaces remain in the platform implementations.
Icon-only controls, floating actions and selected navigation tabs also live here,
with their specialized native geometry and accessibility semantics.

## Switch tokens

Import `Checkbox`, `Slider`, `Picker`, `List`, `ListItem`, `FieldGroup`,
`Collapsible`, and `SegmentedControl` through `@components/ui`. Their platform
adapters read the owning Host scheme and map shared `control*` roles plus
`text`, `muted`, and `divider` to the colors Expo exposes. The compound APIs
(`Picker.Item`, `ListItem.Leading/Supporting/Trailing`, and FieldGroup sections)
remain available. Showcase wrappers use these production adapters.

An explicit Host seed still affects native generated colors; app token mappings
take priority. SwiftUI owns segmented selected surfaces, slider thumbs, and
native menu presentation. Android's Slider API does not expose disabled colors.
See [control theme coverage](../../../docs/control-theme.md) for platform
mappings and validation limits.

## Switch state colors

Import `Switch` from `@components/ui` inside a `UniversalHost`. It preserves Expo
UI's `value`, `onValueChange`, `label`, `disabled`, `testID` and `modifiers` API.
Android maps the shared `switchTrackOn/Off`, `switchThumbOn/Off`, off border and
disabled switch tokens to the native Compose color props. iOS applies
`switchTrackOn` as native tint; SwiftUI owns its thumb, off track and disabled
appearance. Both adapters inherit the Host scheme and suppress disabled changes.
Caller modifiers remain available as native overrides. See `Expo UI/Universal
Switch` for interactive on/off, disabled, light/dark and token stories; `Expo
UI/Theme Tokens` includes switch controls and every switch color swatch.

## Skeleton placeholders

`src/components/ui/skeleton/` contains the component, platform modifiers and
shared pulse hook. Its `index.ts` exposes `Skeleton`, `SkeletonContent` and their
types through the existing `@components/ui` imports.

`Skeleton` owns a Host at an RN boundary; use `SkeletonContent` inside an existing
Host, Row, or Column. It adapts `Reference/components/skeleton/skeleton.tsx` with
rounded shapes, 12-point corners and 0.72 peak opacity. The shared `border`
color supplies the neutral fill in light/dark mode; content inherits the owning
Host's scheme unless `colorScheme` overrides it.

```tsx
import { Column, SkeletonContent } from '@components/ui';

<Column spacing={8}>
  <SkeletonContent style={{ width: 96, height: 96, borderRadius: 14 }} />
  <SkeletonContent style={{ height: 20 }} />
  <SkeletonContent style={{ width: 120, height: 12, borderRadius: 9999 }} />
</Column>;
```

Supported style fields are `width`, `height`, `borderRadius`, `backgroundColor`
and `opacity`. Numeric dimensions are native points/dp. Omitted width or `'100%'`
fills a constrained parent; default height is 16. Other percentage sizes, flex
styles and style arrays are not supported. Native adapters apply sizing before
the background so full-width placeholders retain their height and visible fill.
Shapes pulse by default between the configured opacity and 45% of that opacity,
with a 900-ms fade in each direction. Set `animate={false}` for a static shape
that bypasses both the pulse hook and motion lifecycle subscriptions;
pass the screen's focus flag to pause offscreen. Reduced motion and backgrounding
also restore the static appearance. One shared timer changes native animation
targets at each endpoint, and SwiftUI/Compose interpolate the frames. There are
no per-frame React updates, animated dimensions, or additional Hosts. A busy JS
thread can delay the next endpoint; the current transition remains native.
Placeholders are passive and have no children or press handler.
Keep loading/error/retry announcements in the owning loading-state composition.
See `Expo UI/Skeleton` in native Storybook for both themes, shapes, static mode,
pause/resume, opacity and a
reference search-card composition, including a narrow container. Android applies
opacity directly to the fill color, preserving existing transparency without a
separate compositing layer.

Home uses static placeholders and removes the entire preview ten seconds after
mounting. Its isolated timeout does not rerender query consumers or restart on
refresh/tab focus, and is canceled when the screen unmounts. `StaticReferenceCard`
in native Storybook covers the static composition. The Home flame component and
its Storybook example have been removed. Timed disappearance and scroll smoothness
still need a native device check.

## Adding or changing UI

`HomeRecipeCard` adapts Reference's popular and editor's choice cards with
`variant="popular"` or `variant="editorial"`, explicit `width`, display data,
`onPress`, and an optional `testID`. Popular cards place likes and chef pills over
a rounded image; editorial cards add a category badge, description, and metadata.
The image adapters use a Compose Box or SwiftUI ZStack to keep the native pills
above passive `expo-image` content, with no extra Host or animation loop.
`Recipes/Home recipe card` covers light/dark variants, long titles, a press
counter, and 21-card horizontal/vertical lists in both themes. See [Home card examples](../../../docs/home-recipe-card-examples.md) for
the bundled sample data, local preview interaction, and native verification limits.

Home's editorial list uses a native `ScrollView` with `style={{ height: 300 }}`.
The viewport stays fixed while all 21 cards scroll inside it. Its existing
light/dark collection stories cover this composition.

Export shared components from `index.ts`, keep iOS/Android adaptations in platform
files here, and add a native story under `.rnstorybook/stories`. Screens and feature
workflows import the public entry point. ESLint enforces this boundary and keeps
feature workflows and Storybook out of UI implementations.

`MonoText`, its story and its unused SpaceMono font were removed. Eleven hosted
wrappers used only by stories now live in `.rnstorybook/components/showcase/`.
Their stories remain available. App screens compose the exported native controls
inside `UniversalHost`. The map uses the lazy `@components/ui/map-experience`
module so it is loaded only when its route opens.

The direction-only `LayoutDirectionFrame` lives in
`.rnstorybook/components/layout-direction-frame.tsx` alongside other native
fixtures. Stories import it directly; the production UI entry point exposes the
direction controls used by app pages.

Run `npm run storybook:generate` after changing stories, then `npm run typecheck`,
`npm run lint`, and affected behavioral checks. Native checks require a running app.

Layout direction switches live through `LayoutDirectionProvider`; `UniversalHost`
inherits it for native content and RN boundaries. Use the shared `BottomSheet`
export to retain direction/theme inside presented content. See
[live LTR / RTL](../../../docs/layout-direction.md) for usage and native fixtures.

Each page ends its content with `PageAppearanceControls`: RTL/LTR and dark/light switches plus the brand picker. `PageScreen` and `AuthScreenFrame` append the controls inside their existing scroll content after the last action. `PageFrame` keeps title/back navigation at the top and appends a hosted footer below specialized map/canvas content. Preferences stay in root providers across navigation. See [appearance themes](../../../docs/appearance-themes.md) and `Pages/Appearance footer` / `Expo UI/Theme Tokens`.
