# Development and preview guest browsing

In a development client or a new preview build, tap **Browse all pages as guest (dev)** above the login form. This opens `/development-pages` with navigation buttons for the app screens, UI showcase and individual component pages, Storybook, Skia, and Maps. Home and More also expose **Browse all pages**.

Guest browsing is an in-memory UI mode available when `appDevEnabled` is true after signed-out session restoration. Local development enables it through `__DEV__`. The EAS `preview` profile sets `EXPO_PUBLIC_ENABLE_DEV_SCREENS=true`, enabling the same screens in a standalone release build and including Storybook in Metro's bundle. The `production` profile explicitly sets the flag to `false`.

Guest mode does not create an identity, token, or persisted session. Production guards still require authentication. Auth routes remain available while browsing as a guest. Verification and recovery still require their real flow/challenge parameters.

Create a new standalone preview with `npx eas-cli@latest build --profile preview --platform all` (or select `android` / `ios`). Existing installed builds keep their previous bundle until rebuilt. For local release exports, set `EXPO_PUBLIC_ENABLE_DEV_SCREENS=true` before running `npx expo export --platform all`.

For OTA preview updates, also set this flag to `true` in the EAS `preview` environment. EAS Update uses `--environment preview` rather than the build profile's `env` settings; see [Expo's environment variable guide](https://docs.expo.dev/eas/environment-variables/usage/).

Exit from the page directory, Account, or More to return to signed-out routing. Restarting the app clears guest mode. Recipe publication and account-specific actions require a real login; backend endpoints may show authorization errors in guest mode. Detail buttons use a real loaded ID when available, otherwise an explicitly disclosed preview ID.

Access regression tests cover production rejection, development and preview browsing, restoration, guest exit, screen links, and real-session routing. `.maestro/pages/development-guest.yaml` covers login entry, the directory, Home navigation, and exit. Native execution of this flow remains unverified.
