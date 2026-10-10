# Cleanup and build verification — 2026-10-10

Reviewed the current iOS/Android project with the Expo overview, upgrade, UI and
EAS build skills and Context7. Context7 does not expose a pinned SDK 57 source
snapshot for every API; the findings were checked against the
[SDK 57 docs](https://docs.expo.dev/versions/v57.0.0/sdk/ui/) and installed source.

## Changes

- Removed the Expo UI patch script, its postinstall hook, its implementation-specific
  lifecycle tests and its obsolete documentation. No replacement patch was added.
- Updated compatible SDK 57 patch releases with `npx expo install --fix`: Expo
  `57.0.27`, Constants `57.0.21`, Linking `57.0.12`, Notifications
  `57.0.22`, Observe `57.0.25` and Updates `57.0.25`.
- Synchronized the npm lockfile and refreshed the component catalog and cleanup notes.
- Wait for language/session restoration before mounting navigation, preventing
  short-lived restoration controls from releasing state while native props are queued.
- Constrain auth content through its existing keyboard/safe-area boundary and native
  Host, without measuring window width and passing it through native style conversion.
- Simplified the standalone input Storybook canvas to the same React Native boundary
  used by the button stories, removing a redundant native/RN/native sizing loop.
- Updated stale English validation assertions in the native login, recovery and
  auth story flows; documented the language and first-run device setup.
- Preserved native routes, application behavior, planned dependencies and existing
  Firebase/EAS configuration edits.

## Expo UI version

The initial dependency alignment installed `57.0.22`. Its Android `width` modifier
uses `Either<Int, IntrinsicSizeType>`, but JS numeric widths arrive as doubles. Both
fractional widths and an integer-valued `363.0` produced a native `FieldCastException`
on the emulator. The registry's latest stable SDK 57 release is still `57.0.22`.

The project therefore pins the published, unmodified `@expo/ui` `57.0.21` and
`expo-router` `57.0.24`. Router `57.0.25` requires Expo UI `^57.0.22`; Router `57.0.24`
supports `^57.0.21`. An npm override ties every Expo UI consumer to the direct
dependency, preventing duplicate native modules. These two packages are excluded
from automatic Expo version alignment. The exceptions are intentional; duplicate
module checks, peer validation and all other package checks remain enabled. Review
the pins when an upstream SDK 57 fix is published. There is no postinstall hook or
vendored library patch.

## Local checks

- The initial `npm ci` and final dependency installation succeed without a project
  install hook. The installed Expo UI source uses the original upstream
  `useReleasingSharedObject` implementation. The final lockfile contains one Expo UI
  native module, at `57.0.21`.
- `npx expo install --check` validates packages with the documented Expo UI exception.
- `npx expo-doctor` passes all 21 checks.
- `npm run check` passes TypeScript, zero-warning lint, formatting and all 290 tests.
- `npx expo export --platform all --source-maps --output-dir .expo/cleanup-final-export
--max-workers 2` produces iOS and Android Hermes bundles. Neither source map
  includes Storybook sources (2,363 iOS sources and 2,373 Android sources).
- Metro serves both Android and iOS development bundles successfully (HTTP 200).

Verification logs are under the ignored `.expo/` directory. Automatic approval
review blocked removal of the temporary APK downloads and export copies with
"blocked by policy", without a more specific reason; they remain ignored. EAS
also retains the linked artifacts.

## Native builds

Fresh EAS builds use the existing development profile and frozen remote signing
credentials. The iOS artifact targets a simulator; the Android artifact targets
devices/emulators. Both final builds of the pinned version are `FINISHED`, with no
build error and uploaded artifacts:

- [Android 89f1e965-9c05-4e37-830c-0f1cef7aeb9a](https://expo.dev/accounts/ybenabdallah/projects/likan/builds/89f1e965-9c05-4e37-830c-0f1cef7aeb9a): Gradle `BUILD SUCCESSFUL`; [APK](https://expo.dev/artifacts/eas/Lj8dUIkODTcZ_Rq4qRk1oOGuQ-2aMVnk9LRcmnnYimk.apk).
- [iOS simulator 450d2fa7-8829-4a27-8e3b-c5dac180eb66](https://expo.dev/accounts/ybenabdallah/projects/likan/builds/450d2fa7-8829-4a27-8e3b-c5dac180eb66): Xcode compilation and packaging succeeded; [application archive](https://expo.dev/artifacts/eas/W75RDXBs4djA2xpWMlonw6P_91AOBBqxX0snR08CX7s.tar.gz).

The diagnostic `57.0.22` builds both compiled and uploaded artifacts:

- [Android c5262e8e-eec8-4490-b675-3a62f86c8dce](https://expo.dev/accounts/ybenabdallah/projects/likan/builds/c5262e8e-eec8-4490-b675-3a62f86c8dce): `FINISHED`, Gradle `BUILD SUCCESSFUL`.
- [iOS simulator 6bd88f8b-36f9-4647-9ec9-e86151584360](https://expo.dev/accounts/ybenabdallah/projects/likan/builds/6bd88f8b-36f9-4647-9ec9-e86151584360): `FINISHED`, Xcode compilation and packaging succeeded.

Android native testing then exposed the startup/width failures described above.
After the startup/layout correction, fresh launches of the final binary show Login
without either error. The first-run Expo developer menu was dismissed during device
setup. The cold Storybook bundle took approximately 64 seconds; its readiness
timeout is now two minutes rather than one. The standalone text-input canvas also
exposed an Android Compose remeasurement crash; removing its redundant outer Host
and RNHostView resolved the layout loop and collapsed canvas.

The Android `text-input-empty.yaml` flow passes against the final `57.0.21` binary:
focus, typing, clearing text, keyboard dismissal and the visible Storybook screen.
The final JavaScript corrections were served by Metro to the development binary;
the native module itself is unmodified.

The Android `auth/login.yaml` flow also passes: empty-submit validation, controlled
email/password editing, clearing validation feedback, showing/hiding the password
and navigation to password recovery. Changing to English persisted across restart.
Neither successful flow produced an AndroidRuntime or ReactNativeJS error. The
recovery and auth-story wording fixes were checked against the dictionary but
their complete flows were not executed.

## Limits

Expo UI `57.0.21` still uses effect-based shared-object release. The passing Android
flows cover cold start, editing, password visibility and recovery navigation;
they do not establish that effect replay, retained/hidden state, external form
resets or every navigation/reload path is safe. Those cases and all iOS runtime
behavior remain unverified.

The iOS Firebase plist contains placeholder values. A valid Firebase-generated
configuration for `com.hyrkul.likan` is required for Firebase functionality. No
application source currently imports the Firebase packages. They remain installed
for planned features pending the user's preference.

The dependency audit still reports 27 findings (24 high, three moderate). The
remaining chains need compatible upstream fixes; see
[the dependency audit notes](project-cleanup.md#security-overrides). Build success
does not resolve these findings.
