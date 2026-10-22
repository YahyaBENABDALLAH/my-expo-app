# Live LTR / RTL

Arabic selected in **More → Preferences** applies RTL; French and English
apply LTR. Language changes preserve navigation, form state and the TanStack
Query cache. The shared direction/language/theme footer has been removed from
production pages. Manual direction controls remain available in native
Storybook for layout previews; those changes are session-only.

`LayoutDirectionProvider` updates Expo Router's public `LocaleProvider` and the
root React Native view's `direction`. Every `UniversalHost` receives an explicit
`layoutDirection` on each render. Avoid `I18nManager.forceRTL` / `allowRTL` and
reload APIs: global direction changes require a subsequent app launch.

`PageFrame` retains a title/back header and consumes the top safe area once;
content owns the remaining edges. Isolated stories and sheets use distinct
direction-control selectors. Native sheets cover the page while presented; the direction
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
outside the production UI API. Automated suites have been removed; existing
test IDs remain for future tests. Check draft preservation, open-sheet updates,
native appearance, text cursor/focus and back gestures manually on iOS and Android.
Confirm that production pages no longer expose the footer using a signed-in or
development guest session.

Sources: [Expo localization](https://docs.expo.dev/guides/localization/),
[SDK 57 Host](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/),
[React Native I18nManager](https://reactnative.dev/docs/0.86/i18nmanager).
