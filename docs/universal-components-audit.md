# Universal component feasibility audit

Reviewed 2026-10-11 against installed Expo `57.0.27`, React Native `0.86.3`, and
`@expo/ui` `57.0.21`. The initial analysis is retained below; the implemented
behavior-preserving follow-up is recorded at the end.

**Universal-first is feasible. Universal-only cannot preserve all current behavior
with the installed Expo UI API.** A shared public API already exists through
`@components/ui`. Removing duplicate component trees is a different goal from
removing every native component and modifier import.

The initial audit found **50 platform files: 25 iOS/Android pairs**, all
under `src/components/ui/`. These comprise 22 component pairs and three modifier
helper pairs. Nine pairs have direct root component counterparts, five are custom
controls that could share more composition, and eleven cover native features or
modifier gaps. These counts describe opportunities, not completed migrations or
25 interchangeable implementations.

Context7 was used for the universal API, button customization, and refresh support.
Its responses included `latest` and SDK 58 examples, and its Expo source library
listed versioned branches only through SDK 56. Accordingly, the conclusions below
were checked against the [SDK 57 overview](https://docs.expo.dev/versions/v57.0.0/),
the [Expo documentation index](https://docs.expo.dev/llms.txt), versioned component
pages, and the actual installed types and platform implementations.

The decisive local inventory is
[Expo UI's root exports](../node_modules/@expo/ui/src/universal/index.ts).
The installed release exports 19 component families, plus state helpers. It has
no root `IconButton`, `ProgressView`, `CircularProgressIndicator`, `Snackbar`,
`SegmentedControl`, `Box`, or `ZStack` export. Those omissions concern the root
API; several exist in the platform packages or community entry points.

## Nine pairs with a direct universal counterpart

These can use a shared wrapper if the differences listed below are addressed.
None is an unconditional deletion of both native adapters while retaining every
current theme, selector, and geometry guarantee.

| Pair: iOS / Android                                                                                                                                                  | Root counterpart               | Feasibility and current difference                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Switch](../src/components/ui/switch/switch.ios.tsx) / [Android](../src/components/ui/switch/switch.android.tsx)                                                     | `Switch`                       | Shared value, label, disabled state, callback, selectors, and modifier forwarding are already supported. The Android adapter adds explicit on/off and disabled track, thumb, border, and icon colors; iOS adds tint and label color. Root `SwitchProps` has no color palette prop. Use the root control if Host-derived native colors are acceptable; retain the color adapter for exact theme tokens.                                                                                                                            |
| [Slider](../src/components/ui/slider/slider.ios.tsx) / [Android](../src/components/ui/slider/slider.android.tsx)                                                     | `Slider`                       | The installed universal Android implementation already converts `step` to native steps and rounds callback values, matching the local logic. Both platforms support range, disabled state, and selectors. The remaining reason for the local implementations is tint and Android track/thumb/tick colors. A shared wrapper can retain the JS disabled callback guard; exact palette control still requires native customization.                                                                                                  |
| [Checkbox](../src/components/ui/checkbox/checkbox.ios.tsx) / [Android](../src/components/ui/checkbox/checkbox.android.tsx)                                           | `Checkbox`                     | Universal already handles labelled row activation, checked state, callbacks, and disabled state. Local adapters add explicit checkmark, selected, unselected, and disabled colors, plus iOS foreground/tint. Root props do not expose these colors. Consolidate if native Host colors are sufficient; retain callback guards in a shared wrapper where required.                                                                                                                                                                  |
| [Picker](../src/components/ui/picker/picker.ios.tsx) / [Android](../src/components/ui/picker/picker.android.tsx)                                                     | `Picker` and `Picker.Item`     | Available, but the installed implementation is not equivalent. Local options flatten fragments and distinguish numeric `1` from string `'1'` in React keys. Upstream extraction ignores fragment-contained options and uses `String(value)` keys. Android upstream also does not forward `testID`, lacks option selectors/colors, and does not close an already open menu when disabled. A shared wrapper can normalize children/values, but exact menu styling, selectors, and disabled-menu behavior still justify the adapter. |
| [Collapsible](../src/components/ui/collapsible/collapsible.ios.tsx) / [Android](../src/components/ui/collapsible/collapsible.android.tsx)                            | `Collapsible`                  | Same controlled expansion API and native disclosure/animation mechanics. Local implementations customize collapsed/expanded backgrounds, arrow tint, and content color. Root props offer `labelStyle`, but no container color or modifier escape hatch. This is a good simplification candidate if native default surfaces and arrows are acceptable.                                                                                                                                                                             |
| [List](../src/components/ui/list/list.ios.tsx) / [Android](../src/components/ui/list/list.android.tsx)                                                               | `List`                         | Universal already supports `onRefresh` and `testID`. The local Android implementation adds a synchronous duplicate-refresh guard and explicit indicator/background colors; iOS hides the default content background and applies theme colors. A shared promise guard can preserve refresh coordination. Root `ListProps` has no style/modifier prop for preserving the rest.                                                                                                                                                      |
| [ListItem](../src/components/ui/list-item/list-item-appearance.ios.tsx) / [Android](../src/components/ui/list-item/list-item-appearance.android.tsx)                 | `ListItem` and its slots       | Both local adapters already render root `ListItem`. This is the strongest candidate for shared JSX with a small modifier helper. Root `colors` works on Android only; iOS still needs row background/separator modifiers and slot text treatment. The installed Android root implementation ignores `testID`, so its explicit native selector modifier must be preserved. A root-only default wrapper would lose those details.                                                                                                   |
| [FieldGroup](../src/components/ui/field-group/field-group.ios.tsx) / [Android](../src/components/ui/field-group/field-group.android.tsx)                             | `FieldGroup` and section slots | Universal already provides native grouped sections, headers/footers, connected Android row shapes, and implicit section grouping. Local adapters provide exact section/row/header colors, iOS separator/background treatment, and stable keys for conditional rows. Root section props do not expose an Android row palette. Keep shared child normalization where needed; use universal defaults only after checking theme and row-state behavior.                                                                               |
| [UniversalButtonContent](../src/components/ui/button/universal-button-content.ios.tsx) / [Android](../src/components/ui/button/universal-button-content.android.tsx) | `Button`                       | The six required project intents can map to root `filled`, `outlined`, and `text` variants; custom children and disabled state are supported. Root `ButtonProps` lacks native container/content colors, shape, and content-padding props. Generic background/padding styles decorate the wrapper rather than configure the Compose button's own surface/insets. Preserve semantic palettes, full-width hit areas, and recipe-card geometry with the existing adapters until an equivalent implementation is demonstrated.         |

These comparisons use installed native source, rather than assuming that a root
export exposes every native prop. See the SDK 57
[Button API](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/button/),
[Picker API](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/picker/),
[List and ListItem API](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/list/),
and [FieldGroup API](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/fieldgroup/).

## Five custom controls that could share more composition

Root `Button`, `Icon`, `Row`, and `Column` can express much of the content.
`Icon.select({ ios, android })` can replace duplicated symbol maps. However,
root `Button` has no accessibility-label or selected-tab prop, and generic buttons
do not expose the native IconButton geometry or custom circular padding used here.

| Pair: iOS / Android                                                                                                                                                              | Possible shared composition   | What must be retained or intentionally changed                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AuthIconButton](../src/components/ui/auth/auth-icon-button.ios.tsx) / [Android](../src/components/ui/auth/auth-icon-button.android.tsx)                                         | `Button` + `Icon`             | Preserve the 48-point target, disabled suppression, translated accessibility label, and Android IconButton feedback. Root `Icon.accessibilityLabel` is documented in installed types as Android-only, so it cannot replace the iOS button label. Sharing the icon/content is straightforward; fully replacing the controls changes geometry/feedback or still needs native modifiers. |
| [PageBackButton](../src/components/ui/page/page-back-button.ios.tsx) / [Android](../src/components/ui/page/page-back-button.android.tsx)                                         | `Button` + `Icon.select`      | Preserve the 48-point target, `page-back` selector, and translated action label. iOS uses the directional `arrow.backward` symbol; Android explicitly selects the physical arrow because the installed XML loader does not read `autoMirrored`. A common symbol helper can retain this selection, but it does not remove accessibility and native control differences.                |
| [TextInputIconButton](../src/components/ui/text-input/text-input-icon-button.ios.tsx) / [Android](../src/components/ui/text-input/text-input-icon-button.android.tsx)            | `Button` with custom children | iOS already uses root `Button`; Android uses `IconButton`. A shared root text button is possible with a small native accessibility modifier helper, but Android insets, ripple, and the 48-point visible/action target must be checked. It is a proposed simplification, not established interaction parity.                                                                          |
| [FloatingActionButton](../src/components/ui/floating-action/floating-action-button.ios.tsx) / [Android](../src/components/ui/floating-action/floating-action-button.android.tsx) | `Button` + shared icon map    | Preserve the transparent 76-point circular native control above Skia artwork, zero Compose content padding, disabled surface, and action label. Root button style does not expose these Compose button properties. Share icon selection if useful, while retaining the native control adapters.                                                                                       |
| [NavigationTab](../src/components/ui/navigation/navigation-tab.ios.tsx) / [Android](../src/components/ui/navigation/navigation-tab.android.tsx)                                  | `Column` + `Icon` + `Text`    | Preserve Android `selectable(..., 'tab')`, selected accessibility semantics on iOS, native feedback, the 56-point target, and the 44-by-28 selected icon surface. A generic root `onPress` supplies an action but not equivalent tab semantics. Share labels/icons and constants; retain a small native interaction layer.                                                            |

## Eleven pairs whose native features or modifiers remain necessary

This category includes three helper pairs. It does not imply that every line
must remain duplicated: common state, content, and constants can still be shared.

| Pair: iOS / Android                                                                                                                                                                                 | Root-only feasibility                         | Reason                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [LoadingIndicator](../src/components/ui/loading/loading-indicator.ios.tsx) / [Android](../src/components/ui/loading/loading-indicator.android.tsx)                                                  | No equivalent root control                    | The native `ProgressView` and `CircularProgressIndicator` are absent from root exports. Keep these small host-free adapters to retain native loading behavior.                                                                                                                                                                                                                                          |
| [ErrorToast](../src/components/ui/error-toast/error-toast.ios.tsx) / [Android](../src/components/ui/error-toast/error-toast.android.tsx)                                                            | Requires a behavior redesign                  | Android uses native `SnackbarHost` timing, dismissal, and accessibility. iOS has a custom native row, a six-second timer, live screen-reader handling, and announcements. Root row/text/button content can be shared, but replacing Android Snackbar with it changes native behavior. Retain the platform presentation adapters.                                                                        |
| [NavigationGlassSurface](../src/components/ui/navigation/navigation-glass-surface.ios.tsx) / [Android](../src/components/ui/navigation/navigation-glass-surface.android.tsx)                        | No equivalent root surface                    | iOS uses `glassEffect` on iOS 26+ and thin material on older versions. Android uses Expo BlurView with an explicit BlurTargetView and SDK-specific blur method. Root universal styles do not express these effects. Keep the native surface distinction.                                                                                                                                                |
| [FloatingActionLayout](../src/components/ui/floating-action/floating-action-layout.ios.tsx) / [Android](../src/components/ui/floating-action/floating-action-layout.android.tsx)                    | No native stacking primitive at root          | Uses SwiftUI `ZStack` versus Compose `Box`, including Android control-layer `zIndex`, to keep native controls above hosted RN/Skia artwork. Root `Row`/`Column` arrange siblings; they do not overlay them. An RN absolute overlay is a different hosting architecture and requires native interaction verification.                                                                                    |
| [HomeRecipeCardImage](../src/components/ui/home-recipe-card/home-recipe-card-image.ios.tsx) / [Android](../src/components/ui/home-recipe-card/home-recipe-card-image.android.tsx)                   | No equivalent stacking/alignment API          | Both already share Expo Image through root `RNHostView`, but top/bottom badges need native overlay alignment, clipping, and Android stacking order. Replacing the native stacks with a Column would change badge placement. Preserve this adapter boundary.                                                                                                                                             |
| [RecipeStepperLayout](../src/components/ui/recipe-stepper/recipe-stepper-layout.ios.tsx) / [Android](../src/components/ui/recipe-stepper/recipe-stepper-layout.android.tsx)                         | No equivalent layout/measurement API          | Uses native stacks over canvas artwork, width measurement (`onGeometryChange` / `onSizeChanged`), equally weighted steps, and grouped accessibility labels. Root layout props do not cover stacking, geometry callbacks, or row weight. Keep native layout while sharing step data and artwork.                                                                                                         |
| [SegmentedControl](../src/components/ui/segmented-control/segmented-control.ios.tsx) / [Android](../src/components/ui/segmented-control/segmented-control.android.tsx)                              | No root segmented export                      | Root Picker supports menu/wheel, not segmented appearance. `@expo/ui/community/segmented-control` is an available common import, but it creates its own Host, uses selected indices/label values, omits per-option selectors, and has narrower theme support. It could reduce local files with contract/layout changes; it is not a root-only, lossless replacement.                                    |
| [RefreshableScrollView](../src/components/ui/refreshable-scroll-view/refreshable-scroll-view.ios.tsx) / [Android](../src/components/ui/refreshable-scroll-view/refreshable-scroll-view.android.tsx) | Refresh is missing from root ScrollView props | The content already uses root ScrollView. Native `refreshable` and `PullToRefreshBox` add the missing gesture/indicator. Root List has `onRefresh`, but switching page scrolling to List changes the container and layout. Keep the thin native refresh boundary and preserve promise deduplication, completion after failure, and disabled/hidden suppression.                                         |
| [native-fill-width](../src/components/ui/native/native-fill-width.ios.ts) / [Android](../src/components/ui/native/native-fill-width.android.ts)                                                     | No complete root sizing equivalent            | Adapts flexible full width/size, alignment, and row weight through SwiftUI frames versus Compose fill/weight modifiers. UniversalStyle omits flex, weight, and min/max sizing; installed native width/height conversion produces fixed size modifiers. Do not assume RN-style percentage width can replace these native constraints. Keep the small shared modifier API.                                |
| [text-input-modifiers](../src/components/ui/text-input/text-input-modifiers.ios.ts) / [Android](../src/components/ui/text-input/text-input-modifiers.android.ts)                                    | Necessary native corrections                  | Provides weighted/flexible input sizing and platform accessibility labels. iOS also uses an inset rounded stroke because the installed universal rectangular border is clipped at rounded corners. The parent input already uses universal TextInput/Row/Column/Icon; removing these helpers would remove its sizing, label, or border correction.                                                      |
| [skeleton-modifiers](../src/components/ui/skeleton/skeleton-modifiers.ios.ts) / [Android](../src/components/ui/skeleton/skeleton-modifiers.android.ts)                                              | Static subset only                            | A fixed-size static placeholder can use universal Column style. Current skeletons also fill unspecified width, animate with native easing, and hide content from accessibility. Android blends opacity into background color without a graphics layer; iOS applies native opacity/animation. Plain style would lose the pulse and these implementation choices. Retain the helper for current behavior. |

The [SDK 57 ScrollView API](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/scrollview/)
has no `onRefresh` prop. The
[SDK 57 drop-in replacements](https://docs.expo.dev/versions/v57.0.0/sdk/ui/drop-in-replacements/)
are a separate import surface from the root universal API.

## Existing shared components and migration order

[UniversalHost](../src/components/ui/host/universal-host.tsx),
[UniversalText](../src/components/ui/text/universal-text.tsx), and
[UniversalTextInput](../src/components/ui/text-input/universal-text-input.tsx)
already use root components from shared files. The Host also preserves scheme,
direction, and project button-palette inheritance. Keep that context contract.

[BottomSheet](../src/components/ui/bottom-sheet/bottom-sheet.tsx) is a shared file
in the current tree. It still uses an iOS geometry/frame branch and native width
helpers to bridge content into the sheet's owning Host. This illustrates why
one filename does not necessarily mean universal-only behavior. The inventory
and findings reflect the final tree inspected during this review.

For a behavior-preserving cleanup, start with shared icon maps, constants, and
ListItem composition, retaining small native helpers. Extract genuinely common
logic such as refresh promise coordination only where this reduces complexity.
Keep the native button, overlay, glass, progress, snackbar, and layout boundaries.

If native default styling is an acceptable product change, start a separate
migration with Collapsible, Slider, Checkbox, and Switch. They duplicate more
upstream control mechanics than project behavior. Then evaluate List and
FieldGroup. Leave Picker and the semantic button family until their concrete
contract gaps are resolved. Existing production consumers include settings
Switch/Picker controls, recipe search and creation pickers, collection segments,
and shared page/form buttons; this is not only Storybook cleanup.

Keep the public `@components/ui` API stable. When a pair becomes one `.tsx`,
remove or update its obsolete declaration and account for Metro extension
ordering. Do not leave a declaration-only `.ts` that can shadow a real runtime
file. Existing
[native-resolution checks](../tests/layout/native-input-resolution.test.mjs)
explicitly assert all 25 platform pairs, so a migration must update those checks
to verify the intended new runtime file on both platforms.

The installed package is intentionally pinned because the project previously
observed an Android numeric-width crash on `57.0.22`; see the existing
[version decision](build-verification.md#expo-ui-version). This audit does not
independently reproduce that historical issue or propose changing dependencies.

Universal imports are a maintenance improvement when they remove duplication.
They are not evidence of faster native execution. Also, SDK 57 List uses native
list containers but still creates React rows up front; the
[documented eager-row limitation](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/list/)
means it should not be selected as a performance shortcut for large feeds.

## Verification

- `npm run lint`: passed with zero warnings.
- `npm run typecheck`: passed.
- Every current `.ios` / `.android` pair was inspected alongside relevant
  installed universal types and native implementations.
- Existing
  [control-theme checks](../tests/layout/control-theme.test.mjs) and native-resolution
  checks were inspected as migration constraints. The component catalog and
  Storybook/Maestro inventories identify further verification candidates; they
  do not prove that a proposed replacement works on a device.
- The initial analysis changed no UI implementation and tested no native migration.
  A future implementation needs relevant behavior checks and iOS/Android
  verification for hit areas, disabled actions, RTL, screen readers, keyboard,
  refresh completion, overlay stacking, and live theme changes.

## Implemented follow-up

The user selected shared-code cleanup while retaining current styling. ListItem
now has one [shared component](../src/components/ui/list-item/list-item.tsx) and
private native appearance helpers. The public declaration and duplicated
component files were removed. Native slot styling, caller override precedence,
row selectors, callbacks and Host inheritance remain in place. There are still
25 native pairs, now comprising 21 component pairs and four helper pairs; the
change centralizes composition instead of hiding native differences.

Navigation and floating actions now use common
[tab icon selection](../src/components/ui/navigation/navigation-tab-icons.ts) and
[action icons](../src/components/ui/floating-action/floating-action-icons.ts).
Root Icon renders the same native image/icon controls; their containing native
buttons, geometry, feedback, disabled state, accessibility and colors are retained.

Both refresh adapters share
[pending refresh coordination](../src/components/ui/refreshable-scroll-view/use-pending-refresh.ts).
Promise coalescing and error completion are common; each platform still owns its
native refresh presentation. No native default color palette was substituted.

List stories now include light/dark compound-slot fixtures and an extended
Maestro flow. Updated tests cover native symbol dispatch, row slots and live
themes, module resolution, refresh callback changes and success/failure/recovery.
These are JS and module checks. ADB reported no connected devices; native visual,
gesture and accessibility execution remains pending.

Final cleanup verification: `npm run lint` passed with zero warnings,
`npm run typecheck` passed, and `npm run test:layout` passed all 143 tests.
Storybook registration was regenerated; local report links and the scoped diff
whitespace check also passed.
