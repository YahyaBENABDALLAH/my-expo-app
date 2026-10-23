# Shared native UI

Import shared presentation from `@components/ui`. [index.ts](../src/components/ui/index.ts) is the
public entry point; its component names and props stay stable.

Each folder owns one component or a small family. Keep its implementation,
iOS/Android adapters, types and private helpers together. Each family has one canonical skill with its contract and composition guidance;
source folders contain implementation, not duplicate documentation.

For six-digit verification forms, see [OTP bottom sheet](../.agents/skills/foodiya-ui-otp-bottom-sheet/SKILL.md).

For text fields, choose `TextInput` with a string `value`/`onChangeText`, or
`FormTextInput` with React Hook Form `control`/`name`. Both reuse the existing
Host and the same input implementation. At an RN boundary, supply a
`UniversalHost` explicitly.

| Need                    | Component skills                                                                                                                                                                                                                                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons and actions     | [button](../.agents/skills/foodiya-ui-button/references/component-guide.md), [floating-action](../.agents/skills/foodiya-ui-floating-action/SKILL.md)                                                                                                                                                            |
| Inputs and forms        | [text-input](../.agents/skills/foodiya-ui-text-input/SKILL.md), [form](../.agents/skills/foodiya-ui-form/SKILL.md), [field-group](../.agents/skills/foodiya-ui-field-group/SKILL.md)                                                                                                                             |
| Selection controls      | [checkbox](../.agents/skills/foodiya-ui-checkbox/SKILL.md), [switch](../.agents/skills/foodiya-ui-switch/SKILL.md), [slider](../.agents/skills/foodiya-ui-slider/SKILL.md), [picker](../.agents/skills/foodiya-ui-picker/SKILL.md), [segmented-control](../.agents/skills/foodiya-ui-segmented-control/SKILL.md) |
| Lists and disclosure    | [list](../.agents/skills/foodiya-ui-list/SKILL.md), [list-item](../.agents/skills/foodiya-ui-list-item/SKILL.md), [collapsible](../.agents/skills/foodiya-ui-collapsible/SKILL.md)                                                                                                                               |
| Screen composition      | [page](../.agents/skills/foodiya-ui-page/references/page-guide.md), [auth](../.agents/skills/foodiya-ui-auth/SKILL.md), [refreshable-scroll-view](../.agents/skills/foodiya-ui-refreshable-scroll-view/SKILL.md)                                                                                                 |
| Theme and native layout | [host](../.agents/skills/foodiya-ui-host/SKILL.md), [text](../.agents/skills/foodiya-ui-text/SKILL.md), [native](../.agents/skills/foodiya-ui-native/SKILL.md), [appearance](../.agents/skills/foodiya-ui-appearance/SKILL.md)                                                                                   |
| Feedback and overlays   | [loading](../.agents/skills/foodiya-ui-loading/SKILL.md), [alert](../.agents/skills/foodiya-ui-alert/SKILL.md), [bottom-sheet](../.agents/skills/foodiya-ui-bottom-sheet/SKILL.md), [skeleton](../.agents/skills/foodiya-ui-skeleton/SKILL.md)                                                                   |
| Launch artwork          | [launch-screen](../.agents/skills/foodiya-ui-launch-screen/SKILL.md)                                                                                                                                                                                                                                             |

## Keep it simple

- Use descriptive kebab-case filenames. A small component needs its implementation
  and canonical skill guidance; split out files only for a real platform difference or private helper.
- Export public components from the existing `index.ts`. Additional folder
  barrels are unnecessary. The existing skeleton entry point retains its imports.
- Inside UI, import implementation files directly, including across component
  folders. Importing the public barrel from an implementation creates cycles.
- Keep queries, mutations, form state and workflow hooks in `src/features/`.
  Screen-specific fragments belong with their feature. Routes stay in `src/app/`.
- Keep styles beside their component and shared semantic colors in
  `src/constants/themes/`. Reuse native defaults and the existing Host.
- Stories stay in `.rnstorybook/`; ordinary catalog compositions stay in
  `src/features/ui-showcase/`. Shared UI must not import either. The opt-in
  developer route is the only application owner of Storybook imports. See
  [preview access and bundle boundaries](storybook.md).

## Native appearance

Universal controls inherit the shared Host scheme and theme tint. Semantic button intents use the active theme’s paired colors. Expo owns native shape, padding, disabled treatment and interaction feedback. Small adapters supply only application behavior or missing native selectors. Explicit overrides remain available.

Supported iOS controls retain the system's glass treatment. Menu picker triggers select native glass style on iOS 26+ with an automatic older-iOS fallback. Android retains Material controls. See [control themes](control-theme.md) for the full inventory and retained form behavior.

## Native composition

Use `UniversalButtonContent`, `UniversalTextContent`, `LoadingContent` and
`SkeletonContent` inside an existing `UniversalHost`. Standalone counterparts
own a Host for React Native boundaries. Use Expo UI `Row`, `Column` and `Spacer`
for ordinary layout; a Host supplies theme and hosting, not a content stack.

Every button requires `variant`: `primary`, `secondary`, `tertiary`, `link`, `success`,
`warning`, `info`, `destructive` or `glass`. Glass uses native iOS glass on iOS 26+,
automatic style on older iOS, and an outlined button on Android.

