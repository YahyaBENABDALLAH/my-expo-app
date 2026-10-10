# Universal component catalog

SDK/package versions refreshed 2026-10-10: Expo `~57.0.27` and installed `@expo/ui` `57.0.21` (exact manifest pin). Expo UI `57.0.22` crashes on Android numeric widths; the pin and scoped dependency-validation exclusion are documented in `docs/build-verification.md`. The component inventory uses [SDK 57 universal documentation](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/); resolve actual installed versions before future edits. Packages are installed without project patches.

Authoritative local export inventory: `node_modules/@expo/ui/src/universal/index.ts`. Read component `types.ts` and native implementations alongside the linked API page. This catalog records availability and proposed verification, not proof that all behavior has passed.

## All 19 components

Application wrapper names below refer to `src/components/ui/`. The hosted showcase
wrappers for BottomSheet, Checkbox, Collapsible, Column, FieldGroup, Icon, List,
Picker, ScrollView, Slider and Switch live in `.rnstorybook/components/showcase/`;
they have no application consumers. The public `@components/ui` API combines
the application adapters below with direct Expo UI layout/icon exports.
Story names refer to `.rnstorybook/stories/expo-ui/`.
Existing stories are recorded without implying full behavioral coverage.

Each component family has a folder and README. Keep its implementation,
platform adapters, types and private helpers together. The root public barrel
retains existing imports; implementations import concrete files directly.
See the [folder guide](../../../../src/components/ui/README.md).

| Component / official SDK 57 API                                                     | Local wrapper                                                                           | Existing story                                      | Scenarios to document and verify                                                                                    |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [Host](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/)               | `host/universal-host.tsx`                                                               | Used by stories; dedicated coverage pending         | Light/dark, seed color, intrinsic versus constrained sizing, direction, nested content visibility                   |
| [Column](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/column/)           | Direct Expo UI export; Storybook showcase                                               | `column.stories.tsx`                                | Spacing/alignment, long text, nested rows, narrow screens                                                           |
| [Row](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/row/)                 | Direct Expo UI export                                                                   | Dedicated coverage pending                          | Alignment/spacing, RTL, fitting text and controls without clipping                                                  |
| [Text](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/text/)               | `text/universal-text.tsx`                                                               | `text.stories.tsx`                                  | Theme roles, long content, font scaling, supported typography                                                       |
| [Button](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/button/)           | `button/universal-button.tsx`, `button/universal-button-content.<platform>.tsx`         | `button.stories.tsx`                                | Required intent variants, disabled suppresses actions, one press produces one action, full visible surface responds |
| [ScrollView](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/scrollview/)   | Direct Expo UI export; `refreshable-scroll-view/refreshable-scroll-view.<platform>.tsx` | `scroll-view.stories.tsx`; Pages/Navigation shell   | Scrolling, keyboard, short/tall content; refresh completion, repeated gestures, errors and recovery                 |
| [Switch](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/switch/)           | `switch/switch.<platform>.tsx`                                                          | `switch.stories.tsx`                                | On/off, disabled, callback updates visible state, reset                                                             |
| [Slider](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/slider/)           | `slider/slider.<platform>.tsx`                                                          | `slider.stories.tsx`                                | Minimum/maximum, step, disabled, value updates, drag interaction                                                    |
| [Checkbox](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/checkbox/)       | `checkbox/checkbox.<platform>.tsx`                                                      | `checkbox.stories.tsx`                              | Checked/unchecked, disabled, state change and reset                                                                 |
| [BottomSheet](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/bottomsheet/) | `bottom-sheet/bottom-sheet.tsx`                                                         | `bottom-sheet.stories.tsx`                          | Open/close, swipe/back/outside dismissal where supported, reopen, scrolling tall content                            |
| [Collapsible](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/collapsible/) | `collapsible/collapsible.<platform>.tsx`                                                | `collapsible.stories.tsx`                           | Expand/collapse reveals and hides content, long header/content                                                      |
| [FieldGroup](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/fieldgroup/)   | `field-group/field-group.<platform>.tsx`                                                | `field-group.stories.tsx`                           | Labels/supporting text, grouped fields, empty/error composition, keyboard                                           |
| [Icon](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/icon/)               | Direct Expo UI export; Storybook showcase                                               | `icon.stories.tsx`                                  | Valid symbols on both platforms, size/tint, meaning conveyed by adjacent text                                       |
| [List](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/list/)               | `list/list.<platform>.tsx`                                                              | `list.stories.tsx`                                  | Empty/short groups, row selection, refresh if exposed, scroll behavior                                              |
| [ListItem](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/list/)           | `list-item/list-item.<platform>.tsx`; direct `UniversalListItem` alias                  | Within `list.stories.tsx`; focused coverage pending | Leading/supporting/trailing slots, press/disabled, long text, accessory alignment                                   |
| [Picker](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/picker/)           | `picker/picker.<platform>.tsx`                                                          | `picker.stories.tsx`                                | Menu/wheel differences, selected value, disabled, value callback, long option labels                                |
| [RNHostView](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/rnhostview/)   | Direct Expo UI export                                                                   | Dedicated coverage pending                          | Necessary RN infrastructure inside native trees, intrinsic sizing and interaction; no substitute RN controls        |
| [Spacer](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/spacer/)           | Direct Expo UI export                                                                   | `spacer.stories.tsx`                                | Horizontal/vertical expansion in constrained layouts                                                                |
| [TextInput](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/textinput/)     | `text-input/universal-text-input.tsx`                                                   | `text-input.stories.tsx`                            | Empty/type/clear/reset, controlled updates, password, editable/read-only, focus/blur, keyboard, multiline           |

