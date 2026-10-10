# Native UI automation

The `.maestro/` workspace contains shared Android/iOS Storybook smoke tests. Tests target the installed development build (`com.hyrkul.likan`) and the native test IDs documented in [storybook-test-ids.md](storybook-test-ids.md).

Additional flows under `.maestro/auth/` cover login, registration, password-recovery validation, navigation, route guards and layout direction. Run `npm run test:e2e:auth` to run those separately while signed out. These smoke flows never submit valid credentials, create accounts, or send recovery emails; see [auth-forms.md](auth-forms.md). Storybook routes require an authenticated session or the development guest option.

## Prepare a device

1. Install [Maestro CLI](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli) and Java 17 or higher. Windows supports Android testing directly; use an iOS Simulator on a Mac for iOS tests.
2. Start an Android emulator or connect an Android device with USB debugging enabled. For iOS, boot an iOS Simulator with the app installed.
3. Install the app's development build. It must contain the native libraries used by this project; Expo Go is not the target of these flows.
4. Run `npm start` and open the project once in the development client. Keep Metro running and reachable from the test device. Dismiss first-run development-client instructions before starting tests.
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

To save a JUnit report:

```sh
maestro test --format junit --output .maestro/results/report.xml .maestro
```

| Flow                         | Expected behavior                                                     |
| ---------------------------- | --------------------------------------------------------------------- |
| `text-input-empty.yaml`      | Empty field accepts a tap, typing, and deletion without crashing      |
| `text-input-actions.yaml`    | Focus, blur, clear, and subsequent editing work                       |
| `text-input-controlled.yaml` | JavaScript updates, reset, and uppercase transformation work          |
| `switch.yaml`                | Toggle changes its value and reset returns it to Off                  |
| `checkbox.yaml`              | Toggle changes from Unchecked to Checked and back                     |
| `bottom-sheet.yaml`          | Opening shows content; closing dismisses it and restores Closed state |
| `list.yaml`                  | Pressing the second row changes the selected-row status               |

## Direct story links

Tests open a story directly using Storybook's `STORYBOOK_STORY_ID` query parameter. The `mode=canvas` parameter hides Storybook controls and disables selection persistence during the test. Opening Storybook normally retains the browser and saved selection.

```text
myappexpo://storybook?STORYBOOK_STORY_ID=expo-ui-universal-text-input--empty&mode=canvas
```

Each flow stops the app, connects to Metro, waits for the app and brand animation, and then opens its route. It preserves application data. Storybook flows open the canvas and wait for its initial Button story before selecting the target story, so the native link listener is ready. The shared helper allows two minutes for the initial lazy Storybook bundle and 60 seconds for the target story.

To add coverage, create a flow under `.maestro/storybook/`, reuse `../helpers/open-story.yaml`, and pass the story ID and a visible `READY_ID`. Assert a resulting value or visible state after interaction. Root and helper files are excluded from test discovery by `.maestro/config.yaml`.

## Validation limits

The 2026-10-10 Android execution results are recorded in
[the build verification report](build-verification.md). Remaining flows and all
iOS interactions still need native execution. TypeScript, lint, YAML parsing, and
native bundling cannot validate a device's accessibility hierarchy. If an ID is
absent, inspect the hierarchy in Maestro Studio and use the fallback documented
in the selector reference.

Storybook is development-only in this app. Production/preview builds redirect this route to Skia, so these flows require a development build and Metro. CI will need a development client connected to Metro or a dedicated test build that includes Storybook; do not point these tests at the production build.
