# Native component and form tests

The native suite follows the same two groups as Storybook:

- `.maestro/components/` — buttons, text inputs, switches, checkboxes, sheets, lists, pickers, loading, skeletons and toasts.
- `.maestro/forms/` — form validation/submission and OTP verification.

Run everything with `npm run test:e2e`. For a single flow:

```sh
maestro test .maestro/components/text-input-controlled.yaml
maestro test .maestro/forms/auth-screen.yaml
```

## Device setup

1. Install Maestro CLI and its required Java runtime.
2. Connect an Android device/emulator, or an iOS Simulator on a Mac, with the development build (`com.hyrkul.likan`) installed.
3. Start Metro with `npm run storybook` and open the app in the development client once. Dismiss first-run instructions and turn off the floating developer Tools button.
4. Select English for text assertions. On Android over USB, run `adb reverse tcp:8081 tcp:8081`.

The shared bootstrap connects to Metro at `127.0.0.1:8081`. For a Wi-Fi device,
override `DEV_CLIENT_URL` using Maestro's `-e` option. Select a particular device
with `maestro --device <id> test .maestro`.

The story helper skips onboarding or enters development guest mode when needed,
then opens a deterministic story. It preserves app data. Form stories use local
callbacks and never submit credentials to the API.

## Story links and selectors

```text
myappexpo://storybook?STORYBOOK_STORY_ID=components-button--interaction&mode=canvas
```

Canvas mode hides Storybook panels and preserves native accessibility targets.
Normal Storybook entry shows the browser and saves the selected story. The route
is available in development or builds with `EXPO_PUBLIC_ENABLE_DEV_SCREENS=true`.

Reuse `.maestro/helpers/open-story.yaml` with `STORY_ID` and `READY_ID`. Assert
the visible outcome after interaction. See [selectors](storybook-test-ids.md).

The simplified flows still require device execution on iOS and Android. Node
tests, lint, typecheck and YAML validation do not establish native rendering,
keyboard behavior, accessibility or touch geometry.
