# Safe-area handling

Reviewed against Expo SDK 57, Expo UI 57.0.14, and safe-area-context 5.7.0 on 2026-10-03.

## Ownership

| Surface                        | Top                 | Bottom                 | Sides               |
| ------------------------------ | ------------------- | ---------------------- | ------------------- |
| Main tab content               | Screen              | In-flow custom tab bar | Screen              |
| Detail with shared page header | Screen              | Screen                 | Screen              |
| Authentication                 | Screen              | Screen                 | Screen              |
| Account tab                    | Screen              | Tab bar                | Screen              |
| Launch/session restoration     | Content frame       | Content frame          | Content frame       |
| Native sheets                  | Native presentation | Native presentation    | Native presentation |

`screenInsets` describes this contract without fixed device sizes. The custom bar is in normal navigator layout flow; screens do not reserve its height or add its bottom inset again. Its outer frame owns bottom and side insets. The floating action stays inside the bar's measured bounds, including the area above its rounded panel. Content keeps ordinary spacing separate from system insets.

Expo Router already provides the root `SafeAreaProvider`; another provider is not added around the app or individual pages. Hooks handle the changing inset values consistently with navigation transitions. Backgrounds and Skia artwork may reach the edges; controls remain inside protected content bounds. Portrait remains the app's configured orientation; asymmetric side-inset cases cover possible tablet/window layouts and future rotation support without changing that setting.

The page Host opts out of automatic SwiftUI safe areas because the outer frame handles them. RN keyboard padding handles overlap on iOS and Android. Tab and detail pages both use the shared content header, so no native-header keyboard offset is needed. The system-inset frame wraps the keyboard frame so keyboard padding cannot replace its bottom safe area. Authentication uses the same keyboard padding around its native Host. In the installed Android Expo UI implementation, the Host's keyboard-aware viewport measurement only clamps unbounded constraints; it does not guarantee avoidance for these flex-sized screen Hosts. Native bottom sheets keep their presentation's insets and keyboard behavior. The Host wrapper's global defaults are unchanged.

Old 56-point tab-bar offsets were removed from account, maps, Skia, error fallback, and Storybook screens. Map controls receive actual top/side padding; launch artwork shrinks to fit the available content area.

## Documentation

Context7 MCP tools are not connected. Read [Context7's public React Navigation index](https://context7.com/websites/reactnavigation/llms.txt?tokens=10000), including its safe-area source links, then checked the primary [navigation safe-area guidance](https://reactnavigation.org/docs/handling-safe-area/), [SDK 57 safe-area-context reference](https://docs.expo.dev/versions/v57.0.0/sdk/safe-area-context/), [SDK 57 Expo UI Host reference](https://docs.expo.dev/versions/v57.0.0/sdk/ui/universal/host/), and installed platform Host implementations. The installed Compose Host exposes keyboard handling separately from SwiftUI's `ignoreSafeArea` semantics; platform behavior must still be checked on devices.

## Verification

Lint, typecheck, all 70 automated tests, and iOS/Android production JavaScript/Hermes exports pass. Storybook registration was regenerated. The Android SDK's `adb devices` reports no connected devices; native checks below have not run.

Four layout regression tests cover notched tab pages, native-header details, asymmetric changing side insets, and zero/gesture/three-button bottom insets. These test the shared ownership contract, not native geometry. Native Storybook's Pages/Navigation shell includes NotchedPhone, LandscapeCutout, NativeHeaderDetail, and LongContent fixtures. The inset fixtures override JS context only; they do not simulate an operating system notch, rotate a device, or render a native stack header.

For the shared keyboard-padding change, lint, typecheck, and all 26 layout checks pass; Storybook registration was regenerated. Pages/Navigation shell's KeyboardAccess story and `.maestro/storybook/keyboard-access.yaml` cover auth submission and repeated multiline-page saves without first dismissing the keyboard. Android execution was attempted on `emulator-5554`, but concurrent screen switching interrupted the first run and Maestro lost its device-server connection on retry. The complete native flow remains unverified, as does iOS keyboard behavior.

Before release, inspect iOS and Android with gesture and three-button navigation, a notched phone, a tablet/window resize, large text, and the keyboard open. Check the last scroll item, floating action hit area, native sheets, header transitions, and keyboard dismissal. Run the existing pages Maestro flows and capture native screenshots for comparison. Device checks require a connected device or simulator; automated JS checks cannot establish these results.

## Shared header follow-up (2026-10-04)

The root stack now hides native headers. All PageScreen pages protect the status-bar inset and render the Home title style over the same app background and shared PageMotionOverlay. Standalone pages add a native back arrow beside their title instead of a second toolbar and a bottom Back link. HeaderWithBackArrow and DarkHeaderWithBackArrow replace the former NativeHeaderDetail fixture, with explicit theme and counted activation. The header Maestro flow and updated collections flow cover native arrow activation and return to the prior tab; these remain unexecuted without a connected device.
