---
name: foodiya-ui-button
description: Use, compose, or maintain Foodiya native buttons in screens, existing Hosts, forms, sheets, cards, and React Native boundaries. Covers primary, secondary, tertiary, link, status and glass variants, full width, disabled and pending states, icons, custom children, colors, and geometry. Use for choosing UniversalButton versus UniversalButtonContent and their supported props.
---

# Foodiya buttons

Use the shared native buttons from `@components/ui`. Follow the project's
[implementation pattern](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). This skill documents
`src/components/ui/button/`; it does not add props to the component.

## Check the actual button contract

Before choosing props, read the current
[shared implementation and types](../../../src/components/ui/button/universal-button.tsx) and
[button guide](references/component-guide.md). For native behavior,
check both platform adapters. For Expo API changes, read the installed Expo
major and matching documentation as required by `AGENTS.md`. The reference links
below were checked against SDK 57 and `@expo/ui` 57.0.21; recheck after upgrades.

Screens and feature components import public buttons and types from
`@components/ui`. Inside the UI library, import concrete sibling files to avoid
barrel cycles. `NativeButtonContent` is an internal renderer, not a screen API.
Keep the existing adapters: the upstream universal Button has a different public
contract and does not replace the project's semantic variants and geometry.

## Keep the implementation together

The button family has four source files:

- `universal-button.tsx` owns both public components, their exported prop types
  and the private semantic color resolver.
- `universal-button-content.ios.tsx` owns SwiftUI rendering.
- `universal-button-content.android.tsx` owns Compose rendering.
- `universal-button-content.d.ts` supplies the native renderer's TypeScript
  signature; Metro selects the matching platform implementation.

Keep shared props and color handling beside the public components. Extend these
existing owners when adding a variant or prop. Native files import shared props
with `import type` and receive already resolved colors.

## Choose the button by its immediate rendering boundary

| Where the button renders                                            | Use                                                                   | Host ownership                                                                    |
| ------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `PageScreen` content, including `PageSection`                       | `UniversalButtonContent`                                              | The screen's content already owns a `UniversalHost`                               |
| `AuthScreenFrame` children                                          | `UniversalButtonContent` or the existing `FormSubmit`                 | The auth frame already owns the Host                                              |
| An existing `UniversalHost` or native Expo UI `Host`                | `UniversalButtonContent`                                              | Reuse that native tree; arrange siblings in a `Row` or `Column`                   |
| A native list row, card, or shared `BottomSheet` content            | `UniversalButtonContent`                                              | Reuse the actual native content owner; the sheet creates a native Host internally |
| An existing React Native view, footer, overlay, or RN scroll layout | `UniversalButton`                                                     | The standalone button owns its own Host                                           |
| A React Native subtree bridged with `RNHostView`                    | `UniversalButton`, or one `UniversalHost` for several content buttons | Entering RN breaks the immediate native tree, even with a Host higher up          |
| `PageFrame` alone, a route file, or a component called a screen     | Inspect its children, then choose                                     | A route/screen name and `PageFrame` alone do not establish a content Host         |

Prefer `UniversalHost` when creating a group of project controls: it supplies the
app's theme and direction context. An existing raw native `Host` can render
content buttons, but an explicit raw Host scheme is not the project's React
color-scheme provider. For deterministic themed groups, use `UniversalHost`.
Do not add a hosted standalone button inside ordinary native content, or put a
content button directly into RN without a Host. See
[usage examples](references/usage-examples.md) for each composition.

`UniversalButton` owns one `UniversalHost`, replacing the previous raw Host at
the same RN boundary. Its explicit scheme reaches both native appearance and
custom children's project context; omitted values inherit the nearest project
Host, then app preferences. The shared owner supplies live direction and the
theme tint. Intrinsic buttons use inline hosting; full-width buttons retain
their existing per-axis sizing. Keep the detailed geometry and override rules
in [props and styling](references/props-and-styling.md).

## Select an explicit intent

`variant` is required on both public buttons. These are the current supported
values; never substitute upstream `filled`, `outlined`, or `text` strings.

