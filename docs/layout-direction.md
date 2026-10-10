# Live LTR / RTL

Use the **RTL switch at the bottom of each page's content**:
**off = LTR, on = RTL**. Scroll below the page's last action to reach it. Map,
canvas and Storybook routes place the controls below their main view. Changes
apply immediately in the current session and preserve navigation, form state and
the TanStack Query cache. The initial direction follows the device; manual
selection is session-only. Layout direction does not translate text.

`LayoutDirectionProvider` updates Expo Router's public `LocaleProvider` and the
root React Native view's `direction`. Every `UniversalHost` receives an explicit
`layoutDirection` on each render. Avoid `I18nManager.forceRTL` / `allowRTL` and
reload APIs: global direction changes require a subsequent app launch.

`PageAppearanceControls` composes the switches and picker inside the owning
native scroll content. `PageFrame` retains a title/back header and consumes the
top safe area once. Native scroll pages disable its separate footer to avoid
duplicating controls; specialized RN map/canvas boundaries append that footer
after their content. Direction changes retain both content and controls.
The selector is `page-layout-direction-switch`; isolated stories and sheets use
distinct prefixes. Native sheets cover the page while presented; the direction
composition story includes an in-sheet switch for that scenario.

Compose content in the shared Expo UI Row / Column controls. Use logical start /
end offsets for React Native alignment. Keep physical safe-area insets and map
coordinates physical. The input's existing `leftIcon` / `rightIcon` slots behave
as leading / trailing; Expo UI already maps input padding to start / end. The
stepper mirrors its artwork only, leaving its native labels and numbers readable.
The Android page back arrow is selected explicitly: SDK 57's XML icon loader
ignores the vector's `autoMirrored` attribute. iOS uses the semantic `arrow.backward`.

Use the shared `BottomSheet` export from `@components/ui`. Expo's universal sheet
creates its own native Host; the shared wrapper bridges content back through a
`UniversalHost` so open sheets follow theme and direction changes.

Storybook **Pages / Layout direction** includes light, dark and initial RTL
fixtures, a draft field, leading/trailing actions, a stepper and an open-sheet
switch. Its direction-only frame lives in
[`LayoutDirectionFrame`](../.rnstorybook/components/layout-direction-frame.tsx),
outside the production UI API. `.maestro/storybook/layout-direction.yaml` checks draft preservation and
open-sheet updates. Native appearance, text cursor/focus and back gestures still
require iOS and Android verification; JS fixture tests cannot prove those.
`.maestro/auth/layout-direction.yaml` exercises the footer on auth pages with a
typed draft; `.maestro/pages/layout-direction.yaml` covers tabs, a detail/back
transition and Storybook. The page flow requires a signed-in or development guest
session, as do the other signed-in page flows.

Sources: [Expo localization](https://docs.expo.dev/guides/localization/),
[SDK 57 Host](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/),
[React Native I18nManager](https://reactnative.dev/docs/0.86/i18nmanager).
