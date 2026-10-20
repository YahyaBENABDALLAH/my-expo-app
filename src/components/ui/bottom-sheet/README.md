# Bottom sheet

Export: `BottomSheet`. Implementation: `bottom-sheet.tsx`.

A minimal adapter over the native Expo UI `BottomSheet`. Supported props are
`children`, `isPresented`, `onDismiss`, `testID` and optional `contentHeight`. The iOS drag indicator is
hidden; Android retains its native default.

The sheet's `containerColor` uses the active theme's `surface` token, including
the native chrome and safe-area background. Android's default `contentColor` uses
the theme's `text` token. Both resolve the owning Host's color scheme.
Expo UI owns layout, padding, corners, detents and presentation/dismissal.
Light/dark appearance follows the native app mode;
the root layout synchronizes the existing appearance preference with React Native
`Appearance.setColorScheme`, including system mode.

Compose native content inside the sheet. Callers own their content layout and
any specialized React Native boundaries. OTP measures its own input section;
there is no shared sheet-width context or theme/direction bridge.

For a known scroll viewport, `contentHeight` applies its height to a native Column
before presentation. Home supplies `min(420, screenHeight * 0.6)` here and on its
inner ScrollView, so the native sheet does not wait for an RN/Host size round trip.
This bounds the content, not the sheet's outer height or a 50% snap point; native
chrome and partial/expanded states remain platform-owned. Omit it for intrinsic
content. `FixedContentHeight` is the corresponding native Storybook fixture.

Native stories: `Components/Bottom Sheet`, including `Light`, `Dark` and
`FixedContentHeight`. Maestro flows cover opening, closing, reopening and
language selection; the login flow also includes swipe dismissal. Native views
are mocked in the JS checks, so they do not establish native rendering or gestures.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../README.md).
