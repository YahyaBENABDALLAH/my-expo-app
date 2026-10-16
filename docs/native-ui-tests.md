# Native UI automation

The `.maestro/` workspace contains shared Android/iOS Storybook smoke tests. Tests target the installed development build (`com.hyrkul.likan`) and the native test IDs documented in [storybook-test-ids.md](storybook-test-ids.md).

Additional flows under `.maestro/auth/` cover login, registration, password-recovery validation, navigation, route guards and layout direction. Run `npm run test:e2e:auth` to run those separately while signed out. These smoke flows never submit valid credentials, create accounts, or send recovery emails; see [auth-forms.md](auth-forms.md). Storybook routes require an authenticated session or the development guest option.

## Prepare a device

1. Install [Maestro CLI](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli) and Java 17 or higher. Windows supports Android testing directly; use an iOS Simulator on a Mac for iOS tests.
2. Start an Android emulator or connect an Android device with USB debugging enabled. For iOS, boot an iOS Simulator with the app installed.
3. Install the app's development build. It must contain the native libraries used by this project; Expo Go is not the target of these flows.
4. Run `npm start` and open the project once in the development client. Keep Metro running and reachable from the test device. Dismiss first-run development-client instructions before starting tests.
   In Expo's developer menu, turn off **Tools button** before automation; its
   floating overlay can cover app controls, including onboarding Skip.
5. Select English in the page's language picker for flows that assert English
   validation or accessibility text. The app defaults to French and preserves the
   selected language across restarts.

On Android connected over USB, run `adb reverse tcp:8081 tcp:8081`. The shared startup flow explicitly connects the development client to Metro at `127.0.0.1:8081` before opening a route. The same address works with a local iOS Simulator. For a device on Wi-Fi, override `DEV_CLIENT_URL` with the full development-client URL from Expo CLI using Maestro's `-e` option. Android must allow the installation of Maestro's helper applications over USB.

The same tests run on either platform. If multiple devices are connected, select one explicitly with `maestro --device <device-id> test .maestro`.

## Run tests

```sh
npm run test:e2e
```

Run just the regression test for pressing an empty input:

```sh
npm run test:e2e:input
```

Run Home's Details sheet regression:

```sh
npm run test:e2e:home
```

To save a JUnit report:

```sh
maestro test --format junit --output .maestro/results/report.xml .maestro
```

| Flow                         | Expected behavior                                                      |
| ---------------------------- | ---------------------------------------------------------------------- |
| `text-input-empty.yaml`      | Empty field accepts a tap, typing, and deletion without crashing       |
| `text-input-actions.yaml`    | Focus, blur, clear, and subsequent editing work                        |
| `text-input-controlled.yaml` | JavaScript updates, reset, and uppercase transformation work           |
| `switch.yaml`                | Toggle changes its value and reset returns it to Off                   |
| `checkbox.yaml`              | Toggle changes from Unchecked to Checked and back                      |
| `bottom-sheet.yaml`          | Opening shows content; closing dismisses it and restores Closed state  |
| `list.yaml`                  | Pressing the second row changes the selected-row status                |
| `recipe-card.yaml`           | Repeated card presses increment the count while remaining in Storybook |
| `home-catalog.yaml`          | Details reopens, dismisses, and selects the recipe after a rail swipe  |
| `direct-links.yaml`          | Direct links select their target through lazy loading and mode changes |

## Direct story links

Use `npm ci` to install the native Storybook `10.7.0` / core `10.6.2` dependency
set. `npm run storybook` starts Metro with a cleared cache after dependency
changes. The architecture checks verify that Storybook and Expo Router resolve
the same React, React Native, safe-area, gesture-handler and Reanimated modules;
duplicate native packages can crash the canvas before any story renders.

Tests open a story directly using Storybook's `STORYBOOK_STORY_ID` query parameter. The `mode=canvas` parameter hides Storybook controls and disables selection persistence during the test. The custom canvas preserves individual native accessibility targets and uses the story's light/dark background. Opening Storybook normally retains the browser and saved selection.

```text
myappexpo://storybook?STORYBOOK_STORY_ID=expo-ui-universal-text-input--empty&mode=canvas
```

Each flow stops the app, connects to Metro, waits for the app and brand animation, and then opens its route. It preserves application data. The shared Storybook helper opens the requested story directly and allows two minutes for the lazy Storybook bundle. The screen seeds its initial selection from the Router's `STORYBOOK_STORY_ID`, including when switching between browser and canvas mode; subsequent links in the same mode use Storybook's native listener. Ordinary renders retain the story's component state, and normal browser entry retains saved selection.

To add coverage, create a flow under `.maestro/storybook/`, reuse `../helpers/open-story.yaml`, and pass the story ID and a visible `READY_ID`. Assert a resulting value or visible state after interaction. Root and helper files are excluded from test discovery by `.maestro/config.yaml`.

## Validation limits

The 2026-10-10 Android execution results are recorded in
[the build verification report](build-verification.md). Home's 2026-10-13 Android
execution is recorded in [Home catalog layout](home-catalog-layout.md). Remaining flows and all
iOS flows still need automated native execution. TypeScript, lint, YAML parsing, and
native bundling cannot validate a device's accessibility hierarchy. If an ID is
absent, inspect the hierarchy in Maestro Studio and use the fallback documented
in the selector reference.

On 2026-10-15, manual iOS 27 / iPhone 18 Pro checks verified Storybook startup,
catalog search, Actions logging, live label controls, direct lazy story selection,
Button repeat/disabled/reset behavior, and Checkbox selection. The custom canvas
keeps individual native controls accessible. The shared story frame now supplies
a measured, finite width to its RN bridge; previously percentage-width Hosts
collapsed and hid labels and values. The portable frame test covers retaining
control state through resizing. These checks are not a Maestro run or automated
screenshot comparison; Android interaction checks remain pending.

Storybook is enabled in development and in preview builds with `EXPO_PUBLIC_ENABLE_DEV_SCREENS=true`. Production builds without that opt-in redirect this route to Skia. The shared bootstrap connects a development client to Metro; a standalone preview build needs its own launch flow. Do not point these tests at the production build.

The focused Storybook cleanup on 2026-10-15 retains 190 stories across 38 families.
Manual iOS 27 / iPhone 18 Pro checks confirmed the top-left/bottom-right and
top-right/bottom-left button shapes, with exactly one counter increment for each
upper and lower edge tap. `.maestro/storybook/button-corners.yaml` records those
checks for future automated execution. Skeleton playback now uses the standalone
CSS placeholders; its existing flow targets their updated selectors. Portable
checks cover native corner forwarding, feedback motion settings and all literal
Maestro story links. Maestro is unavailable on this host; these flows, Android
geometry and native OTP keyframe timing remain unverified.