## Compound exports and helpers

### Public UI entry point (2026-10-04)

`@components/ui` resolves to `src/components/ui/index.ts`. Screens import their
shared controls, text, layouts and states through this entry point. UI
implementations use sibling imports. Shared presentation now includes
`AuthScreenFrame`, `AuthText`, `FormTextInput`, `FormSubmit`, `NativeField`,
`PageScreen`, `QueryContent`, `RecipeCard`, `ReferenceNavigationBar`, `ScreenError`,
`ErrorToastHost`, `AuroraBackground` and `LaunchScreen`. Feature modules retain
workflow state and the tab navigation controller.

`AuthButton` has been removed. All auth actions use `UniversalButtonContent` with
the owning Host's `buttonPalette`. An explicit component `palette` overrides it;
`colorScheme` still overrides scheme inheritance. Palettes consume `tint`,
`background`, `success`, `warning`, `error` and optional `onAccent`. The auth palette
preserves its filled-label colors. Auth screen stories have explicit light/dark
schemes; button stories include both auth palettes. `MonoText`, its story and the
unused SpaceMono font were removed. Eleven hosted showcase wrappers were moved
into `.rnstorybook/components/showcase/`; native control stories remain available
without exporting their development fixtures from the app library.

`tests/layout/universal-button.test.mjs` exercises the real Host context and button
adapters with mocked native boundaries: scheme/palette inheritance, overrides,
intent colors, standalone forwarding, disabled suppression and custom/full-width
content. These checks establish JS behavior; native rendering still requires devices.

### Shared page motion

The current default is the full-screen `AuroraBackground`, mounted behind root
navigation. Stack/tab scenes, page frames, headers, auth forms, loading and recovery
boundaries reveal the theme-aware shader through transparent containers. It supports
`animate`, `colorScheme`, optional shared `hue` and RN boundary `style`; native layout
sets resolution. Its UI-thread clock stops during static mode, inactive app state and
live Reduce Motion changes. Decoration ignores touches and accessibility.
`aurora-background.stories.tsx` covers Light, Dark, Static and NarrowPhone with page
content, native buttons, press counts and pause/resume. The corresponding Maestro
flow is `aurora-background.yaml`; native execution remains pending.