| Variant       | Typical action                           | iOS style                                         | Android control |
| ------------- | ---------------------------------------- | ------------------------------------------------- | --------------- |
| `primary`     | Main save, continue, or submit action    | Bordered prominent                                | Filled Button   |
| `secondary`   | Alternative or cancel action             | Bordered                                          | OutlinedButton  |
| `tertiary`    | Lower-emphasis optional action           | Plain                                             | TextButton      |
| `link`        | Text-style action or navigation callback | Plain                                             | TextButton      |
| `success`     | Action with success intent               | Bordered prominent                                | Filled Button   |
| `warning`     | Action requiring attention               | Bordered prominent                                | Filled Button   |
| `info`        | Informational action                     | Bordered prominent                                | Filled Button   |
| `destructive` | Delete/remove action                     | Bordered prominent plus destructive role          | Filled Button   |
| `glass`       | Requested native glass treatment         | Glass on iOS 26+, automatic fallback on older iOS | OutlinedButton  |

Every theme applies its semantic color pairs by default. Primary and success
can share a hue when the active theme deliberately assigns the same token. Read
[props and styling](references/props-and-styling.md) before overriding colors or
geometry. A `link` variant supplies appearance only: invoke Expo Router from the
consumer's `onPress` for navigation. A destructive variant does not perform
confirmation or deletion by itself.

## Apply width, interaction state, and content deliberately

- For full width, set `fullWidth` on the button and give the parent a real width.
  `PageSection` already fills available width. In custom native layouts, reuse
  `nativeFillWidth`. For two equal actions in a row, put each full-width button
  in a `Column` with `nativeRowWeight`; two unweighted full-width buttons compete
  for the whole row. Omit `fullWidth` for native content sizing.
- Use `disabled` for unavailable actions. Both adapters disable the native control
  and suppress the callback; opacity or removing `onPress` alone does not express
  the same state. Disabled buttons stay visible and preserve native feedback.
- Pending is consumer-owned. Combine the existing pending/prerequisite flags into
  `disabled`, change the translated label to a waiting label when useful, and
  retain the workflow's duplicate-submit guard. The button has no `loading` or
  `pending` prop, spinner, error handling, retry policy, or automatic async lock.
- Prefer a translated `label` for ordinary actions. Non-nullish `children`
  replace the label completely; compose native `Row` / `Column`, `Icon`, and
  `Text` for custom content. Keep an accessible text label. Do not place RN views
  or raw strings directly in a native label tree; use `RNHostView` for necessary
  RN artwork, with the existing card patterns as a reference.
- Custom native `Text` without an explicit color can inherit the button's content
  color. `UniversalTextContent` supplies its own theme foreground, so it can
  override the contrasting filled-button label. Use it only with an intentional
  matching foreground. Verify custom icon/text colors and disabled appearance.
- Give interactive buttons real callbacks and stable, language-independent
  `testID` values. Never nest another button, clickable row, or other independent
  control inside a button. Keep sibling card actions outside the outer action.

Generic icon-only buttons are not fully exposed by this public API: there is no
button-level `accessibilityLabel` prop, and `label` is ignored with custom
children. Use an existing matching native icon-control adapter for
navigation, input, or floating actions. If a new generic icon-only action is
requested, extend the shared contract and both adapters with accessible naming;
do not invent an unsupported prop or rely on an unlabeled icon. Icon-and-text
buttons are covered in the examples.

## Verify the requested work

For button usage, check Host ownership, intent, actual width constraints, enabled
and disabled activation, pending recovery, readable labels, and RTL/large text.
For geometry or custom content, check visible bounds and edge taps on native
iOS and Android; JS mocks do not establish native accessibility or touch targets.

For button behavior changes, use the
[native stories](../../../.rnstorybook/stories/components/button.stories.tsx),
including SemanticVariantsLight and SemanticVariantsDark. Run `npm run typecheck`
and `npm run lint`; regenerate registration with `npm run storybook:generate`
when stories change. Automated suites and Maestro flows have been removed;
keep existing selectors and report native device verification separately.
`StandaloneHostLight` and `StandaloneHostDark` reuse the production Buttons
showcase's `StandaloneButtonPreview`. Its custom labels read their own Host's
scheme/direction, forced light/dark cases retain physical diagonal clipping,
an inherited case keeps intrinsic width, and a disabled action must not count.
The fixture's `button-host-rtl` toggle changes direction without remounting the
buttons; `button-host-presses` and `button-host-reset` expose count/reset.
The routed Buttons page retains `demo-button-standalone-light`; dark, inline
and disabled cases use the corresponding suffixes. Label selectors add `-label`.
Check native upper/lower/side edges, large text, live Arabic, app/Host scheme
differences and both palettes. Registration and exports do not prove those
native behaviors; the current Host migration still needs device verification.
For skill-only changes, validate metadata, links, and examples against the current
types without claiming native device verification.
