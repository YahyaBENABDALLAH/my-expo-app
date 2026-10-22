# EAS development builds

Requested 2026-10-03 after the global checks passed. Used the existing `development` profile with `developmentClient: true`, internal distribution, and the development environment. EAS login and linked project were verified.

## Android

The first build failed at `:app:processDebugResources`: `drawable/splashscreen_logo` was missing. The installed SDK 57 splash plugin references this drawable in its theme even when no image is configured. Fixed `app.json` by setting the existing `assets/images/splash-icon.png`, width 200, and `contain` resize mode.

Verified a fresh isolated Android prebuild generates the logo in all five density folders. `npm run check` passed (typecheck, lint, formatting, 73 tests). No generated native files were edited by hand.

Replacement submitted with existing remote signing credentials. Verified final EAS state: `FINISHED`, no build error, with build artifact upload completed. Native compilation and APK packaging succeeded; installation and device behavior remain unverified.

- Replacement build ID: `3bb7e03e-5414-49ce-8749-1b76b03791a3`
- [Replacement build status and installation artifact](https://expo.dev/accounts/ybenabdallah/projects/likan/builds/3bb7e03e-5414-49ce-8749-1b76b03791a3)

- Failed build ID: `bb2fb613-9756-47c7-9533-a934b1f9e61c`
- App ID: `com.hyrkul.likan`
- [Build status and installation artifact](https://expo.dev/accounts/ybenabdallah/projects/likan/builds/bb2fb613-9756-47c7-9533-a934b1f9e61c)

## iOS configuration

The iOS simulator development build submitted on 2026-10-10 failed during prebuild because the installed React Native Firebase config plugin requires `expo.ios.googleServicesFile`. Build ID: `64f44088-ab45-4e15-92c1-f79118d58c37`.

The subsequent simulator build compiled with a placeholder plist, but the user
reported that it closes before the splash screen. The Firebase config plugin
calls `FirebaseApp.configure()` before React Native starts. Firebase iOS SDK
`12.18.0` rejects the placeholder `GOOGLE_APP_ID` with a native exception.

Firebase has no current application consumers, so the startup repair removes
its bootstrap plugins and iOS Google-services reference. `expo.autolinking.ios.exclude`
keeps `@react-native-firebase/app` and `@react-native-firebase/messaging` out of the
iOS binary. Their npm packages remain installed for future features. The obsolete
Firebase framework/linking overrides are also removed. The placeholder file remains
in the repository but is not bundled or used by the new iOS build.

Android keeps its valid `google-services.json` and both Firebase native modules.
Expo's default plugins copy the JSON and configure the Google Services Gradle
plugin from `android.googleServicesFile`; the removed Firebase plugins were
redundant for this project's Android settings. Android native config introspection
is unchanged after this repair.

Replacement [iOS simulator build 1f0c2bdb-b8c6-4b5f-83db-527d05a4baba](https://expo.dev/accounts/ybenabdallah/projects/likan/builds/1f0c2bdb-b8c6-4b5f-83db-527d05a4baba)
finished successfully with the existing `development` profile and cleared cache.
[Download the replacement simulator app](https://expo.dev/artifacts/eas/H-kPam29-3hFRILDdwXnUYNH-zkEyTV8TGtwSQYSM9c.tar.gz).
Install this replacement; the previous iOS artifact contains the
invalid bootstrap and cannot be corrected by a Metro reload.

To enable Firebase on iOS later, obtain the Firebase-generated plist for
`com.hyrkul.likan`, restore its native plugins and framework configuration, remove
the iOS autolinking exclusions and create a new native build. Reference's plist
identifies `com.hyrkul.foodiya` and cannot be reused by changing only the bundle ID.
Apple device signing and provisioning remain unverified.

The remote development environment now provides `EXPO_PUBLIC_API_URL`. The dev
client's Metro server also loads the project's local development environment
when serving JavaScript. See [the 2026-10-10 cleanup verification](build-verification.md)
for fresh builds of the unpatched dependency set and runtime verification limits.

## iPhone Duo display support — 2026-10-21

All iOS build profiles pin `macos-tahoe-26.6-xcode-27.1` so builds use the
iOS 27.1 SDK. SDK 57's default Xcode 26 image leaves the app in iPhone Duo's
compatibility window. Building with iOS 27.1 opts the app into using the full
display; setting `ios.requireFullScreen` does not select that SDK.

`app.json` enables `expo-build-properties`' `ios.enableSceneSupport` option.
The locked Expo `57.0.27` and build-properties `57.0.22` support this SDK 57
migration. Prebuild generates the scene manifest and moves React Native startup
to Expo's scene delegate, which creates its window from `UIWindowScene` instead
of `UIScreen.main.bounds`. Keep these changes in config rather than editing
generated iOS files. The minimum supported iOS version remains unchanged.

Create and install a new iOS binary after this change. Metro reloads and EAS
Update cannot change an installed binary's build SDK or native scene lifecycle:

```sh
# Simulator development client
npx eas-cli@latest build --platform ios --profile development

# Signed physical-device preview
npx eas-cli@latest build --platform ios --profile preview
```

After installation, verify a cold launch, folding/unfolding, rotation, keyboard
access, navigation and asymmetric safe areas on iPhone Duo. Full display rendering
and native compilation still require verification with the new binary.

References: [Apple's iPhone Duo preparation guide](https://developer.apple.com/iphone-duo/prepare/),
[Expo SDK 57 scene support](https://docs.expo.dev/versions/v57.0.0/sdk/build-properties/#pluginconfigtypeios),
and [EAS build images](https://docs.expo.dev/build-reference/infrastructure/#ios-server-images).

Local verification passed: TypeScript, zero-warning lint, Expo config introspection
and the scene-startup transformation applied to the installed SDK template. No new
cloud build or native device test was run for this change.

## Google Play store updates

The root layout enables `useStoreUpdates` after the launch screen exits. On
Android release builds, it checks Google Play once per mounted app session and
starts the native update flow when an update is available. The package chooses
a permitted flexible/immediate flow from Play's update priority (4 or higher
prefers immediate). The user accepts the Google Play prompt before updating.
The package completes a flexible update after its download, which can restart
the app. No OTA update service is involved.

Debug builds and iOS skip the hook. Loading the native module is deferred and
guarded so missing modules, offline checks and installs that are not eligible
for Play updates do not block startup. A dismissed prompt or failed check is
not retried on every foreground event; a new cold launch tries again. If a
check finishes while the app is in the background, it waits for foreground
before checking again or presenting an update.

`expo-in-app-updates` is pinned to `0.13.0`. The app remains on Expo SDK 57.
The package's release was developed with SDK 58 and Expo Modules 2.0; its peer
dependencies accept this installation, but native compatibility still requires
verification in a new Android build. The native module is autolinked;
no config plugin, App Store ID or generated native source edits are needed for
this Android integration. iOS autolinking explicitly excludes the package while
App Store update support is disabled. Build and install a new Android binary to include it. Existing
development clients cannot acquire native modules through a Metro reload.

For device testing, use a release build installed through Google Play or its
internal app sharing flow. A sideloaded development APK is not sufficient:

1. Install an older release containing this integration through internal app
   sharing. The tester must own the app in Google Play.
2. Upload a build with the same application ID/signing key and a higher
   `versionCode`. Open its sharing link without installing the newer build.
3. Cold-launch the older app and accept the update prompt. Check dismissal,
   offline startup and returning from the background as well.

Internal app sharing does not support `inAppUpdatePriority`; use a Play test
track when verifying priority-based immediate updates. Native compilation and
the actual Play download/install flow still require a new build and device
verification. See the [package documentation](https://github.com/SohelIslamImran/expo-in-app-updates)
and [Google's testing guide](https://developer.android.com/guide/playcore/in-app-updates/test).

Local verification passed: typecheck, zero-warning lint, formatting, all 135
tests (including nine store-update lifecycle tests), Android Hermes production
export and Android/iOS autolinking checks. These checks do not verify native
compilation or a live Google Play installation.