```tsx
import { PageScreen, UniversalButtonContent } from '@components/ui';

<PageScreen title="Account" description="Your profile.">
  <UniversalButtonContent variant="primary" label="Save" onPress={save} disabled={pending} />
</PageScreen>;
```

Translate labels in the caller with `useTranslation().t()`. Keep stable
`testID` values independent of translations.

## Maintenance

Check the [SDK 57 docs](https://docs.expo.dev/versions/v57.0.0/) and installed
types before changing native APIs. Expo UI is pinned to unmodified `57.0.21`
together with Router `57.0.24`. The [dated native version decision](build-verification.md#expo-ui-version)
records why: Android numeric widths crashed on `57.0.22`, and the next Router
version required that package. It is historical evidence, not a claim about the
current registry. Review these two intentional alignment exceptions together in
a dedicated upgrade change. Keep the direct dependency, override, lockfile and
Expo install exclusions aligned; do not remove pins through incidental cleanup.

Add or update an existing native story when behavior changes. Regenerate story
registration after story edits with `npm run storybook:generate`. Run
`npm run typecheck`, `npm run lint` and affected behavioral checks. Native
rendering and interaction require a running iOS or Android app.

See the [component catalog](../.agents/skills/expo-universal-component-library/references/components.md)
for native API references and verification limits.

### Adapter responsibilities and upgrade review

These are the existing maintenance boundaries. Their canonical contracts live in
the skills linked above. A wrapper supplies named app behavior or a verified
native gap; it cannot make future Expo UI changes automatically compatible.

| Existing owner                      | Concrete responsibility                                                                                   | Review on both platforms when upgrading                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Host and native layout helpers      | Inherited scheme/direction, tint and native intrinsic/fill sizing; fragment flattening for compound slots | Standalone and content controls, fractional width, full/intrinsic width, bounded viewport, live RTL and state retention   |
| Semantic button and floating action | App intents/colors, geometry, native styles, named actions and standalone haptics                         | Custom children, edge taps, clipping, disabled/pending suppression, native icon names and large text                      |
| Text and appearance control         | Semantic text colors/typography and app color-scheme selection                                            | Host overrides, both palettes, explicit text colors and saved appearance isolation                                        |
| Text input and form adapters        | Controlled string/native-state bridge, labels/status/icons; React Hook Form binding and submit state      | Keyboard/focus, external reset, secure visibility, icon labels, validation, duplicate submission and retained drafts      |
| Picker and segmented control        | Typed value selection and native menu/wheel/segment implementations; iOS menu treatment                   | String/number values, enabled suppression, option selectors, selection after rerender and native style fallbacks          |
| Checkbox, switch and slider         | Suppress callbacks while disabled; otherwise pass through native props                                    | Enabled/disabled interaction, controlled values, continuous/stepped slider values                                         |
| List and Android list row           | Coalesced refresh completion; Android row selector forwarding                                             | Repeated refresh, rejected refresh, actual row activation and native selector lookup                                      |
| Bottom sheet and OTP sheet          | Shared themed native presentation; OTP input, verification, resend and lifecycle                          | Dismiss/reopen, retained values, cooldown, duplicate requests, keyboard fit and focus                                     |
| Refreshable scroll                  | iOS refresh modifier/Android refresh box plus one pending refresh                                         | Gesture activation, completion/rejection, repeated requests, disabled/hidden and unmount                                  |
| Alert and root presenter            | Queued translated feedback with platform-native acknowledgment                                            | Dismissal, next alert, navigation while visible and spoken titles/actions                                                 |
| Page family and launch screen       | Header/safe-area/keyboard composition, shared header motion and configured startup                        | Default/Dunes/Ribbon/Rain, SVG mask and hit-area stacking, branded/minimal readiness, background/resume and Reduce Motion |
| Loading and skeleton                | Native progress/query states; static native placeholders or motion-aware hosted pulse                     | Disabled/offline/error/empty/cached refresh, independent retries, Host sizing and background/reduced motion               |

`Column`, `Row`, `Spacer`, `ScrollView`, `RNHostView`, `Icon`, raw `Text`,
`useNativeState`, `FieldGroup`, `Collapsible` and the iOS ListItem remain direct
native exports. Do not introduce adapters just to rename these primitives.

For an SDK/Expo UI upgrade:

1. Read the target version's docs and installed native types. Review each affected
   row above, including `.ios`, `.android` and matching `.d.ts` signatures. Remove
   an existing workaround only after its original case passes with the new package.
2. Reproduce the documented Android numeric-width failure in the Host/button/input
   previews on the baseline and proposed versions. Use a matching fresh native
   build for each version; a Metro reload does not update native modules.
3. Run `npm run check` and `npm run storybook:generate` when fixtures change. Serve
   the maintained [native previews](storybook.md); verify both OSes, light/dark,
   large text, live RTL, selectors and retained state. Record exact package/build,
   device/OS and observed results with unresolved upstream gaps.
4. Export both platform bundles in client and preview configurations. Confirm no
   Storybook sources in release graphs and check the intended route flags. Report
   native observations separately from static checks and successful bundling.

## Documentation ownership

Update the matching component skill when its contract changes. Keep detailed
page and button material in that skill’s linked references. Do not add a README
to each source folder. Use [the documentation index](index.md) for project guides.