`LaunchScreen` now reports native layout with optional `onReady`. The root hides the
native splash at that point and retains the animated screen for the user-requested
three seconds, then exits once startup is also ready. Its existing 300-ms transition
completes immediately under reduced motion. `launch-screen.stories.tsx` provides a
replayable ThreeSeconds preview. Root JS fixtures exercise fast/slow restoration and
the timing boundary. These statements supersede the readiness-only startup behavior
recorded later in this catalog; actual native rendering and timing remain unverified.

The following top-edge wave is retained as optional artwork and a composition story;
it is no longer the root default:

`PageMotionOverlay` (`src/components/ui/page/page-motion-overlay.tsx`) provides a single 144-point-tall Skia canvas above the root navigation tree. It covers all routed pages, including authentication, details, and utility screens, without modifying their native control trees. `animate` defaults to true; optional `colorScheme` supplies deterministic light/dark previews. It consumes existing `tint` and `tabIconSelected` colors. Two oversized paths drift gently in opposite directions on a shared 12-second UI-thread loop. Width follows the wrapper's `onLayout` event, with no per-frame measurement or React updates. `useMotionEnabled` cancels/resets motion during background/inactive states, live Reduce Motion changes, and explicit static mode. The root keeps it static beneath the launch screen.

Both wrapper and canvas ignore touches, and the decorative wrapper is hidden from accessibility. `.rnstorybook/stories/pages/page-motion.stories.tsx` covers Light, Dark, Static, and NarrowPhone with native buttons underneath the artwork, a visible action count, and pause/resume. `.maestro/storybook/page-motion.yaml` checks single tap delivery and those control states. These fixtures do not prove animation timing, actual native stacking, screen-reader behavior, rotation, or device performance; see [shared motion verification](../../../../docs/shared-skia-motion.md).

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

Home renders 21 popular samples horizontally and the same 21 editorial samples
vertically outside API query content. The editorial section uses a native
ScrollView with a fixed 300-point/dp height. All 21 cards scroll inside it, with
no viewport measurements. The finite lists render eagerly and reuse three local
images. Taps open a local native preview sheet; fake identifiers never reach
recipe routes. English/French/Arabic copy and three bundled 800-pixel JPEGs
require no runtime fetch. `pages/home-recipe-card.stories.tsx` covers both variants
in light/dark themes, long titles, a visible press counter, and complete 21-card lists.
`tests/recipes/home-cards.test.mjs` checks sample selection, both dismissal paths,
matching 21-item lists and last-card selection, compact widths, no fetching/interval
clocks, and live preview translation.
Metro resolution checks cover both image adapters. Native stacking/touch
coverage, RTL, large type and release smoothness require device verification.
See `docs/home-recipe-card-examples.md` for implementation and limitations.

### Skeleton placeholders (2026-10-04)

`Skeleton` / `SkeletonContent` (`src/components/ui/skeleton/skeleton.tsx`) adapt Reference's
placeholder using universal Expo UI `Column`. The standalone component owns
a Host at an RN boundary; content inherits the owning Host's scheme with an optional
`colorScheme` override. Props: `animate` (default true), `testID`, `colorScheme`, and `style` with numeric width/
height, borderRadius, backgroundColor and opacity. Omitted width or `'100%'` fills a
constrained parent. Defaults: height 16, radius 12, opacity 0.72, semantic `border`
fill. No interaction, children, flex styles, style arrays or arbitrary
percentage sizes. Sizing/background/clip order is isolated in native modifier
adapters; SwiftUI requires separate fixed-height and flexible-width frames. Android
applies opacity to the fill color itself, preserving an existing color alpha and
avoiding a separate compositing layer for each placeholder.

The pulse fades between the requested opacity and 45% of it in 900 ms per direction.
`src/components/ui/skeleton/use-skeleton-pulse.ts` shares one endpoint timer across mounted animated shapes;
SwiftUI opacity and Compose background-color modifiers interpolate frames natively.
No frame-by-frame React renders, extra Hosts, layout measurements, or dependencies.
JS congestion can delay the next endpoint; this is not an autonomous UI-runtime
loop. `animate={false}`, live reduced motion, and inactive app state unsubscribe
and restore the configured opacity. Static shapes bypass the pulse hook entirely,
creating no pulse timer or motion lifecycle subscriptions. Home uses this static
path and unmounts the complete preview ten seconds after the screen mounts;
refreshing or switching tabs does not restart that preview.

`.rnstorybook/stories/expo-ui/skeleton.stories.tsx` covers Light/Dark, image, circle,
pill, custom appearance, static mode, StaticReferenceCard, pause/resume, opacity 0/0.35/1 and Reference search-card compositions with inherited
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

- Auth screens use one Host per AuthScreenFrame, including account, and native ScrollView/Column children. AuthText and UniversalButtonContent are host-free; FormTextInput uses UniversalTextInputContent. Do not insert RN View/RNHostView between these native controls and their Host. The session-restoration panel owns a separate Host.
- UniversalTextContent and UniversalTextInputContent are native composition exports alongside the existing RN-layout adapters. They preserve text palette roles and field text/muted/tint/surface/border/status roles; field refs, observable value, focus/blur, editable/read-only, and password props remain available. Input content does not expose the adapter's RN touch observer (`onPress`) or measure layout in JS. Use numeric widths or the platform native-fill-width modifiers, not percentage universal widths.
- TextInput supports `leftIcon` and `rightIcon` (Expo UI `Icon` names; prefer `Icon.select`), `onRightIconPress`, and `rightIconAccessibilityLabel`. SDK 57 has no universal input icon slots, so native Row/Icon/Button surround the same TextInput inside one field surface. Android weights the input; iOS expands it with a frame. Icons use muted/tint roles; the right action keeps native Button feedback and padding. Omit the callback for a decorative right icon. `disabled` blocks the action; readOnly/editable affect editing only. Style applies to the whole field with icons; textStyle and modifiers still target the input. The existing adapter onPress touch observer also observes icon touches. `text-input.stories.tsx` includes left/right, clickable light/dark, and disabled examples with a visible action count. `.maestro/storybook/text-input-icons.yaml` checks clear, typing, one callback per tap, and disabled suppression; native execution, narrow widths, multiline, font scaling, and accessibility remain unverified until run on devices.
- Disabled TextInput styling dims only the input text/placeholder and icons. The shared native Row owns the border and surface for fields with or without icons, so submission does not fade their colors or the label/helper text. Editing and right-icon actions remain disabled; focus and status still select the usual border color. Disabled and DisabledIcons stories expose this treatment; the existing icon flow checks action suppression. Native appearance requires device inspection.
- On iOS, TextInput uses `strokeBorder` with a rounded rectangle matching the numeric `style.borderRadius` and `style.borderWidth`. This avoids SDK 57's universal style conversion clipping a rectangular border at the rounded corners. The surface retains its rounded clip; the inset border uses the resolved focus/status/palette color and supports a zero width. Android retains its native style border. `RoundedBorder` and `RoundedBorderLight` stories expose a thicker semantic border for checking every corner, alongside existing Focused, DisabledIcons and Multiline stories. Native iOS appearance remains unverified without a device or simulator.
- `auth-screen.stories.tsx` covers the actual frame, text, fields, and native buttons in one Host, with local validation and pending state. `.maestro/storybook/auth-screen.yaml` checks editing, validation, visibility, submit count, and pending suppression. Native iOS/Android rendering, keyboard/scroll behavior, light/dark appearance, and selectors require a connected device; static checks and story registration do not prove them.
- FormTextInput reserves a two-line, font-scale-aware message slot so validation does not insert/remove layout rows. Long messages are limited to two lines. Error feedback uses Android Reject / iOS Error haptics on the valid-to-invalid transition; a 250 ms shared gate coalesces simultaneous field errors. Color feedback remains immediate. Native layout and physical haptics still require device verification.
- FormTextInput supports `passwordToggle="icon"` to toggle password masking through the universal input's right eye icon; the default remains the text button. Login/register fields use shared person/mail/lock icons, including an independent eye toggle for registration confirmation. Colors follow the auth palette, with muted leading glyphs and tint for the action; pending disables it. Auth Screen stories PasswordIcons/PendingPasswordIcons cover composition; auth login/register Maestro flows assert reveal and masking. Native layout, keyboard/focus across SecureField/TextField swaps, and screen-reader behavior remain device checks.
- Right-icon spacing refinement: `text-input-icon-button.android.tsx` uses Expo UI's native Compose IconButton instead of a text Button with Material text-button padding. iOS keeps a plain 44-point button; Android uses a 48-dp icon target. The field places vertical padding on the editable text only and reduces right inset to 2, avoiding button height plus two outer padding layers. Existing ClickableRightIcon/light/disabled and PasswordIcons stories exercise this shared composition; existing icon/auth Maestro flows retain their selectors. Device geometry remains unverified.
- Native icon button resolution: shared declarations live in `text-input-icon-button.d.ts`, never a declaration-only `.ts` beside `.ios.tsx`/`.android.tsx`. Metro checks source extensions in order, so a plain `.ts` can shadow native `.tsx` implementations and produce an undefined component. `tests/layout/native-input-resolution.test.mjs` checks both platforms with the installed Metro resolver and Expo extension ordering; native interaction still requires devices.
- TextInput maintenance review: Context7 examples were cross-checked with SDK 57 docs and installed source because search results included newer versions. All icon fields now apply resolved vertical padding to the text once; explicit shorthand/directional padding is respected without padding the native action twice. The private icon button uses a narrow shared props interface, avoiding unsupported Button props on Android. FormTextInput shares its visibility callback/label and preserves an explicitly supplied secureTextEntry for non-password-mode callers. CustomPaddingIcons and ReadOnlyIcons stories cover the changed contract; the icon Maestro flow also covers a read-only field's separate action. Observable values, caller refs, native Host ownership, and isolated platform modifiers remain the intended design. React Hook Form validation still runs on JS; no per-keystroke wrapper state was added. Native focus/cursor across iOS secure/nonsecure swaps, screen-reader labels, font scaling, and geometry require devices.

- Root imports select SwiftUI on iOS and Compose on Android. Ordinary native trees need Host. BottomSheet in this installed version creates its own internal native Host; follow its implementation and existing wrapper rather than blindly nesting another host.
- BottomSheet uses `isPresented` and `onDismiss`. Android Material sheet states do not guarantee exact parity with iOS fractional/height detents; document and verify each supported platform behavior.
- Picker wheel appearance is iOS-specific; Android uses its dropdown behavior.
- List is for short native groups, not a virtualization solution for unbounded feeds. Do not silently replace it with a disallowed UI control or render huge data trees. Raise the requirement and resolve an approved approach if needed.
- Existing wrappers and stories can contain styling or RN content that predates the mobile-only skill. Their presence is not an exception for new work. Correct only the touched scope and document remaining drift.

## Error notifications

`error-toast.android.tsx` uses [Compose SnackbarHost](https://docs.expo.dev/versions/v57.0.0/sdk/ui/jetpack-compose/snackbar/). SDK 57 has no universal or SwiftUI Snackbar; `error-toast.ios.tsx` composes native SwiftUI HStack/Text/Button inside UniversalHost. The shared contract is `message`, `onDismiss`, and optional `colorScheme`; mount a new keyed instance per notification. Colors consume `surface`, `error`, and `text`; native button and Snackbar geometry are retained. Android uses the long native timeout and close control. iOS wraps multiline text, announces to VoiceOver, holds while a screen reader is enabled, and otherwise dismisses after six seconds.

`ErrorToastHost` provides a safe-area top overlay above navigation, queue retention before mounting, and stable dismissal IDs. Shared query/mutation cache callbacks and imperative auth failures report through `src/lib/error-toasts.ts`; client-side field validation and retry buttons stay on screens. `FormTextInput.onEdited` is now optional because auth forms no longer maintain inline API errors; existing stories can still use it for local feedback.

`error-toast.stories.tsx` covers light/dark, long text, multiline validation messages, dismissal count, and reopening. `.maestro/storybook/error-toast.yaml` checks visible text, dismissal, and reopening. Real Axios/TanStack tests cover error messages, coalescing, queues, retries, callbacks, canceled reads and session changes. Metro-resolution checks cover both native implementations. Native appearance, font scaling, narrow screens, VoiceOver/TalkBack, overlay stacking, keyboard visibility, and dismiss selectors require devices; no native execution is claimed.

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

UniversalButton and UniversalButtonContent require a variant: primary, secondary, link, success, warning or destructive. Legacy size, rounded and semanticVariant props are removed. The standalone wrapper owns a Host; the content component uses native Compose Button/OutlinedButton/TextButton or SwiftUI Button inside its existing Host. Colors use shared semantic tokens while preserving native geometry, feedback and disabled treatment. Full-width iOS labels expand inside the button surface. The Interaction story has an observable count, a disabled control and reset; its Maestro flow is .maestro/storybook/button.yaml.

UniversalHost provides its resolved scheme to content through useHostColorScheme. Ordinary composition uses Row/Column/Spacer, with nativeFillWidth/nativeFillSize/nativeRowWeight where the native APIs differ. Spacer is imported directly; its redundant wrapper is removed. The navbar shares one Host and a weighted native row, keeping its RN absolute geometry only for the raised action. Context action appearance follows an explicit kind, not its translated label.

LoadingIndicator is a host-free platform adapter using SwiftUI ProgressView or Compose CircularProgressIndicator. LoadingContent composes a native row with an indicator and text; LoadingScreen owns a full-screen Host for route/Suspense boundaries. loading-state.stories.tsx exercises fetching, disabled, offline, persistent error, successful empty, cached refresh and refresh failure, plus full-screen and light/dark compositions. .maestro/storybook/loading-state.yaml checks observable state transitions. JS render tests establish query state selection; native layout/interaction verification is recorded in docs/production-fixes-plan.md.

Screen recovery, launch text, maps/Skia captions and controls now use Expo UI. RN boundaries remain for native maps, canvas/Lottie artwork, keyboard/safe areas, navigation and absolute overlays. Launch waits for actual font/session readiness, with a 300-ms exit and immediate completion under reduced motion. Native-only no-op loaders and unused web branches were removed. The selected redundancy cleanup on 2026-10-05 also removed the web CanvasKit copy script, WASM asset and favicon; the 2026-10-10 cleanup removes the remaining Expo UI postinstall patch.

### Floating-action native verification follow-up

FloatingActionLayout is a host-free Box/ZStack platform adapter for stacking RN artwork and the native control in one hosting tree. Android gives the control layer a native zIndex. FloatingAction uses passive touch observation to schedule feedback and leaves action delivery with its native button; earlier Gesture.Native descriptions are historical. NativeControl isolates the underlying button in the navigation story. Updated native Metro resolution checks and the numeric/offscreen harnesses pass; final composed native activation is unverified after an ADB driver connection closed. See [current verification](../../../../docs/navbar-wave-verification.md).

### Light navigation dock shadow correction (2026-10-04)

ReferenceNavigationBar disables shadowOpacity and all three RN elevation layers in light mode. Android elevation independently casts a shadow, so lowering shadowOpacity alone would retain the grey halo. Existing zIndex values keep the controls and raised action above the decorative glass. Dark-mode elevations, glass adapters, dock geometry, native tab feedback and action motion are retained. The existing Light/Dark and GlassAndTap/DarkGlassAndTap stories cover appearance; actual blur, stacking and edge taps require native verification.
